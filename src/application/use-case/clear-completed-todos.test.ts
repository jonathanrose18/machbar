import { describe, expect, it, vi } from 'vitest';

import type { TodoRepository } from '@/application/ports/todo-repository';
import { makeClearCompletedTodosUseCase } from './clear-completed-todos';

describe('ClearCompletedTodosUseCase', () => {
  it('should call repository.removeCompleted', async () => {
    const removeCompletedMock = vi.fn();
    const todoRepository = {
      add: vi.fn(),
      completeAll: vi.fn(),
      get: vi.fn(),
      remove: vi.fn(),
      removeCompleted: removeCompletedMock,
      removeOpen: vi.fn(),
      restoreMany: vi.fn(),
      toggle: vi.fn(),
      update: vi.fn(),
    } as unknown as TodoRepository;

    const useCase = makeClearCompletedTodosUseCase({ todoRepository });
    await useCase.execute();

    expect(removeCompletedMock).toHaveBeenCalled();
  });
});
