import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { Todo } from '@/domain/model/todo';
import { TodoList } from './todo-list';

type AddTodoUseCase = { execute: (params: { title: string }) => Promise<Todo> };
type ClearCompletedTodosUseCase = { execute: () => Promise<void> };
type ClearOpenTodosUseCase = { execute: () => Promise<void> };
type CompleteAllTodosUseCase = { execute: () => Promise<void> };
type GetTodosUseCase = { execute: () => Promise<Todo[]> };
type RemoveTodoUseCase = { execute: (params: { id: string }) => Promise<void> };
type RestoreTodosUseCase = { execute: (params: { todos: Todo[] }) => Promise<void> };
type ToggleTodoUseCase = { execute: (params: { id: string }) => Promise<void> };
type UpdateTodoUseCase = { execute: (params: { id: string; title: string }) => Promise<void> };

let addTodoUseCase: AddTodoUseCase;
let clearCompletedTodosUseCase: ClearCompletedTodosUseCase;
let clearOpenTodosUseCase: ClearOpenTodosUseCase;
let completeAllTodosUseCase: CompleteAllTodosUseCase;
let getTodosUseCase: GetTodosUseCase;
let removeTodoUseCase: RemoveTodoUseCase;
let restoreTodosUseCase: RestoreTodosUseCase;
let toggleTodoUseCase: ToggleTodoUseCase;
let updateTodoUseCase: UpdateTodoUseCase;

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

const deferred = <T,>() => {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

const renderTodoList = () =>
  render(
    <TodoList
      useCases={{
        addTodoUseCase,
        clearCompletedTodosUseCase,
        clearOpenTodosUseCase,
        completeAllTodosUseCase,
        getTodosUseCase,
        removeTodoUseCase,
        restoreTodosUseCase,
        toggleTodoUseCase,
        updateTodoUseCase,
      }}
    />
  );

describe('TodoList integration', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    addTodoUseCase = { execute: vi.fn().mockResolvedValue(makeTodo({ id: 'new' })) };
    clearCompletedTodosUseCase = { execute: vi.fn().mockResolvedValue(undefined) };
    clearOpenTodosUseCase = { execute: vi.fn().mockResolvedValue(undefined) };
    completeAllTodosUseCase = { execute: vi.fn().mockResolvedValue(undefined) };
    getTodosUseCase = { execute: vi.fn().mockResolvedValue([]) };
    removeTodoUseCase = { execute: vi.fn().mockResolvedValue(undefined) };
    restoreTodosUseCase = { execute: vi.fn().mockResolvedValue(undefined) };
    toggleTodoUseCase = { execute: vi.fn().mockResolvedValue(undefined) };
    updateTodoUseCase = { execute: vi.fn().mockResolvedValue(undefined) };
  });

  it('should show loading skeleton during initial fetch and then render todos', async () => {
    const fetchDeferred = deferred<Todo[]>();
    getTodosUseCase = { execute: vi.fn(() => fetchDeferred.promise) };

    const { container } = renderTodoList();
    expect(container.querySelector('[aria-busy="true"]')).not.toBeNull();

    await act(async () => {
      fetchDeferred.resolve([makeTodo({ id: 'a', title: 'Task A' })]);
      await fetchDeferred.promise;
    });

    expect(await screen.findByText('Task A')).toBeInTheDocument();
  });

  it('should filter todos with text search', async () => {
    getTodosUseCase = {
      execute: vi
        .fn()
        .mockResolvedValue([makeTodo({ id: '1', title: 'Buy milk' }), makeTodo({ id: '2', title: 'Call mom' })]),
    };
    renderTodoList();

    await screen.findByText('Buy milk');
    fireEvent.change(screen.getByLabelText('Search todos'), {
      target: { value: 'call' },
    });

    await waitFor(() => {
      expect(screen.queryByText('Buy milk')).not.toBeInTheDocument();
      expect(screen.getByText('Call mom')).toBeInTheDocument();
    });
  });

  it('should edit todo title inline', async () => {
    getTodosUseCase = {
      execute: vi.fn().mockResolvedValue([makeTodo({ id: '1', title: 'Old title' })]),
    };
    renderTodoList();

    await screen.findByText('Old title');
    fireEvent.click(screen.getByRole('button', { name: 'Edit todo Old title' }));
    fireEvent.change(screen.getByLabelText('Edit todo Old title'), {
      target: { value: 'New title' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save todo Old title' }));

    expect(updateTodoUseCase.execute).toHaveBeenCalledWith({
      id: '1',
      title: 'New title',
    });
    await screen.findByText('New title');
  });

  it('should rollback optimistic remove when remove fails and allow undo', async () => {
    const removeDeferred = deferred<void>();
    getTodosUseCase = {
      execute: vi.fn().mockResolvedValue([makeTodo({ id: 'r-1', title: 'Delete me' })]),
    };
    removeTodoUseCase = { execute: vi.fn(() => removeDeferred.promise) };

    renderTodoList();
    expect(await screen.findByText('Delete me')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Remove todo Delete me' }));
    await waitFor(() => {
      expect(screen.queryByText('Delete me')).not.toBeInTheDocument();
    });

    await act(async () => {
      removeDeferred.reject(new Error('Remove failed'));
      try {
        await removeDeferred.promise;
      } catch {
        // expected
      }
    });

    await waitFor(() => {
      expect(screen.getByText('Delete me')).toBeInTheDocument();
    });
  });

  it('should delete completed todos with bulk action and restore with undo', async () => {
    getTodosUseCase = {
      execute: vi
        .fn()
        .mockResolvedValue([
          makeTodo({ id: '1', title: 'Done', done: true, completed_at: '2026-02-02T00:00:00.000Z' }),
          makeTodo({ id: '2', title: 'Open', done: false }),
        ]),
    };
    renderTodoList();
    await screen.findByText('Done');

    fireEvent.click(screen.getByRole('button', { name: 'Delete completed' }));
    await waitFor(() => {
      expect(screen.queryByText('Done')).not.toBeInTheDocument();
    });

    expect(await screen.findByText('1 completed todo(s) deleted')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Undo' }));

    await waitFor(() => {
      expect(screen.getByText('Done')).toBeInTheDocument();
      expect(restoreTodosUseCase.execute).toHaveBeenCalled();
    });
  });
});
