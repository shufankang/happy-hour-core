import { Model, DataConverter } from '../DataModels';
import { APIConverter } from './APIConverter';
import * as API from './APIModel';
import { DataProviderFactory } from '../DataModels/Model';
import * as UUID from 'uuid';
import { Item, User } from '../Entities';

export interface UserAPI {
  spendCredits: (
    userId: string,
    eventId: string,
    itemId: string,
    amount: number
  ) => Promise<API.User>;
  returnCredits: (
    userId: string,
    eventId: string,
    itemId: string,
    amount: number
  ) => Promise<API.User>;
  getUser: (userId: string, eventId: string) => Promise<API.User>;
  listEvents: (userName: string) => Promise<API.Event[]>;
  getEvent: (userId: string, eventId: string) => Promise<API.Event>;
  addItem: (userId: string, item: API.CreateItemRequest) => Promise<API.Item>;
  listItems: (userId: string, eventId: string) => Promise<API.Item[]>;
}

export class ConcreteUserAPI implements UserAPI {
  private eventProvider: Model.EventProvider;
  private userProvider: Model.UserProvider;
  private itemProvider: Model.ItemProvider;
  private transactionProvider: Model.TransactionProvider;
  private dataConverter: DataConverter;
  private apiConverter: APIConverter;

  constructor(dataProviderFactory: DataProviderFactory) {
    this.eventProvider = dataProviderFactory.createEventProvider();
    this.userProvider = dataProviderFactory.createUserProvider();
    this.itemProvider = dataProviderFactory.createItemProvider();
    this.transactionProvider = dataProviderFactory.createTransactionProvider();
    this.dataConverter = new DataConverter();
    this.apiConverter = new APIConverter();
  }

  spendCredits = async (
    userId: string,
    eventId: string,
    itemId: string,
    amount: number
  ): Promise<API.User> => {
    const userModel = await this.checkUserInEvent(userId, eventId);
    const transactionsModel = await this.transactionProvider.listTransactionsByUserId(userId);
    const userEntity = new User.ConcreteUser(
      this.dataConverter.toUserEntity(userModel, transactionsModel)
    );

    const transaction = userEntity.spendCredits(amount, itemId);
    await this.transactionProvider.create(transaction);
    return this.apiConverter.toUser(userModel, userEntity.getCredits());
  };
  returnCredits = async (
    userId: string,
    eventId: string,
    itemId: string,
    amount: number
  ): Promise<API.User> => {
    const userModel = await this.checkUserInEvent(userId, eventId);
    const transactionsModel = await this.transactionProvider.listTransactionsByUserId(userId);
    const userEntity = new User.ConcreteUser(
      this.dataConverter.toUserEntity(userModel, transactionsModel)
    );

    const transaction = userEntity.returnCredits(amount, itemId);
    await this.transactionProvider.create(transaction);
    return this.apiConverter.toUser(userModel, userEntity.getCredits());
  };
  getUser = async (userId: string, eventId: string): Promise<API.User> => {
    const userModel = await this.checkUserInEvent(userId, eventId);
    const transactionsModel = await this.transactionProvider.listTransactionsByUserId(userId);
    const userEntity = new User.ConcreteUser(
      this.dataConverter.toUserEntity(userModel, transactionsModel)
    );
    return this.apiConverter.toUser(userModel, userEntity.getCredits());
  };
  listEvents = async (userName: string): Promise<API.Event[]> => {
    const eventIds = await this.userProvider.listEventIdsByUserName(userName);
    const events: API.Event[] = [];
    for (let id of eventIds) {
      const eventModel = await this.eventProvider.get(id);
      events.push(this.apiConverter.toEvent(eventModel));
    }
    return events;
  };
  getEvent = async (userId: string, eventId: string): Promise<API.Event> => {
    await this.checkUserInEvent(userId, eventId);
    const eventModel = await this.eventProvider.get(eventId);
    return this.apiConverter.toEvent(eventModel);
  };
  addItem = async (userId: string, item: API.CreateItemRequest): Promise<API.Item> => {
    await this.checkUserInEvent(userId, item.eventId);
    const itemModel: Model.Item = { ...item, id: UUID.v4() };

    await this.itemProvider.create(itemModel);
    return this.apiConverter.toItem(itemModel, 0);
  };

  listItems = async (userId: string, eventId: string): Promise<API.Item[]> => {
    await this.checkUserInEvent(userId, eventId);
    const itemsModel = await this.itemProvider.listItemsByEventId(eventId);
    const items: API.Item[] = [];
    for (let itemModel of itemsModel) {
      const transactionsModel = await this.transactionProvider.listTransactionsByItemId(
        itemModel.id
      );
      const itemData = this.dataConverter.toItemEntity(itemModel, transactionsModel);
      const itemEntity = new Item.ConcreteItem(itemData);
      items.push(this.apiConverter.toItem(itemModel, itemEntity.getCredits()));
    }
    return items;
  };

  checkUserInEvent = async (userId: string, eventId: string): Promise<Model.User> => {
    const userModel = await this.userProvider.get(userId);
    if (userModel.eventId !== eventId) {
      throw new Error('UerNotBelongToRequestEvent');
    }
    return userModel;
  };
}
