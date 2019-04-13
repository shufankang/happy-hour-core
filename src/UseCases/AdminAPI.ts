import * as UUID from 'uuid';
import * as API from './APIModel';
import { DataConverter, Model } from '../DataModels';
import { Event, Item } from '../Entities';
import { APIConverter } from './APIConverter';

export interface AdminAPI {
  createEvent: (event: API.CreateEventRequest) => Promise<API.Event>;
  getEvent: (organizerId: string, eventId: string) => Promise<API.Event>;
  listEvents: (organizerId: string) => Promise<API.Event[]>;
  addUser: (organizerId: string, user: API.CreateUserRequest) => Promise<API.User>;
  listUsers: (organizerId: string, eventId: string) => Promise<API.User[]>;
  removeItem: (organizerId: string, eventId: string, itemId: string) => Promise<void>;
  addItem: (organizerId: string, item: API.CreateItemRequest) => Promise<API.Item>;
  listItems: (organizerId: string, eventId: string) => Promise<API.Item[]>;
}

export class ConcreteAdminAPI implements AdminAPI {
  private eventProvider: Model.EventProvider;
  private userProvider: Model.UserProvider;
  private itemProvider: Model.ItemProvider;
  private transactionProvider: Model.TransactionProvider;
  private dataConverter: DataConverter;
  private apiConverter: APIConverter;

  constructor(dataModelProviderFactory: Model.DataProviderFactory) {
    this.eventProvider = dataModelProviderFactory.createEventProvider();
    this.userProvider = dataModelProviderFactory.createUserProvider();
    this.itemProvider = dataModelProviderFactory.createItemProvider();
    this.transactionProvider = dataModelProviderFactory.createTransactionProvider();
    this.dataConverter = new DataConverter();
    this.apiConverter = new APIConverter();
  }

  createEvent = async (event: API.CreateEventRequest): Promise<API.Event> => {
    const eventModel: Model.Event = { ...event, id: UUID.v4() };
    await this.eventProvider.create(eventModel);
    return this.apiConverter.toEvent(eventModel);
  };

  getEvent = async (organizerId: string, eventId: string): Promise<API.Event> => {
    const eventModel = await this.checkEventOwnership(organizerId, eventId);
    return this.apiConverter.toEvent(eventModel);
  };

  listEvents = async (organizerId: string): Promise<API.Event[]> => {
    const eventsModel = await this.eventProvider.listEventsByOrganizerId(organizerId);
    const events: API.Event[] = [];
    eventsModel.forEach(eventModel => {
      events.push(this.apiConverter.toEvent(eventModel));
    });
    return events;
  };
  addUser = async (organizerId: string, user: API.CreateUserRequest): Promise<API.User> => {
    const eventModel = await this.checkEventOwnership(organizerId, user.eventId);
    const usersModel = await this.userProvider.listUsersByEventId(user.eventId);

    const event = new Event.ConcreteEvent(this.dataConverter.toEventEntity(eventModel, usersModel));
    // if this call is succeeding, that means we are able to create such
    // user.
    const userModel = { ...user, id: UUID.v4() };
    event.addUser(userModel.id, user.initialCredits);

    await this.userProvider.create(userModel);
    return this.apiConverter.toUser(userModel, userModel.initialCredits);
  };

  listUsers = async (organizerId: string, eventId: string): Promise<API.User[]> => {
    await this.checkEventOwnership(organizerId, eventId);
    const usersModel = await this.userProvider.listUsersByEventId(eventId);

    const users: API.User[] = [];
    usersModel.forEach(userModel => {
      users.push(this.apiConverter.toUser(userModel, userModel.initialCredits));
    });
    return users;
  };

  removeItem = async (organizerId: string, eventId: string, itemId: string): Promise<void> => {
    await this.checkEventOwnership(organizerId, eventId);
    const item = await this.itemProvider.get(itemId);
    if (item.eventId !== eventId) {
      throw Error('The item you are trying to delete do not belong to you.');
    }
    await this.itemProvider.delete(itemId);
  };

  addItem = async (organizerId: string, item: API.CreateItemRequest): Promise<API.Item> => {
    await this.checkEventOwnership(organizerId, item.eventId);
    const itemModel: Model.Item = { ...item, id: UUID.v4() };

    await this.itemProvider.create(itemModel);
    return this.apiConverter.toItem(itemModel, 0);
  };

  listItems = async (organizerId: string, eventId: string): Promise<API.Item[]> => {
    await this.checkEventOwnership(organizerId, eventId);
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

  checkEventOwnership = async (organizerId: string, eventId: string): Promise<Model.Event> => {
    const eventModel = await this.eventProvider.get(eventId);
    if (eventModel.organizerId !== organizerId) {
      throw Error('Unauthorized');
    }
    return eventModel;
  };
}
