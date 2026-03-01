import { nowIso } from './time';
import type { Todo } from './todo';

type CreateTodoParams = {
  readonly addedAt?: Todo['added_at'];
  readonly completedAt?: Todo['completed_at'];
  readonly done?: Todo['done'];
  readonly dueDate?: Todo['due_date'];
  readonly id?: Todo['id'];
  readonly priority?: Todo['priority'];
  readonly title: Todo['title'];
  readonly updatedAt?: Todo['updated_at'];
};

export const generateTodoId = (): Todo['id'] => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const createTodo = ({
  addedAt,
  completedAt,
  done = false,
  dueDate = null,
  id = generateTodoId(),
  priority = null,
  title,
  updatedAt,
}: CreateTodoParams): Todo => {
  const resolvedAddedAt = addedAt ?? nowIso();
  const resolvedUpdatedAt = updatedAt ?? resolvedAddedAt;

  return {
    id,
    title,
    done,
    added_at: resolvedAddedAt,
    updated_at: resolvedUpdatedAt,
    completed_at: completedAt ?? (done ? resolvedUpdatedAt : null),
    priority,
    due_date: dueDate,
  };
};

export const createTodoFromPartial = (value: Partial<Todo>): Todo => {
  const addedAt = value.added_at;
  const updatedAt = value.updated_at ?? addedAt;
  const done = value.done ?? false;

  return createTodo({
    id: value.id,
    title: value.title ?? '',
    done,
    addedAt,
    updatedAt,
    completedAt: value.completed_at,
    priority: value.priority ?? null,
    dueDate: value.due_date ?? null,
  });
};
