<template>
  <div class="map">
    <div id="map-container">
    </div>
  </div>
</template>
<script setup lang="ts">
import Mapbox from "mapbox-gl"
import TreeHelperService from '@/helpers/TreeHelperService'
import { MapBoxCoordinates } from "@/typings/typings"
import { onMounted, ref } from 'vue'
let map:Mapbox;
let zoom = ref(16.2)
let markerZoom = ref(0)
let boundingTrees = ref()

function addTreeLayer () {
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
       'circle-stroke-color': '#0f6633',
       'circle-stroke-width': 1,
       'circle-color': '#418754'
     }
   });
    map.on('mousemove', 'trees-layer', () => {
      map.getCanvas().style.cursor = 'pointer';
    })

    map.on('mouseleave', 'trees-layer', () => {
      map.getCanvas().style.cursor = '';
    })
}

async function loadTrees (pos: MapBoxCoordinates, bounds:{ _sw:MapBoxCoordinates,_ne:MapBoxCoordinates }, zoom: number) {
  console.log(pos, zoom)
  if(zoom >= 14){
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
  else{
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
  center: [16.35997475606348,48.20987538428605], // starting position [lng, lat]
  zoom: zoom.value, // starting zoom
  projection: 'globe' // display the map as a 3D globe
  });
  map.on('style.load', () => {
    map.setFog({}); // Set the default atmosphere style
  });

  await loadTrees(map.getCenter(), map.getBounds(), map.getZoom())

  map.on('zoomend', (e:Event) => {
    loadTrees(map.getCenter(), map.getBounds(), map.getZoom())
    zoom.value = map.getZoom()
  });

  map.on('moveend', (e:Event) => {
    loadTrees(map.getCenter(), map.getBounds(), map.getZoom())
  });
}


onMounted(() => {
  generateMap()
})



</script>
<style lang="scss">
.map{
  #map-container{
    height: 100vh;
  }
}
</style>