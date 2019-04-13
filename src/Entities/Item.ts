import { Transaction } from './Transaction';

export interface Item {
  eventId: string;
  id: string;
  price: number;
  url: string;
  imageSrc: string;
  name: string;
  transactions: Transaction[];
}
