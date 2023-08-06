export type ConnectionStatus = "connected" | "disconnected" | "reconnecting";

export interface Stock {
  isin: string;
  price: number;
  bid?: number;
  ask?: number;
}
export interface IncomingWebSocketMessage {
  isin: string;
  price: number;
  bid?: number;
  ask?: number;
}
