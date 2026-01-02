import type { Todo } from '@/domain/model/todo';
import type { TodoRepository } from '@/application/ports/todo-repository';

const COLLECTION_NAME: string = 'todos';

export const makeLocalStorageTodoRepository = (): TodoRepository => {
  const safeGet = (): Todo[] => {
    try {
      const raw = localStorage.getItem(COLLECTION_NAME);
      if (!raw) return [];
      return JSON.parse(raw) as Todo[];
    } catch (err) {
      console.warn('Failed to parse todos from localStorage:', err);
      return [];
    }
  };

  const safeSet = (todos: Todo[]): void => {
    try {
      localStorage.setItem(COLLECTION_NAME, JSON.stringify(todos));
    } catch (err) {
      console.error('Failed to save todos to localStorage:', err);
      throw new Error('Could not save todo.');
    }
  };

  const add = async (title: string): Promise<Todo> => {
    const todos = safeGet();
    const done = false;
    const id = `${Date.now()}`;
    const now = new Date().toUTCString();
    
    const newTodo: Todo = { done, title, id, added_at: now };
    safeSet([...todos, newTodo]);
    
    return newTodo;
  };

  const get = async (): Promise<Todo[]> => {
    return safeGet();
  };

  const remove = async (id: string): Promise<void> => {
    const todos = safeGet();
    const newTodos = todos.filter(todo => todo.id !== id);
    safeSet(newTodos);
  };

  const toggle = async (id: string): Promise<void> => {
    const todos = safeGet();
    const newTodos = todos.map(todo => 
      (todo.id === id ? { ...todo, done: !todo.done } : todo)
    );
    safeSet(newTodos);
  };

  return { add, get, remove, toggle };
};
