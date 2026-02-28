import { normalizeTodoId } from '@/domain/model/id';
import type { TodoRepository } from '@/application/ports/todo-repository';
import type { UseCaseWithParams } from '@/application/types/use-case';

type Dependencies = {
  readonly todoRepository: TodoRepository;
};

export const makeRemoveTodoUseCase = ({ todoRepository }: Dependencies): UseCaseWithParams<void, { id: string }> => ({
  execute: async ({ id }) => todoRepository.remove(normalizeTodoId(id)),
});
