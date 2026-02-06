import { describe, it, expect, vi } from 'vitest';
import { makeRemoveTodoUseCase } from './remove-todo';
import type { TodoRepository } from '@/application/ports/todo-repository';

describe('RemoveTodoUseCase', () => {
  it('should call repository.remove with correct id', async () => {
    const removeMock = vi.fn();
    const todoRepository = {
      add: vi.fn(),
      completeAll: vi.fn(),
      get: vi.fn(),
      removeCompleted: vi.fn(),
      removeOpen: vi.fn(),
      remove: removeMock,
      restoreMany: vi.fn(),
      toggle: vi.fn(),
      update: vi.fn(),
    } as unknown as TodoRepository;

    const useCase = makeRemoveTodoUseCase({ todoRepository });
    const id = '123';

    await useCase.execute({ id });

    expect(removeMock).toHaveBeenCalledWith(id);
  });

  it('should throw error if id is empty', async () => {
    const todoRepository = {
      add: vi.fn(),
      completeAll: vi.fn(),
      get: vi.fn(),
      removeCompleted: vi.fn(),
      removeOpen: vi.fn(),
      remove: vi.fn(),
      restoreMany: vi.fn(),
      toggle: vi.fn(),
      update: vi.fn(),
    } as unknown as TodoRepository;

    const useCase = makeRemoveTodoUseCase({ todoRepository });

    await expect(useCase.execute({ id: '' })).rejects.toThrow('Id cannot be empty');
    await expect(useCase.execute({ id: '   ' })).rejects.toThrow('Id cannot be empty');
  });

  it('should propagate repository errors', async () => {
    const todoRepository = {
      add: vi.fn(),
      completeAll: vi.fn(),
      get: vi.fn(),
      removeCompleted: vi.fn(),
      removeOpen: vi.fn(),
      remove: vi.fn().mockRejectedValue(new Error('Repository remove failed')),
      restoreMany: vi.fn(),
      toggle: vi.fn(),
      update: vi.fn(),
    } as unknown as TodoRepository;

    const useCase = makeRemoveTodoUseCase({ todoRepository });

    await expect(useCase.execute({ id: '123' })).rejects.toThrow('Repository remove failed');
  });
});
