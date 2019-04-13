import {User} from '../index';

describe('User', () => {
  const INITIAL_CREDITS = 10;
  const USER_ID = 'userId';
  const EVENT_ID = 'eventId';
  const ITEM_ID = 'itemId';
  let user: User.User;
  const userData: User.Data = {
    id: USER_ID,
    eventId: EVENT_ID,
    initialCredits: INITIAL_CREDITS,
    transactions: []
  };

  beforeEach(() => {
    user = new User.ConcreteUser(userData);
  });

  it('should get initial credits', () => {
    expect(user.getCredits()).toEqual(INITIAL_CREDITS);
  });

  it('should get user data', () => {
    expect(user.getData()).toEqual(userData);
  });

  it(`user's data should be immutable`, () => {
    const retrievedUserData = user.getData();
    retrievedUserData.transactions.pop();
    retrievedUserData.id = 'badId';
    expect(user.getData()).toEqual(userData);
  });

  it('should be able to spend credits', () => {
    user.spendCredits(1, ITEM_ID);
    expect(user.getData().transactions.length).toEqual(1);
  });

  it('should NOT be able to spend negative credits', () => {
    expect(() => user.spendCredits(-1, ITEM_ID))
        .toThrowError(User.AMOUNT_SHOULD_GREATER_THAN_0);
  });

  it('should NOT be able to return negative credits', () => {
    expect(() => user.returnCredits(-1, ITEM_ID))
        .toThrowError(User.AMOUNT_SHOULD_GREATER_THAN_0);
  });

  it('should be able to return credits', () => {
    user.spendCredits(1, ITEM_ID);
    user.returnCredits(1, ITEM_ID);
    expect(user.getCredits()).toEqual(INITIAL_CREDITS);
  });

  it(`should NOT be able to spend credits more than ${INITIAL_CREDITS}`, () => {
    expect(() => user.spendCredits(11, ITEM_ID))
        .toThrowError(User.NOT_ENOUGH_CREDITS_TO_SPEND);
  });

  it('should NOT be able to return credits for item that more than spent',
     () => {
       user.spendCredits(1, ITEM_ID);
       expect(() => user.returnCredits(2, ITEM_ID))
           .toThrowError(User.NOT_ENOUGH_CREDITS_TO_RETURN);
     });

  it(`should NOT be able to return credits from another item`, () => {
    user.spendCredits(5, ITEM_ID);
    expect(() => user.returnCredits(5, 'anotherItem'))
        .toThrowError(User.NOT_ENOUGH_CREDITS_TO_RETURN);
  });

  it('should get less credits after spend credits', () => {
    user.spendCredits(2, ITEM_ID);
    expect(user.getCredits()).toEqual(INITIAL_CREDITS - 2);
  });
});
