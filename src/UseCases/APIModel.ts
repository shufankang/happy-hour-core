
export interface Event {
  id: string;
  name: string;
  description: string;
  organizerId: string;
  organizerName: string;
  organizerEmail: string;
  budget: number;
  startAt: Date;
  endAt: Date;
}

export interface User {
  eventId: string;
  id: string;
  name: string;
  email: string;
  userName: string;
  initialCredits: number;
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
