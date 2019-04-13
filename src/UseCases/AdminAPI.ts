import * as UUID from 'uuid';

import { DataConverter, Model } from '../DataModels';
import { Event } from '../Entities';

import { API } from './index';

export interface AdminAPI {
  createEvent: (event: API.Event) => Promise<void>;
  getEvent: (organizerId: string, eventId: string) => Promise<API.Event>;
  listEvents: (organizerId: string) => Promise<API.Event[]>;
  addUser: (organizerId: string, user: API.User) => Promise<API.User>;
  listUsers: (organizerId: string, eventId: string) => Promise<API.User[]>;
  removeItem: (organizerId: string, eventId: string, itemId: string) => Promise<void>;
  addItem: (
    organizerId: string,
    eventId: string,
    url: string,
    imageSrc: string,
    price: number,
    name: string
  ) => Promise<API.Item>;
  listItems: (organizerId: string, eventId: string) => Promise<API.Item[]>;
}

export class ConcreteAdminAPI implements AdminAPI {
  private eventProvider: Model.EventProvider;
  private userProvider: Model.UserProvider;
  private itemProvider: Model.ItemProvider;
  private dataConverter: DataConverter;

  constructor(dataModelProviderFactory: Model.DataProviderFactory) {
    this.eventProvider = dataModelProviderFactory.createEventProvider();
    this.userProvider = dataModelProviderFactory.createUserProvider();
    this.itemProvider = dataModelProviderFactory.createItemProvider();
    this.dataConverter = new DataConverter();
  }

  createEvent = async (event: API.Event): Promise<void> => {
    const eventModel: Model.Event = { ...event };
    await this.eventProvider.create(eventModel);
  };

  getEvent = async (organizerId: string, eventId: string): Promise<API.Event> => {
    return this.checkEventOwnership(organizerId, eventId);
  };

  listEvents = async (organizerId: string): Promise<API.Event[]> => {
    const eventsModel = await this.eventProvider.listEventsByOrganizerId(organizerId);
    const events: API.Event[] = [];
    eventsModel.forEach(eventModel => {
      events.push({ ...eventModel });
    });
    return events;
  };
  addUser = async (organizerId: string, user: API.User): Promise<API.User> => {
    const eventModel = await this.checkEventOwnership(organizerId, user.eventId);
    const usersModel = await this.userProvider.listUsersByEventId(user.eventId);

    const event = new Event.ConcreteEvent(this.dataConverter.toEventEntity(eventModel, usersModel));
    // if this call is succeeding, that means we are able to create such
    // user.
    event.addUser(user.id, user.initialCredits);

    return await this.userProvider.create(user);
  };

  listUsers = async (organizerId: string, eventId: string): Promise<API.User[]> => {
    await this.checkEventOwnership(organizerId, eventId);
    const usersModel = await this.userProvider.listUsersByEventId(eventId);
    return usersModel;
  };

  removeItem = async (organizerId: string, eventId: string, itemId: string): Promise<void> => {
    await this.checkEventOwnership(organizerId, eventId);
    const item = await this.itemProvider.get(itemId);
    if (item.eventId !== eventId) {
      throw Error('The item you are trying to delete do not belong to you.');
    }
    this.itemProvider.delete(itemId);
  };

  addItem = async (
    organizerId: string,
    eventId: string,
    url: string,
    imageSrc: string,
    price: number,
    name: string
  ): Promise<API.Item> => {
    await this.checkEventOwnership(organizerId, eventId);
    const item: Model.Item = { eventId, url, imageSrc, price, name, id: UUID.v4() };

    return this.itemProvider.create(item);
  };

  listItems = async (organizerId: string, eventId: string): Promise<API.Item[]> => {
    await this.checkEventOwnership(organizerId, eventId);
    return this.itemProvider.listItemsByEventId(eventId);
  };

  checkEventOwnership = async (organizerId: string, eventId: string): Promise<Model.Event> => {
    const eventModel = await this.eventProvider.get(eventId);
    if (eventModel.organizerId !== organizerId) {
      throw Error('Unauthorized');
    }
    return eventModel;
  };
}
