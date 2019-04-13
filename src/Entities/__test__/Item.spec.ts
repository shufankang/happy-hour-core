import { Item } from '../index';

describe('Test Item Entity', () => {
  const itemData: Item.Data = {
    id: 'itemId',
    url: 'url',
    name: 'apple',
    imageSrc: 'image',
    price: 10,
    eventId: 'eventId',
    transactions: [
      {
        id: 'transactionId',
        credits: 5,
        eventId: 'eventId',
        userId: 'userId',
        time: new Date(),
        itemId: 'itemId'
      },
      {
        id: 'transactionId2',
        credits: 3,
        eventId: 'eventId',
        userId: 'userId',
        time: new Date(),
        itemId: 'itemId'
      }
    ]
  };
  let item: Item.Item;
  beforeEach(() => {
    item = new Item.ConcreteItem(itemData);
  });

  it('should get current credits', () => {
    const credits = item.getCredits();
    expect(credits).toEqual(8);
  });
});
