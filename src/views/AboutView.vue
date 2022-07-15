<template>
  <div class="about">
    <h1>This is an about page</h1>
    {{lat}}
    {{long}}
    {{acc}}
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';

const lat = ref(0)
const long = ref(0)
const acc = ref(0)


if(navigator.geolocation){
  navigator.geolocation.getCurrentPosition(function(position) {
    console.log(position)
  lat.value = position.coords.latitude
  long.value = position.coords.longitude
  acc.value = position.coords.accuracy
})
}

function handlePermission() {
  navigator.permissions.query({name:'geolocation'}).then(function(result) {
    if (result.state == 'granted') {
      report(result.state);
    } else if (result.state == 'prompt') {
      report(result.state);
    } else if (result.state == 'denied') {
      report(result.state);
    }
    result.addEventListener('change', function() {
      report(result.state);
    });
  });
}

function report(state) {
  console.log('Permission ' + state);
}

handlePermission();

</script>
