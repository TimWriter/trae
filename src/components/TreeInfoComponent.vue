<template>
  <div class="tree-info" v-if="tree">
    <div class="close" @click="$emit('unselect')">
      <i class="bi bi-x"></i>
    </div>
    <h3>Ausgewählter Baum</h3>
    <div class="info">
      <div class="row">
        <div class="label">Name:</div>
        <div class="value">{{ tree.name }}</div>
      </div>
      <div class="row">
        <div class="label">Baumnummer:</div>
        <div class="value">{{ tree.tree_nr }}</div>
      </div>
      <div class="row">
        <div class="label">Pflanzjahr:</div>
        <div class="value">{{ tree.year }}</div>
      </div>
      <div class="row">
        <div class="label">Baumhöhe:</div>
        <div class="value">{{ tree.height }}</div>
      </div>
      <div class="row">
        <div class="label">Stammumfang:</div>
        <div class="value">{{ tree.circumference }}</div>
      </div>
      <div class="row">
        <div class="label">Kronendurchmesser:</div>
        <div class="value">{{ tree.crowndiameter }}</div>
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
  id: number | null
}>()
const tree = ref<FullTree | null>(null)

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
  min-height: 200px;
  min-width: 400px;
  padding: 1.5em 2em;
  background-color: #fff;
  z-index: 1;
  border: 1px solid #ddd;
  border-radius: 20px;
  box-shadow: 0px 0px 15px rgba($color: #000000, $alpha: .2);
  font-family: 'Lato', sans-serif;

  @media only screen and (max-width: 500px) {
    left: 0;
    width: calc(100% - 2px);
    bottom: 0;
    z-index: 2;
    border-radius: 20px 20px 0 0;
  }

  .close {
    position: absolute;
    right: 1em;
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
    margin: .2em 0 1em 0;
  }

  .info {
    .row {
      display: flex;
      flex-direction: row;
      text-align: left;
      margin-top: .4em;

      &:first-child {
        margin-top: 0;
      }

      .label {
        min-width: 10em;
        font-weight: 600;
      }
    }
  }
}
</style>