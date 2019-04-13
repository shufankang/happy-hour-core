import { ConcreteAdminAPI } from '../AdminAPI';
import { InMemoryDataModelProviderFactory } from '../../InMemoryDataModelProvider/ProviderFactory';
import { ConcreteUserAPI } from '../UserAPI';

describe('By using user API: ', () => {
  let eventId: string;
  let userId: string;
  let userName: string;
  let itemId: string;
  const dataProviderFactory = new InMemoryDataModelProviderFactory();
  const userAPI = new ConcreteUserAPI(dataProviderFactory);

  beforeAll(async done => {
    const adminAPI = new ConcreteAdminAPI(dataProviderFactory);
    const event = await adminAPI.createEvent({
      organizerId: 'organizerId',
      name: 'eventName',
      description: 'description',
      organizerName: 'organizerName',
      organizerEmail: 'organizerEmail',
      budget: 100,
      startAt: new Date(),
      endAt: new Date()
    });
    eventId = event.id;
    const user = await adminAPI.addUser('organizerId', {
      eventId,
      userName: 'userName',
      name: 'name',
      initialCredits: 10,
      email: 'email'
    });
    userId = user.id;
    userName = user.userName;
    done();
  });

  it('should add item', async done => {
    const url = 'url';
    const imageSrc = 'imageSrc';
    const price = 10;
    const name = 'apple';
    const item = await userAPI.addItem(userId, {
      url,
      imageSrc,
      price,
      name,
      eventId
    });
    expect(item.price).toEqual(10);
    expect(item.credits).toEqual(0);
    itemId = item.id;
    done();
  });

  it('should spend credits on item', async done => {
    await userAPI.spendCredits(userId, eventId, itemId, 3);
    const user = await userAPI.getUser(userId, eventId);
    expect(user.currentCredits).toEqual(7);
    const items = await userAPI.listItems(userId, eventId);
    expect(items.length).toEqual(1);
    expect(items[0].credits).toEqual(3);
    done();
  });

  it('should return credits on item', async done => {
    await userAPI.returnCredits(userId, eventId, itemId, 2);
    const user = await userAPI.getUser(userId, eventId);
    expect(user.currentCredits).toEqual(9);
    const items = await userAPI.listItems(userId, eventId);
    expect(items.length).toEqual(1);
    expect(items[0].credits).toEqual(1);
    done();
  });

  it('should get event by userId', async done => {
    const event = await userAPI.getEvent(userId, eventId);
    expect(event.id).toEqual(eventId);
    expect(event.name).toEqual('eventName');
    done();
  });

  it('should list event by userName', async done => {
    const events = await userAPI.listEvents(userName);
    expect(events.length).toEqual(1);
    done();
  });

  it('should fail when eventId does not match', async done => {
    try {
      await userAPI.getUser(userId, 'anotherEventId');
      fail('UnexpectedSucceed');
    } catch (err) {
      expect(err.message).toEqual('UerNotBelongToRequestEvent');
    }
    done();
  });
});
