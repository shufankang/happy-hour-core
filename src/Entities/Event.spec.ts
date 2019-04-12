import { Event } from './Event';

describe('Test Event', () => {

    const eventData: Event.Data = {
        id: 'eventId',
        budget: 10,
        users: []
    }
    let event: Event.Event;
    beforeEach(() => {
        event = new Event.ConcreteEvent(eventData);
    });

    it('should add user', () => {
        event.addUser('userId', 5);
        expect(event.getData().users.length).toEqual(1);
    })

    it('should change budget', () => {
        event.setBudget(100);
        expect(event.getData().budget).toEqual(100);
    })

    it('should not add user with initial credits that exceed budget', () => {
        expect(() => event.addUser('userId', 11)).toThrowError(Event.NOT_ENOUGH_BUDGET_ERROR);
    })

    it('should not add user with negative credits', () => {
        expect(() => event.addUser('userId', -11)).toThrowError(Event.INVALID_INITIAL_CREDITS);
    })

    it('should not set budget that less than assigned credits.', () => {
        event.addUser('userId', 10);
        expect(() => event.setBudget(5)).toThrowError(Event.NOT_ENOUGH_BUDGET_ERROR);
    })
});