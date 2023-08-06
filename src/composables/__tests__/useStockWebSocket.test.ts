import { Server } from "mock-socket";
import { useStockWebSocket } from "../useStockWebSocket";
import { test, expect, describe, beforeEach, afterEach } from "vitest";

const WEB_SOCKET_URL =
  import.meta.env.VITE_WEB_SOCKET_URL || "ws://localhost:8425";

describe("useStockWebSocket", () => {
  let mockServer: Server;

  beforeEach(() => {
    mockServer = new Server(WEB_SOCKET_URL);
  });

  afterEach(() => {
    mockServer.close();
  });

  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  test("handles incoming message correctly", async () => {
    return new Promise((resolve, reject) => {
      const incomingMessage = {
        isin: "TEST123",
        price: 100,
        bid: 99,
        ask: 101,
      };

      const { activeWatchList } = useStockWebSocket();

      mockServer.on("connection", (socket) => {
        socket.send(JSON.stringify(incomingMessage));
      });

      setTimeout(() => {
        try {
          expect(activeWatchList.value).toHaveLength(1);
          expect(activeWatchList.value[0]).toEqual(incomingMessage);
          resolve(null);
        } catch (error) {
          reject(error);
        }
      }, 100);
    });
  });

  test("updates stock if already in watchlist", async () => {
    const initialStock = {
      isin: "TEST123",
      price: 50,
      bid: 49,
      ask: 51,
    };
    const updatedMessage = {
      isin: "TEST123",
      price: 100,
      bid: 99,
      ask: 101,
    };

    const { activeWatchList } = useStockWebSocket();

    mockServer.emit("message", JSON.stringify(initialStock));
    mockServer.emit("message", JSON.stringify(updatedMessage));

    expect(activeWatchList.value).toHaveLength(1);
    expect(activeWatchList.value[0]).toEqual(updatedMessage);
  });

  test.skip("connection status updates correctly", async () => {
    const { connectionStatus } = useStockWebSocket();

    expect(connectionStatus.value).toBe("connected");

    mockServer.simulate("open");
    await delay(100);
    expect(connectionStatus.value).toBe("disconnected");

    mockServer.simulate("close");
    await delay(100);
    expect(connectionStatus.value).toBe("disconnected");

    mockServer.simulate("error");
    await delay(100);
    expect(connectionStatus.value).toBe("reconnecting");
  });

  test("handles missing or malformed messages", async () => {
    const invalidMessage1 = { bid: 99, ask: 101 };
    const invalidMessage2 = { isin: "TEST123" };

    const { activeWatchList } = useStockWebSocket();

    mockServer.emit("message", JSON.stringify(invalidMessage1));
    mockServer.emit("message", JSON.stringify(invalidMessage2));

    expect(activeWatchList.value).toHaveLength(0);
  });

  test("handles WebSocket error and retries", async () => {
    const { connectionStatus } = useStockWebSocket();

    mockServer.simulate("error");

    expect(connectionStatus.value).toBe("reconnecting");
  });

  test("subscribes and unsubscribes from instruments correctly", async () => {
    const { subscribeToInstrument, unsubscribeFromInstrument } =
      useStockWebSocket();

    const testIsin = "TEST123";

    mockServer.on("message", (data: any) => {
      const message = JSON.parse(data);
      if (message.subscribe) {
        expect(message.subscribe).toBe(testIsin);
      }
      if (message.unsubscribe) {
        expect(message.unsubscribe).toBe(testIsin);
      }
    });

    subscribeToInstrument(testIsin);
    unsubscribeFromInstrument(testIsin);
  });
});
