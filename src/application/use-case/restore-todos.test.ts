import { describe, expect, it, vi } from 'vitest';

import type { TodoRepository } from '@/application/ports/todo-repository';
import { makeRestoreTodosUseCase } from './restore-todos';

describe('RestoreTodosUseCase', () => {
  it('should call repository.restoreMany for non-empty payload', async () => {
    const restoreManyMock = vi.fn();
    const todoRepository = {
      add: vi.fn(),
      completeAll: vi.fn(),
      get: vi.fn(),
      remove: vi.fn(),
      removeCompleted: vi.fn(),
      removeOpen: vi.fn(),
      restoreMany: restoreManyMock,
      toggle: vi.fn(),
      update: vi.fn(),
    } as unknown as TodoRepository;

    const useCase = makeRestoreTodosUseCase({ todoRepository });
    const todos = [
      {
        id: '1',
        title: 'Todo',
        done: false,
        added_at: '2026-02-01T00:00:00.000Z',
        updated_at: '2026-02-01T00:00:00.000Z',
        completed_at: null,
        priority: null,
        due_date: null,
      },
    ];

    await useCase.execute({ todos });
    expect(restoreManyMock).toHaveBeenCalledWith(todos);
  });

  it('should ignore empty payload', async () => {
    const restoreManyMock = vi.fn();
    const todoRepository = {
      add: vi.fn(),
      completeAll: vi.fn(),
      get: vi.fn(),
      remove: vi.fn(),
      removeCompleted: vi.fn(),
      removeOpen: vi.fn(),
      restoreMany: restoreManyMock,
      toggle: vi.fn(),
      update: vi.fn(),
    } as unknown as TodoRepository;

    const useCase = makeRestoreTodosUseCase({ todoRepository });
    await useCase.execute({ todos: [] });
    expect(restoreManyMock).not.toHaveBeenCalled();
  });
});
