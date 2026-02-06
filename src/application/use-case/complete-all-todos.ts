import type { TodoRepository } from '@/application/ports/todo-repository';
import type { UseCase } from '@/domain/model/types';

type Dependencies = {
  readonly todoRepository: TodoRepository;
};

export const makeCompleteAllTodosUseCase = ({ todoRepository }: Dependencies): UseCase<void> => ({
  execute: () => todoRepository.completeAll(),
});
