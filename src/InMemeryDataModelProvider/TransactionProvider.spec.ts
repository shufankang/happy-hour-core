import { InMemoryTransactionProvider } from './TransactionProvider';
import { Model } from '../DataModels';

describe('TransactionProvider Tests', () => {

    let transactionProvider: Model.TransactionProvider;
    let transaction: Model.Transaction;

    beforeEach(()=> {
        transactionProvider = new InMemoryTransactionProvider();
        transaction = {
            id: 'transactionId',
            eventId: 'eventId',
            userId: 'userId',
            time: new Date(),
            credits: 5,
            itemId: 'itemId',
        };
    })

    it('should be able to CRUD transaction', async (done) => {
        // CR
        await transactionProvider.create(transaction);
        let retrievedTransaction = await transactionProvider.get('transactionId');
        expect(retrievedTransaction).toEqual(transaction);

        // UR
        transaction.credits = 3;
        await transactionProvider.update(transaction);
        retrievedTransaction = await transactionProvider.get('transactionId');
        expect(retrievedTransaction).toEqual(transaction);

        // List
        await transactionProvider.create({
            ...transaction,
            id: 'newTransactionId'
        });
        await transactionProvider.create({
            ...transaction,
            id: 'anotherTransactionId',
            eventId: 'newEventId'
        });
        await transactionProvider.create({
            ...transaction,
            id: 'thirdTransactionId',
            eventId: 'newEventId',
            itemId: 'newItemId'
        });
        let transactions = await transactionProvider.listTransactionsByEventId('eventId');
        expect(transactions).toContainEqual(transaction);
        expect(transactions).toContainEqual({
            ...transaction,
            id: 'newTransactionId'
        });
        expect(transactions.length).toEqual(2);

        transactions = await transactionProvider.listTransactionsByItemId('itemId');
        expect(transactions).toContainEqual(transaction);
        expect(transactions.length).toEqual(3);

        transactions = await transactionProvider.listTransactionsByUserId('userId');
        expect(transactions).toContainEqual(transaction);
        expect(transactions.length).toEqual(4);

        // delete
        await transactionProvider.delete('newTransactionId');
        transactions = await transactionProvider.listTransactionsByEventId('eventId');
        expect(transactions).toContainEqual(transaction);
        expect(transactions.length).toEqual(1);
        done();
    })

    it('should not create 2 transactions with same id', async (done) => {
        await transactionProvider.create(transaction);
        try {
            await transactionProvider.create(transaction);
            fail();
        } catch (e) {
            expect(e.message.includes('AlreadyExists')).toBeTruthy();
        }
        done();
    })

    it('should not update non existing transaction', async (done) => {
        try {
            await transactionProvider.update(transaction);
            fail();
        } catch (e) {
            expect(e.message.includes('NotFound')).toBeTruthy();
        }
        done();
    })

    it('should not get non existing transaction', async (done) => {
        try {
            await transactionProvider.get('id');
            fail();
        } catch (e) {
            expect(e.message.includes('NotFound')).toBeTruthy();
        }
        done();
    })
})