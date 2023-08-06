export interface Stock {
  isin: string;
  price: number;
  bid?: number;
  ask?: number;
}
