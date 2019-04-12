import { Model } from "../DataModels";

export namespace API {
    export interface Event {
        id: string;
        name: string;
        description: string;
        organizerName: string;
        organizerEmail: string;
        startAt: Date;
        endAt: Date;
        items: Item[];
    }
    export interface User {
        eventId: string;
        id: string;
        name: string;
        email: string;
        initialCredits: number;
        transactions: Transaction[];
    }

    export interface Transaction {
        id: string;
        eventId: string;
        itemId: string;
        userId: string;
        credits: string;
        time: Date;
    }

    export interface Item {
        eventId: string;
        id: string;
        price: number;
        url: string;
        imageSrc: string;
        name: string;
    }


    /**
     * User Id is required for all the UserAPIs.
     */
    export interface UserAPI {
        constructor(dataModelProviderFactory: Model.DataProviderFactory): UserAPI;
        spendCredits: (userId: string, eventId: string, itemId: string, amount: number) => Promise<User>;
        returnCredits: (userId: string, eventId: string, itemId: string, amount: number) => Promise<User>;
        getUser: (userId: string, eventId: string) => Promise<User>;
        listEvents: (userId: string) => Promise<Event[]>;
        getEvent: (userId: string, eventId: string) => Promise<Event>;
        addItem: (userId: string, eventId: string, url: string, imageSrc: string, price: number, name: string) => Promise<Item>;
    }


    export interface AdminAPI {
        createEvent: (organizerId: string, organizerName: string, organizerEmail: string, name: string,
             startAt: Date, endAt: Date, description: string, budget: number) => void;
        addUser: (user: User) => Promise<User>;
        updateUser: (user: User) => Promise<User>;
        removeUser: (eventId: string, userId: string) => Promise<User>;
        listUsers: (eventId: string) => Promise<User[]>;
        deleteItem: (eventId: string, id: string) => Promise<void>;
    }
}