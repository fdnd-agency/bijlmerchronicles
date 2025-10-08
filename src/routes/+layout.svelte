<script>
	import favicon from '$lib/assets/favicon.svg';
	import '$lib/css/global-styles.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
