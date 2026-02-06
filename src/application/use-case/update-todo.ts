import type { TodoRepository } from '@/application/ports/todo-repository';
import type { UseCaseWithParams } from '@/domain/model/types';

type Dependencies = {
  readonly todoRepository: TodoRepository;
};

export const makeUpdateTodoUseCase = ({
  todoRepository,
}: Dependencies): UseCaseWithParams<void, { id: string; title: string }> => ({
  execute: async ({ id, title }) => {
    const trimmedId = id.trim();
    const trimmedTitle = title.trim();
    if (!trimmedId) {
      throw new Error('Id cannot be empty');
    }
    if (!trimmedTitle) {
      throw new Error('Title cannot be empty');
    }
    return todoRepository.update(trimmedId, trimmedTitle);
  },
});
