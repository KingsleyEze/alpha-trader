<script setup lang="ts">
import WatchItem from "@/components/watch/WatchItem.vue";
import { inject } from "vue";
import { Stock } from "@/types";

const { activeWatchList } = inject("watchList") as {
  activeWatchList: Stock[];
};
</script>
<template>
  <h2>Watch List</h2>
  <WatchItem
    v-for="item in activeWatchList"
    :isin="item.isin"
    :price="item.price"
  />
</template>
