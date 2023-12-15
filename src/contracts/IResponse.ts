import { IItem } from "./IItem";

/**
 * Interface representing the structure of a paginated list of items.
 */
export interface IResponse {
    total: number;
    limit: number;
    page: number;
    sortBy: string;
    items: IItem[];
  }