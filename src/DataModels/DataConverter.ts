import { Event, User, Item, Transaction } from '../Entities'
import { Model } from './Model'

export class DataConverter {
  toEventEntity = (event: Model.Event, users: Model.User[]): Event.Data => ({
    id: event.id,
    budget: event.budget,
    users: users.map(user => this.toUserEntity(user, []))
  })

  toUserEntity = (user: Model.User, transactions: Model.Transaction[]): User.Data => ({
    id: user.id,
    eventId: user.eventId,
    initialCredits: user.initialCredits,
    transactions: transactions.map(this.toTransactionEntity)
  })

  toTransactionEntity = (transaction: Model.Transaction): Transaction => ({
    ...transaction
  })

  toItemEntity = (item: Model.Item, transactions: Model.Transaction[]): Item => ({
    ...item,
    transactions: transactions.map(this.toTransactionEntity)
  })
}
