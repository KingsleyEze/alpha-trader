<script setup lang="ts">
import { watchEffect, onUnmounted, provide, onMounted } from "vue";
import Header from "@/components/common/Header.vue";
import AppLayout from "@/layout/AppLayout.vue";
import Search from "@/components/search/Search.vue";
import WatchList from "@/components/watch/WatchList.vue";
import "@/index.css";
import { useStockWebSocket } from "./composables/useStockWebSocket";
import { Stock } from "./types";

const {
  activeWatchList,
  connectionStatus,
  subscribeToInstrument,
  unsubscribeFromInstrument,
} = useStockWebSocket();

const addStockToWatchList = (isin: string): void => {
  const existingStock = activeWatchList.value.find(
    (stock) => stock.isin === isin,
  );

  if (!existingStock) {
    activeWatchList.value.push({
      isin: isin,
      price: 0,
    });
    subscribeToInstrument(isin);
  }
};

const removeStockFromWatchList = (isin: string): void => {
  const existingStockIndex = activeWatchList.value.findIndex(
    (stock) => stock.isin === isin,
  );

  if (existingStockIndex > -1) {
    activeWatchList.value.splice(existingStockIndex, 1);
    unsubscribeFromInstrument(isin);
  }
};

onMounted(() => {
  watchEffect(() => {
    console.log(connectionStatus.value);
    if (connectionStatus.value === "connected") {
      activeWatchList.value.forEach((stock: Stock) => {
        subscribeToInstrument(stock.isin);
      });
    }
  });
});

onUnmounted(() => {
  activeWatchList.value.forEach((stock: Stock) => {
    unsubscribeFromInstrument(stock.isin);
  });
});

provide("watchList", {
  activeWatchList,
  addStockToWatchList,
  removeStockFromWatchList,
});
</script>

<template>
  <AppLayout>
    <template #header>
      <Header />
    </template>
    <template #content>
      <div class="main">
        <Search />
        <WatchList />
      </div>
    </template>
  </AppLayout>
</template>
<style>
#app {
  font-family: var(--font-regular);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.main {
  max-width: var(--max-width);
  margin: 0 auto;
}
</style>
