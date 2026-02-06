import type { Todo } from '@/domain/model/todo';

export interface TodoRepository {
  add(title: string): Promise<Todo>;
  completeAll(): Promise<void>;
  get(): Promise<Todo[]>;
  removeCompleted(): Promise<void>;
  removeOpen(): Promise<void>;
  remove(id: string): Promise<void>;
  restoreMany(todos: Todo[]): Promise<void>;
  toggle(id: string): Promise<void>;
  update(id: string, title: string): Promise<void>;
}
