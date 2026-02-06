import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { Todo } from '@/domain/model/todo';
import { useTodoListViewModel } from './useTodoListViewModel';

const makeTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: '1',
  title: 'Todo 1',
  done: false,
  added_at: '2026-02-01T00:00:00.000Z',
  updated_at: '2026-02-01T00:00:00.000Z',
  completed_at: null,
  priority: null,
  due_date: null,
  ...overrides,
});

const deferred = <T>() => {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

const baseDeps = () => ({
  addTodoUseCase: { execute: vi.fn() },
  clearCompletedTodosUseCase: { execute: vi.fn() },
  clearOpenTodosUseCase: { execute: vi.fn() },
  completeAllTodosUseCase: { execute: vi.fn() },
  getTodosUseCase: { execute: vi.fn().mockResolvedValue([]) },
  removeTodoUseCase: { execute: vi.fn() },
  restoreTodosUseCase: { execute: vi.fn() },
  toggleTodoUseCase: { execute: vi.fn() },
  updateTodoUseCase: { execute: vi.fn() },
});

describe('useTodoListViewModel', () => {
  it('should set loading during refresh and sort todos by newest first by default', async () => {
    const refreshDeferred = deferred<Todo[]>();
    const deps = baseDeps();
    deps.getTodosUseCase = { execute: vi.fn(() => refreshDeferred.promise) };

    const { result } = renderHook(() =>
      useTodoListViewModel({
        autoRefresh: false,
        ...deps,
      })
    );

    act(() => {
      void result.current.refresh();
    });

    expect(result.current.loading).toBe(true);

    refreshDeferred.resolve([
      makeTodo({ id: 'older', added_at: '2026-01-01T00:00:00.000Z' }),
      makeTodo({ id: 'newer', added_at: '2026-03-01T00:00:00.000Z' }),
    ]);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.todos.map(todo => todo.id)).toEqual(['newer', 'older']);
  });

  it('should filter and search todos', async () => {
    const deps = baseDeps();
    deps.getTodosUseCase = {
      execute: vi.fn().mockResolvedValue([
        makeTodo({ id: '1', title: 'Buy milk', done: false }),
        makeTodo({
          id: '2',
          title: 'Call mom',
          done: true,
          completed_at: '2026-02-02T00:00:00.000Z',
        }),
      ]),
    };
    const { result } = renderHook(() =>
      useTodoListViewModel({
        autoRefresh: false,
        ...deps,
      })
    );

    await act(async () => {
      await result.current.refresh();
    });

    act(() => {
      result.current.setFilter('done');
      result.current.setSearchQuery('call');
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].id).toBe('2');
  });

  it('should rollback optimistic update when update fails', async () => {
    const deps = baseDeps();
    deps.getTodosUseCase = { execute: vi.fn().mockResolvedValue([makeTodo({ id: '1', title: 'A' })]) };
    deps.updateTodoUseCase = { execute: vi.fn().mockRejectedValue(new Error('Update failed')) };
    const { result } = renderHook(() =>
      useTodoListViewModel({
        autoRefresh: false,
        ...deps,
      })
    );

    await act(async () => {
      await result.current.refresh();
    });

    act(() => {
      void result.current.updateTodo('1', 'Updated');
    });

    expect(result.current.todos[0].title).toBe('Updated');

    await waitFor(() => {
      expect(result.current.todos[0].title).toBe('A');
      expect(result.current.error).toBe('Update failed');
    });
  });

  it('should create undo state on remove and restore on undo', async () => {
    const deps = baseDeps();
    deps.getTodosUseCase = { execute: vi.fn().mockResolvedValue([makeTodo({ id: '1', title: 'A' })]) };
    deps.removeTodoUseCase = { execute: vi.fn().mockResolvedValue(undefined) };
    deps.restoreTodosUseCase = { execute: vi.fn().mockResolvedValue(undefined) };

    const { result } = renderHook(() =>
      useTodoListViewModel({
        autoRefresh: false,
        ...deps,
      })
    );

    await act(async () => {
      await result.current.refresh();
    });

    await act(async () => {
      await result.current.removeTodo('1');
    });

    expect(result.current.todos).toHaveLength(0);
    expect(result.current.undoMessage).toBe('Todo deleted');

    await act(async () => {
      await result.current.undoLastRemoval();
    });

    expect(result.current.todos).toHaveLength(1);
    expect(deps.restoreTodosUseCase.execute).toHaveBeenCalled();
  });

  it('should rollback optimistic bulk remove when clear completed fails', async () => {
    const deps = baseDeps();
    deps.getTodosUseCase = {
      execute: vi
        .fn()
        .mockResolvedValue([
          makeTodo({ id: '1', done: true, completed_at: '2026-02-02T00:00:00.000Z' }),
          makeTodo({ id: '2', done: false }),
        ]),
    };
    deps.clearCompletedTodosUseCase = {
      execute: vi.fn().mockRejectedValue(new Error('Bulk delete failed')),
    };

    const { result } = renderHook(() =>
      useTodoListViewModel({
        autoRefresh: false,
        ...deps,
      })
    );

    await act(async () => {
      await result.current.refresh();
    });

    act(() => {
      void result.current.clearCompletedTodos();
    });

    expect(result.current.stats.total).toBe(1);

    await waitFor(() => {
      expect(result.current.stats.total).toBe(2);
      expect(result.current.error).toBe('Bulk delete failed');
    });
  });
});
