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
	header{
		container-name: header;
        container-type: inline-size;
	}
</style>