'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import type { Todo } from '@/domain/model/todo';
import type { UseCase, UseCaseWithParams } from '@/domain/model/types';

type Dependencies = {
  readonly autoRefresh?: boolean;
  readonly addTodoUseCase: UseCaseWithParams<Todo, { title: string }>;
  readonly getTodosUseCase: UseCase<Todo[]>;
  readonly removeTodoUseCase: UseCaseWithParams<void, { id: string }>;
  readonly toggleTodoUseCase: UseCaseWithParams<void, { id: string }>;
};

export function useTodoListViewModel({
  addTodoUseCase,
  getTodosUseCase,
  removeTodoUseCase,
  toggleTodoUseCase,
  autoRefresh = true,
}: Dependencies) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [todos, setTodos] = useState<Todo[]>([]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getTodosUseCase.execute();
      setTodos(result);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load todos');
    } finally {
      setLoading(false);
    }
  }, [getTodosUseCase]);

  const sortById = useCallback((a: Todo, b: Todo) => {
    return a.id.localeCompare(b.id);
  }, []);

  const sortedTodos = useMemo(() => {
    return [...todos].sort(sortById);
  }, [todos, sortById]);

  const addTodo = useCallback(
    async (title: string) => {
      setError(null);
      // Optimistic update: Create a temporary todo
      const tempId = `temp-${Date.now()}`;
      const tempTodo: Todo = {
        id: tempId,
        title,
        done: false,
        added_at: new Date().toISOString(),
      };
      
      setTodos((prev) => [...prev, tempTodo]);

      try {
        const newTodo = await addTodoUseCase.execute({ title });
        setTodos((prev) => prev.map((t) => (t.id === tempId ? newTodo : t)));
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to add todo');
        // Rollback
        setTodos((prev) => prev.filter((t) => t.id !== tempId));
      }
    },
    [addTodoUseCase]
  );

  const removeTodo = useCallback(
    async (id: string) => {
      setError(null);
      // Optimistic update
      const previousTodos = todos;
      setTodos((prev) => prev.filter((t) => t.id !== id));

      try {
        await removeTodoUseCase.execute({ id });
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to remove todo');
        // Rollback
        setTodos(previousTodos);
      }
    },
    [removeTodoUseCase, todos]
  );

  const toggleTodo = useCallback(
    async (id: string) => {
      setError(null);
      // Optimistic update
      const previousTodos = todos;
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
      );

      try {
        await toggleTodoUseCase.execute({ id });
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to toggle todo');
        // Rollback
        setTodos(previousTodos);
      }
    },
    [toggleTodoUseCase, todos]
  );

  useEffect(() => {
    if (autoRefresh) {
      refresh();
    }
  }, [autoRefresh, refresh]);

  return {
    error,
    loading,
    todos: sortedTodos,
    addTodo,
    refresh,
    removeTodo,
    toggleTodo,
  };
}
