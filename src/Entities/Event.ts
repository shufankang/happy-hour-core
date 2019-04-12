import { User } from "./User";

export namespace Event {
    export const NOT_ENOUGH_BUDGET_ERROR = 'NotEnoughBudget';
    export const INVALID_INITIAL_CREDITS = 'InvalidInitialCredits';

    export interface Data {
        id: string;
        budget: number;
        users: User.Data[];
    }

    export interface Event {
        addUser: (userId: string, initialCredits: number) => User.Data;
        setBudget: (amount: number) => void;
        getData: () => Data;
    }

    export class ConcreteEvent implements Event {
        id: string;
        budget: number;
        users: User.Data[];

        constructor(event: Data) {
            this.id = event.id;
            this.budget = event.budget;
            this.users = event.users.slice(0);
        }

        getData = (): Data => ({
            id: this.id,
            budget: this.budget,
            users: this.users.slice(0)
        });

        addUser = (userId: string, initialCredits: number): User.Data => {
            if (initialCredits <= 0) {
                throw new Error(INVALID_INITIAL_CREDITS);
            }
            const currentAssignedCredits = this.getCurrentAssignedCredits();
            if (initialCredits + currentAssignedCredits > this.budget) {
                throw new Error(NOT_ENOUGH_BUDGET_ERROR);
            }
            const user: User.Data =  {
                eventId: this.id,
                id: userId,
                initialCredits,
                transactions: []
            };
            this.users.push(user);
            return user;
        } 

        setBudget = (amount: number): void => {
            const currentAssignedCredits = this.getCurrentAssignedCredits();
            if (amount < currentAssignedCredits) {
                throw new Error(NOT_ENOUGH_BUDGET_ERROR);
            }
            this.budget = amount;
        };

        private getCurrentAssignedCredits = (): number => 
            this.users
                .map(user => user.initialCredits)
                .reduce((sum, cur) => sum + cur, 0);
    } 
}