export interface IPagination {
  limit: number;
  offset: number;
}

export interface IRepository<T> {
  getMany(pagination: IPagination): Promise<Array<T>>;
  getOne(id: String): Promise<T>;
  update(id: String, newValue: T): Promise<T>;
}
