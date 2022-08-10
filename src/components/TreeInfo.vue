<template>
  <div class="tree-info" v-if="tree">
    {{tree}}
  </div>
</template>
<script setup lang="ts">
import TreeHelperService from '@/helpers/TreeHelperService'
import { FullTree } from '@/typings/typings';
import { nextTick, ref } from 'vue';
const props = defineProps<{
  id: number | null
}>()
const tree = ref<FullTree | null>(null)

function getTreeFromDB () {
  nextTick(async () => {
    if(props.id !== null) {
      tree.value = await TreeHelperService.getTree(props.id) 
      }
  })
}

defineExpose({
    getTreeFromDB
})

getTreeFromDB()
</script>
<style lang="scss">
.tree-info{
  position: absolute;
  left: 1em;
  bottom: 3em;
  height: 200px;
  width: 400px;
  background-color: #fff;
  z-index: 5;
  border: 1px solid #ddd;
  border-radius: 20px;
  box-shadow: 0px 0px 20px rgba($color: #000000, $alpha: .1);
}
</style>