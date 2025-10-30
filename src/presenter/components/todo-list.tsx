'use client';

import { useMemo } from 'react';

import { AddTodoInputGroup } from '@/presenter/components/add-todo-input';
import { buildContainer } from '@/di/container';
import { useTodoListViewModel } from '@/presenter/todos/useTodoListViewModel';

export function TodoList() {
  const di = useMemo(buildContainer, []);
  const vm = useTodoListViewModel({
    addTodoUseCase: di.resolve('addTodoUseCase'),
    getTodosUseCase: di.resolve('getTodosUseCase'),
  });

  const { todos, loading, error, addTodo } = vm;

  return (
    <section className='space-y-4'>
      <header className='flex items-end justify-between'>
        <div>
          <h2 className='text-xl font-semibold tracking-tight'>Meine Aufgaben</h2>
          <p className='text-muted-foreground text-sm'>Verwalte deine Todos schnell und einfach</p>
        </div>
        {todos.length > 0 && (
          <span className='text-muted-foreground text-xs rounded-md border px-2 py-0.5'>
            {todos.length} offen
          </span>
        )}
      </header>

      {error && (
        <div className='border-destructive/50 bg-destructive/10 text-destructive rounded-md border px-3 py-2 text-sm'>
          {error}
        </div>
      )}

      <AddTodoInputGroup onAdd={addTodo} />

      {loading ? (
        <div className='rounded-md border p-4'>
          <div className='h-4 w-1/3 animate-pulse rounded bg-foreground/10' />
          <div className='mt-3 h-3 w-full animate-pulse rounded bg-foreground/10' />
          <div className='mt-2 h-3 w-11/12 animate-pulse rounded bg-foreground/10' />
        </div>
      ) : todos.length === 0 ? (
        <div className='text-muted-foreground rounded-md border px-4 py-8 text-center text-sm'>
          Keine Aufgaben vorhanden. Füge oben eine neue hinzu.
        </div>
      ) : (
        <ul className='divide-border rounded-md border'>
          {todos.map(todo => (
            <li
              key={todo.id}
              className='hover:bg-accent/50 flex items-center justify-between px-3 py-2 text-sm transition-colors'
            >
              <span className='truncate'>{todo.title}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
