<script setup lang="ts">
import Header from "@/components/common/Header.vue";
import AppLayout from "@/layout/AppLayout.vue";
import Search from "@/components/search/Search.vue";
import WatchList from "@/components/watch/WatchList.vue";
import "@/index.css";
import { computed, provide, Ref, ref } from "vue";
import { Stock } from "@/types";

const ISINList: Ref<string[]> = ref([]);

const activeWatchList: Ref<Stock[]> = computed(() => {
  return ISINList.value.map((isin) => {
    return {
      isin,
      price: 0,
    };
  });
});

const updateWatchList = (isin: string) => {
  ISINList.value.push(isin);
};

provide("watchList", {
  activeWatchList,
  updateWatchList,
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
