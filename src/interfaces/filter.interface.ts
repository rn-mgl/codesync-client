export interface PaginateProperties {
  limit: number;
  canSelectLimit: boolean;
  page: number;
  pages: number;
  handleLimit: (limit: number) => void;
  handlePage: (page: number) => void;
  handleCanSelectLimit: () => void;
}
