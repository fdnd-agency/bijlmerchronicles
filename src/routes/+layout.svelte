<script>
	import favicon from '$lib/assets/logo-favicon.avif';
	import '$lib/css/global-styles.css';
	import { AmsterdamStarsSVG } from "$lib";

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Encyclopédie Mapping Bijlmer Zuid-Oost </title>
</svelte:head>
<main>
	{@render children?.()}
</main>

<style>
	main{
		margin-top: -7.3rem;
	}
</style>
