import type { Id, IsoDate } from '@/domain/model/types';

export type TodoPriority = 'low' | 'medium' | 'high';

export type Todo = {
  readonly id: Id;
  readonly added_at: IsoDate;
  readonly completed_at: IsoDate | null;
  readonly done: boolean;
  readonly due_date: IsoDate | null;
  readonly priority: TodoPriority | null;
  readonly title: string;
  readonly updated_at: IsoDate;
};
