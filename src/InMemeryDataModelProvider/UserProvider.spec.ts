import { InMemoryUserProvider } from './UserProvider';
import { Model } from '../DataModels';

describe('UserProvider Tests', () => {

    let userProvider: Model.UserProvider;
    let user: Model.User;

    beforeEach(() => {
        userProvider = new InMemoryUserProvider();
        user = {
            id: 'userId',
            eventId: 'eventId',
            name: 'name',
            email: 'email',
            initialCredits: 10,
            userName: 'userName'
        };
    })

    it('should be able to CRUD user', async (done) => {
        // CR
        await userProvider.create(user);
        let retrievedUser = await userProvider.get('userId');
        expect(retrievedUser).toEqual(user);

        // UR
        user.email = 'new email';
        await userProvider.update(user);
        retrievedUser = await userProvider.get('userId');
        expect(retrievedUser).toEqual(user);

        // List
        await userProvider.create({
            ...user,
            id: 'newUserId',
            eventId: 'newEventId'
        });
        await userProvider.create({
            ...user,
            id: 'anotherUserId',
            eventId: 'anotherEventId',
        });
        let users = await userProvider.listUsersByEventId('eventId');
        expect(users).toContainEqual(user);
        expect(users.length).toEqual(1);

        // list events by userName
        let eventIds = await userProvider.listEventIdsByUserName('userName');
        expect(eventIds.length).toEqual(3);
        expect(eventIds).toContainEqual('eventId');
        expect(eventIds).toContainEqual('newEventId');
        expect(eventIds).toContainEqual('anotherEventId');

        // delete
        await userProvider.delete('newUserId');
        users = await userProvider.listUsersByEventId('eventId');
        expect(users).toContainEqual(user);
        expect(users.length).toEqual(1);

        eventIds = await userProvider.listEventIdsByUserName('userName');
        expect(eventIds.length).toEqual(2);
        expect(eventIds).toContainEqual('eventId');
        done();
    })

    it('should not create 2 users with same id', async (done) => {
        await userProvider.create(user);
        try {
            await userProvider.create(user);
            fail();
        } catch (e) {
            expect(e.message.includes('AlreadyExists')).toBeTruthy();
        }
        done();
    })

    it('should not update non existing user', async (done) => {
        try {
            await userProvider.update(user);
            fail();
        } catch (e) {
            expect(e.message.includes('NotFound')).toBeTruthy();
        }
        done();
    })

    it('should not get non existing user', async (done) => {
        try {
            await userProvider.get('id');
            fail();
        } catch (e) {
            expect(e.message.includes('NotFound')).toBeTruthy();
        }
        done();
    })
})