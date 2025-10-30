import { useCallback } from 'react';

import { Button } from '@/presenter/components/ui/button';
import { Checkbox } from '@/presenter/components/ui/checkbox';
import { cn } from '@/presenter/lib/utils';
import type { Todo } from '@/domain/model/todo';

type TodoListItemProps = {
  readonly todo: Todo;
  readonly onRemove: (id: string) => void;
  readonly onToggle: (id: string) => void;
};

export function TodoListItem({ todo, onRemove, onToggle }: TodoListItemProps) {
  const checkboxId = `todo-checkbox-${todo.id}`;

  const handleRemove = useCallback(() => {
    if (!onRemove) {
      return;
    }

    onRemove(todo.id);
  }, [onRemove, todo.id]);

  const handleToggle = useCallback(() => {
    if (!onToggle) {
      return;
    }

    onToggle(todo.id);
  }, [onToggle, todo.id]);

  return (
    <li className='hover:bg-accent/50 flex items-center justify-between px-3 py-2 text-sm transition-colors'>
      <div className='flex items-center gap-2 truncate'>
        <Checkbox id={checkboxId} checked={todo.done} onCheckedChange={handleToggle} />
        <label htmlFor={checkboxId} className={cn('truncate', todo.done && 'line-through text-muted-foreground')}>
          {todo.title}
        </label>
      </div>
      <Button
        type='button'
        variant='ghost'
        size='sm'
        aria-label={`Aufgabe entfernen: ${todo.title}`}
        onClick={handleRemove}
      >
        Remove
      </Button>
    </li>
  );
}
