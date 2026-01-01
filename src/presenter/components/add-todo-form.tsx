import {
  useCallback,
  useState,
  type ChangeEventHandler,
  type FormEvent,
} from "react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function AddTodoForm({ onAdd }: { onAdd: (title: string) => void }) {
  const [title, setTitle] = useState("");

  const submit = useCallback(() => {
    const trimmed = title.trim();
    if (!trimmed) {
      return;
    }

    onAdd(trimmed);
    setTitle("");
  }, [title, onAdd]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit();
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setTitle(e.target.value);
  };

  const isDisabled = title.trim().length === 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Input
        aria-label="Add new task"
        autoFocus
        placeholder="Add new task..."
        value={title}
        onChange={handleChange}
      />
      <Button className="w-full" disabled={isDisabled} type="submit">
        Save
      </Button>
    </form>
  );
}
