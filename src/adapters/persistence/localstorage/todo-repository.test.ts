import { beforeEach, describe, expect, it, vi } from 'vitest';

import { makeLocalStorageTodoRepository } from './todo-repository';

describe('LocalStorageTodoRepository', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should add a todo with metadata and persist it', async () => {
    const repo = makeLocalStorageTodoRepository();
    const todo = await repo.add('Integration Test Todo');

    expect(todo.title).toBe('Integration Test Todo');
    expect(todo.done).toBe(false);
    expect(todo.completed_at).toBeNull();
    expect(todo.updated_at).toBe(todo.added_at);
    expect(todo.priority).toBeNull();
    expect(todo.due_date).toBeNull();

    const stored = JSON.parse(localStorage.getItem('todos') || '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0]).toEqual(todo);
  });

  it('should normalize legacy todos when retrieving', async () => {
    const repo = makeLocalStorageTodoRepository();
    localStorage.setItem(
      'todos',
      JSON.stringify([{ id: '1', title: 'Legacy', done: true, added_at: '2026-01-01T00:00:00.000Z' }])
    );

    const todos = await repo.get();

    expect(todos[0].updated_at).toBe('2026-01-01T00:00:00.000Z');
    expect(todos[0].completed_at).toBe('2026-01-01T00:00:00.000Z');
    expect(todos[0].priority).toBeNull();
    expect(todos[0].due_date).toBeNull();
  });

  it('should return empty array when localStorage contains invalid JSON', async () => {
    const repo = makeLocalStorageTodoRepository();
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    localStorage.setItem('todos', '{invalid-json');

    const todos = await repo.get();

    expect(todos).toEqual([]);
    expect(warnSpy).toHaveBeenCalled();
  });

  it('should update title and updated_at', async () => {
    const repo = makeLocalStorageTodoRepository();
    localStorage.setItem(
      'todos',
      JSON.stringify([
        {
          id: '1',
          title: 'Old',
          done: false,
          added_at: '2026-01-01T00:00:00.000Z',
          updated_at: '2026-01-01T00:00:00.000Z',
          completed_at: null,
          priority: null,
          due_date: null,
        },
      ])
    );

    await repo.update('1', 'New');
    const stored = JSON.parse(localStorage.getItem('todos') || '[]');
    expect(stored[0].title).toBe('New');
    expect(stored[0].updated_at).not.toBe('2026-01-01T00:00:00.000Z');
  });

  it('should toggle done status and completed_at', async () => {
    const repo = makeLocalStorageTodoRepository();
    localStorage.setItem(
      'todos',
      JSON.stringify([
        {
          id: '1',
          title: 'To Toggle',
          done: false,
          added_at: '2026-01-01T00:00:00.000Z',
          updated_at: '2026-01-01T00:00:00.000Z',
          completed_at: null,
          priority: null,
          due_date: null,
        },
      ])
    );

    await repo.toggle('1');
    const stored = JSON.parse(localStorage.getItem('todos') || '[]');
    expect(stored[0].done).toBe(true);
    expect(stored[0].completed_at).not.toBeNull();

    await repo.toggle('1');
    const stored2 = JSON.parse(localStorage.getItem('todos') || '[]');
    expect(stored2[0].done).toBe(false);
    expect(stored2[0].completed_at).toBeNull();
  });

  it('should complete all open todos', async () => {
    const repo = makeLocalStorageTodoRepository();
    localStorage.setItem(
      'todos',
      JSON.stringify([
        {
          id: '1',
          title: 'Open',
          done: false,
          added_at: '2026-01-01T00:00:00.000Z',
          updated_at: '2026-01-01T00:00:00.000Z',
          completed_at: null,
          priority: null,
          due_date: null,
        },
      ])
    );

    await repo.completeAll();

    const stored = JSON.parse(localStorage.getItem('todos') || '[]');
    expect(stored[0].done).toBe(true);
    expect(stored[0].completed_at).not.toBeNull();
  });

  it('should remove completed and open todos via bulk methods', async () => {
    const repo = makeLocalStorageTodoRepository();
    localStorage.setItem(
      'todos',
      JSON.stringify([
        {
          id: '1',
          title: 'Done',
          done: true,
          added_at: '2026-01-01T00:00:00.000Z',
          updated_at: '2026-01-01T00:00:00.000Z',
          completed_at: '2026-01-01T00:00:00.000Z',
          priority: null,
          due_date: null,
        },
        {
          id: '2',
          title: 'Open',
          done: false,
          added_at: '2026-01-02T00:00:00.000Z',
          updated_at: '2026-01-02T00:00:00.000Z',
          completed_at: null,
          priority: null,
          due_date: null,
        },
      ])
    );

    await repo.removeCompleted();
    const afterCompleted = JSON.parse(localStorage.getItem('todos') || '[]');
    expect(afterCompleted).toHaveLength(1);
    expect(afterCompleted[0].id).toBe('2');

    await repo.removeOpen();
    const afterOpen = JSON.parse(localStorage.getItem('todos') || '[]');
    expect(afterOpen).toHaveLength(0);
  });

  it('should restore many todos and keep ids unique', async () => {
    const repo = makeLocalStorageTodoRepository();
    localStorage.setItem(
      'todos',
      JSON.stringify([
        {
          id: '1',
          title: 'Existing',
          done: false,
          added_at: '2026-01-01T00:00:00.000Z',
          updated_at: '2026-01-01T00:00:00.000Z',
          completed_at: null,
          priority: null,
          due_date: null,
        },
      ])
    );

    await repo.restoreMany([
      {
        id: '1',
        title: 'Existing updated',
        done: false,
        added_at: '2026-01-01T00:00:00.000Z',
        updated_at: '2026-01-03T00:00:00.000Z',
        completed_at: null,
        priority: null,
        due_date: null,
      },
      {
        id: '2',
        title: 'Restored',
        done: true,
        added_at: '2026-01-02T00:00:00.000Z',
        updated_at: '2026-01-02T00:00:00.000Z',
        completed_at: '2026-01-02T00:00:00.000Z',
        priority: null,
        due_date: null,
      },
    ]);

    const stored = JSON.parse(localStorage.getItem('todos') || '[]');
    expect(stored).toHaveLength(2);
    expect(stored.find((todo: { id: string }) => todo.id === '1')?.title).toBe('Existing updated');
  });

  it('should throw when saving to localStorage fails', async () => {
    const repo = makeLocalStorageTodoRepository();
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Quota exceeded');
    });
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(repo.add('Test')).rejects.toThrow('Could not save todo.');
    expect(errorSpy).toHaveBeenCalled();
  });
});
