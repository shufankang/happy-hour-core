import { Transaction } from './Transaction';

export interface Data {
  eventId: string;
  id: string;
  price: number;
  url: string;
  imageSrc: string;
  name: string;
  transactions: Transaction[];
}

export interface Item {
  getCredits: () => number;
}

export class ConcreteItem implements Item {
  private transactions: Transaction[];
  private itemId: string;

  constructor(data: Data) {
    this.transactions = data.transactions;
    this.itemId = data.id;
  }

  getCredits = (): number => {
    return this.transactions
      .filter(transaction => transaction.itemId === this.itemId)
      .map(transaction => transaction.credits)
      .reduce((sum, credit) => sum + credit, 0);
  };
}
