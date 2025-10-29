'use client';

import { buildContainer } from '@/di/container';
import { useTodoListViewModel } from '@/presenter/todos/useTodoListViewModel';
import { AddTodoInputGroup } from './add-todo-input';

export function TodoList() {
  const di = buildContainer();
  const vm = useTodoListViewModel({
    addTodoUseCase: di.resolve('addTodoUseCase'),
    getTodosUseCase: di.resolve('getTodosUseCase'),
  });

  const { todos, loading, error, addTodo } = vm;

  return (
    <section>
      {error && <p className='text-red-600'>{error}</p>}
      {loading && <p className='opacity-70'>Loading…</p>}

      <AddTodoInputGroup onAdd={addTodo} />

      <ul className='divide-y rounded border'>
        {todos.map(todo => (
          <li key={todo.id} className='flex items-center justify-between p-2 text-sm'>
            <span>{todo.title}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
