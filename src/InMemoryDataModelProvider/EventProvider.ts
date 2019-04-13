import { Model } from '../DataModels'

export class InMemoryEventProvider implements Model.EventProvider {
  private events: Map<string, Model.Event> = new Map()
  private organizerIdToEventIdMap: Map<string, Set<string>> = new Map()

  listEventsByOrganizerId = async (organizerId: string): Promise<Model.Event[]> => {
    const eventIdSet = this.organizerIdToEventIdMap.get(organizerId)
    const eventList: Model.Event[] = []
    if (eventIdSet) {
      eventIdSet.forEach(id => {
        const event = this.events.get(id)
        if (event) {
          eventList.push(event)
        }
      })
    }
    return eventList
  }
  create = async (t: Model.Event): Promise<Model.Event> => {
    if (this.events.get(t.id)) {
      throw new Error('AlreadyExists')
    }
    this.events.set(t.id, t)
    const eventIdSet = this.organizerIdToEventIdMap.get(t.organizerId)
    if (eventIdSet) {
      this.organizerIdToEventIdMap.set(t.organizerId, eventIdSet.add(t.id))
    } else {
      this.organizerIdToEventIdMap.set(t.organizerId, new Set().add(t.id))
    }
    return t
  }
  get = async (id: string): Promise<Model.Event> => {
    const event = this.events.get(id)
    if (event) {
      return event
    } else {
      throw new Error('NotFound')
    }
  }
  update = async (t: Model.Event): Promise<Model.Event> => {
    const event = this.events.get(t.id)
    if (event) {
      this.events.set(t.id, t)
      return t
    } else {
      throw new Error('NotFound')
    }
  }
  delete = async (id: string): Promise<void> => {
    const event = this.events.get(id)
    if (event) {
      const organizerId = event.organizerId
      const eventIdSet = this.organizerIdToEventIdMap.get(organizerId)
      if (eventIdSet) {
        eventIdSet.delete(id)
      }
      this.events.delete(id)
    }
  }
}
