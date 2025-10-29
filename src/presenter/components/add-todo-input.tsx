import { useState, type ChangeEventHandler } from 'react';

import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/presenter/components/ui/input-group';

export function AddTodoInputGroup({ onAdd }: { onAdd: (title: string) => void }) {
  const [title, setTitle] = useState('');

  const handleClick = () => {
    const newTitle = title;
    onAdd(newTitle);
    setTitle('');
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = e => {
    setTitle(e.target.value);
  };

  return (
    <InputGroup>
      <InputGroupInput placeholder='Type to add title...' value={title} onChange={handleChange} />
      <InputGroupAddon align='inline-end'>
        <InputGroupButton onClick={handleClick} variant='secondary'>
          Hinzufügen
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}
