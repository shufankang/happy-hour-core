export interface CreateEventRequest {
  name: string;
  description: string;
  organizerId: string;
  organizerName: string;
  organizerEmail: string;
  budget: number;
  startAt: Date;
  endAt: Date;
}

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

export interface CreateUserRequest {
  eventId: string;
  name: string;
  email: string;
  userName: string;
  initialCredits: number;
}

export interface User {
  eventId: string;
  id: string;
  name: string;
  email: string;
  userName: string;
  initialCredits: number;
  currentCredits: number;
}

export interface Transaction {
  id: string;
  eventId: string;
  itemId: string;
  userId: string;
  credits: number;
  time: Date;
}

export interface CreateItemRequest {
  eventId: string;
  price: number;
  url: string;
  imageSrc: string;
  name: string;
}

export interface Item {
  eventId: string;
  id: string;
  price: number;
  url: string;
  imageSrc: string;
  name: string;
  credits: number;
}
