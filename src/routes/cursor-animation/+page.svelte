<script>
	import { onMount } from "svelte";
	import { gsap } from "gsap";
	import { Observer } from "gsap/Observer";

	gsap.registerPlugin(Observer);

	let blob;

	const background = "#111";
	const color = "#76bc84";
	const size = 70;
	const lag = 1.5;

	onMount(() => {
		Observer.create({
			type: "pointer",
			onMove: (self) => {
				const { x, y } = self;

				gsap.to(blob, {
					x: x - size / 2,
					y: y - size / 2,
					duration: lag,
					ease: "power4.out"
				});
			}
		});
	});
</script>

<div style="width: 100vw; height: 100vh; background: {background}; position: relative;">
	<div
		bind:this={blob}
		class="blob"
		style="width: {size}px; height: {size}px; background: {color};"
	></div>
</div>

<style>
	.blob {
		position: absolute;
		left: 0;
		top: 0;
		border-radius: 50%;
		pointer-events: none;
		filter: blur(20px);
		z-index: 10;
	}
</style>
