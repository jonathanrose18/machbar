import type { Todo } from '@/domain/model/todo';

export interface TodoRepository {
  add(title: string): Promise<Todo>;
  get(): Promise<Todo[]>;
}
