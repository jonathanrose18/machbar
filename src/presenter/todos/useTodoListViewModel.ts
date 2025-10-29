'use client';

import { useCallback, useMemo, useState } from 'react';

import type { Todo } from '@/domain/model/todo';
import type { UseCase } from '@/domain/model/types';

type Dependencies = {
  readonly getTodosUseCase: UseCase<Todo[]>;
};

export function useTodoListViewModel({ getTodosUseCase }: Dependencies) {
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [todos, setTodos] = useState<Todo[]>([]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(undefined);
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

  return {
    error,
    loading,
    refresh,
    todos: sortedTodos,
  };
}
