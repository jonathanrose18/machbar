import type { Todo, TodoRepository } from "@/domain/todo";

const STORAGE_KEY = "todos:v1";

export class LocalStorageTodoRepository implements TodoRepository {
  private cache: Todo[] | null = null;

  private get todos(): Todo[] {
    if (this.cache) {
      return this.cache;
    }

    this.cache = safeLoad();
    return this.cache;
  }

  private set todos(next: Todo[]) {
    this.cache = next;
    safeSave(next);
  }

  async add(title: string): Promise<Todo> {
    const newTodo: Todo = {
      createdAt: new Date(),
      done: false,
      id: crypto.randomUUID(),
      title,
    };

    this.todos = [newTodo, ...this.todos];
    return newTodo;
  }

  async list(): Promise<Todo[]> {
    return [...this.todos].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async toggle(id: string): Promise<Todo> {
    const index = this.todos.findIndex((todo) => todo.id === id);

    if (index < 0) {
      throw new Error("Not found");
    }

    const currentTodos = this.todos[index];
    const updatedTodos = { ...currentTodos, done: !currentTodos.done };
    const nextTodos = [...this.todos];
    nextTodos[index] = updatedTodos;

    this.todos = nextTodos;
    return updatedTodos;
  }
}

function safeLoad(): Todo[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as Array<
      Omit<Todo, "createdAt"> & { createdAt: string }
    >;
    return parsed.map((t) => ({ ...t, createdAt: new Date(t.createdAt) }));
  } catch {
    return [];
  }
}

function safeSave(todos: Todo[]) {
  if (typeof window === "undefined") {
    return;
  }

  const serializable = todos.map((todo) => ({
    ...todo,
    createdAt: todo.createdAt.toISOString(),
  }));
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
}
