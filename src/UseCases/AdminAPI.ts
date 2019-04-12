import { Model } from "../DataModels";
import { API } from "./APIModel";

export interface AdminAPI {
    constructor(dataModelProviderFactory: Model.DataProviderFactory): AdminAPI;
    createEvent: (organizerId: string, organizerName: string, organizerEmail: string, name: string,
         startAt: Date, endAt: Date, description: string, budget: number) => void;
    addUser: (user: API.User) => Promise<API.User>;
    updateUser: (user: API.User) => Promise<API.User>;
    removeUser: (eventId: string, userId: string) => Promise<API.User>;
    listUsers: (eventId: string) => Promise<API.User[]>;
    deleteItem: (eventId: string, id: string) => Promise<void>;
}

// TODO implement