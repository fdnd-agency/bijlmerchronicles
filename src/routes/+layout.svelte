<script>
	import favicon from '$lib/assets/logo-favicon.avif';
	import '$lib/css/global-styles.css';
	import { Header } from "$lib";
	import { AmsterdamStarsSVG } from "$lib";

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Encyclopédie Mapping Bijlmer Zuid-Oost </title>
</svelte:head>

<!-- COMPONENT: BACKGROUND--> 
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
    	min-height: 9rem;
		top: 0;
		container-name: header;
        container-type: inline-size;
	}

	main{
		margin-top: -7.3rem;
	}
</style>
