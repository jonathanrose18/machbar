import type { Todo } from '@/domain/model/todo';
import type { TodoRepository } from '@/application/ports/todo-repository';
import type { UseCaseWithParams } from '@/domain/model/types';

type Dependencies = {
  readonly todoRepository: TodoRepository;
};

export const makeAddTodoUseCase = ({ todoRepository }: Dependencies): UseCaseWithParams<Todo, Pick<Todo, 'title'>> => ({
  execute: async ({ title }) => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      throw new Error('Title cannot be empty');
    }
    return todoRepository.add(trimmedTitle);
  },
});
