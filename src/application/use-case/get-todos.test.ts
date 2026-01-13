import { describe, it, expect, vi } from 'vitest';
import { makeGetTodosUseCase } from './get-todos';
import type { TodoRepository } from '@/application/ports/todo-repository';

describe('GetTodosUseCase', () => {
  it('should return todos from repository', async () => {
    const expectedTodos = [
      { id: '1', title: 'Todo 1', done: false, added_at: 'now' },
      { id: '2', title: 'Todo 2', done: true, added_at: 'now' },
    ];
    const getMock = vi.fn().mockResolvedValue(expectedTodos);
    const todoRepository = {
      add: vi.fn(),
      get: getMock,
      remove: vi.fn(),
      toggle: vi.fn(),
    } as unknown as TodoRepository;

    const useCase = makeGetTodosUseCase({ todoRepository });

    const todos = await useCase.execute();

    expect(getMock).toHaveBeenCalled();
    expect(todos).toEqual(expectedTodos);
  });
});
