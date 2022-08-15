<template>
  <div class="bg"></div>
  <div class="location-banner">
    <h4>Standortabfrage</h4>
    <p>
      Bitte teile deinen Standort mit uns, um alle Features dieser Seite nutzen zu können.<br>
      <span class="info">
        <i class="bi bi-info-circle"></i>
        Deine Daten werden nicht gespeichert.
      </span>
      <span class="info iphone" v-if="iOS()">
        <span class="path">
          "Einstellungen" > "Datenschutz" > "Ortungsdienste" > "Safari"
          <i class="bi bi-gear-fill"></i>
        </span>
        muss auf "Beim Verwenden" gesetzt sein.
      </span>
    </p>
    <div class="buttons">
      <button @click="emit('cancel')">Lieber nicht</button>
      <button @click="emit('accept')">Standort teilen</button>
    </div>
  </div>
</template>
<script setup lang="ts">

const emit = defineEmits(['cancel', 'accept'])
function iOS() {
  return !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
}
</script>
<style lang="scss">
.location-banner {
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  bottom: 3em;
  background-color: #fff;
  padding: 2em;
  border: 1px solid #ddd;
  border-radius: 20px;
  box-shadow: 0px 0px 15px rgba($color: #000000, $alpha: .2);
  text-align: left;
  z-index: 5;
  font-family: 'Lato', sans-serif;

  @media only screen and (max-width: 500px) {
    width: calc(100% - 6em);
    bottom: 2.2em;
  }

  h4 {
    margin: 0 0;
    text-align: left;
  }

  .buttons {
    display: flex;

    button {
      color: #777;
      background-color: #fff;
      border: 2px solid #777;
      padding: .6em 1em;
      border-radius: 6px;
      -webkit-appearance: none;
      cursor: pointer;
      margin-right: .5em;
      font-weight: 600;
      font-family: 'Lato', sans-serif;

      @media only screen and (max-width: 500px) {
        font-size: .8em;
      }

      &:hover {
        background-color: rgb(236, 236, 236);
      }

      &:nth-child(2) {
        color: #9b64d9;
        border: 2px solid #9b64d9;

        &:hover {
          background-color: rgb(251, 244, 251);
        }
      }
    }
  }

  .info {
    display: block;
    color: #5e5a62;
    font-size: .9em;
    margin: .8em 0 1.6em 0;

    i {
      font-size: .9em;
    }
  }

  .iphone {
    .path {
      position: relative;
      display: block;
      background-color: rgb(219, 219, 219);
      padding: .4em;
      border-radius: 4px;
      margin: .2em 0;
      line-height: 1.4em;

      i {
        position: absolute;
        right: .3em;
        top: .3em;
      }
    }
  }
}

.bg {
  @media only screen and (max-width: 500px) {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 4;
    backdrop-filter: blur(2px);
    background-color: rgba($color: #000000, $alpha: .3);
  }
}
</style>