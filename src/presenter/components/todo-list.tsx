'use client';

import { useMemo } from 'react';

import { AddTodoInputGroup } from '@/presenter/components/add-todo-input';
import { TodoListHeader } from '@/presenter/components/todo-list-header';
import { TodoListEmpty } from '@/presenter/components/todo-list-empty';
import { TodoListSkeleton } from '@/presenter/components/todo-list-skeleton';
import { TodoListItem } from '@/presenter/components/todo-list-item';
import { buildContainer } from '@/di/container';
import { useTodoListViewModel } from '@/presenter/todos/useTodoListViewModel';

export function TodoList() {
  const di = useMemo(buildContainer, []);
  const vm = useTodoListViewModel({
    addTodoUseCase: di.resolve('addTodoUseCase'),
    getTodosUseCase: di.resolve('getTodosUseCase'),
    removeTodoUseCase: di.resolve('removeTodoUseCase'),
  });

  const { todos, loading, error, addTodo, removeTodo } = vm;

  return (
    <section className='space-y-4'>
      <TodoListHeader count={todos.length} />

      {error && (
        <div className='border-destructive/50 bg-destructive/10 text-destructive rounded-md border px-3 py-2 text-sm'>
          {error}
        </div>
      )}

      <AddTodoInputGroup onAdd={addTodo} />

      {loading ? (
        <TodoListSkeleton />
      ) : todos.length === 0 ? (
        <TodoListEmpty />
      ) : (
        <ul className='divide-border rounded-md border'>
          {todos.map(todo => (
            <TodoListItem key={todo.id} todo={todo} onRemove={removeTodo} />
          ))}
        </ul>
      )}
    </section>
  );
}
