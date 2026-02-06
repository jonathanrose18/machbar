import { describe, it, expect, vi } from 'vitest';
import { makeToggleTodoUseCase } from './toggle-todo';
import type { TodoRepository } from '@/application/ports/todo-repository';

describe('ToggleTodoUseCase', () => {
  it('should call repository.toggle with correct id', async () => {
    const toggleMock = vi.fn();
    const todoRepository = {
      add: vi.fn(),
      completeAll: vi.fn(),
      get: vi.fn(),
      removeCompleted: vi.fn(),
      removeOpen: vi.fn(),
      remove: vi.fn(),
      restoreMany: vi.fn(),
      toggle: toggleMock,
      update: vi.fn(),
    } as unknown as TodoRepository;

    const useCase = makeToggleTodoUseCase({ todoRepository });
    const id = '123';

    await useCase.execute({ id });

    expect(toggleMock).toHaveBeenCalledWith(id);
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

    const useCase = makeToggleTodoUseCase({ todoRepository });

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
      remove: vi.fn(),
      restoreMany: vi.fn(),
      toggle: vi.fn().mockRejectedValue(new Error('Repository toggle failed')),
      update: vi.fn(),
    } as unknown as TodoRepository;

    const useCase = makeToggleTodoUseCase({ todoRepository });

    await expect(useCase.execute({ id: '123' })).rejects.toThrow('Repository toggle failed');
  });
});
