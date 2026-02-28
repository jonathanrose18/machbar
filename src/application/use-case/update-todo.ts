import { normalizeTodoTitle } from '@/domain/model/title';
import type { TodoRepository } from '@/application/ports/todo-repository';
import type { UseCaseWithParams } from '@/application/types/use-case';

type Dependencies = {
  readonly todoRepository: TodoRepository;
};

export const makeUpdateTodoUseCase = ({
  todoRepository,
}: Dependencies): UseCaseWithParams<void, { id: string; title: string }> => ({
  execute: async ({ id, title }) => {
    const trimmedId = id.trim();
    if (!trimmedId) {
      throw new Error('Id cannot be empty');
    }
    return todoRepository.update(trimmedId, normalizeTodoTitle(title));
  },
});
