import { expect, test } from '@playwright/test';

const PERSOON_URL = '/admin/persoon';

// Roles, mirroring +page.server.js: 1 = regular user, 2 = admin, 3 = moderator.
const ROLE = { USER: 1, ADMIN: 2, MODERATOR: 3 };

/**
 * Authenticate by injecting the `user_session` cookie that the login action
 * (src/routes/inlog/+page.server.js) normally sets. This skips the real
 * argon2 login so the suite does not need a live test account, while still
 * exercising the server-side access checks in load/actions.
 */
async function loginAs(context, { id = 999, email = 'e2e@bijlmerchronicles.test', role }) {
    await context.addCookies([
        {
            name: 'user_session',
            value: JSON.stringify({ id, email, role }),
            url: 'http://localhost:5173',
        },
    ]);
}

test.describe('admin persoon — access control', () => {
    test('redirects an unauthenticated visitor to the homepage', async ({ page }) => {
        await page.goto(PERSOON_URL);

        await expect(page).toHaveURL('/');
    });

    test('redirects a regular user (role 1) to the homepage', async ({ page, context }) => {
        await loginAs(context, { role: ROLE.USER });

        await page.goto(PERSOON_URL);

        await expect(page).toHaveURL('/');
    });

    test('lets a moderator (role 3) open the persoon page', async ({ page, context }) => {
        await loginAs(context, { role: ROLE.MODERATOR });

        await page.goto(PERSOON_URL);

        await expect(page).toHaveURL(PERSOON_URL);
        await expect(page.getByRole('heading', { name: 'persoon', level: 1 })).toBeVisible();
    });
});

test.describe('admin persoon — page rendering', () => {
    test.beforeEach(async ({ context }) => {
        await loginAs(context, { role: ROLE.ADMIN });
    });

    test('shows the person list and the create/edit form', async ({ page }) => {
        await page.goto(PERSOON_URL);

        await expect(page.getByRole('button', { name: 'nieuw persoon' })).toBeVisible();
        await expect(page.getByLabel('name')).toBeVisible();
        await expect(page.getByLabel('functie/role')).toBeVisible();
        await expect(page.getByLabel('bio beschrijving')).toBeVisible();
        // No person is selected yet, so the form is in "create" mode.
        await expect(page.getByRole('button', { name: 'aanmaken' })).toBeVisible();
    });

    test('"nieuw persoon" resets the form to an empty create state', async ({ page }) => {
        await page.goto(PERSOON_URL);

        // Type something, then reset.
        await page.getByLabel('name').fill('Tijdelijke invoer');
        await page.getByRole('button', { name: 'nieuw persoon' }).click();

        await expect(page.getByLabel('name')).toHaveValue('');
        await expect(page.getByRole('button', { name: 'aanmaken' })).toBeVisible();
    });

    test('"bekijk meer" loads a person into the form in edit mode', async ({ page }) => {
        await page.goto(PERSOON_URL);

        const firstView = page.getByRole('button', { name: 'bekijk meer' }).first();
        // The list depends on live Directus data; skip cleanly if it is empty.
        test.skip((await firstView.count()) === 0, 'No existing persons to view');

        await firstView.click();

        // Selecting a person populates the name and switches the form to "opslaan".
        await expect(page.getByLabel('name')).not.toHaveValue('');
        await expect(page.getByRole('button', { name: 'opslaan' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'verwijder persoon' })).toBeVisible();
    });

    test('opening then cancelling the delete modal keeps the person', async ({ page }) => {
        await page.goto(PERSOON_URL);

        const firstView = page.getByRole('button', { name: 'bekijk meer' }).first();
        test.skip((await firstView.count()) === 0, 'No existing persons to view');

        await firstView.click();
        await page.getByRole('button', { name: 'verwijder persoon' }).click();

        const dialog = page.getByRole('dialog');
        await expect(dialog).toBeVisible();

        await dialog.getByRole('button', { name: 'Annuleren' }).click();
        await expect(dialog).toBeHidden();
    });
});

test.describe('admin persoon — full CRUD round trip', () => {
    test.beforeEach(async ({ context }) => {
        await loginAs(context, { role: ROLE.ADMIN });
    });

    // Each step makes a server round trip to the live Directus backend and
    // then re-renders the list via invalidateAll, so the default 30s budget
    // is too tight for the whole create → edit → delete chain.
    test('creates, edits and deletes a person', { timeout: 120_000 }, async ({ page }) => {
        const unique = `E2E TEST ${Date.now()}`;
        const editedName = `${unique} (bewerkt)`;

        const rowByName = (name) => page.getByRole('listitem').filter({ hasText: name });

        // Select a person from the list and confirm it loaded into the form.
        async function openPerson(name) {
            await rowByName(name).getByRole('button', { name: 'bekijk meer' }).click();
            await expect(page.getByLabel('name')).toHaveValue(name);
        }

        // Delete the person currently loaded in the form, then wait until the
        // modal has closed and the row is gone from the list.
        async function deleteSelected(name) {
            await page.getByRole('button', { name: 'verwijder persoon' }).click();
            const dialog = page.getByRole('dialog');
            await dialog.getByRole('button', { name: 'Ja, verwijder' }).click();
            await expect(dialog).toBeHidden();
            await expect(rowByName(name)).toHaveCount(0);
        }

        await page.goto(PERSOON_URL);

        let cleaned = false;
        try {
            // --- Create -------------------------------------------------
            await page.getByRole('button', { name: 'nieuw persoon' }).click();
            await page.getByLabel('name').fill(unique);
            await page.getByLabel('functie/role').fill('Testrol');
            await page.getByLabel('bio beschrijving').fill('Aangemaakt door de e2e-test.');
            await page.getByRole('button', { name: 'aanmaken' }).click();

            await expect(page.getByText('Opgeslagen!')).toBeVisible();
            await expect(rowByName(unique)).toHaveCount(1);

            // --- Edit ---------------------------------------------------
            await openPerson(unique);
            await page.getByLabel('name').fill(editedName);
            await page.getByRole('button', { name: 'opslaan' }).click();
            await expect(page.getByText('Opgeslagen!')).toBeVisible();
            await expect(rowByName(editedName)).toHaveCount(1);

            // --- Delete -------------------------------------------------
            await openPerson(editedName);
            await deleteSelected(editedName);
            cleaned = true;
        } finally {
            // Safety net: if an assertion above failed before the delete,
            // remove whichever name still exists so the backend stays clean.
            if (!cleaned) {
                // Dismiss a possibly-open modal so it can't block the list.
                await page.keyboard.press('Escape').catch(() => {});
                for (const name of [editedName, unique]) {
                    if ((await rowByName(name).count()) > 0) {
                        await openPerson(name).catch(() => {});
                        await deleteSelected(name).catch(() => {});
                        break;
                    }
                }
            }
        }
    });
});
