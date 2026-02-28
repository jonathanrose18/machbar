import type { UseCase, UseCaseWithParams } from '@/application/types/use-case';
import type { Todo } from '@/domain/model/todo';

export type TodoListViewModelDependencies = {
  readonly addTodoUseCase: UseCaseWithParams<Todo, { title: string }>;
  readonly autoRefresh?: boolean;
  readonly clearCompletedTodosUseCase: UseCase<void>;
  readonly clearOpenTodosUseCase: UseCase<void>;
  readonly completeAllTodosUseCase: UseCase<void>;
  readonly getTodosUseCase: UseCase<Todo[]>;
  readonly removeTodoUseCase: UseCaseWithParams<void, { id: string }>;
  readonly restoreTodosUseCase: UseCaseWithParams<void, { todos: Todo[] }>;
  readonly toggleTodoUseCase: UseCaseWithParams<void, { id: string }>;
  readonly updateTodoUseCase: UseCaseWithParams<void, { id: string; title: string }>;
};

export type TodoListUseCases = Omit<TodoListViewModelDependencies, 'autoRefresh'>;
