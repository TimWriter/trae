<template>
  <div class="map">
    <div id="map-container">
    </div>
    <SearchbarComponent @showPOI="showPOI" @showTree="showTree" />
    <TreeInfo :id="selectedTreeID" @unselect="unselectTree()" ref="treeInfoRef" />
  </div>
</template>
<script setup lang="ts">
import Mapbox from "mapbox-gl"
import TreeHelperService from '@/helpers/TreeHelperService'
import { FullTree, MapBoxCoordinates } from "@/typings/typings"
import { onMounted, ref } from 'vue'
import TreeInfo from '@/components/TreeInfoComponent.vue'
import SearchbarComponent from "@/components/SearchbarComponent.vue"
let map: Mapbox;
let zoom = ref(16.2)
let boundingTrees = ref()
let treeInfoRef = ref()
let selectedTreeID = ref<number | null>(null)
let isTouch = 'ontouchstart' in window || navigator.maxTouchPoints;
let poiMarker: any | null = null;

console.log(isTouch)

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
    "data": {
      "type": "FeatureCollection",
      "features": boundingTrees.value
    }
  })
  map.addLayer({
    id: 'trees-layer',
    type: 'circle',
    source: 'trees',
    paint: {
      'circle-stroke-color': [
        'case',
        ['boolean', ['feature-state', 'selected'], false],
        '#444',
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
        '#54a862',
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
    essential: true // this animation is considered essential with respect to prefers-reduced-motion
  });
}

async function loadTrees(pos: MapBoxCoordinates, bounds: { _sw: MapBoxCoordinates, _ne: MapBoxCoordinates }, zoom: number) {
  if (zoom >= 10) {
    boundingTrees.value = await TreeHelperService.getAllBoundingTreesGeoJSON(bounds)
    console.log(boundingTrees.value.length)
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
  else {
    if (map.getLayer('trees-layer')) {
      map.removeLayer('trees-layer');
      map.removeSource('trees');
    }
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