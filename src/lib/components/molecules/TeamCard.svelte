<script>
    export let member;
    const defaultImage = '/images/default.png';
</script>

<article class="single-item">
    <section class="item">
        <div class="card-img">
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

            <aside class="overlay">
                <span class="role">{member.role}</span>

                <p class="overlay-text">{member.bio}</p>
            </aside>
        </div>

        <header class="info">
            <h3>{member.name}</h3>
        </header>
    </section>
</article>

<style>
    /* Card */
    .single-item {
        margin-bottom: 0;
    }

    .item .card-img {
        position: relative;
        overflow: hidden;
        z-index: 1;
        height: 380px;
    }

    .item .card-img::after {
        background: var(--color-secondary);
        content: '';
        height: 100%;
        left: 0;
        opacity: 0;
        position: absolute;
        top: 0;
        transition: all 0.6s ease-in-out;
        width: 100%;
    }

    .item:hover .card-img::after {
        opacity: 0.7;
    }

    .img-size {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transition: all 0.15s ease-in-out;
    }

    .item:hover .card-img picture {
        opacity: 0.6;
    }

    .card-img .overlay {
        top: -100%;
        left: 0;
        padding: 20px;
        position: absolute;
        text-align: center;
        transition: all 0.15s ease-in-out;
        width: 100%;
        z-index: 1;
    }

    .item:hover .card-img .overlay {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .card-img .overlay p {
        color: var(--color-primary-lightest);
    }

    /* SCROLLBARE TEKST */
    .overlay-text {
        max-height: 160px; /* Hoeveel tekst zichtbaar is */
        overflow: hidden;
        margin-top: 10px;
        padding: 18px;
    }

    /* Scroll tonen bij hover */
    .item:hover .overlay-text {
        overflow-y: auto;
    }

    .overlay-text::-webkit-scrollbar {
        width: 6px;
    }

    .overlay-text::-webkit-scrollbar-thumb {
        background: var(--color-secondary);
        border-radius: 4px;
    }

    /* Info blok */
    .info {
        background: var(--color-secondary);
        box-shadow: 0 0 10px var(--color-secondary);
        padding: 40px 20px 20px;
        min-height: 120px;
        text-align: center;
        position: relative;
        z-index: 1;
    }

    .info h3 {
        font-weight: 600;
        margin-bottom: 5px;
        text-transform: capitalize;
        color: var(--color-primary-lightest);
        text-transform: uppercase;
        font-size: var(--paragraph-3);
    }

    .role {
        color: var(--color-primary-lightest);
        font-weight: 600;
        text-transform: uppercase;
        font-size: var(--paragraph-size);
        letter-spacing: 0.6px;
    }
</style>
