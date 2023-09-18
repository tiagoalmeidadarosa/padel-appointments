export interface Check {
  id: number;
  date: string;
  priceDividedBy: number;
  pricePaidFor: number;
  itemsConsumed: ItemConsumed[];
}

export interface ItemConsumed {
  id: number;
  quantity: number;
  description: string;
  price: number;
  paid: boolean;
}

export interface CheckRequest {
  priceDividedBy: number;
  pricePaidFor: number;
  itemsConsumed: ItemConsumed[];
}
