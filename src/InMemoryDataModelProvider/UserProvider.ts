import {Model} from '../DataModels';

export class InMemoryUserProvider implements Model.UserProvider {
  private users: Map<string, Model.User> = new Map();
  private eventIdToUserIdSet: Map<string, Set<string>> = new Map();
  private userNameToUserIdSet: Map<string, Set<string>> = new Map();

  listEventIdsByUserName = async(userName: string):
      Promise<string[]> => {
        const userIdSet = this.userNameToUserIdSet.get(userName);
        const eventIds: Set<string> = new Set();
        if (userIdSet) {
          userIdSet.forEach(id => {
            const user = this.users.get(id);
            if (user) {
              eventIds.add(user.eventId);
            }
          });
        }
        return Array.from(eventIds);
      }

  listUsersByEventId = async(eventId: string):
      Promise<Model.User[]> => {
        const userIdSet = this.eventIdToUserIdSet.get(eventId);
        const userList: Model.User[] = [];
        if (userIdSet) {
          userIdSet.forEach(id => {
            const user = this.users.get(id);
            if (user) {
              userList.push(user);
            }
          });
        }
        return userList;
      }

  create = async(t: Model.User): Promise<Model.User> => {
    if (this.users.get(t.id)) {
      throw new Error('AlreadyExists');
    }
    this.users.set(t.id, t);
    const userIdSet = this.eventIdToUserIdSet.get(t.eventId);
    if (userIdSet) {
      this.eventIdToUserIdSet.set(t.eventId, userIdSet.add(t.id));
    } else {
      this.eventIdToUserIdSet.set(t.eventId, new Set().add(t.id));
    }

    const userIdSet2 = this.userNameToUserIdSet.get(t.userName);
    if (userIdSet2) {
      this.userNameToUserIdSet.set(t.userName, userIdSet2.add(t.id));
    } else {
      this.userNameToUserIdSet.set(t.userName, new Set().add(t.id));
    }
    return t;
  };
  get = async(id: string): Promise<Model.User> => {
    const user = this.users.get(id);
    if (user) {
      return user;
    } else {
      throw new Error('NotFound');
    }
  };
  update = async(t: Model.User): Promise<Model.User> => {
    const user = this.users.get(t.id);
    if (user) {
      this.users.set(t.id, t);
      return t;
    } else {
      throw new Error('NotFound');
    }
  };
  delete = async(id: string): Promise<void> => {
    const user = this.users.get(id);
    if (user) {
      const eventId = user.eventId;
      const userIdSet = this.eventIdToUserIdSet.get(eventId);
      if (userIdSet) {
        userIdSet.delete(id);
      }
      const userName = user.userName;
      const userIdSet2 = this.userNameToUserIdSet.get(userName);
      if (userIdSet2) {
        userIdSet2.delete(id);
      }
      this.users.delete(id);
    }
  }
}
