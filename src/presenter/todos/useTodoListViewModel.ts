'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { Todo } from '@/domain/model/todo';
import type { TodoListViewModelDependencies } from './types';

export type TodoFilter = 'all' | 'open' | 'done';
export type TodoSortOrder = 'newest' | 'oldest';

type UndoState = {
  readonly message: string;
  readonly todos: Todo[];
};

const UNDO_TIMEOUT_MS = 5000;

export function useTodoListViewModel({
  addTodoUseCase,
  clearCompletedTodosUseCase,
  clearOpenTodosUseCase,
  completeAllTodosUseCase,
  getTodosUseCase,
  removeTodoUseCase,
  restoreTodosUseCase,
  toggleTodoUseCase,
  updateTodoUseCase,
  autoRefresh = true,
}: TodoListViewModelDependencies) {
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<TodoFilter>('all');
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<TodoSortOrder>('newest');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [undoState, setUndoState] = useState<UndoState | null>(null);
  const undoTimerRef = useRef<number | null>(null);

  const clearUndo = useCallback(() => {
    if (undoTimerRef.current !== null) {
      window.clearTimeout(undoTimerRef.current);
      undoTimerRef.current = null;
    }
    setUndoState(null);
  }, []);

  const scheduleUndo = useCallback(
    (items: Todo[], message: string) => {
      if (!items.length) return;
      clearUndo();
      setUndoState({ todos: items, message });
      undoTimerRef.current = window.setTimeout(() => {
        setUndoState(null);
        undoTimerRef.current = null;
      }, UNDO_TIMEOUT_MS);
    },
    [clearUndo]
  );

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getTodosUseCase.execute();
      setTodos(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load todos');
    } finally {
      setLoading(false);
    }
  }, [getTodosUseCase]);

  const sortTodos = useCallback(
    (list: Todo[]) => {
      return [...list].sort((a, b) => {
        const aTime = new Date(a.added_at).getTime();
        const bTime = new Date(b.added_at).getTime();
        if (aTime === bTime) return a.id.localeCompare(b.id);
        return sortOrder === 'newest' ? bTime - aTime : aTime - bTime;
      });
    },
    [sortOrder]
  );

  const visibleTodos = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const filtered = todos.filter(todo => {
      const matchFilter = filter === 'all' ? true : filter === 'open' ? !todo.done : todo.done;
      const matchQuery = normalizedQuery ? todo.title.toLowerCase().includes(normalizedQuery) : true;
      return matchFilter && matchQuery;
    });
    return sortTodos(filtered);
  }, [filter, searchQuery, sortTodos, todos]);

  const stats = useMemo(() => {
    const completed = todos.filter(todo => todo.done).length;
    const open = todos.length - completed;
    return {
      total: todos.length,
      open,
      completed,
    };
  }, [todos]);

  const addTodo = useCallback(
    async (title: string) => {
      setError(null);
      const timestamp = new Date().toISOString();
      const tempId = `temp-${Date.now()}`;
      const tempTodo: Todo = {
        id: tempId,
        title,
        done: false,
        added_at: timestamp,
        updated_at: timestamp,
        completed_at: null,
        priority: null,
        due_date: null,
      };

      setTodos(prev => [...prev, tempTodo]);

      try {
        const newTodo = await addTodoUseCase.execute({ title });
        setTodos(prev => prev.map(todo => (todo.id === tempId ? newTodo : todo)));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to add todo');
        setTodos(prev => prev.filter(todo => todo.id !== tempId));
      }
    },
    [addTodoUseCase]
  );

  const updateTodo = useCallback(
    async (id: string, title: string) => {
      setError(null);
      const timestamp = new Date().toISOString();
      const previousTodos = todos;
      setTodos(prev => prev.map(todo => (todo.id === id ? { ...todo, title, updated_at: timestamp } : todo)));

      try {
        await updateTodoUseCase.execute({ id, title });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update todo');
        setTodos(previousTodos);
      }
    },
    [todos, updateTodoUseCase]
  );

  const removeTodo = useCallback(
    async (id: string) => {
      setError(null);
      const previousTodos = todos;
      const removedTodo = previousTodos.find(todo => todo.id === id);
      setTodos(prev => prev.filter(todo => todo.id !== id));

      try {
        await removeTodoUseCase.execute({ id });
        if (removedTodo) {
          scheduleUndo([removedTodo], 'Todo deleted');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to remove todo');
        setTodos(previousTodos);
      }
    },
    [removeTodoUseCase, scheduleUndo, todos]
  );

  const toggleTodo = useCallback(
    async (id: string) => {
      setError(null);
      const previousTodos = todos;
      const timestamp = new Date().toISOString();
      setTodos(prev =>
        prev.map(todo => {
          if (todo.id !== id) return todo;
          const done = !todo.done;
          return {
            ...todo,
            done,
            updated_at: timestamp,
            completed_at: done ? timestamp : null,
          };
        })
      );

      try {
        await toggleTodoUseCase.execute({ id });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to toggle todo');
        setTodos(previousTodos);
      }
    },
    [toggleTodoUseCase, todos]
  );

  const completeAllTodos = useCallback(async () => {
    setError(null);
    const previousTodos = todos;
    const timestamp = new Date().toISOString();
    setTodos(prev =>
      prev.map(todo =>
        todo.done
          ? todo
          : {
              ...todo,
              done: true,
              updated_at: timestamp,
              completed_at: timestamp,
            }
      )
    );

    try {
      await completeAllTodosUseCase.execute();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete all todos');
      setTodos(previousTodos);
    }
  }, [completeAllTodosUseCase, todos]);

  const clearCompletedTodos = useCallback(async () => {
    setError(null);
    const previousTodos = todos;
    const removed = previousTodos.filter(todo => todo.done);
    if (!removed.length) return;
    setTodos(prev => prev.filter(todo => !todo.done));

    try {
      await clearCompletedTodosUseCase.execute();
      scheduleUndo(removed, `${removed.length} completed todo(s) deleted`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear completed todos');
      setTodos(previousTodos);
    }
  }, [clearCompletedTodosUseCase, scheduleUndo, todos]);

  const clearOpenTodos = useCallback(async () => {
    setError(null);
    const previousTodos = todos;
    const removed = previousTodos.filter(todo => !todo.done);
    if (!removed.length) return;
    setTodos(prev => prev.filter(todo => todo.done));

    try {
      await clearOpenTodosUseCase.execute();
      scheduleUndo(removed, `${removed.length} open todo(s) deleted`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear open todos');
      setTodos(previousTodos);
    }
  }, [clearOpenTodosUseCase, scheduleUndo, todos]);

  const undoLastRemoval = useCallback(async () => {
    if (!undoState) {
      return;
    }
    setError(null);
    const restored = undoState.todos;
    clearUndo();
    setTodos(prev => {
      const map = new Map(prev.map(todo => [todo.id, todo] as const));
      for (const todo of restored) {
        map.set(todo.id, todo);
      }
      return Array.from(map.values());
    });

    try {
      await restoreTodosUseCase.execute({ todos: restored });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to restore todos');
      setTodos(prev => prev.filter(todo => !restored.some(item => item.id === todo.id)));
    }
  }, [clearUndo, restoreTodosUseCase, undoState]);

  useEffect(() => {
    if (autoRefresh) {
      void refresh();
    }
  }, [autoRefresh, refresh]);

  useEffect(() => {
    return () => {
      if (undoTimerRef.current !== null) {
        window.clearTimeout(undoTimerRef.current);
      }
    };
  }, []);

  return {
    addTodo,
    clearCompletedTodos,
    clearOpenTodos,
    completeAllTodos,
    error,
    filter,
    loading,
    refresh,
    removeTodo,
    searchQuery,
    setFilter,
    setSearchQuery,
    setSortOrder,
    sortOrder,
    stats,
    todos: visibleTodos,
    toggleTodo,
    undoLastRemoval,
    undoMessage: undoState?.message ?? null,
    updateTodo,
  };
}
