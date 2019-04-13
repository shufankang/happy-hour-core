import { InMemoryDataModelProviderFactory } from '../../InMemoryDataModelProvider/ProviderFactory';
import { AdminAPI, ConcreteAdminAPI } from '../index';

describe('By using Admin API', () => {
  const eventId = 'eventId';
  const organizerId = 'organizerId';
  let itemId: string;

  const eventInput = {
    id: eventId,
    organizerId,
    name: 'eventName',
    description: 'description',
    organizerName: 'organizerName',
    organizerEmail: 'organizerEmail',
    budget: 100,
    startAt: new Date(),
    endAt: new Date()
  };

  const adminAPI: AdminAPI = new ConcreteAdminAPI(new InMemoryDataModelProviderFactory());

  it('should create event', async done => {
    await adminAPI.createEvent(eventInput);
    done();
  });

  it('should get event', async done => {
    const event = await adminAPI.getEvent(organizerId, eventId);
    expect(event).toBeTruthy();
    expect(event).toEqual(eventInput);
    done();
  });

  it('should list event', async done => {
    const events = await adminAPI.listEvents(organizerId);
    expect(events.length).toEqual(1);
    expect(events[0]).toEqual(eventInput);
    done();
  });

  it('should not list event that not belong to the organizer', async done => {
    const events = await adminAPI.listEvents('anotherOrganizerId');
    expect(events.length).toEqual(0);
    done();
  });

  it('should add user to an event', async done => {
    await adminAPI.addUser(organizerId, {
      eventId,
      id: 'userId',
      userName: 'userName',
      name: 'name',
      initialCredits: 10,
      email: 'email'
    });
    done();
  });

  it('should not add user that have more credits than budget', async done => {
    try {
      await adminAPI.addUser(organizerId, {
        eventId,
        id: 'userId2',
        userName: 'userName',
        name: 'name',
        initialCredits: 1000,
        email: 'email'
      });
      fail('Unexpected success.');
    } catch (err) {
      expect(err.message).toEqual('NotEnoughBudget');
    }
    done();
  });

  it('should list users by eventId', async done => {
    const users = await adminAPI.listUsers(organizerId, eventId);
    expect(users.length).toEqual(1);
    expect(users[0].userName).toEqual('userName');
    done();
  });

  it('should add item to an event', async done => {
    const url = 'url';
    const imageSrc = 'imageSrc';
    const price = 10;
    const name = 'apple';
    const item = await adminAPI.addItem(organizerId, eventId, url, imageSrc, price, name);
    expect(item).toBeTruthy();
    expect(item.eventId).toEqual(eventId);
    itemId = item.id;
    done();
  });

  it('should list items by eventId', async done => {
    const items = await adminAPI.listItems(organizerId, eventId);
    expect(items.length).toEqual(1);
    expect(items[0].name).toEqual('apple');
    done();
  });

  it('should not add item for event that not owned', async done => {
    try {
      const url = 'url';
      const imageSrc = 'imageSrc';
      const price = 10;
      const name = 'apple';
      await adminAPI.addItem('anotherOrganizer', eventId, url, imageSrc, price, name);
      fail('Unexpected success.');
    } catch (err) {
      expect(err.message).toEqual('Unauthorized');
    }
    done();
  });

  it('should not remove item for another event', async done => {
    try {
      await adminAPI.createEvent({ ...eventInput, id: 'anotherEvent' });
      await adminAPI.removeItem(organizerId, 'anotherEvent', itemId);
      fail('Unexpected success.');
    } catch (err) {
      expect(err.message).toEqual('The item you are trying to delete do not belong to you.');
    }
    done();
  });

  it('should remove item', async done => {
    await adminAPI.removeItem(organizerId, eventId, itemId);
    done();
  });
});
