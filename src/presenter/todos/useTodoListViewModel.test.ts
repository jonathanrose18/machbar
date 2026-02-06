import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { Todo } from '@/domain/model/todo';
import { useTodoListViewModel } from './useTodoListViewModel';

const makeTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: '1',
  title: 'Todo 1',
  done: false,
  added_at: '2026-02-01T00:00:00.000Z',
  ...overrides,
});

const deferred = <T,>() => {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

describe('useTodoListViewModel', () => {
  it('should set loading during refresh and then expose sorted todos', async () => {
    const refreshDeferred = deferred<Todo[]>();
    const getTodosUseCase = { execute: vi.fn(() => refreshDeferred.promise) };

    const { result } = renderHook(() =>
      useTodoListViewModel({
        autoRefresh: false,
        addTodoUseCase: { execute: vi.fn() },
        getTodosUseCase,
        removeTodoUseCase: { execute: vi.fn() },
        toggleTodoUseCase: { execute: vi.fn() },
      })
    );

    act(() => {
      void result.current.refresh();
    });

    expect(result.current.loading).toBe(true);

    refreshDeferred.resolve([
      makeTodo({ id: 'b' }),
      makeTodo({ id: 'a' }),
      makeTodo({ id: 'c' }),
    ]);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.todos.map((todo) => todo.id)).toEqual(['a', 'b', 'c']);
  });

  it('should optimistically add and then replace temporary todo on success', async () => {
    const addDeferred = deferred<Todo>();
    const { result } = renderHook(() =>
      useTodoListViewModel({
        autoRefresh: false,
        addTodoUseCase: { execute: vi.fn(() => addDeferred.promise) },
        getTodosUseCase: { execute: vi.fn().mockResolvedValue([]) },
        removeTodoUseCase: { execute: vi.fn() },
        toggleTodoUseCase: { execute: vi.fn() },
      })
    );

    act(() => {
      void result.current.addTodo('Test');
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].id.startsWith('temp-')).toBe(true);

    addDeferred.resolve(makeTodo({ id: 'real-1', title: 'Test' }));

    await waitFor(() => {
      expect(result.current.todos[0].id).toBe('real-1');
    });
  });

  it('should rollback optimistic add when add fails', async () => {
    const addDeferred = deferred<Todo>();
    const { result } = renderHook(() =>
      useTodoListViewModel({
        autoRefresh: false,
        addTodoUseCase: { execute: vi.fn(() => addDeferred.promise) },
        getTodosUseCase: { execute: vi.fn().mockResolvedValue([]) },
        removeTodoUseCase: { execute: vi.fn() },
        toggleTodoUseCase: { execute: vi.fn() },
      })
    );

    act(() => {
      void result.current.addTodo('Will fail');
    });

    expect(result.current.todos).toHaveLength(1);

    addDeferred.reject(new Error('Add failed'));

    await waitFor(() => {
      expect(result.current.todos).toHaveLength(0);
      expect(result.current.error).toBe('Add failed');
    });
  });

  it('should rollback optimistic remove when remove fails', async () => {
    const removeDeferred = deferred<void>();
    const { result } = renderHook(() =>
      useTodoListViewModel({
        autoRefresh: false,
        addTodoUseCase: { execute: vi.fn() },
        getTodosUseCase: {
          execute: vi.fn().mockResolvedValue([
            makeTodo({ id: '1', title: 'A' }),
            makeTodo({ id: '2', title: 'B' }),
          ]),
        },
        removeTodoUseCase: { execute: vi.fn(() => removeDeferred.promise) },
        toggleTodoUseCase: { execute: vi.fn() },
      })
    );

    await act(async () => {
      await result.current.refresh();
    });

    act(() => {
      void result.current.removeTodo('1');
    });

    expect(result.current.todos.map((todo) => todo.id)).toEqual(['2']);

    removeDeferred.reject(new Error('Remove failed'));

    await waitFor(() => {
      expect(result.current.todos.map((todo) => todo.id)).toEqual(['1', '2']);
      expect(result.current.error).toBe('Remove failed');
    });
  });

  it('should rollback optimistic toggle when toggle fails', async () => {
    const toggleDeferred = deferred<void>();
    const { result } = renderHook(() =>
      useTodoListViewModel({
        autoRefresh: false,
        addTodoUseCase: { execute: vi.fn() },
        getTodosUseCase: {
          execute: vi.fn().mockResolvedValue([makeTodo({ id: '1', done: false })]),
        },
        removeTodoUseCase: { execute: vi.fn() },
        toggleTodoUseCase: { execute: vi.fn(() => toggleDeferred.promise) },
      })
    );

    await act(async () => {
      await result.current.refresh();
    });

    act(() => {
      void result.current.toggleTodo('1');
    });

    expect(result.current.todos[0].done).toBe(true);

    toggleDeferred.reject(new Error('Toggle failed'));

    await waitFor(() => {
      expect(result.current.todos[0].done).toBe(false);
      expect(result.current.error).toBe('Toggle failed');
    });
  });
});
