import { describe, expect, it, vi } from 'vitest';

import type { TodoRepository } from '@/application/ports/todo-repository';
import { makeUpdateTodoUseCase } from './update-todo';

describe('UpdateTodoUseCase', () => {
  it('should call repository.update with trimmed values', async () => {
    const updateMock = vi.fn();
    const todoRepository = {
      add: vi.fn(),
      completeAll: vi.fn(),
      get: vi.fn(),
      remove: vi.fn(),
      removeCompleted: vi.fn(),
      removeOpen: vi.fn(),
      restoreMany: vi.fn(),
      toggle: vi.fn(),
      update: updateMock,
    } as unknown as TodoRepository;

    const useCase = makeUpdateTodoUseCase({ todoRepository });
    await useCase.execute({ id: ' 1 ', title: ' Updated ' });

    expect(updateMock).toHaveBeenCalledWith('1', 'Updated');
  });

  it('should throw if id or title is empty', async () => {
    const todoRepository = {
      add: vi.fn(),
      completeAll: vi.fn(),
      get: vi.fn(),
      remove: vi.fn(),
      removeCompleted: vi.fn(),
      removeOpen: vi.fn(),
      restoreMany: vi.fn(),
      toggle: vi.fn(),
      update: vi.fn(),
    } as unknown as TodoRepository;

    const useCase = makeUpdateTodoUseCase({ todoRepository });

    await expect(useCase.execute({ id: ' ', title: 'x' })).rejects.toThrow('Id cannot be empty');
    await expect(useCase.execute({ id: '1', title: ' ' })).rejects.toThrow('Title cannot be empty');
  });
});
