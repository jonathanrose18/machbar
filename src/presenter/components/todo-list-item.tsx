import { useCallback } from 'react';

import type { Todo } from '@/domain/model/todo';
import { Button } from '@/presenter/components/ui/button';

type TodoListItemProps = {
  readonly todo: Todo;
  readonly onRemove: (id: string) => void;
};

export function TodoListItem({ todo, onRemove }: TodoListItemProps) {
  const handleRemove = useCallback(() => {
    if (!onRemove) {
      return;
    }

    onRemove(todo.id);
  }, [onRemove, todo.id]);

  return (
    <li className='hover:bg-accent/50 flex items-center justify-between px-3 py-2 text-sm transition-colors'>
      <span className='truncate'>{todo.title}</span>
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
