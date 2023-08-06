import { webSocket } from "rxjs/webSocket";
import { tap, catchError, mergeMap } from "rxjs/operators";
import { of, throwError, timer } from "rxjs";
import { Ref, ref } from "vue";
import { Stock, IncomingWebSocketMessage, ConnectionStatus } from "../types";

const WEB_SOCKET_URL =
  import.meta.env.VITE_WEB_SOCKET_URL || "ws://localhost:8425";
const MAX_RETRIES = import.meta.env.VITE_MAX_RETRIES || 5;
const INITIAL_DELAY = import.meta.env.VITE_INITIAL_DELAY || 1000;

export const useStockWebSocket = () => {
  const activeWatchList: Ref<Stock[]> = ref([]);

  const handleIncomingMessage = (message: IncomingWebSocketMessage): void => {
    const stock = activeWatchList.value.find(
      (stock) => stock.isin === message.isin,
    );

    if (stock) {
      stock.price = message.price;
      stock.bid = message.bid;
      stock.ask = message.ask;
    } else {
      activeWatchList.value.push({
        isin: message.isin,
        price: message.price,
        bid: message.bid,
        ask: message.ask,
      });
    }
  };

  const rawSocket$ = webSocket<any>(WEB_SOCKET_URL);

  const connectionStatus: Ref<ConnectionStatus> = ref("disconnected");

  const socket$ = rawSocket$.pipe(
    tap({
      next: () => {
        connectionStatus.value = "connected";
      },
      error: () => {
        connectionStatus.value = "reconnecting";
      },
      complete: () => {
        connectionStatus.value = "disconnected";
      },
    }),
    catchError((err, caught) => {
      console.error("Error in WebSocket stream:", err);
      return of(err).pipe(
        mergeMap((error, retryCount) => {
          if (retryCount < MAX_RETRIES) {
            // @ts-ignore
            const delayDuration = INITIAL_DELAY * Math.pow(2, retryCount);
            return timer(delayDuration);
          }
          return throwError(() => new Error("Reached maximum retries"));
        }),
      );
    }),
  );

  socket$.subscribe(handleIncomingMessage);

  return {
    activeWatchList,
    connectionStatus,
    subscribeToInstrument: (isin: string) =>
      rawSocket$.next({ subscribe: isin }),
    unsubscribeFromInstrument: (isin: string) =>
      rawSocket$.next({ unsubscribe: isin }),
  };
};
