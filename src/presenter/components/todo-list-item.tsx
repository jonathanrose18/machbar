import { useCallback, useMemo } from 'react';
import { enUS } from 'date-fns/locale';
import { format } from 'date-fns';
import { XIcon } from 'lucide-react';

import { Badge } from '@/presenter/components/ui/badge';
import { Button } from '@/presenter/components/ui/button';
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

  const handleRemove = useCallback(() => {
    onRemove(todo.id);
  }, [onRemove, todo.id]);

  return (
    <li>
      <HoverCard className='group flex items-center justify-between gap-2' hoverable={false}>
        <div className='flex gap-2 items-center'>
          <Checkbox className='cursor-pointer' id={checkboxId} checked={todo.done} onCheckedChange={handleToggle} />
          <label
            className={cn('text-sm cursor-pointer', todo.done && 'line-through text-muted-foreground')}
            htmlFor={checkboxId}
          >
            {todo.title}
          </label>
        </div>
        <div className='flex items-center gap-2'>
          {todo.added_at && (
            <Badge className={cn(todo.done && 'line-through')} variant='outline'>
              {formattedDate}
            </Badge>
          )}
          <Button
            aria-label={`Remove todo ${todo.title}`}
            className='opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100'
            onClick={handleRemove}
            size='icon-sm'
            variant='ghost'
          >
            <XIcon />
          </Button>
        </div>
      </HoverCard>
    </li>
  );
}
