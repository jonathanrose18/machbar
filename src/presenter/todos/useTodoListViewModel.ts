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
      setLoading(true);
      setError(null);

      try {
        await addTodoUseCase.execute({ title });
        await refresh();
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to add todo');
      } finally {
        setLoading(false);
      }
    },
    [addTodoUseCase, refresh]
  );

  const removeTodo = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      await removeTodoUseCase.execute({ id });
      await refresh();
    },
    [removeTodoUseCase, refresh]
  );

  const toggleTodo = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      await toggleTodoUseCase.execute({ id });
      await refresh();
    },
    [toggleTodoUseCase, refresh]
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
