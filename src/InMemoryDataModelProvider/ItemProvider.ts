import { Model } from '../DataModels'

export class InMemoryItemProvider implements Model.ItemProvider {
  private items: Map<string, Model.Item> = new Map()
  private eventIdToItemIdSet: Map<string, Set<string>> = new Map()

  listItemsByEventId = async (eventId: string): Promise<Model.Item[]> => {
    const itemIdSet = this.eventIdToItemIdSet.get(eventId)
    const itemList: Model.Item[] = []
    if (itemIdSet) {
      itemIdSet.forEach(id => {
        const item = this.items.get(id)
        if (item) {
          itemList.push(item)
        }
      })
    }
    return itemList
  }

  create = async (t: Model.Item): Promise<Model.Item> => {
    if (this.items.get(t.id)) {
      throw new Error('AlreadyExists')
    }
    this.items.set(t.id, t)
    const itemIdSet = this.eventIdToItemIdSet.get(t.eventId)
    if (itemIdSet) {
      this.eventIdToItemIdSet.set(t.eventId, itemIdSet.add(t.id))
    } else {
      this.eventIdToItemIdSet.set(t.eventId, new Set().add(t.id))
    }
    return t
  }
  get = async (id: string): Promise<Model.Item> => {
    const item = this.items.get(id)
    if (item) {
      return item
    } else {
      throw new Error('NotFound')
    }
  }
  update = async (t: Model.Item): Promise<Model.Item> => {
    const item = this.items.get(t.id)
    if (item) {
      this.items.set(t.id, t)
      return t
    } else {
      throw new Error('NotFound')
    }
  }
  delete = async (id: string): Promise<void> => {
    const item = this.items.get(id)
    if (item) {
      const eventId = item.eventId
      const itemIdSet = this.eventIdToItemIdSet.get(eventId)
      if (itemIdSet) {
        itemIdSet.delete(id)
      }
      this.items.delete(id)
    }
  }
}
