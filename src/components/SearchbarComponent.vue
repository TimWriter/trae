<template>
  <div class="searchbar-container">
    <div class="input-container" @click="openSearchbar()" :class="isExtended ? 'extended' : ''">
      <input type="search" v-if="isExtended" v-model="searchBarModel" @keyup="searchAPI()" @blur="exitSearchbar()"
        ref="searchBarRef" autocomplete="false" placeholder="Adresse, #Baumnummer">
      <i v-if="!isExtended" class="bi bi-search"></i>
      <i v-else class="bi bi-x" @click="closeSearchbar()"></i>
      <div v-if="results.length > 0" class="results">
        <div class="row" v-for="item in results" :key="item" @click="showSearchResult(item)">
          <div class="icon">
            <i v-if="searchBarModel.charAt(0) === '#'" class="bi bi-pin-map"></i>
            <i v-else class="bi bi-geo-alt"></i>
          </div>
          <div class="name" v-if="searchBarModel.charAt(0) !== '#'">
            <span v-if="item.display_name.split(',')[0].length > 1">
              {{ item.display_name.split(',')[0] }}
            </span>
            <span v-else>
              {{ item.display_name.split(',')[1] }}
            </span>
          </div>
          <div class="name" v-else>
            {{ item.name }}
          </div>
          <div class="city" v-if="searchBarModel.charAt(0) !== '#'">
            {{ item.address.city || item.address.town }}
          </div>
          <div class="city" v-else>
            {{ item['tree_nr'] }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import "bootstrap-icons/font/bootstrap-icons.css";
import TreeHelperService from '@/helpers/TreeHelperService'
import { nextTick, ref } from "vue";
import axios from "axios"

const isExtended = ref(false)
const searchBarRef = ref<HTMLElement | null>(null)
const searchBarModel = ref('')
const results = ref<Array<any>>([])
const emit = defineEmits(['showPOI', 'showTree'])

function openSearchbar() {
  if (!isExtended.value)
    isExtended.value = true
  setTimeout(() => {
    searchBarRef.value?.focus()
  }, 1)
}

function exitSearchbar() {
  if (searchBarModel.value.length < 1) {
    isExtended.value = false
  }
}

function closeSearchbar() {
  results.value = []
  setTimeout(() => {
    isExtended.value = false
  }, 1)

}

async function searchAPI() {
  if (searchBarModel.value.charAt(0) !== '#') {
    const request = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: searchBarModel.value,
        format: 'json',
        addressdetails: 1,
        viewbox: '18.235355189567343,50.201870291472034,8.38194241488577,44.83225864460698',
        bounded: 1,
        email: 'tim.schreiber@outlook.com',
        limit: 5,
        'accept-language': 'de,en'
      }
    })
    results.value = JSON.parse(request.request.response)
    console.log(results.value)
  } else {
    const trees = await TreeHelperService.getTreesByTreeNumber(searchBarModel.value.split('#')[1])
    console.log(trees)
    if (trees !== null) results.value = trees
  }
}

function showSearchResult(result: any) {
  if (result["tree_nr"] === undefined) {
    const coords = [result.lon, result.lat]
    emit('showPOI', coords)
  } else {
    emit('showTree', result)
  }
  closeSearchbar()
}
</script>
<style lang="scss">
.searchbar-container {
  position: absolute;
  z-index: 1;
  top: 2em;
  right: 2em;

  @media only screen and (max-width: 500px) {
    top: 1em;
    right: 1em;
  }


  .input-container {
    position: relative;
    min-width: 50px;
    height: 50px;
    border-radius: 50px;
    background-color: #fff;
    box-shadow: 0px 0px 15px rgba($color: #000000, $alpha: .2);
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px solid #ddd;
    cursor: pointer;
    transition-duration: .2s;

    &:hover {
      border: 2px solid rgb(184, 184, 184);
    }

    i {
      font-size: 1.2em;
    }

    input {
      font-size: 1em;
      height: 36px;
      width: 18em;
      border: 1px solid #ddd;
      border-radius: 36px;
      margin: 8px;
      -webkit-appearance: none;
      background-color: #eee;
      padding: 0 1em;
      font-family: 'Lato', sans-serif;

      @media only screen and (max-width: 500px) {
        width: 13em;
      }

      &::placeholder {
        color: #777;
      }

      &:focus {
        outline: none;
        border: 1px solid rgb(95, 95, 95);
      }
    }

    .results {
      position: absolute;
      width: 100%;
      height: auto;
      max-height: 200px;
      overflow-y: auto;
      background-color: rgb(241, 241, 241);
      top: 50%;
      box-shadow: 0px 0px 15px rgba($color: #000000, $alpha: .2);
      border-radius: 0 0 15px 15px;
      z-index: -1;
      padding: 2.2em 0 1em 0;

      .row {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 40px;
        overflow: hidden;
        padding: 0 1em;
        transition-duration: .2s;
        cursor: pointer;

        &:hover {
          background-color: #fff;
        }

        .name {
          max-width: 60%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .city {
          margin-left: .5em;
          font-size: .8em;
          color: #777;
        }
      }
    }
  }

  .extended {
    cursor: auto;

    i {
      margin-right: 12px;
      cursor: pointer;
      font-size: 1.6em;
      width: 30px;
      height: 30px;
      border-radius: 15px;
      transition-duration: .2s;

      &:hover {
        background-color: #ddd;
      }
    }

    &:hover {
      border: 2px solid #ddd;
    }
  }
}
</style>