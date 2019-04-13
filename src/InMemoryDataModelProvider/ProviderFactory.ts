import {Model} from '../DataModels';

import {InMemoryEventProvider} from './EventProvider';
import {InMemoryItemProvider} from './ItemProvider';
import {InMemoryTransactionProvider} from './TransactionProvider';
import {InMemoryUserProvider} from './UserProvider';

export class InMemoryDataModelProviderFactory implements
    Model.DataProviderFactory {
  createEventProvider = (): Model.EventProvider => {
    return new InMemoryEventProvider();
  };
  createItemProvider = (): Model.ItemProvider => {
    return new InMemoryItemProvider();
  };
  createUserProvider = (): Model.UserProvider => {
    return new InMemoryUserProvider();
  };
  createTransactionProvider = (): Model.TransactionProvider => {
    return new InMemoryTransactionProvider();
  }
}
