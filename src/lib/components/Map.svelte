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
		const popup = leaflet && leaflet.popup ? leaflet.popup({
			autoPan: true,
			autoPanPaddingTopLeft: [10, 110],  // Extra padding aan de bovenkant (left, top)
			autoPanPaddingBottomRight: [10, 10]  // Minimale padding onderaan
		}) : null;
		// Prefer a direct poster image URL (provided by server load as `posterimage_url`).
		// Fallback: try the older nested `marker.poster.covers[...]` shape.
		let imgHtml = '';
		const posterUrl = marker.posterimage_url || marker.posterimage ||
			(marker.poster && marker.poster.covers && marker.poster.covers[0] && (marker.poster.covers[0].directus_files_id?.id || marker.poster.covers[0].directus_files_id));
		if (posterUrl) {
			const src = posterUrl.startsWith('http') ? posterUrl : `https://fdnd-agency.directus.app/assets/${posterUrl}`;
			imgHtml = `<img src="${src}" alt="Afbeelding van ${marker.street ?? ''} ${marker.house_number ?? ''}">`;
		}

		const content = `
		<div id="popover-container">
		  ${imgHtml}
          <h2><strong>${marker.title ?? ''}</strong></h2>
          <p>${marker.summary ?? ''}</p>
		  <a class="see-more" href="/wiki/${marker.id ?? ''}" data-sveltekit-reload>Bekijk meer</a>
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

		// Create marker icons per-marker below (use poster image when available).
		// Removed single static markerIcon; we will compute an icon per marker using
		// the same poster resolution logic as in createMarkerPopup.

		// create simple circle markers for all addresses (avoids depending on external marker images)
		if (Array.isArray(mapAddresses)) {
			mapAddresses.forEach((marker) => {
				const popup = createMarkerPopup(marker);
				const coords = [...(marker?.map?.coordinates ?? [])].reverse();
				if (coords.length < 2) return;

				// try to build an icon from the marker's poster; fallback to circleMarker
				const posterUrl = marker.posterimage_url || marker.posterimage ||
					(marker.poster && marker.poster.covers && marker.poster.covers[0] && (marker.poster.covers[0].directus_files_id?.id || marker.poster.covers[0].directus_files_id));
				let icon = null;
				if (posterUrl) {
					const src = posterUrl.startsWith('http') ? posterUrl : `https://fdnd-agency.directus.app/assets/${posterUrl}`;
					icon = leaflet.icon({
						iconUrl: src,
						iconSize: [60, 55],
						iconAnchor: [30, 50],
						popupAnchor: [1, -45]
					});
				}

				const newMarker = icon
					? leaflet.marker(coords, { icon })
					: leaflet.circleMarker(coords, {
						radius: 6,
						color: '#d0342a',
						fillColor: '#d0342a',
						fillOpacity: 0.9
					});

				newMarker.addTo(map).bindPopup(popup);

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
						if (this._pinned) {
							this.openPopup();
						} else {
							this.closePopup();
						}
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

				// try to build an icon from the marker's poster; fallback to circleMarker
				const posterUrl = marker.posterimage_url || marker.posterimage ||
					(marker.poster && marker.poster.covers && marker.poster.covers[0] && (marker.poster.covers[0].directus_files_id?.id || marker.poster.covers[0].directus_files_id));
				let icon = null;
				if (posterUrl) {
					const src = posterUrl.startsWith('http') ? posterUrl : `https://fdnd-agency.directus.app/assets/${posterUrl}`;
					icon = leaflet.icon({
						iconUrl: src,
						iconSize: [70, 65],
						iconAnchor: [35, 60],
						popupAnchor: [1, -55]
					});
				}

				const newMarker = icon
					? leaflet.marker(coords, { icon })
					: leaflet.circleMarker(coords, {
						radius: 12,
						color: '#0056ff',
						fillColor: '#0056ff',
						fillOpacity: 0.95
					});

				newMarker.addTo(map).bindPopup(popup);

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
						if (this._pinned) {
							this.openPopup();
						} else {
							this.closePopup();
						}
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

<!-- <div class="poi-container">
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
</div> -->

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
		height: 79vh;
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
	:global(.leaflet-popup-content-wrapper),
	:global(.leaflet-popup-tip) {
		box-shadow: var(--box-shadow);
		background-color: var(--color-neutral);
		border: 5px solid var(--color-secondary);
		border-radius: 5px;
		container-name: popup;
	}

	:global(.leaflet-popup-tip) {
		display: none;
	}

	@media (min-width: 40em) {
		:global(.leaflet-popup-content-wrapper) {
			background-color: red;
		}
	}
	
	@supports (container: popup) {
		@container popup (min-width: 40em) {
			:global(.leaflet-popup-content-wrapper) {
				grid-template-columns: 2fr 1fr;
			}
		}
	}
	

	
    :global(.leaflet-popup-content) {
		width: 200px;
        & img {
            width: 100%;
            border-radius: 4px;
            margin-right: 0.75rem;
        }
    }
	:global(#popover-container) {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: min-content min-content min-content;
		& h2 {
			font-size: var(--heading-3);
			margin: 0;
			text-align: center;
		}
	}
	:global(.see-more) {
		margin-top: 0.5rem;
		text-align: center;
		color: var(--link-color);
		font-size: var(--paragraph-3);
		text-decoration: none;
	}
	:global(.leaflet-container a.leaflet-popup-close-button) {
		font-size: 24px;
		top: 5px;
		right: 5px;
		color: black;
	}
</style>