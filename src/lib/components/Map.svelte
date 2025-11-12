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
		// Prefer a direct poster image URL (provided by server load as `posterimage_url`).
		// Fallback: try the older nested `marker.poster.covers[...]` shape.
		let imgHtml = '';
		const posterUrl = marker.posterimage_url || marker.posterimage ||
			(marker.poster && marker.poster.covers && marker.poster.covers[0] && (marker.poster.covers[0].directus_files_id?.id || marker.poster.covers[0].directus_files_id));
		if (posterUrl) {
			const src = posterUrl.startsWith('http') ? posterUrl : `https://fdnd-agency.directus.app/assets/${posterUrl}`;
			imgHtml = `<img style="float: left; width: 150px; height: auto; margin-bottom: 0.75rem;" src="${src}" alt="Afbeelding van ${marker.street ?? ''} ${marker.house_number ?? ''}">`;
		}

		const content = `
		<div style="width: 100%;">
		  <p><strong>${marker.title ?? ''}</strong></p>
		  ${imgHtml}
          <p>${marker.summary ?? ''}</p>
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

					// open popup on hover, close on mouseout
					let closeTimer = null;
					newMarker._pinned = false;
					newMarker.on('mouseover', function () {
						if (closeTimer) {
							clearTimeout(closeTimer);
							closeTimer = null;
						}
						this.openPopup();
						// attach listeners to popup element so hovering the popup keeps it open
						setTimeout(() => {
							const popup = this.getPopup?.();
							const el = popup?.getElement?.();
							if (el) {
								el.addEventListener('mouseenter', () => {
									if (closeTimer) {
										clearTimeout(closeTimer);
										closeTimer = null;
									}
								});
								el.addEventListener('mouseleave', () => {
									if (!this._pinned) this.closePopup();
								});
							}
						}, 0);
					});
					newMarker.on('mouseout', function () {
						// delay close so user can move pointer into popup
						if (closeTimer) clearTimeout(closeTimer);
						closeTimer = setTimeout(() => {
							if (!this._pinned) this.closePopup();
							closeTimer = null;
						}, 250);
					});
					newMarker.on('click', function () {
						// toggle pinned state on click so popup stays open for interaction
						this._pinned = !this._pinned;
						if (this._pinned) this.openPopup();
					});

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

					let closeTimer = null;
					newMarker._pinned = false;
					newMarker.on('mouseover', function () {
						if (closeTimer) {
							clearTimeout(closeTimer);
							closeTimer = null;
						}
						this.openPopup();
						setTimeout(() => {
							const popup = this.getPopup?.();
							const el = popup?.getElement?.();
							if (el) {
								el.addEventListener('mouseenter', () => {
									if (closeTimer) {
										clearTimeout(closeTimer);
										closeTimer = null;
									}
								});
								el.addEventListener('mouseleave', () => {
									if (!this._pinned) this.closePopup();
								});
							}
						}, 0);
					});
					newMarker.on('mouseout', function () {
						if (closeTimer) clearTimeout(closeTimer);
						closeTimer = setTimeout(() => {
							if (!this._pinned) this.closePopup();
							closeTimer = null;
						}, 250);
					});
					newMarker.on('click', function () {
						this._pinned = !this._pinned;
						if (this._pinned) this.openPopup();
					});

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
	<div bind:this={mapElement} class={mapClass}></div>
</section>

<div class="poi-container">
    <a href="/kaart" class="poi">
        <img src="/lemmapngtest1.png" alt="Lemma {{ }}">
        <h2>Johan Cruijff Arena</h2>
    </a>
    <a href="/kaart" class="poi">
        <img src="/lemmapngtest1.png" alt="Footer Image">
        <h2>Johan Cruijff Arena</h2>
    </a>
    <a href="/kaart" class="poi">
        <img src="/lemmapngtest1.png" alt="Footer Image">
        <h2>Johan Cruijff Arena</h2>
    </a>
    <a href="/kaart" class="poi">
        <img src="/lemmapngtest1.png" alt="Footer Image">
        <h2>Johan Cruijff Arena</h2>
    </a>
    <a href="/kaart" class="poi">
        <img src="/lemmapngtest1.png" alt="Footer Image">
        <h2>Johan Cruijff Arena</h2>
    </a>
</div>

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

	.leaflet-container {
		height: 60vh;
	}

    .poi-container {
        display: flex;
        justify-content: space-evenly;
        gap: 1rem;
        margin-top: 1rem;
        & a {
            text-decoration: none;
            color: inherit;
        }
        & img {
            height: 100px;
            width: 150px;
        }
    }
    .poi {
        position: relative;
        h2 {
            position: absolute;
            bottom: -0.75rem;
            left: 50%;
            transform: translateX(-50%) scale(1);
            text-wrap: nowrap;
            margin: 0;
            padding: 0;
            transition: transform 0.1s ease-in-out;
        }
        &:hover {
            img {
                transform: scale(1.6);
                transition: transform 0.1s ease-in-out;
            }
            h2 {
                transform: translateX(-50%) scale(1.2);
            }
        }
    }
</style>