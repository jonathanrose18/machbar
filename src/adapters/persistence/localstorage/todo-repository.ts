import type { Todo } from '@/domain/model/todo';
import type { TodoRepository } from '@/application/ports/todo-repository';

const COLLECTION_NAME = 'todos';

const nowIso = (): string => new Date().toISOString();

const normalizeTodo = (value: Partial<Todo>): Todo => {
  const timestamp = value.added_at ?? nowIso();
  const done = value.done ?? false;
  return {
    id: value.id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: value.title ?? '',
    done,
    added_at: timestamp,
    updated_at: value.updated_at ?? timestamp,
    completed_at: value.completed_at ?? (done ? (value.updated_at ?? timestamp) : null),
    priority: value.priority ?? null,
    due_date: value.due_date ?? null,
  };
};

export const makeLocalStorageTodoRepository = (): TodoRepository => {
  const safeGet = (): Todo[] => {
    try {
      const raw = localStorage.getItem(COLLECTION_NAME);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as Partial<Todo>[];
      return parsed.map(normalizeTodo);
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
    const timestamp = nowIso();
    const newTodo: Todo = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title,
      done: false,
      added_at: timestamp,
      updated_at: timestamp,
      completed_at: null,
      priority: null,
      due_date: null,
    };
    safeSet([...todos, newTodo]);
    return newTodo;
  };

  const get = async (): Promise<Todo[]> => safeGet();

  const remove = async (id: string): Promise<void> => {
    const todos = safeGet();
    safeSet(todos.filter(todo => todo.id !== id));
  };

  const toggle = async (id: string): Promise<void> => {
    const todos = safeGet();
    const timestamp = nowIso();
    safeSet(
      todos.map(todo => {
        if (todo.id !== id) return todo;
        const done = !todo.done;
        return {
          ...todo,
          done,
          updated_at: timestamp,
          completed_at: done ? timestamp : null,
        };
      })
    );
  };

  const update = async (id: string, title: string): Promise<void> => {
    const todos = safeGet();
    const timestamp = nowIso();
    safeSet(todos.map(todo => (todo.id === id ? { ...todo, title, updated_at: timestamp } : todo)));
  };

  const completeAll = async (): Promise<void> => {
    const todos = safeGet();
    const timestamp = nowIso();
    safeSet(
      todos.map(todo =>
        todo.done
          ? todo
          : {
              ...todo,
              done: true,
              updated_at: timestamp,
              completed_at: timestamp,
            }
      )
    );
  };

  const removeCompleted = async (): Promise<void> => {
    const todos = safeGet();
    safeSet(todos.filter(todo => !todo.done));
  };

  const removeOpen = async (): Promise<void> => {
    const todos = safeGet();
    safeSet(todos.filter(todo => todo.done));
  };

  const restoreMany = async (todos: Todo[]): Promise<void> => {
    const existing = safeGet();
    const merged = new Map(existing.map(todo => [todo.id, todo] as const));
    for (const todo of todos) {
      merged.set(todo.id, normalizeTodo(todo));
    }
    safeSet(Array.from(merged.values()));
  };

  return {
    add,
    get,
    remove,
    toggle,
    update,
    completeAll,
    removeCompleted,
    removeOpen,
    restoreMany,
  };
};
