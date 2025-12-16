<article>
    <h1>Oeps! Pagina niet gevonden</h1>
    <h2>404 Not Found</h2>
    <p>De pagina die je probeerde te bereiken bestaat niet. Klik de knop hieronder om weer terug te gaan naar de homepagina</p>
    <a href="/" class="backtohome-btn">Terug naar home</a>
</article>

<style>
    article {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 4rem 1rem 0 1rem;
    }
    h1 {
        order: 1;
        color: var(--color-secondary-600);
        font-size: var(--heading-1);
        text-align: center;
        margin: 0;
    }
    h2 {
        order: 0;
        color: var(--color-secondary-400);
        font-size: var(--heading-3);
    }
    p {
        order: 2;
        color: var(--color-text);
        font-size: var(--paragraph-size);
        text-align: center;
    }
    a {
        order: 3;
        margin-top: 2rem;
    }

    .backtohome-btn {
        border: solid 1px var(--accent-color);
        background-color: var(--color-secondary);
        color: var(--accent-color);
    }
</style>