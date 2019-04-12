import { Model } from "../DataModels";


export class InMemoryTransactionProvider implements Model.TransactionProvider {

    private transactions: Map<string, Model.Transaction> = new Map();
    private eventIdToTransactionIdSet: Map<string, Set<string>> = new Map();
    private userIdToTransactionIdSet: Map<string, Set<string>> = new Map();
    private itemIdToTransactionIdSet: Map<string, Set<string>> = new Map();

    listTransactionsByItemId = async (itemId: string): Promise<Model.Transaction[]> => {
        const transactionIdSet = this.itemIdToTransactionIdSet.get(itemId);
        const transactionList: Model.Transaction[] = [];
        if (transactionIdSet) {
            transactionIdSet.forEach(id => {
                const transaction = this.transactions.get(id);
                if (transaction) {
                    transactionList.push(transaction);
                }
            })
        }
        return transactionList;
    }

    listTransactionsByUserId = async (userId: string): Promise<Model.Transaction[]> => {
        const transactionIdSet = this.userIdToTransactionIdSet.get(userId);
        const transactionList: Model.Transaction[] = [];
        if (transactionIdSet) {
            transactionIdSet.forEach(id => {
                const transaction = this.transactions.get(id);
                if (transaction) {
                    transactionList.push(transaction);
                }
            })
        }
        return transactionList;
    }

 
    listTransactionsByEventId = async (eventId: string): Promise<Model.Transaction[]> => {
        const transactionIdSet = this.eventIdToTransactionIdSet.get(eventId);
        const transactionList: Model.Transaction[] = [];
        if (transactionIdSet) {
            transactionIdSet.forEach(id => {
                const transaction = this.transactions.get(id);
                if (transaction) {
                    transactionList.push(transaction);
                }
            })
        }
        return transactionList;
    }

    create = async (t: Model.Transaction): Promise<Model.Transaction> => {
        if (this.transactions.get(t.id)) {
            throw new Error('AlreadyExists')
        }
        this.transactions.set(t.id, t);
        // event id to transaction
        const transactionIdSet = this.eventIdToTransactionIdSet.get(t.eventId);
        if (transactionIdSet) {
            this.eventIdToTransactionIdSet.set(t.eventId, transactionIdSet.add(t.id));
        } else {
            this.eventIdToTransactionIdSet.set(t.eventId, new Set().add(t.id));
        }
        // user id to transaction
        const transactionIdSet2 = this.userIdToTransactionIdSet.get(t.userId);
        if (transactionIdSet2) {
            this.userIdToTransactionIdSet.set(t.userId, transactionIdSet2.add(t.id));
        } else {
            this.userIdToTransactionIdSet.set(t.userId, new Set().add(t.id));
        }
        // item id to transaction
        const transactionIdSet3 = this.itemIdToTransactionIdSet.get(t.itemId);
        if (transactionIdSet3) {
            this.itemIdToTransactionIdSet.set(t.itemId, transactionIdSet3.add(t.id));
        } else {
            this.itemIdToTransactionIdSet.set(t.itemId, new Set().add(t.id));
        }
        return t;
    };
    get = async (id: string): Promise<Model.Transaction> => {
        const transaction = this.transactions.get(id);
        if (transaction) {
            return transaction;
        } else {
            throw new Error('NotFound');
        }
    }
    update = async (t: Model.Transaction): Promise<Model.Transaction> => {
        const transaction = this.transactions.get(t.id);
        if (transaction) {
            this.transactions.set(t.id, t);
            return t;
        } else {
            throw new Error('NotFound');
        }
    }
    delete = async (id: string): Promise<void> => {
        const transaction = this.transactions.get(id);
        if (transaction) {
            const eventId = transaction.eventId;
            const transactionIdSet = this.eventIdToTransactionIdSet.get(eventId); 
            if (transactionIdSet) {
                transactionIdSet.delete(id);
            }

            const userId = transaction.userId;
            const transactionIdSet2 = this.userIdToTransactionIdSet.get(userId); 
            if (transactionIdSet2) {
                transactionIdSet2.delete(id);
            }

            const itemId = transaction.itemId;
            const transactionIdSet3 = this.itemIdToTransactionIdSet.get(itemId); 
            if (transactionIdSet3) {
                transactionIdSet3.delete(id);
            }
            this.transactions.delete(id);
        }
    }
}