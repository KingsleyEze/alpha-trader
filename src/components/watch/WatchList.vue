<script setup lang="ts">
import WatchItem from "@/components/watch/WatchItem.vue";
import { inject } from "vue";
import { Stock } from "@/types";

const { activeWatchList } = inject("watchList") as {
  activeWatchList: Stock[];
};
</script>

<template>
  <div class="watch-list">
    <WatchItem
      v-for="item in activeWatchList"
      :key="item.isin"
      :isin="item.isin"
      :price="item.price"
      :bid="item.bid"
      :ask="item.ask"
    />
  </div>
</template>

<style lang="scss">
.watch-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 900px;
  padding: 10px;
  margin: 0 auto;

  @media (max-width: var(--max-width-tablet)) {
    max-width: 700px;
  }

  @media (max-width: var(--max-width-mobile)) {
    max-width: 100%;
    gap: 5px;
    padding: 5px;
  }
}
</style>
