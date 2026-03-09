<script>
    import { enhance } from '$app/forms';

    /** @type {import('./$types').ActionData} */
    export let form;
</script>

<section class="register-page">
    <div class="register-hero">
        <div class="hero-background"></div>
        <h1>Aanmelden</h1>
        <p class="subtitle">
            Word lid van de Bijlmer Chronicles community en ontdek de rijke geschiedenis van Amsterdam-Zuidoost.
        </p>
    </div>

    <div class="form-wrapper">
        {#if form?.success}
            <div class="success-card">
                <h2>Welkom!</h2>
                <p>Je account is succesvol aangemaakt. Je kunt nu inloggen en de encyclopedie verkennen.</p>
                <a href="/" class="btn-home">Naar de homepagina</a>
            </div>
        {:else}
            <form class="register-form" method="POST" use:enhance>
                {#if form?.error}
                    <div class="error-message" role="alert">{form.error}</div>
                {/if}

                <div class="form-group">
                    <label for="email">E-mailadres</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="voorbeeld@email.nl"
                        required
                    />
                </div>

                <div class="form-group">
                    <label for="password">Wachtwoord</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Minimaal 8 tekens"
                        required
                    />
                </div>

                <div class="form-group">
                    <label for="confirmPassword">Bevestig wachtwoord</label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="Herhaal je wachtwoord"
                        required
                    />
                </div>

                <button type="submit" class="btn-submit">Account aanmaken</button>

                <p class="login-link">
                    Heb je al een account? <a href="/">Inloggen</a>
                </p>
            </form>
        {/if}
    </div>
</section>

<style>
    /* --------------------------------------- Page layout ------------------------------------ */
    .register-page {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-bottom: 4rem;
    }

    /* --------------------------------------- Hero section with organic shape ------------------------------------ */
    .register-hero {
        position: relative;
        width: 100%;
        padding: 2rem 1.25rem 3rem;
        margin-top: -3.25rem;
        z-index: 2;
    }

    .register-hero h1 {
        font-family: var(--main-font-black);
        font-size: var(--heading-1);
        color: var(--color-primary);
        position: relative;
        z-index: 2;
        margin: 0 0 1rem 0;
    }

    .register-hero .subtitle {
        font-family: var(--main-font);
        font-size: var(--paragraph-3);
        color: var(--color-primary-lighter);
        position: relative;
        z-index: 2;
        max-width: 38rem;
        margin: 0;
        text-align: left;
    }

    @supports (
        clip-path: shape(
                from 0% 4.58%,
                curve to 2.55% 0.49% with 0% 1.18%/1.38% -1.03%,
                line to 98.28% 0%,
                curve to 100% 5% with 99.5% 0%/100% 2%,
                line to 100% 95%,
                curve to 97% 100% with 100% 98%/99% 100%,
                line to 3% 100%,
                curve to 0% 95% with 1% 100%/0% 98%,
                close
            )
    ) {
        .hero-background {
            position: absolute;
            inset: 0;
            background-color: var(--color-secondary);
            z-index: 0;
            clip-path: shape(
                from 0% 4.58%,
                curve to 2.55% 0.49% with 0% 1.18%/1.38% -1.03%,
                line to 98.28% 0%,
                curve to 100% 5% with 99.5% 0%/100% 2%,
                line to 100% 92%,
                curve to 96% 100% with 100% 97%/99% 100%,
                line to 3% 98%,
                curve to 0% 90% with 1% 98%/0% 95%,
                close
            );
        }
    }

    /* Fallback when clip-path shape() is not supported */
    @supports not (
        clip-path: shape(
                from 0% 4.58%,
                curve to 2.55% 0.49% with 0% 1.18%/1.38% -1.03%,
                line to 98.28% 0%,
                curve to 100% 5% with 99.5% 0%/100% 2%,
                line to 100% 95%,
                curve to 97% 100% with 100% 98%/99% 100%,
                line to 3% 100%,
                curve to 0% 95% with 1% 100%/0% 98%,
                close
            )
    ) {
        .hero-background {
            position: absolute;
            inset: 0;
            background-color: var(--color-secondary);
            z-index: 0;
            border-radius: 0 0 1rem 1rem;
        }
    }

    /* --------------------------------------- Form wrapper ------------------------------------ */
    .form-wrapper {
        width: 100%;
        max-width: 30rem;
        padding: 0 1.25rem;
        margin-top: 2rem;
    }

    /* --------------------------------------- Form styling ------------------------------------ */
    .register-form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
    }

    .form-group label {
        font-family: var(--main-font-black);
        font-size: var(--paragraph-2);
        color: var(--color-secondary);
    }

    .form-group input {
        width: 100%;
        padding: 0.75rem;
        font-size: 1.1rem;
        font-family: var(--main-font);
        border: 0.2rem solid var(--color-secondary);
        border-radius: 0.5rem;
        background-color: var(--color-neutral);
        color: var(--color-secondary);
        box-sizing: border-box;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .form-group input::placeholder {
        color: var(--color-secondary);
        opacity: 0.5;
    }

    .form-group input:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 0.15rem var(--color-primary-light);
    }

    /* --------------------------------------- Submit button ------------------------------------ */
    .btn-submit {
        width: 100%;
        padding: 0.9rem;
        font-family: var(--main-font-black);
        font-size: var(--paragraph-2);
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: var(--color-neutral);
        background-color: var(--color-secondary);
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
        box-shadow: 0.25rem 0.25rem 0.1rem 0.04rem var(--color-secondary-dark);
        transition: background-color 0.2s ease, transform 0.1s ease;
    }

    .btn-submit:hover {
        background-color: var(--color-secondary-dark);
    }

    .btn-submit:active {
        transform: translateY(0.1rem);
        box-shadow: 0.15rem 0.15rem 0.05rem 0.02rem var(--color-secondary-dark);
    }

    .btn-submit:focus-visible {
        outline: 2px solid var(--color-primary);
        outline-offset: 0.2rem;
    }

    /* --------------------------------------- Login link ------------------------------------ */
    .login-link {
        text-align: center;
        font-size: 1rem;
        color: var(--color-secondary);
        margin-top: 0.5rem;
    }

    .login-link a {
        color: var(--pop-out-color);
        font-family: var(--main-font-black);
        text-decoration: underline;
    }

    .login-link a:hover {
        color: var(--pop-out-color-dark);
    }

    /* --------------------------------------- Error message ------------------------------------ */
    .error-message {
        background-color: hsl(0, 60%, 95%);
        color: hsl(0, 60%, 35%);
        border: 0.15rem solid hsl(0, 50%, 70%);
        border-radius: 0.5rem;
        padding: 0.75rem 1rem;
        font-size: 1rem;
        font-family: var(--main-font);
    }

    /* --------------------------------------- Success card ------------------------------------ */
    .success-card {
        text-align: center;
        padding: 2rem;
        border: 0.2rem solid var(--color-secondary);
        border-radius: 0.75rem;
        background-color: var(--color-secondary-lightest);
    }

    .success-card h2 {
        font-family: var(--main-font-black);
        font-size: var(--heading-3);
        color: var(--color-secondary);
        margin: 0 0 1rem 0;
    }

    .success-card p {
        font-size: var(--paragraph-2);
        color: var(--color-secondary);
        margin: 0 0 1.5rem 0;
    }

    .btn-home {
        display: inline-block;
        padding: 0.75rem 1.5rem;
        font-family: var(--main-font-black);
        font-size: 1.1rem;
        color: var(--color-neutral);
        background-color: var(--color-secondary);
        border-radius: 0.5rem;
        text-decoration: none;
        box-shadow: 0.25rem 0.25rem 0.1rem 0.04rem var(--color-secondary-dark);
        transition: background-color 0.2s ease;
    }

    .btn-home:hover {
        background-color: var(--color-secondary-dark);
    }

    /* --------------------------------------- Responsive ------------------------------------ */
    @media (min-width: 37.5rem) {
        .register-hero {
            padding: 3rem 3rem 4rem;
        }

        .register-hero .subtitle {
            font-size: var(--paragraph-2);
        }

        .form-wrapper {
            margin-top: 3rem;
        }
    }
</style>