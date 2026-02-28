import type { Todo } from '@/domain/model/todo';
import type { TodoRepository } from '@/application/ports/todo-repository';
import type { UseCase } from '@/application/types/use-case';

type Dependencies = {
  readonly todoRepository: TodoRepository;
};

export const makeGetTodosUseCase = ({ todoRepository }: Dependencies): UseCase<Todo[]> => ({
  execute: () => todoRepository.get(),
});
