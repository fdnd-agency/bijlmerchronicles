<script>
    export let member;

    function getStaticImage(member) {
        const firstName = member.name?.split(" ")[0];
        return `/images/${firstName}.png`;
    }

    const defaultImage = "/images/default.png";
</script>

<article class="single-item">
    <section class="item">
        <div class="card-img">
            <img
                class="img-size"
                src={getStaticImage(member)}
                alt=""
                on:error={(e) => {
                    e.target.src = defaultImage;
                }}
            />

            <aside class="overlay" >
                <h4>{member.name}</h4>
                <p class="overlay-text">{member.bio}</p>
            </aside>
        </div>

        <header class="info">
            <span class="role">{member.role}</span>
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
        content: "";
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

    .item:hover .card-img img {
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

    .card-img .overlay h4,
    .card-img .overlay p {
        color: #ffffff;
    }

    .card-img .overlay h4 {
        display: inline-block;
        text-transform: uppercase;
    }

    /* SCROLLBARE TEKST */
    .overlay-text {
        max-height: 160px; /* Hoeveel tekst zichtbaar is */
        overflow: hidden;
        margin-top: 10px;
        padding-right: 6px;
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
        z-index: 2;
    }

    .info h4 {
        font-weight: 600;
        margin-bottom: 5px;
        text-transform: capitalize;
    }

    .role {
        color: var(--color-primary-lightest);
        font-weight: 600;
        text-transform: uppercase;
        font-size: var(--paragraph-size);
        letter-spacing: 0.6px;
    }
</style>
