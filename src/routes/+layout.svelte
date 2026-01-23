<script>
    import { page } from '$app/stores';
    import favicon from '$lib/assets/logo-favicon.avif';
    import '$lib/css/global-styles.css';
    import { Header } from "$lib";
    import { getSeoForPath } from '$lib/utils/seo';

	// https://svelte.dev/docs/svelte/$derived
    const seo = $derived(getSeoForPath($page.url.pathname));

    // Behoud de children prop
    let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>{seo.title}</title>
	<meta name="description" content={seo.description} />
	<meta property="og:title" content={seo.title} />
	<meta property="og:description" content={seo.description} />
</svelte:head>

<header>
	<Header />
</header>

<main>
	{@render children?.()}  
</main>

<style>
	:root{
		--header-height: 10vh;
	}

	header{
		width: 100%;
		height: var(--header-height);
		min-height: 7.25rem;
		top: 0;
	}
</style>
