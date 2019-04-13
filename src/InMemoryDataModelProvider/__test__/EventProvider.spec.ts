import {Model} from '../../DataModels';
import {InMemoryEventProvider} from '../EventProvider';

describe('EventProvider Tests', () => {
  let eventProvider: Model.EventProvider;
  let event: Model.Event;

  beforeEach(() => {
    eventProvider = new InMemoryEventProvider();
    event = {
      id: 'eventId',
      organizerId: 'organizerId',
      name: 'name',
      budget: 10,
      description: 'description',
      startAt: new Date(),
      endAt: new Date(),
      organizerName: 'organizerName',
      organizerEmail: 'organizerEmail'
    };
  });

  it('should be able to CRUD event', async done => {
    // CR
    await eventProvider.create(event);
    let retrievedEvent = await eventProvider.get('eventId');
    expect(retrievedEvent).toEqual(event);

    // UR
    event.description = 'new description';
    await eventProvider.update(event);
    retrievedEvent = await eventProvider.get('eventId');
    expect(retrievedEvent).toEqual(event);

    // List
    await eventProvider.create({...event, id: 'newEventId'});
    await eventProvider.create(
        {...event, id: 'anotherEventId', organizerId: 'newOrganizerId'});
    let events = await eventProvider.listEventsByOrganizerId('organizerId');
    expect(events).toContainEqual(event);
    expect(events).toContainEqual({...event, id: 'newEventId'});
    expect(events.length).toEqual(2);

    // delete
    await eventProvider.delete('newEventId');
    events = await eventProvider.listEventsByOrganizerId('organizerId');
    expect(events).toContainEqual(event);
    expect(events.length).toEqual(1);
    done();
  });

  it('should not create 2 events with same id', async done => {
    await eventProvider.create(event);
    try {
      await eventProvider.create(event);
      fail();
    } catch (e) {
      expect(e.message.includes('AlreadyExists')).toBeTruthy();
    }
    done();
  });

  it('should not update non existing event', async done => {
    try {
      await eventProvider.update(event);
      fail();
    } catch (e) {
      expect(e.message.includes('NotFound')).toBeTruthy();
    }
    done();
  });

  it('should not get non existing event', async done => {
    try {
      await eventProvider.get('id');
      fail();
    } catch (e) {
      expect(e.message.includes('NotFound')).toBeTruthy();
    }
    done();
  });
});
