<script>
	import { onDestroy, onMount } from 'svelte';
	import { tick } from 'svelte';
	import { javascript } from '$lib/utils/javascriptEnabled.svelte.js';

	let {
		mapAddresses,
		activeMapAddresses = [],
		mapClass = '',
		initialZoom = 13,
		initialView = [52.32110888521107, 4.966273199933488]
	} = $props();
	let mapElement;
	let map = null;
	let markers = [];
	let leaflet = null;
	// local flag to show the map area when JS runs (avoid relying on external $state)
	let jsEnabled = $state(false);

	function createMarkerPopup(marker) {
		// Use leaflet popup if available (avoid global L dependency)
		const popup = leaflet && leaflet.popup ? leaflet.popup({}) : null;
		const content = `
		<div style="width: 100px;">
		  <p><strong>${marker.street ?? ''}</strong> ${marker.house_number ?? ''} ${marker.floor ?? ''} ${marker.addition ?? ''}</p>
		  ${marker.poster && marker.poster.covers && marker.poster.covers[0] && marker.poster.covers[0].directus_files_id ? `<img style="width: 100%; height: auto; margin-bottom: 0.75rem;" src="https://fdnd-agency.directus.app/assets/${marker.poster.covers[0].directus_files_id.id}" alt="Afbeelding van ${marker.street ?? ''} ${marker.house_number ?? ''} ${marker.floor ?? ''} ${marker.addition ?? ''}">` : ''}
		  <a href="/wiki/${marker.id ?? ''}" data-sveltekit-reload>Bekijk meer</a>
		</div>`;

		if (popup) {
			popup.setContent(content);
			return popup;
		}

		// Fallback: return plain HTML string (Leaflet bindPopup accepts strings)
		return content;
	}

	async function initializeMap() {
		// Leaflet's ESM build is the default export
		leaflet = (await import('leaflet')).default;

		const mapStyle = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
		const attribution =
			'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

		map = leaflet.map(mapElement).setView(initialView, initialZoom);

		leaflet
			.tileLayer(mapStyle, {
				attribution
			})
			.addTo(map);

		updateMarkers();
	}

	function updateMarkers() {
		if (!map) return;

		// remove previous markers
		markers.forEach((m) => map.removeLayer(m));
		markers = [];

		// create simple circle markers for all addresses (avoids depending on external marker images)
		if (Array.isArray(mapAddresses)) {
			mapAddresses.forEach((marker) => {
				const popup = createMarkerPopup(marker);
				const coords = [...(marker?.map?.coordinates ?? [])].reverse();
				if (coords.length < 2) return;

				const newMarker = leaflet
					.circleMarker(coords, {
						radius: 6,
						color: '#d0342a',
						fillColor: '#d0342a',
						fillOpacity: 0.9
					})
					.addTo(map)
					.bindPopup(popup);

				markers.push(newMarker);
			});
		}

		// render active addresses as larger/highlighted circle markers
		if (Array.isArray(activeMapAddresses)) {
			activeMapAddresses.forEach((marker) => {
				const popup = createMarkerPopup(marker);
				const coords = [...(marker?.map?.coordinates ?? [])].reverse();
				if (coords.length < 2) return;

				const newMarker = leaflet
					.circleMarker(coords, {
						radius: 12,
						color: '#0056ff',
						fillColor: '#0056ff',
						fillOpacity: 0.95
					})
					.addTo(map)
					.bindPopup(popup);

				markers.push(newMarker);
			});
		}
	}

	onMount(async () => {
		jsEnabled = true;
		await initializeMap();
	});

	$effect(() => {
		updateMarkers();
	});

	onDestroy(() => {
		if (map) map.remove();
	});
</script>

<section class="map" class:js-enabled={jsEnabled}>
	<h2 class="sr-only">Adressen fop de kaart</h2>

	<div bind:this={mapElement} class={mapClass}></div>
</section>

<style>
	@import 'leaflet/dist/leaflet.css';
	section {
		display: none;
		width: 100%;
		position: relative;
		z-index: 1;
	}

	section.js-enabled {
		display: block;
	}

	div {
		height: 60vh;
	}
</style>