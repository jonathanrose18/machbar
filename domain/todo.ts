export type Todo = {
  createdAt: Date;
  done: boolean;
  id: string;
  title: string;
};

export interface TodoRepository {
  add(title: string): Promise<Todo>;
  list(): Promise<Todo[]>;
  toggle(id: string): Promise<Todo>;
}
