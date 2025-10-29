import type { Todo } from '@/domain/model/todo';
import type { TodoRepository } from '@/application/ports/todo-repository';
import type { UseCase } from '@/domain/model/types';

type Dependencies = {
  readonly todoRepository: TodoRepository;
};

export const makeGetTodosUseCase = ({ todoRepository }: Dependencies): UseCase<Todo[]> => ({
  execute: () => todoRepository.get(),
});
