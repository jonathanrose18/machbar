import { useCallback, useMemo, useState, type FormEvent } from 'react';
import { enUS } from 'date-fns/locale';
import { format } from 'date-fns';
import { CheckIcon, PencilIcon, XIcon } from 'lucide-react';

import { Badge } from '@/presenter/components/ui/badge';
import { Button } from '@/presenter/components/ui/button';
import { Checkbox } from '@/presenter/components/ui/checkbox';
import { HoverCard } from '@/presenter/components/ui/hover-card';
import { Input } from '@/presenter/components/ui/input';
import { cn } from '@/presenter/lib/utils';
import type { Todo } from '@/domain/model/todo';

type TodoListItemProps = {
  readonly onEdit: (id: string, title: string) => void;
  readonly todo: Todo;
  readonly onRemove: (id: string) => void;
  readonly onToggle: (id: string) => void;
};

export function TodoListItem({ onEdit, todo, onRemove, onToggle }: TodoListItemProps) {
  const checkboxId = `todo-checkbox-${todo.id}`;
  const [draftTitle, setDraftTitle] = useState(todo.title);
  const [editing, setEditing] = useState(false);
  const formattedDate = useMemo(() => format(new Date(todo.added_at), 'PPP', { locale: enUS }), [todo.added_at]);

  const handleToggle = useCallback(() => {
    onToggle(todo.id);
  }, [onToggle, todo.id]);

  const handleRemove = useCallback(() => {
    onRemove(todo.id);
  }, [onRemove, todo.id]);

  const beginEdit = useCallback(() => {
    setDraftTitle(todo.title);
    setEditing(true);
  }, [todo.title]);

  const cancelEdit = useCallback(() => {
    setDraftTitle(todo.title);
    setEditing(false);
  }, [todo.title]);

  const submitEdit = useCallback(
    (event?: FormEvent) => {
      if (event) {
        event.preventDefault();
      }
      const trimmed = draftTitle.trim();
      if (!trimmed || trimmed === todo.title) {
        setEditing(false);
        setDraftTitle(todo.title);
        return;
      }
      onEdit(todo.id, trimmed);
      setEditing(false);
    },
    [draftTitle, onEdit, todo.id, todo.title]
  );

  return (
    <li>
      <HoverCard className='group flex items-center justify-between gap-2' hoverable={false}>
        <div className='flex gap-2 items-center'>
          <Checkbox className='cursor-pointer' id={checkboxId} checked={todo.done} onCheckedChange={handleToggle} />
          {editing ? (
            <form className='flex items-center gap-2' onSubmit={submitEdit}>
              <Input
                aria-label={`Edit todo ${todo.title}`}
                className='h-8'
                onChange={event => setDraftTitle(event.target.value)}
                value={draftTitle}
              />
              <Button aria-label={`Save todo ${todo.title}`} size='icon-sm' type='submit' variant='secondary'>
                <CheckIcon />
              </Button>
              <Button
                aria-label={`Cancel edit ${todo.title}`}
                onClick={cancelEdit}
                size='icon-sm'
                type='button'
                variant='ghost'
              >
                <XIcon />
              </Button>
            </form>
          ) : (
            <label
              className={cn('text-sm cursor-pointer', todo.done && 'line-through text-muted-foreground')}
              htmlFor={checkboxId}
            >
              {todo.title}
            </label>
          )}
        </div>
        <div className='flex items-center gap-2'>
          {todo.added_at && (
            <Badge className={cn(todo.done && 'line-through')} variant='outline'>
              {formattedDate}
            </Badge>
          )}
          {!editing && (
            <>
              <Button
                aria-label={`Edit todo ${todo.title}`}
                className='opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100'
                onClick={beginEdit}
                size='icon-sm'
                variant='ghost'
              >
                <PencilIcon />
              </Button>
              <Button
                aria-label={`Remove todo ${todo.title}`}
                className='opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100'
                onClick={handleRemove}
                size='icon-sm'
                variant='ghost'
              >
                <XIcon />
              </Button>
            </>
          )}
        </div>
      </HoverCard>
    </li>
  );
}
