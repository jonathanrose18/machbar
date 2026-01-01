import type { Id, IsoDate } from '@/domain/model/types';

export type Todo = {
  readonly id: Id;
  readonly added_at: IsoDate;
  readonly done: boolean;
  readonly title: string;
};
