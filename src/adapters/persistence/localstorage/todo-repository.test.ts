import { describe, it, expect, beforeEach, vi } from 'vitest';

import { makeLocalStorageTodoRepository } from './todo-repository';

describe('LocalStorageTodoRepository', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it('should add a todo and persist it to localStorage', async () => {
        const repo = makeLocalStorageTodoRepository();
        const title = 'Integration Test Todo';

        const todo = await repo.add(title);

        expect(todo.title).toBe(title);
        expect(todo.done).toBe(false);

        const stored = JSON.parse(localStorage.getItem('todos') || '[]');
        expect(stored).toHaveLength(1);
        expect(stored[0]).toEqual(todo);
    });

    it('should retrieve todos from localStorage', async () => {
        const repo = makeLocalStorageTodoRepository();
        const existingTodos = [
            { id: '1', title: 'Existing', done: true, added_at: 'now' }
        ];
        localStorage.setItem('todos', JSON.stringify(existingTodos));

        const todos = await repo.get();

        expect(todos).toEqual(existingTodos);
    });

    it('should remove a todo', async () => {
        const repo = makeLocalStorageTodoRepository();
        const existingTodos = [
            { id: '1', title: 'To Remove', done: false, added_at: 'now' },
            { id: '2', title: 'To Keep', done: false, added_at: 'now' }
        ];
        localStorage.setItem('todos', JSON.stringify(existingTodos));

        await repo.remove('1');

        const stored = JSON.parse(localStorage.getItem('todos') || '[]');
        expect(stored).toHaveLength(1);
        expect(stored[0].id).toBe('2');
    });

    it('should toggle a todo done status', async () => {
        const repo = makeLocalStorageTodoRepository();
        const existingTodos = [
            { id: '1', title: 'To Toggle', done: false, added_at: 'now' }
        ];
        localStorage.setItem('todos', JSON.stringify(existingTodos));

        await repo.toggle('1');

        const stored = JSON.parse(localStorage.getItem('todos') || '[]');
        expect(stored[0].done).toBe(true);

        await repo.toggle('1');
        const stored2 = JSON.parse(localStorage.getItem('todos') || '[]');
        expect(stored2[0].done).toBe(false);
    });
});
