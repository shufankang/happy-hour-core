import { Model } from '../DataModels';

import { InMemoryEventProvider } from './EventProvider';
import { InMemoryItemProvider } from './ItemProvider';
import { InMemoryTransactionProvider } from './TransactionProvider';
import { InMemoryUserProvider } from './UserProvider';

export class InMemoryDataModelProviderFactory implements Model.DataProviderFactory {
  private eventProvider: Model.EventProvider;
  private userProvider: Model.UserProvider;
  private itemProvider: Model.ItemProvider;
  private transactionProvider: Model.TransactionProvider;

  constructor() {
    this.eventProvider = new InMemoryEventProvider();
    this.userProvider = new InMemoryUserProvider();
    this.itemProvider = new InMemoryItemProvider();
    this.transactionProvider = new InMemoryTransactionProvider();
  }

  createEventProvider = (): Model.EventProvider => {
    return this.eventProvider;
  };
  createItemProvider = (): Model.ItemProvider => {
    return this.itemProvider;
  };
  createUserProvider = (): Model.UserProvider => {
    return this.userProvider;
  };
  createTransactionProvider = (): Model.TransactionProvider => {
    return this.transactionProvider;
  };
}
