
export namespace Model {
    export interface Event {
        id: string;
        name: string;
        description: string;
        organizerId: string;
        organizerName: string;
        organizerEmail: string;
        startAt: Date;
        endAt: Date;
    }

    export interface BasicCRUD<T> {
        create: (t: T) => Promise<T>;
        get: (id: string) => Promise<T>;
        update: (t: T) => Promise<T>;
        delete: (id: string) => Promise<void>;
    }

    export interface EventProvider extends BasicCRUD<Event> {
        listEventsByOrganizerId: (organizerId: string) => Promise<Event[]>;
    }

    export interface Item {
        eventId: string;
        id: string;
        price: number;
        url: string;
        imageSrc: string;
        name: string;
    }

    export interface ItemProvider extends BasicCRUD<Item> {
        listItemsByEventId: (eventId: string) => Promise<Item[]>;
    }

    export interface User {
        eventId: string;
        id: string;
        userName: string;
        name: string;
        email: string;
        initialCredits: number;
    }

    export interface UserProvider extends BasicCRUD<User> {
        listUsersByEventId: (eventId: string) => Promise<User[]>;
        listEventIdsByUserName: (userName: string) => Promise<string[]>;
    }

    export interface Transaction {
        eventId: string;
        userId: string;
        itemId: string;
        id: string;
        credits: number;
        time: Date;
    }

    export interface TransactionProvider extends BasicCRUD<Transaction> {
        listTransactionsByEventId: (eventId: string) => Promise<Transaction[]>;
        listTransactionsByUserId: (userId: string) => Promise<Transaction[]>;
        listTransactionsByItemId: (itemId: string) => Promise<Transaction[]>;
    }

    export interface DataProviderFactory {
        createEventProvider: () => EventProvider;
        createItemProvider: () => ItemProvider;
        createUserProvider: () => UserProvider;
        createTransactionProvider: () => TransactionProvider;
    }
}