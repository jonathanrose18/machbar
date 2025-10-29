import type { Id } from '@/domain/model/types';

export type Todo = {
  readonly id: Id;
  readonly done: boolean;
  readonly title: string;
};
