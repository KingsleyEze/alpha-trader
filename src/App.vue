<script setup lang="ts">
import { webSocket } from "rxjs/webSocket";
import { watchEffect, onUnmounted } from "vue";
import { tap, catchError, mergeMap } from "rxjs/operators";
import { of, throwError, timer } from "rxjs";
import Header from "@/components/common/Header.vue";
import AppLayout from "@/layout/AppLayout.vue";
import Search from "@/components/search/Search.vue";
import WatchList from "@/components/watch/WatchList.vue";
import "@/index.css";
import { provide, Ref, ref } from "vue";
import { Stock } from "./types";

const WEB_SOCKET_URL = "ws://localhost:8425";
const MAX_RETRIES = 5;
const INITIAL_DELAY = 1000; // 1 second

interface IncomingWebSocketMessage {
  isin: string;
  price: number;
  bid?: number;
  ask?: number;
}
const activeWatchList: Ref<Stock[]> = ref([]);

function handleIncomingMessage(message: IncomingWebSocketMessage) {
  const stock = activeWatchList.value.find(
    (stock) => stock.isin === message.isin,
  );

  if (stock) {
    stock.price = message.price;
  } else {
    activeWatchList.value.push({
      isin: message.isin,
      price: message.price,
    });
  }
}

const rawSocket$ = webSocket<any>(WEB_SOCKET_URL);

const socket$ = rawSocket$.pipe(
  tap({
    next: () => console.log("WebSocket connection successful."),
    error: () =>
      console.warn("WebSocket connection failed. Trying to reconnect..."),
    complete: () => console.log("WebSocket connection closed."),
  }),
  catchError((err, caught) => {
    console.error("Error in WebSocket stream:", err);

    return of(err).pipe(
      mergeMap((error, retryCount) => {
        if (retryCount < MAX_RETRIES) {
          const delayDuration = INITIAL_DELAY * Math.pow(2, retryCount);
          return timer(delayDuration);
        }
        return throwError(() => new Error("Reached maximum retries"));
      }),
    );
  }),
);

watchEffect(() => {
  const subscription = socket$.subscribe({
    next: (message: IncomingWebSocketMessage) => handleIncomingMessage(message),
    error: (err) => console.error("WebSocket final error:", err),
  });

  onUnmounted(() => subscription.unsubscribe());
});

function updateWatchList(isin: string) {
  const stockExists = activeWatchList.value.some(
    (stock) => stock.isin === isin,
  );

  if (!stockExists) {
    activeWatchList.value.push({
      isin: isin,
      price: 0,
    });
    subscribeToInstrument(isin);
  }
}

function subscribeToInstrument(isin: string) {
  rawSocket$.next({ subscribe: isin });
}

function unsubscribeFromInstrument(isin: string) {
  rawSocket$.next({ unsubscribe: isin });
}

provide("watchList", {
  activeWatchList,
  updateWatchList,
  subscribeToInstrument,
  unsubscribeFromInstrument,
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
