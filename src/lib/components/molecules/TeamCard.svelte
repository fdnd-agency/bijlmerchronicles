<script>
    export let member;
    const defaultImage = '/images/default.png';
</script>

<article class="team-card">
    <picture>
        <source
            srcset={member.picture
                ? `https://fdnd-agency.directus.app/assets/${member.picture}&format=avif`
                : defaultImage}
            type="image/avif"
        />

        <source
            srcset={member.picture
                ? `https://fdnd-agency.directus.app/assets/${member.picture}&format=webp`
                : defaultImage}
            type="image/webp"
        />

        <enhanced:img
            class="img-size"
            src={member.picture
                ? `https://fdnd-agency.directus.app/assets/${member.picture}`
                : defaultImage}
            alt=""
            fetchpriority="high"
            on:error={(e) => {
                e.target.src = defaultImage;
            }}
        />
    </picture>

    <div class="member-overlay">
        <h3 class="member-name">
            <a href="/team/{member.id}">{member.name}</a>
        </h3>
    </div>

    <div class="member-info">
        <p class="member-role">{member.role}</p>
        <p class="member-bio">{member.bio}</p>
    </div>
</article>

<style>
    .team-card {
        position: relative;
        margin: 0;
        height: 560px;
        background-color: var(--color-secondary);
        overflow: hidden;
    }

    picture,
    .img-size {
        object-fit: cover;
        height: var(--height-member-picture);
        width: 100%;
    }

    .member-overlay {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: var(--height-member-name);

        h3 {
            margin: 0;
            color: var(--color-primary-lightest);
            font-size: var(--paragraph-3);
            font-weight: 600;
            text-transform: capitalize;
            text-align: center;

            a {
                color: inherit;
                text-decoration: none;

                &::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 10;
                    transition: all 0.3s ease-in-out;
                }
            }
        }
    }

    .member-info {
        position: absolute;
        bottom: -100%;
        width: var(--width);
        min-width: 90%;
        height: var(--height-member-picture);
        background: var(--color-secondary);
        color: var(--color-primary-lightest);
        margin: 0;
        padding: 0em 1.5em 0em 1.5em;
        transition: 0.6s cubic-bezier(0.33, 1, 0.68, 1);

        .member-role {
            font-weight: 600;
            text-transform: uppercase;
            font-size: var(--paragraph-size);
            letter-spacing: 1px;
            text-align: center;
            margin: 2em 0 2em 0;
        }

        .member-bio {
            font-size: 20px;
            display: -webkit-box;
            -webkit-line-clamp: 11;
            line-clamp: 11;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
    }

    .team-card:hover {
        h3 {
            color: var(--pop-out-color-light);
        }

        .member-info {
            bottom: var(--height-member-name);
        }

        .member-role {
            color: var(--pop-out-color-light);
        }
    }
</style>
