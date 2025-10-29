import type { Todo } from '@/domain/model/todo';
import type { TodoRepository } from '@/application/ports/todo-repository';
import type { UseCaseWithParams } from '@/domain/model/types';

type Dependencies = {
  readonly todoRepository: TodoRepository;
};

export const makeAddTodoUseCase = ({ todoRepository }: Dependencies): UseCaseWithParams<Todo, Omit<Todo, 'id'>> => ({
  execute: ({ title }) => todoRepository.add(title),
});
