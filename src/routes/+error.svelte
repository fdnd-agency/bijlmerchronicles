<svelte:head>
	<title>Pagina niet gevonden - Encyclopédie Mapping Bijlmer</title>
	<meta name="description" content="Deze pagina kon niet worden gevonden in de Bijlmer Encyclopedie. Ga terug naar de homepage of gebruik de zoekfunctie." />
	<meta property="og:title" content="Pagina niet gevonden - Encyclopédie Mapping Bijlmer" />
	<meta property="og:description" content="Deze pagina kon niet worden gevonden in de Bijlmer Encyclopedie. Ga terug naar de homepage of gebruik de zoekfunctie." />
	<meta name="robots" content="noindex, follow" /> 
</svelte:head>

<article>
    <h1>Oeps! Pagina niet gevonden</h1>
    <h2>404 Not Found</h2>
    <p>De pagina die je probeerde te bereiken bestaat niet. Klik de knop hieronder om weer terug te gaan naar de homepagina</p>
    <a href="/" class="backtohome-btn"><span class="backtohome-btn-border">Terug naar home</span></a>
</article>

<style>
    article {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 4rem 1rem 0 1rem;
        --backtohome-button-width: clamp(10rem, 20vw, 15rem);
        --backtohome-button-height: 4rem;
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

        color: var(--color-secondary);
        text-decoration: none;
        font-size: var(--paragraph-size);
        &:hover {
            color: var(--pop-out-color-500);
        }

        /* --------------------------------------- Login / 'aanmelden' Button styling ---------------------------------------  */
        span {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 5;
            border-radius: var(--border-radius);
        }

        .backtohome-btn-border {
            border: solid 1px var(--accent-color);
        }
    }

    .backtohome-btn {
        width: var(--backtohome-button-width);
        height: var(--backtohome-button-height);
        position: relative;
        border-radius: var(--border-radius);
        z-index: 1;

        /* -- Box shadow in button recreated --  */
        &::before{
            content: '';
            position: absolute;
            top: -0.15rem;
            right: 0.1rem;
            width: calc(var(--backtohome-button-width) + 0.2rem);
            height: calc(var(--backtohome-button-height) + 0.15rem);
            border-radius: inherit;
            z-index: -1;
        }
        
    }

    /* -- Hover styling per button --  */
    .backtohome-btn {
        color: var(--accent-color);
        background-color: var(--color-secondary);
        @supports (content: "") {
            &::before{
                background-color: var(--color-secondary);
            }
        }

        &:hover{
            color: var(--color-secondary);

            .backtohome-btn-border{
                border-color: var(--color-secondary);
            }

            &::before{
                background-color: var(--pop-out-color-500);
            }

        }

    }
    
</style>