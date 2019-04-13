import {Model} from '../../DataModels';
import {InMemoryItemProvider} from '../ItemProvider';

describe('ItemProvider Tests', () => {
  let itemProvider: Model.ItemProvider;
  let item: Model.Item;

  beforeEach(() => {
    itemProvider = new InMemoryItemProvider();
    item = {
      id: 'itemId',
      eventId: 'eventId',
      name: 'name',
      url: 'url',
      imageSrc: 'imageSrc',
      price: 10
    };
  });

  it('should be able to CRUD item', async done => {
    // CR
    await itemProvider.create(item);
    let retrievedItem = await itemProvider.get('itemId');
    expect(retrievedItem).toEqual(item);

    // UR
    item.url = 'new url';
    await itemProvider.update(item);
    retrievedItem = await itemProvider.get('itemId');
    expect(retrievedItem).toEqual(item);

    // List
    await itemProvider.create({...item, id: 'newItemId'});
    await itemProvider.create(
        {...item, id: 'anotherItemId', eventId: 'newEventId'});
    let items = await itemProvider.listItemsByEventId('eventId');
    expect(items).toContainEqual(item);
    expect(items).toContainEqual({...item, id: 'newItemId'});
    expect(items.length).toEqual(2);

    // delete
    await itemProvider.delete('newItemId');
    items = await itemProvider.listItemsByEventId('eventId');
    expect(items).toContainEqual(item);
    expect(items.length).toEqual(1);
    done();
  });

  it('should not create 2 items with same id', async done => {
    await itemProvider.create(item);
    try {
      await itemProvider.create(item);
      fail();
    } catch (e) {
      expect(e.message.includes('AlreadyExists')).toBeTruthy();
    }
    done();
  });

  it('should not update non existing item', async done => {
    try {
      await itemProvider.update(item);
      fail();
    } catch (e) {
      expect(e.message.includes('NotFound')).toBeTruthy();
    }
    done();
  });

  it('should not get non existing item', async done => {
    try {
      await itemProvider.get('id');
      fail();
    } catch (e) {
      expect(e.message.includes('NotFound')).toBeTruthy();
    }
    done();
  });
});
