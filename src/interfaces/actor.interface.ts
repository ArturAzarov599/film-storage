import { IDefaultModel } from "@interfaces/default-model.interface";

export interface IActor {
  name: string;
}

export interface IActorModel extends IActor, IDefaultModel {}
