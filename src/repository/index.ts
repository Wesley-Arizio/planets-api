export interface IPagination {
  limit: number;
  offset: number;
}

export class RepositoryError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export type Context<T> = {
  client: T;
};

export interface IRepository<T> {
  getMany(pagination: IPagination): Promise<Array<T>>;
  getOne(id: String): Promise<T>;
  update(id: String, newValue: Partial<T>): Promise<T>;
  create(value: T): Promise<T>;
  exists(id: String): Promise<boolean>;
}
