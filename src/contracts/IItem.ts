import { IAddress } from "./IAddress";
/**
 * Interface representing the structure of an user item in the list.
 */

export interface IItem {
    id: string;
    gender: string;
    name: string;
    address: IAddress;
    email: string;
    age: string;
    picture: string;
    createdAt: Date;
  }