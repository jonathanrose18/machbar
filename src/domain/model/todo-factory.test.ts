import { afterEach, describe, expect, it, vi } from 'vitest';

import { createTodo, createTodoFromPartial } from './todo-factory';

describe('todo-factory', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create a todo with default metadata', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-28T21:00:00.000Z'));

    const todo = createTodo({ id: 'id-1', title: 'Write tests' });

    expect(todo).toEqual({
      id: 'id-1',
      title: 'Write tests',
      done: false,
      added_at: '2026-02-28T21:00:00.000Z',
      updated_at: '2026-02-28T21:00:00.000Z',
      completed_at: null,
      priority: null,
      due_date: null,
    });
  });

  it('should normalize a legacy partial todo', () => {
    const todo = createTodoFromPartial({
      id: 'legacy-1',
      title: 'Legacy',
      done: true,
      added_at: '2026-01-01T00:00:00.000Z',
    });

    expect(todo).toEqual({
      id: 'legacy-1',
      title: 'Legacy',
      done: true,
      added_at: '2026-01-01T00:00:00.000Z',
      updated_at: '2026-01-01T00:00:00.000Z',
      completed_at: '2026-01-01T00:00:00.000Z',
      priority: null,
      due_date: null,
    });
  });
});
