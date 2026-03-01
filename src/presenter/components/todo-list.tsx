'use client';

import { PlusIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

import { AddTodoForm } from '@/presenter/components/add-todo-form';
import { Button } from '@/presenter/components/ui/button';
import { Input } from '@/presenter/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/presenter/components/ui/select';
import { Separator } from '@/presenter/components/ui/separator';
import { TodoListItem } from '@/presenter/components/todo-list-item';
import { TodoListSkeleton } from '@/presenter/components/todo-list-skeleton';
import { buildContainer, resolveTodoListUseCases } from '@/di/container';
import { useTodoListViewModel } from '@/presenter/todos/useTodoListViewModel';

export function TodoList() {
  const di = useMemo(buildContainer, []);
  const vm = useTodoListViewModel(resolveTodoListUseCases(di));

  const {
    addTodo,
    clearCompletedTodos,
    clearOpenTodos,
    completeAllTodos,
    error,
    filter,
    loading,
    removeTodo,
    searchQuery,
    setFilter,
    setSearchQuery,
    setSortOrder,
    sortOrder,
    stats,
    todos,
    toggleTodo,
    undoLastRemoval,
    undoMessage,
    updateTodo,
  } = vm;

  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = (title: string) => {
    void addTodo(title);
    setIsAdding(false);
  };

  return (
    <section className='space-y-4'>
      {error && (
        <div className='border-destructive/50 bg-destructive/10 text-destructive rounded-md border px-3 py-2 text-sm'>
          {error}
        </div>
      )}

      <div className='grid gap-3 rounded-md border p-3'>
        <Input
          aria-label='Search todos'
          onChange={event => setSearchQuery(event.target.value)}
          placeholder='Search todos...'
          value={searchQuery}
        />
        <div className='flex flex-wrap items-center gap-2'>
          <Button onClick={() => setFilter('all')} size='sm' variant={filter === 'all' ? 'default' : 'outline'}>
            All ({stats.total})
          </Button>
          <Button onClick={() => setFilter('open')} size='sm' variant={filter === 'open' ? 'default' : 'outline'}>
            Open ({stats.open})
          </Button>
          <Button onClick={() => setFilter('done')} size='sm' variant={filter === 'done' ? 'default' : 'outline'}>
            Done ({stats.completed})
          </Button>
          <Select onValueChange={value => setSortOrder(value as 'newest' | 'oldest')} value={sortOrder}>
            <SelectTrigger aria-label='Sort todos' className='w-[140px] h-9'>
              <SelectValue placeholder='Sort order' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='newest'>Newest first</SelectItem>
              <SelectItem value='oldest'>Oldest first</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className='flex flex-wrap gap-2'>
          <Button disabled={stats.open === 0} onClick={() => void completeAllTodos()} size='sm' variant='secondary'>
            Mark all done
          </Button>
          <Button disabled={stats.open === 0} onClick={() => void clearOpenTodos()} size='sm' variant='outline'>
            Delete open
          </Button>
          <Button
            disabled={stats.completed === 0}
            onClick={() => void clearCompletedTodos()}
            size='sm'
            variant='outline'
          >
            Delete completed
          </Button>
        </div>
      </div>

      {loading ? (
        <TodoListSkeleton />
      ) : todos.length === 0 ? (
        <div className='text-muted-foreground text-sm'>No todos found.</div>
      ) : (
        <ul className='grid gap-4'>
          {todos.map(todo => (
            <TodoListItem
              key={todo.id}
              onEdit={(id, title) => void updateTodo(id, title)}
              onRemove={id => void removeTodo(id)}
              onToggle={id => void toggleTodo(id)}
              todo={todo}
            />
          ))}
        </ul>
      )}

      {undoMessage && (
        <div className='bg-card fixed bottom-4 right-4 z-40 flex items-center gap-3 rounded-md border px-3 py-2 shadow-lg'>
          <span className='text-sm'>{undoMessage}</span>
          <Button onClick={() => void undoLastRemoval()} size='sm' variant='secondary'>
            Undo
          </Button>
        </div>
      )}

      {isAdding ? (
        <>
          <Separator />
          <div className='mt-4'>
            <AddTodoForm onAdd={handleAdd} />
          </div>
        </>
      ) : (
        <Button
          className='w-full justify-start text-muted-foreground hover:text-foreground pl-0 mt-2'
          onClick={() => setIsAdding(true)}
          variant='ghost'
        >
          <PlusIcon className='mr-2 h-4 w-4' />
          Add todo
        </Button>
      )}
    </section>
  );
}
