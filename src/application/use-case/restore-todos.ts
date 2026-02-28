import type { TodoRepository } from '@/application/ports/todo-repository';
import type { Todo } from '@/domain/model/todo';
import type { UseCaseWithParams } from '@/application/types/use-case';

type Dependencies = {
  readonly todoRepository: TodoRepository;
};

export const makeRestoreTodosUseCase = ({
  todoRepository,
}: Dependencies): UseCaseWithParams<void, { todos: Todo[] }> => ({
  execute: async ({ todos }) => {
    if (!todos.length) {
      return;
    }
    return todoRepository.restoreMany(todos);
  },
});
