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
}