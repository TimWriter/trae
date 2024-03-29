<template>
  <div class="tree-info" v-if="tree">
    <div class="center" @click="$emit('center', tree)">
      <i class="bi bi-geo"></i>
    </div>
    <div class="close" @click="$emit('unselect')">
      <i class="bi bi-x"></i>
    </div>
    <h3>Ausgewählter Baum</h3>
    <div class="info">
      <div class="row">
        <div class="label">Name</div>
        <div class="value">{{ tree.name }}</div>
      </div>
      <div class="row" v-if="showFullInfo">
        <div class="label">Baumnummer</div>
        <div class="value">{{ tree.tree_nr }}</div>
      </div>
      <div class="row" v-if="showFullInfo">
        <div class="label">Pflanzjahr</div>
        <div class="value" v-if="tree.year !== 'n.a.'">{{ tree.year }}</div>
        <div class="value" v-else>nicht verfügbar</div>
      </div>
      <div class="row" v-if="showFullInfo">
        <div class="label">Baumhöhe</div>
        <div class="value">
          {{ getHeight(tree) }}
        </div>
      </div>
      <div class="row" v-if="showFullInfo">
        <div class="label">Stammumfang</div>
        <div class="value" v-if="tree.circumference !== 'n.a.'">{{ tree.circumference }} cm</div>
        <div class="value" v-else>nicht verfügbar</div>
      </div>
      <div class="row" v-if="showFullInfo">
        <div class="label">Kronendurchmesser</div>
        <div class="value">
          {{ getCrown(tree) }}
        </div>
      </div>
      <div class="row" v-if="!showFullInfo">
        <div class="show-more" @click="showFullInfo = true">
          <i class="bi bi-chevron-up"></i>
          Mehr Information
        </div>
      </div>
      <div class="row" v-if="showFullInfo">
        <div class="show-more" @click="showFullInfo = false">
          <i class="bi bi-chevron-down"></i>
          Weniger Information
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import TreeHelperService from '@/helpers/TreeHelperService'
import { FullTree } from '@/typings/typings';
import { nextTick, ref } from 'vue';
import "bootstrap-icons/font/bootstrap-icons.css";
const props = defineProps<{
  id: number | null,
  height: { id: number, min: string, max: string }[] | null,
  crown: { id: number, min: string, max: string }[] | null
}>()
const tree = ref<FullTree | null>(null)
const isMobile = ref(window.innerWidth < 500)
const showFullInfo = ref(!isMobile.value)

function getTreeFromDB() {
  nextTick(async () => {
    if (props.id !== null) {
      tree.value = await TreeHelperService.getTree(props.id)
    }
    else {
      tree.value = null
    }
  })
}

function getHeight(tree: FullTree) {
  if (tree.height !== 'n.a.') {
    if (tree.id < 213680) {
      const lookup = props.height?.find(x => x.id === parseInt(tree.height))
      return `${lookup?.min} - ${lookup?.max} m`
    } else {
      return tree.height + ' m'
    }

  }
  return 'nicht verfügbar'
}

function getCrown(tree: FullTree) {
  if (tree.crowndiameter !== 'n.a.') {
    console.log(tree.id)
    if (tree.id < 213680) {
      const lookup = props.crown?.find(x => x.id === parseInt(tree.crowndiameter))
      return `${lookup?.min} - ${lookup?.max} m`
    } else {
      return tree.crowndiameter + ' m'
    }
  }
  return 'nicht verfügbar'
}

defineExpose({
  getTreeFromDB
})

getTreeFromDB()
</script>
<style lang="scss">
.tree-info {
  position: absolute;
  left: 1em;
  bottom: 3em;
  min-width: 300px;
  padding: 1.5em 2em;
  z-index: 1;
  border: 1px solid #ddd;
  border-radius: 20px;
  box-shadow: 0px 0px 15px rgba($color: #000000, $alpha: .2);
  font-family: 'Lato', sans-serif;
  background-color: #fff;

  @media only screen and (max-width: 500px) {
    left: 0;
    width: calc(100% - 4em - 2px);
    min-width: 0px;
    bottom: 0;
    z-index: 2;
    border-radius: 20px 20px 0 0;
  }

  @media all and (display-mode: standalone) {
    .show-more {
      margin: 1em auto 1.5em auto !important;
    }
  }

  .center {
    position: absolute;
    left: 1.5em;
    top: 1em;
    cursor: pointer;
    border-radius: 50%;
    width: 2em;
    height: 2em;
    transition-duration: .2s;
    color: #7FA776;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      background-color: #7FA77633;
    }

    i {
      margin-top: -3px;
      font-size: 1.2em;
    }
  }

  .close {
    position: absolute;
    right: 1.5em;
    top: 1em;
    cursor: pointer;
    border-radius: 50%;
    width: 2em;
    height: 2em;
    transition-duration: .2s;

    &:hover {
      background-color: #ddd;
    }

    i {
      font-size: 1.6em;
    }
  }

  h3 {
    margin: -.2em 0 1em 0;
  }

  .info {
    .row {
      display: flex;
      flex-direction: column;
      text-align: left;
      margin-top: .4em;

      &:first-child {
        margin-top: 0;
      }

      .label {
        min-width: 10em;
        font-weight: 600;
        font-size: .8em;
      }

      .show-more {
        margin: 1em auto 0 auto;
        font-weight: 500;
        font-size: .9em;
        color: #9b64d9;
        cursor: pointer;

        i {
          font-size: .9em;
          margin-right: .2em;
        }
      }
    }
  }
}
</style>