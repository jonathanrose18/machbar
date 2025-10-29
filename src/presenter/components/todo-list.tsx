'use client';

import { buildContainer } from '@/di/container';
import { useTodoListViewModel } from '@/presenter/todos/useTodoListViewModel';

export function TodoList() {
  const di = buildContainer();
  const vm = useTodoListViewModel({ getTodosUseCase: di.resolve('getTodosUseCase') });

  const { todos, loading, error } = vm;

  return (
    <section className='space-y-4'>
      <header className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold'>Todos</h2>
        <button onClick={vm.refresh} className='rounded border px-3 py-1' type='button'>
          Refresh
        </button>
      </header>

      {error && <p className='text-red-600'>{error}</p>}
      {loading && <p className='opacity-70'>Loading…</p>}

      <ul className='divide-y rounded border'>
        {todos.map(todo => (
          <li key={todo.id} className='flex items-center justify-between p-3'>
            <span>{todo.title}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
