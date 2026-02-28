export interface ITable<T extends Record<string, unknown>> {
  headers: (keyof T & string)[];
  data: object[];
}
