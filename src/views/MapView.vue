<template>
  <div class="map">
    <div id="map-container">
    </div>
  </div>
</template>
<script setup lang="ts">
import Mapbox from "mapbox-gl";
import { onMounted, ref } from 'vue'
let map:Mapbox;
let zoom = ref(11)
let markerZoom = ref(0)
let currentSelection = ref('')

function generateMap() {
  Mapbox.accessToken = 'pk.eyJ1Ijoid2Vic2Nyb2xsIiwiYSI6ImNsNW1sYm02ajB1ejczY21ncTBtN2o4NjgifQ.eP6LH-g1PeLwlYbegoxV0A';
  map = new Mapbox.Map({
  container: 'map-container', // container ID
  style: 'mapbox://styles/webscroll/cl5mokzbw000914qh5jjhqprw', // style URL
  center: [16.40,48.20], // starting position [lng, lat]
  zoom: zoom.value, // starting zoom
  projection: 'globe' // display the map as a 3D globe
  });
  map.on('style.load', () => {
    map.setFog({}); // Set the default atmosphere style
  });

  addMarker()

  map.on('zoom', (e:Event) => {
    zoom.value = map.getZoom()
    // markerZoom.value = (zoom.value-2.5)*0.12 - 1
    markerZoom.value = 1 + (zoom.value - 14) * 1
    if (markerZoom.value < 0) {
      markerZoom.value = 0
    }
    console.log(markerZoom.value)
  });
}

function selectTree(id:string):void {
  currentSelection.value = id
  const tree = document.querySelector(`[data-id="tree-#${id}"]`) as HTMLElement
  tree.classList.add('selected')
}

function addMarker() {
  const position = [16.40,48.20]
  const point = document.createElement('div');
  point.id = 'marker';
  point.classList.add('tree-container');
  point.innerHTML= `<div class="tree" data-id="tree-#1">`

  new Mapbox.Marker(point)
  .setLngLat(position)
  .addTo(map);

  const tree = document.querySelector('[data-id="tree-#1"]') as HTMLElement
  tree.addEventListener('click', () => {selectTree('1')})
}

onMounted(() => {
  let width = document.documentElement.clientWidth
  if(width < 1200) zoom.value = 10
  if(width < 500) zoom.value = 9
  console.log(width)
  generateMap()
})



</script>
<style lang="scss">
.map{
  #map-container{
    height: 100vh;
  }
}

.tree{
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 2px;
  background-color: green;
  transform: scale(v-bind('markerZoom'));
  cursor: pointer;
}

.tree.selected{
  z-index: 1;
  &::before{
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: #000;
    z-index: 0;
  }
  
}
</style>