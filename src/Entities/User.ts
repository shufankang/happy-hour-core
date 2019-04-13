import * as UUID from 'uuid';

import { Transaction } from './Transaction';

export const NOT_ENOUGH_CREDITS_TO_SPEND = 'Not enough credits to spend.';
export const NOT_ENOUGH_CREDITS_TO_RETURN = 'Not enough credits to return for requested item.';
export const AMOUNT_SHOULD_GREATER_THAN_0 = 'Amount should greater than 0';

export interface Data {
  eventId: string;
  id: string;
  initialCredits: number;
  transactions: Transaction[];
}

export interface User {
  spendCredits: (amount: number, itemId: string) => Transaction;
  returnCredits: (amount: number, itemId: string) => Transaction;
  getSpentCreditForItem: (itemId: string) => number;
  getCredits: () => number;
  getData: () => Data;
}

export class ConcreteUser implements User {
  readonly eventId: string;
  readonly id: string;
  readonly initialCredits: number;
  private transactions: Transaction[];

  constructor(userData: Data) {
    this.eventId = userData.eventId;
    this.id = userData.id;
    this.initialCredits = userData.initialCredits;
    this.transactions = userData.transactions.slice(0);
  }

  getData = (): Data => ({
    eventId: this.eventId,
    id: this.id,
    initialCredits: this.initialCredits,
    transactions: this.transactions.slice(0)
  });

  spendCredits = (amount: number, itemId: string): Transaction => {
    if (amount <= 0) {
      throw new Error(AMOUNT_SHOULD_GREATER_THAN_0);
    }
    const currentCredit = this.getCredits();
    if (amount > currentCredit) {
      throw new Error(NOT_ENOUGH_CREDITS_TO_SPEND);
    }

    const transaction = this.generateTransaction(amount, itemId);
    this.transactions.push(transaction);
    return transaction;
  };

  returnCredits = (amount: number, itemId: string): Transaction => {
    if (amount <= 0) {
      throw new Error(AMOUNT_SHOULD_GREATER_THAN_0);
    }
    const spentCreditForItem = this.getSpentCreditForItem(itemId);

    if (spentCreditForItem < amount) {
      throw new Error(NOT_ENOUGH_CREDITS_TO_RETURN);
    }
    const transaction = this.generateTransaction(0 - amount, itemId);
    this.transactions.push(transaction);
    return transaction;
  };

  getCredits = (): number => {
    return this.transactions
      .map(transaction => transaction.credits)
      .reduce((sum, credit) => sum - credit, this.initialCredits);
  };

  getSpentCreditForItem = (itemId: string): number => {
    return this.transactions
      .filter(transaction => transaction.itemId === itemId)
      .map(transaction => transaction.credits)
      .reduce((sum, credit) => sum + credit, 0);
  };

  private generateTransaction = (credits: number, itemId: string): Transaction => ({
    id: UUID.v4(),
    userId: this.id,
    itemId,
    eventId: this.eventId,
    time: new Date(),
    credits
  });
}
