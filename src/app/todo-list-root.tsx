'use client';

import { useMemo } from 'react';

import { TodoList } from '@/presenter/components/todo-list';
import { buildContainer, resolveTodoListUseCases } from '@/di/container';

export function TodoListRoot() {
  const useCases = useMemo(() => {
    const container = buildContainer();
    return resolveTodoListUseCases(container);
  }, []);

  return <TodoList useCases={useCases} />;
}
