import { describe, expect, it, vi } from 'vitest';

import type { TodoRepository } from '@/application/ports/todo-repository';
import { makeCompleteAllTodosUseCase } from './complete-all-todos';

describe('CompleteAllTodosUseCase', () => {
  it('should call repository.completeAll', async () => {
    const completeAllMock = vi.fn();
    const todoRepository = {
      add: vi.fn(),
      completeAll: completeAllMock,
      get: vi.fn(),
      remove: vi.fn(),
      removeCompleted: vi.fn(),
      removeOpen: vi.fn(),
      restoreMany: vi.fn(),
      toggle: vi.fn(),
      update: vi.fn(),
    } as unknown as TodoRepository;

    const useCase = makeCompleteAllTodosUseCase({ todoRepository });
    await useCase.execute();

    expect(completeAllMock).toHaveBeenCalled();
  });
});
