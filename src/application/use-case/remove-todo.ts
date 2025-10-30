import type { TodoRepository } from '@/application/ports/todo-repository';
import type { UseCaseWithParams } from '@/domain/model/types';

type Dependencies = {
  readonly todoRepository: TodoRepository;
};

export const makeRemoveTodoUseCase = ({ todoRepository }: Dependencies): UseCaseWithParams<void, { id: string }> => ({
  execute: ({ id }) => todoRepository.remove(id),
});
