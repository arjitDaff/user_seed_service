
/**
 * Interface representing the structure of a paginated list of items.
 */

interface IPagination {
  total: number;
  limit: number;
  page: number;
  sortBy: string;
  items: IItems[];
}

/**
 * Interface representing the structure of an user item in the list.
 */

interface IItems {
  id: string;
  gender: string;
  name: string;
  address: IAddress;
  email: string;
  age: string;
  picture: string;
  createdAt: Date;
}

/**
 * Interface representing the structure of an users address.
 */

interface IAddress {
  city: string;
  state: string;
  country: string;
  street: string;
}

export { IAddress, IItems, IPagination }