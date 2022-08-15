<template>
  <div class="map">
    <div id="map-container">
    </div>
    <SearchbarComponent @showPOI="showPOI" @showTree="showTree" />
    <TreeInfo :id="selectedTreeID" @unselect="unselectTree()" ref="treeInfoRef" />
    <LocationBannerComponent v-if="showLocationBanner" @accept="getGeolocation()"
      @cancel="showLocationBanner = false" />
  </div>
</template>
<script setup lang="ts">
import Mapbox from "mapbox-gl"
import TreeHelperService from '@/helpers/TreeHelperService'
import { FullTree, MapBoxCoordinates } from "@/typings/typings"
import { onMounted, ref } from 'vue'
import TreeInfo from '@/components/TreeInfoComponent.vue'
import SearchbarComponent from "@/components/SearchbarComponent.vue"
import LocationBannerComponent from "../components/LocationBannerComponent.vue"
let map: Mapbox;
const zoom = ref(16.2)
const boundingTrees = ref()
const treeInfoRef = ref()
const selectedTreeID = ref<number | null>(null)
const showLocationBanner = ref(false)
const geolocation = ref(null)
let isTouch = 'ontouchstart' in window || navigator.maxTouchPoints;
let poiMarker: any | null = null;


function selectTree(id: number) {
  selectedTreeID.value = id;
  map.setFeatureState(
    {
      source: 'trees',
      id: selectedTreeID.value
    },
    {
      selected: true
    }
  );
  treeInfoRef.value.getTreeFromDB()
}

function unselectTree() {
  map.removeFeatureState({
    source: 'trees',
    id: selectedTreeID.value
  });
  selectedTreeID.value = null;
  treeInfoRef.value.getTreeFromDB()
}

function addTreeLayer() {
  map.addSource('trees', {
    'type': 'geojson',
    'data': {
      'type': 'FeatureCollection',
      'features': boundingTrees.value
    },
    cluster: true,
    clusterMaxZoom: 15, // Max zoom to cluster points on
    clusterRadius: 150
  })
  map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'trees',
    filter: ['has', 'point_count'],
    paint: {
      // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
      // with three steps to implement three types of circles:
      //   * Blue, 20px circles when point count is less than 100
      //   * Yellow, 30px circles when point count is between 100 and 750
      //   * Pink, 40px circles when point count is greater than or equal to 750
      'circle-color': [
        'step',
        ['get', 'point_count'],
        '#7FA776',
        100,
        '#507C58',
        500,
        '#344E41'
      ],
      'circle-radius': [
        'step',
        ['get', 'point_count'],
        20,
        100,
        30,
        750,
        40
      ]
    }
  });
  map.addLayer({
    id: 'cluster-count',
    type: 'symbol',
    source: 'trees',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': [
        'step',
        ['get', 'point_count'],
        '10+',
        100,
        '100+',
        500,
        '500+'
      ],
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 12,
    },
    paint: {
      "text-color": "#ffffff",
      "text-halo-color": "rgba(0,0,0,0.4)",
      "text-halo-width": 1,
      "text-halo-blur": 1
    }
  });
  map.addLayer({
    id: 'trees-layer',
    type: 'circle',
    source: 'trees',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-stroke-color': [
        'case',
        ['boolean', ['feature-state', 'selected'], false],
        '#446e42',
        '#446e42'
      ],
      'circle-stroke-width': [
        'case',
        ['boolean', ['feature-state', 'selected'], false],
        isTouch ? 3 : 2,
        isTouch ? 2 : 1,
      ],
      'circle-color': [
        'case',
        ['boolean', ['feature-state', 'selected'], false],
        '#9b64d9',
        '#54a862'
      ],
      'circle-radius': [
        'case',
        ['boolean', ['feature-state', 'selected'], false],
        isTouch ? 12 : 9,
        isTouch ? 8 : 6,
      ]
    }
  });
  map.on('mousemove', 'trees-layer', () => {
    map.getCanvas().style.cursor = 'pointer';
  })

  map.on('mouseleave', 'trees-layer', () => {
    map.getCanvas().style.cursor = '';
  })

  map.on('click', 'trees-layer', (event) => {
    if (selectedTreeID.value !== null) {
      unselectTree()
    }

    selectTree(event.features[0].id)
  })
}

function showPOI(coords: Array<number>) {
  if (poiMarker !== null) {
    poiMarker.remove()
  }
  poiMarker = new Mapbox.Marker({
    color: "#ed3434",
  })
    .setLngLat(coords)
    .addTo(map);
  map.flyTo({
    center: coords,
    essential: true // this animation is considered essential with respect to prefers-reduced-motion
  });
}

function showTree(tree: FullTree) {
  selectTree(tree.id)
  map.flyTo({
    center: [tree.long, tree.lat],
    zoom: 19,
    essential: true // this animation is considered essential with respect to prefers-reduced-motion
  });
}

async function loadTrees(pos: MapBoxCoordinates, bounds: { _sw: MapBoxCoordinates, _ne: MapBoxCoordinates }, zoom: number) {
  boundingTrees.value = await TreeHelperService.getAllBoundingTreesGeoJSON(bounds)
  if (map.getLayer('trees-layer')) {
    map.getSource('trees').setData(
      {
        "type": "FeatureCollection",
        "features": boundingTrees.value
      }
    );
  } else {
    addTreeLayer()
  }
}

async function generateMap() {
  Mapbox.accessToken = 'pk.eyJ1Ijoid2Vic2Nyb2xsIiwiYSI6ImNsNW1sYm02ajB1ejczY21ncTBtN2o4NjgifQ.eP6LH-g1PeLwlYbegoxV0A';
  map = new Mapbox.Map({
    container: 'map-container', // container ID
    style: 'mapbox://styles/webscroll/cl5mokzbw000914qh5jjhqprw', // style URL
    center: [16.35997475606348, 48.20987538428605], // starting position [lng, lat]
    zoom: zoom.value, // starting zoom
    projection: 'globe' // display the map as a 3D globe
  });
  map.on('style.load', () => {
    map.setFog({}); // Set the default atmosphere style
  });

  await loadTrees(map.getCenter(), map.getBounds(), map.getZoom())

  map.on('zoomend', () => {
    loadTrees(map.getCenter(), map.getBounds(), map.getZoom())
    zoom.value = map.getZoom()
  });

  map.on('moveend', () => {
    loadTrees(map.getCenter(), map.getBounds(), map.getZoom())
  });
}


onMounted(() => {
  generateMap()
})

const size = 150;

// This implements `StyleImageInterface`
// to draw a pulsing dot icon on the map.
const pulsingDot = {
  width: size,
  height: size,
  data: new Uint8ClampedArray(size * size * 4),
  context: '' as unknown as CanvasRenderingContext2D,

  // When the layer is added to the map,
  // get the rendering context for the map canvas.
  onAdd: function () {
    const canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    this.context = canvas.getContext('2d') as CanvasRenderingContext2D;
  },

  // Call once before every frame where the icon will be used.
  render: function () {
    const duration = 3000;
    const t = (performance.now() % duration) / duration;

    const radius = (size / 2) * 0.3;
    const outerRadius = (size / 2) * 0.7 * t + radius;
    const context = this.context;

    // Draw the outer circle.
    context.clearRect(0, 0, this.width, this.height);
    context.beginPath();
    context.arc(
      this.width / 2,
      this.height / 2,
      outerRadius,
      0,
      Math.PI * 2
    );
    context.fillStyle = `rgba(82, 157, 255, ${1 - t})`;
    context.fill();

    // Draw the inner circle.
    context.beginPath();
    context.arc(
      this.width / 2,
      this.height / 2,
      radius,
      0,
      Math.PI * 2
    );
    context.fillStyle = '#529dff';
    context.strokeStyle = 'white';
    context.lineWidth = 2 + 4 * (1 - t);
    context.fill();
    context.stroke();

    // Update this image's data with data from the canvas.
    this.data = context.getImageData(
      0,
      0,
      this.width,
      this.height
    ).data;

    // Continuously repaint the map, resulting
    // in the smooth animation of the dot.
    map.triggerRepaint();

    // Return `true` to let the map know that the image was updated.
    return true;
  }
};

function addLocationIcon(coords: { longitude: number, latitude: number }) {
  map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });

  map.addSource('dot-point', {
    'type': 'geojson',
    'data': {
      'type': 'FeatureCollection',
      'features': [
        {
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [coords.longitude, coords.latitude] // icon position [lng, lat]
          }
        }
      ]
    }
  });
  map.addLayer({
    'id': 'layer-with-pulsing-dot',
    'type': 'symbol',
    'source': 'dot-point',
    'layout': {
      'icon-image': 'pulsing-dot'
    }
  });
}


function setGeolocation(position: any) {
  if (geolocation.value === null) {
    geolocation.value = position
    addLocationIcon(position.coords)
    map.flyTo({
      center: [position.coords.longitude, position.coords.latitude],
      zoom: 16,
      essential: true
    });
  } else {
    geolocation.value = position
    map.getSource('dot-point').setData({
      'type': 'FeatureCollection',
      'features': [
        {
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [position.coords.longitude, position.coords.latitude]
          }
        }
      ]
    });
  }
}

function showError(err: any) {
  console.log(err)
}

function getGeolocation() {
  showLocationBanner.value = false
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(setGeolocation, showError);
    navigator.geolocation.watchPosition(setGeolocation, showError);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

async function checkGeolocation() {
  const query = await navigator.permissions.query({ name: "geolocation" });
  const isValid = query.state === 'granted';
  showLocationBanner.value = !isValid
  if (isValid) {
    getGeolocation()
  }
}

checkGeolocation()
</script>
<style lang="scss">
.map {
  position: absolute;
  height: 100%;
  width: 100%;
  overflow: hidden;

  #map-container {
    height: 100%;
  }
}
</style>