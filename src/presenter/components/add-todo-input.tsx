import { useCallback, useState, type ChangeEventHandler, type FormEvent } from 'react';

import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/presenter/components/ui/input-group';

export function AddTodoInputGroup({ onAdd }: { onAdd: (title: string) => void }) {
  const [title, setTitle] = useState('');

  const submit = useCallback(() => {
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setTitle('');
  }, [onAdd, title]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit();
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = e => {
    setTitle(e.target.value);
  };

  const isDisabled = title.trim().length === 0;

  return (
    <form onSubmit={handleSubmit} className='space-y-2'>
      <InputGroup>
        <InputGroupInput
          placeholder='Neuen Task hinzufügen…'
          aria-label='Neuen Task hinzufügen'
          value={title}
          onChange={handleChange}
        />
        <InputGroupAddon align='inline-end'>
          <InputGroupButton type='submit' disabled={isDisabled} variant='secondary'>
            Hinzufügen
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}
