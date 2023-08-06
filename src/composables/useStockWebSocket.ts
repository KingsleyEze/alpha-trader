import { webSocket } from "rxjs/webSocket";
import { tap, catchError, mergeMap } from "rxjs/operators";
import { of, throwError, timer, Subject } from "rxjs";
import { Ref, ref } from "vue";
import { Stock } from "../types";

const WEB_SOCKET_URL = "ws://localhost:8425";
const MAX_RETRIES = 5;
const INITIAL_DELAY = 1000; // 1 second

interface IncomingWebSocketMessage {
  isin: string;
  price: number;
  bid?: number;
  ask?: number;
}

export const useStockWebSocket = () => {
  const activeWatchList: Ref<Stock[]> = ref([]);

  const handleIncomingMessage = (message: IncomingWebSocketMessage): void => {
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
  };

  const rawSocket$ = webSocket<any>(WEB_SOCKET_URL);

  const connectionStatus: Ref<"connected" | "disconnected" | "reconnecting"> =
    ref("disconnected");

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
