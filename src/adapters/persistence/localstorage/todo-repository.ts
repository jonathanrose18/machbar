import type { Todo } from '@/domain/model/todo';
import type { TodoRepository } from '@/application/ports/todo-repository';

const COLLECTION_NAME: string = 'todos';

export const makeLocalStorageTodoRepository = (): TodoRepository => {
  const add = async (title: string): Promise<Todo> => {
    const todos = await get();

    const id = `${Date.now()}`;
    const done = false;

    const newTodo: Todo = { done, title, id };

    localStorage.setItem(COLLECTION_NAME, JSON.stringify([...todos, newTodo]));

    return newTodo;
  };

  const get = async (): Promise<Todo[]> => {
    try {
      const raw = localStorage.getItem(COLLECTION_NAME);

      if (!raw) {
        return [];
      }

      return JSON.parse(raw) as Todo[];
    } catch (err) {
      console.warn('Failed to parse todos:', err);
      return [];
    }
  };

  const remove = async (id: string): Promise<void> => {
    const todos = await get();
    const newTodos = todos.filter(todo => todo.id !== id);
    localStorage.setItem(COLLECTION_NAME, JSON.stringify(newTodos));
  };

  return { add, get, remove };
};
