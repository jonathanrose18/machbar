import { describe, expect, it, vi } from 'vitest';

import type { TodoRepository } from '@/application/ports/todo-repository';
import { makeClearOpenTodosUseCase } from './clear-open-todos';

describe('ClearOpenTodosUseCase', () => {
  it('should call repository.removeOpen', async () => {
    const removeOpenMock = vi.fn();
    const todoRepository = {
      add: vi.fn(),
      completeAll: vi.fn(),
      get: vi.fn(),
      remove: vi.fn(),
      removeCompleted: vi.fn(),
      removeOpen: removeOpenMock,
      restoreMany: vi.fn(),
      toggle: vi.fn(),
      update: vi.fn(),
    } as unknown as TodoRepository;

    const useCase = makeClearOpenTodosUseCase({ todoRepository });
    await useCase.execute();

    expect(removeOpenMock).toHaveBeenCalled();
  });
});
