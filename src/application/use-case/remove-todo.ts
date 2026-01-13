import type { TodoRepository } from '@/application/ports/todo-repository';
import type { UseCaseWithParams } from '@/domain/model/types';

type Dependencies = {
  readonly todoRepository: TodoRepository;
};

export const makeRemoveTodoUseCase = ({ todoRepository }: Dependencies): UseCaseWithParams<void, { id: string }> => ({
  execute: async ({ id }) => {
    const trimmedId = id.trim();
    if (!trimmedId) {
      throw new Error('Id cannot be empty');
    }
    return todoRepository.remove(trimmedId);
  },
});
