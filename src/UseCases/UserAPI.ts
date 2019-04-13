import {Model} from '../DataModels';
import {API} from './index';

export interface UserAPI {
  spendCredits:
      (userId: string, eventId: string, itemId: string,
       amount: number) => Promise<API.User>;
  returnCredits:
      (userId: string, eventId: string, itemId: string,
       amount: number) => Promise<API.User>;
  getUser: (userId: string, eventId: string) => Promise<API.User>;
  listEvents: (userId: string) => Promise<API.Event[]>;
  getEvent: (userId: string, eventId: string) => Promise<API.Event>;
  addItem:
      (userId: string, eventId: string, url: string, imageSrc: string,
       price: number, name: string) => Promise<API.Item>;
}

// TODO implement
