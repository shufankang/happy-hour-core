import { Model } from '../DataModels';
import { API } from '.';

export class APIConverter {
  toUser = (model: Model.User, currentCredits: number): API.User => {
    return { ...model, currentCredits };
  };

  toEvent = (model: Model.Event): API.Event => {
    return model;
  };
  toItem = (model: Model.Item, credits: number): API.Item => {
    return { ...model, credits };
  };
}
