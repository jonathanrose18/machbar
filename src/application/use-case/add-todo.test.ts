import { describe, it, expect, vi } from 'vitest';
import { makeAddTodoUseCase } from './add-todo';
import type { TodoRepository } from '@/application/ports/todo-repository';

describe('AddTodoUseCase', () => {
    it('should call repository.add with correct title', async () => {
        const addMock = vi.fn();
        const todoRepository = {
            add: addMock,
            get: vi.fn(),
            remove: vi.fn(),
            toggle: vi.fn(),
        } as unknown as TodoRepository;

        const useCase = makeAddTodoUseCase({ todoRepository });
        const title = 'Test Todo';

        await useCase.execute({ title });

        expect(addMock).toHaveBeenCalledWith(title);
    });

    it('should return the result from repository', async () => {
        const expectedTodo = { id: '1', title: 'Test', done: false, added_at: 'now' };
        const addMock = vi.fn().mockResolvedValue(expectedTodo);
        const todoRepository = {
            add: addMock,
            get: vi.fn(),
            remove: vi.fn(),
            toggle: vi.fn(),
        } as unknown as TodoRepository;

        const useCase = makeAddTodoUseCase({ todoRepository });

        const result = await useCase.execute({ title: 'Test' });

        expect(result).toEqual(expectedTodo);
    });
});
