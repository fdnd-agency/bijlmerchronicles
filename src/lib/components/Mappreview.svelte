<script>
    import { Mapdetailtitle } from '$lib';
</script>

<section>
    <div class="background-shape">
        <h3>Bekijk de lemma's</h3>
    </div>
    <img src="/mapimage.png" alt="foto van de kaart van de bijlmer">
    <a href="/">Ontdek meer</a>
    <Mapdetailtitle />
</section>

<style>
    section {
        position: relative;
        height: 80vh;
        width: 100%;
    }
    .background-shape {
        position: absolute;
        top: 0;
        right: 0;
        background-color: #263B1C;
        display: flex;
        align-items: center;
        padding: clamp(1rem, 2vw, 6rem);
    }
    h3 {
        margin: 0;
        color: #CEBF8F;
        font-size: clamp(1.5rem, 5vw, 3rem);
    }
    img {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: cover;
    }
    a {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #717171c8;
        color: #FFFFFF;
        text-decoration: none;
        padding: .6em;
        border-radius: 10px;
        font-size: 1.25rem;
        &::after {
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
        }
        @media (min-width: 600px) {
            font-size: 1.5em;
            padding: .5em 1em;
        }
    }

</style>