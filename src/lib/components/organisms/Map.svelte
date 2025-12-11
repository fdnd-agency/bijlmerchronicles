<script>
    import { onDestroy, onMount } from "svelte";
    import { tick } from "svelte";
    import { javascript } from "$lib/utils/javascriptEnabled.svelte.js";

    let {
        mapAddresses,
        activeMapAddresses = [],
        mapClass = "",
        initialZoom = 13,
        initialView = [52.32110888521107, 4.966273199933488],
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
        let imgHtml = "";
        const posterUrl =
            marker.posterimage_url ||
            marker.posterimage ||
            (marker.poster &&
                marker.poster.covers &&
                marker.poster.covers[0] &&
                (marker.poster.covers[0].directus_files_id?.id ||
                    marker.poster.covers[0].directus_files_id));
        if (posterUrl) {
            const src = posterUrl.startsWith("http")
                ? posterUrl
                : `https://fdnd-agency.directus.app/assets/${posterUrl}`;
            imgHtml = `<img style="width: clamp(100px, 20vw, 150px);" src="${src}" alt="Afbeelding van ${marker.street ?? ""} ${marker.house_number ?? ""}">`;
        }

        const content = `
		<div id="popover-container">
		  ${imgHtml}
          <p><strong>${marker.title ?? ""}</strong></p>
          <p>${marker.summary ?? ""}</p>
		  <a href="/wiki/${marker.id ?? ""}" data-sveltekit-reload>Bekijk meer</a>
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
        leaflet = (await import("leaflet")).default;

        const mapStyle =
            "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
        const attribution =
            '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

        map = leaflet.map(mapElement).setView(initialView, initialZoom);

        leaflet
            .tileLayer(mapStyle, {
                attribution,
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
                const posterUrl =
                    marker.posterimage_url ||
                    marker.posterimage ||
                    (marker.poster &&
                        marker.poster.covers &&
                        marker.poster.covers[0] &&
                        (marker.poster.covers[0].directus_files_id?.id ||
                            marker.poster.covers[0].directus_files_id));
                let icon = null;
                if (posterUrl) {
                    const src = posterUrl.startsWith("http")
                        ? posterUrl
                        : `https://fdnd-agency.directus.app/assets/${posterUrl}`;
                    icon = leaflet.icon({
                        iconUrl: src,
                        iconSize: [45, 40],
                        iconAnchor: [23, 36],
                        popupAnchor: [1, -34],
                    });
                }

                const newMarker = icon
                    ? leaflet.marker(coords, { icon })
                    : leaflet.circleMarker(coords, {
                          radius: 6,
                          color: "#d0342a",
                          fillColor: "#d0342a",
                          fillOpacity: 0.9,
                      });

                newMarker.addTo(map).bindPopup(popup);

                // open popup on hover, close on mouseout
                let closeTimer = null;
                newMarker._pinned = false;
                newMarker.on("mouseover", function () {
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
                            el.addEventListener("mouseenter", () => {
                                if (closeTimer) {
                                    clearTimeout(closeTimer);
                                    closeTimer = null;
                                }
                            });
                            el.addEventListener("mouseleave", () => {
                                if (!this._pinned) this.closePopup();
                            });
                        }
                    }, 0);
                });
                newMarker.on("mouseout", function () {
                    // delay close so user can move pointer into popup
                    if (closeTimer) clearTimeout(closeTimer);
                    closeTimer = setTimeout(() => {
                        if (!this._pinned) this.closePopup();
                        closeTimer = null;
                    }, 250);
                });
                newMarker.on("click", function () {
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

                // try to build an icon from the marker's poster; fallback to circleMarker
                const posterUrl =
                    marker.posterimage_url ||
                    marker.posterimage ||
                    (marker.poster &&
                        marker.poster.covers &&
                        marker.poster.covers[0] &&
                        (marker.poster.covers[0].directus_files_id?.id ||
                            marker.poster.covers[0].directus_files_id));
                let icon = null;
                if (posterUrl) {
                    const src = posterUrl.startsWith("http")
                        ? posterUrl
                        : `https://fdnd-agency.directus.app/assets/${posterUrl}`;
                    icon = leaflet.icon({
                        iconUrl: src,
                        iconSize: [36, 54],
                        iconAnchor: [18, 54],
                        popupAnchor: [1, -34],
                    });
                }

                const newMarker = icon
                    ? leaflet.marker(coords, { icon })
                    : leaflet.circleMarker(coords, {
                          radius: 12,
                          color: "#0056ff",
                          fillColor: "#0056ff",
                          fillOpacity: 0.95,
                      });

                newMarker.addTo(map).bindPopup(popup);

                let closeTimer = null;
                newMarker._pinned = false;
                newMarker.on("mouseover", function () {
                    if (closeTimer) {
                        clearTimeout(closeTimer);
                        closeTimer = null;
                    }
                    this.openPopup();
                    setTimeout(() => {
                        const popup = this.getPopup?.();
                        const el = popup?.getElement?.();
                        if (el) {
                            el.addEventListener("mouseenter", () => {
                                if (closeTimer) {
                                    clearTimeout(closeTimer);
                                    closeTimer = null;
                                }
                            });
                            el.addEventListener("mouseleave", () => {
                                if (!this._pinned) this.closePopup();
                            });
                        }
                    }, 0);
                });
                newMarker.on("mouseout", function () {
                    if (closeTimer) clearTimeout(closeTimer);
                    closeTimer = setTimeout(() => {
                        if (!this._pinned) this.closePopup();
                        closeTimer = null;
                    }, 250);
                });
                newMarker.on("click", function () {
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
    @import "leaflet/dist/leaflet.css";
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
        margin-top: 7rem;
        width: 100%;
    }

    /* --------------------------------------- Heading (h3) background + H3 Styling------------------------------------ */

    .background-heading {
        position: absolute;
        width: 150%;
        height: 300%;
        min-height: 7rem;
        right: -1rem;
        top: -2rem;
        aspect-ratio: 3.118;
        clip-path: shape(
            from 100% 94%,
            curve to 97.64% 99.87% with 100% 97.81%/98.85% 100.66%,
            line to 82.91% 90.36%,
            line to 58.41% 73.64%,
            curve to 58.05% 73.5% with 58.29% 73.56%/58.17% 73.51%,
            line to 4.68% 67.74%,
            curve to 2.82% 62.84% with 3.76% 67.64%/2.99% 65.6%,
            line to 0.03% 16.72%,
            curve to 1.9% 9.63% with -0.19% 13.11%/0.7% 9.75%,
            line to 97.98% 0%,
            curve to 100% 6% with 99.08% -0.11%/100% 2.61%,
            vline to 94%,
            close
        );
        background-color: var(--color-secondary);
        z-index: -1;
    }

    h3 {
        position: absolute;
        top: 0;
        right: 1rem;
        margin: 0;
        color: var(--color-primary);
        font-size: clamp(1.5rem, 5vw, 3rem);
        z-index: 2;
    }

    /* --------------------------------------- Img (cover) and shape that's the same color as the background (intersection shape) that's top left ------------------------------------ */

    img {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: cover;
    }

    .intersection-shape {
        aspect-ratio: 6.296;
        clip-path: shape(
            from 0% 0%,
            hline to 100%,
            line to 73.11% 36.4%,
            line to 0% 100%,
            vline to 0%,
            close
        );
        background-color: var(--color-background);
        position: absolute;
        width: 65%;
        height: 10vh;
        min-height: 3rem;
        left: 0;
        top: -0.2rem;
    }

    /* --------------------------------------- Button styling (Button in the middle that redirects to new page) ------------------------------------ */
    a {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #717171c8;
        color: #ffffff;
        text-decoration: none;
        padding: 0.6em;
        border-radius: 0.6rem;
        font-size: 1.25rem;
        &::after {
            content: "";
            position: absolute;
            bottom: -0.75rem;
            left: 50%;
            transform: translateX(-50%) scale(1);
            text-wrap: nowrap;
            margin: 0;
            padding: 0;
            transition: transform 0.1s ease-in-out;
        }
        @media (min-width: 38rem) {
            font-size: 1.5em;
            padding: 0.5em 1em;
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
        .leaflet-popup-content {
            display: grid;
            background-color: black;
            margin: 0;
            & img {
                width: clamp(100px, 20vw, 200px);
                border-radius: 4px;
                margin-right: 0.75rem;
            }
        }
    }
</style>
