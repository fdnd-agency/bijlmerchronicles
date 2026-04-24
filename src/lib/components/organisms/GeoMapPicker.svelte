<script>
    const DEFAULT_LAT = 52.316;
    const DEFAULT_LNG = 4.974;

    let { lat = '', lng = '', onChange = () => {} } = $props();

    let leaflet = $state(null);
    let map = $state(null);
    let marker = $state(null);

    async function initMap(node) {
        const L =
            await import('https://unpkg.com/leaflet@1.9.4/dist/leaflet-src.esm.js');
        leaflet = L;

        map = L.map(node, {
            worldCopyJump: false,
            maxBounds: [
                [-85, -180],
                [85, 180],
            ],
            maxBoundsViscosity: 1.0,
        }).setView(
            [parseFloat(lat) || DEFAULT_LAT, parseFloat(lng) || DEFAULT_LNG],
            14,
        );

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 19,
            noWrap: true,
        }).addTo(map);

        if (lat && lng) {
            marker = L.marker([parseFloat(lat), parseFloat(lng)]).addTo(map);
        }

        map.on('click', (e) => {
            const nextLat = e.latlng.lat.toFixed(6);
            const nextLng = e.latlng.lng.toFixed(6);

            onChange({ lat: nextLat, lng: nextLng });

            if (marker) {
                marker.setLatLng([e.latlng.lat, e.latlng.lng]);
            } else {
                marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
            }
        });

        updateMapMarker();
    }

    function updateMapMarker() {
        if (!map || !leaflet) return;

        const parsedLat = parseFloat(lat);
        const parsedLng = parseFloat(lng);

        if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
            map.invalidateSize();
            map.setView([parsedLat, parsedLng], 15);
            if (marker) {
                marker.setLatLng([parsedLat, parsedLng]);
            } else {
                marker = leaflet.marker([parsedLat, parsedLng]).addTo(map);
            }
            return;
        }

        map.setView([DEFAULT_LAT, DEFAULT_LNG], 14);
        if (marker) {
            marker.remove();
            marker = null;
        }
    }

    $effect(() => {
        updateMapMarker();
    });
</script>

<svelte:head>
    <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        crossorigin=""
    />
</svelte:head>

<div class="form-group">
    <!-- svelte-ignore a11y_label_has_associated_control -->
    <label>
        geo locatie <small>(klik op de kaart om locatie te kiezen)</small>
    </label>
    <div class="map-wrapper" use:initMap></div>
</div>

<style>
    .form-group {
        margin-bottom: 0.65rem;
    }

    .form-group label {
        display: block;
        margin-bottom: 0.25rem;
        font-size: 0.9rem;
    }

    .form-group label small {
        font-size: 0.75rem;
        opacity: 0.7;
    }

    .map-wrapper {
        width: 100%;
        height: 250px;
        border: 2px solid hsl(var(--secondary-h), var(--secondary-s), 17%);
        border-radius: 2px;
        margin-bottom: 0.5rem;
        z-index: 0;
    }
</style>
