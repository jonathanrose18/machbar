import { useCallback, useMemo } from 'react';
import { enUS } from 'date-fns/locale';
import { format } from 'date-fns';

import { Badge } from '@/presenter/components/ui/badge';
import { Checkbox } from '@/presenter/components/ui/checkbox';
import { HoverCard } from '@/presenter/components/ui/hover-card';
import { cn } from '@/presenter/lib/utils';
import type { Todo } from '@/domain/model/todo';

type TodoListItemProps = {
  readonly todo: Todo;
  readonly onRemove: (id: string) => void;
  readonly onToggle: (id: string) => void;
};

export function TodoListItem({ todo, onRemove, onToggle }: TodoListItemProps) {
  const checkboxId = `todo-checkbox-${todo.id}`;
  const formattedDate = useMemo(() => format(new Date(todo.added_at), 'PPP', { locale: enUS }), [todo.added_at]);

  const handleToggle = useCallback(() => {
    onToggle(todo.id);
  }, [onToggle, todo.id]);

  return (
    <li>
      <HoverCard className='flex items-center justify-between gap-2' hoverable={false}>
        <div className='flex gap-2 items-center'>
          <Checkbox className='cursor-pointer' id={checkboxId} checked={todo.done} onCheckedChange={handleToggle} />
          <label
            className={cn('text-sm cursor-pointer', todo.done && 'line-through text-muted-foreground')}
            htmlFor={checkboxId}
          >
            {todo.title}
          </label>
        </div>
        {todo.added_at && (
          <Badge className={cn(todo.done && 'line-through')} variant='outline'>
            {formattedDate}
          </Badge>
        )}
      </HoverCard>
    </li>
  );
}
