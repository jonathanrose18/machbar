import { normalizeTodoTitle } from '@/domain/model/title';
import type { Todo } from '@/domain/model/todo';
import type { TodoRepository } from '@/application/ports/todo-repository';
import type { UseCaseWithParams } from '@/application/types/use-case';

type Dependencies = {
  readonly todoRepository: TodoRepository;
};

export const makeAddTodoUseCase = ({ todoRepository }: Dependencies): UseCaseWithParams<Todo, Pick<Todo, 'title'>> => ({
  execute: async ({ title }) => todoRepository.add(normalizeTodoTitle(title)),
});
