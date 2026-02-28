import { createContainer, asFunction, Lifetime, type AwilixContainer, type Resolver } from 'awilix';

import { makeAddTodoUseCase } from '@/application/use-case/add-todo';
import { makeGetTodosUseCase } from '@/application/use-case/get-todos';
import { makeLocalStorageTodoRepository } from '@/adapters/persistence/localstorage/todo-repository';
import { makeRemoveTodoUseCase } from '@/application/use-case/remove-todo';
import { makeToggleTodoUseCase } from '@/application/use-case/toggle-todo';
import { makeUpdateTodoUseCase } from '@/application/use-case/update-todo';
import { makeCompleteAllTodosUseCase } from '@/application/use-case/complete-all-todos';
import { makeClearCompletedTodosUseCase } from '@/application/use-case/clear-completed-todos';
import { makeClearOpenTodosUseCase } from '@/application/use-case/clear-open-todos';
import { makeRestoreTodosUseCase } from '@/application/use-case/restore-todos';
import type { TodoListUseCases } from '@/presenter/todos/types';

type ContainerRegistrations = TodoListUseCases & {
  readonly todoRepository: ReturnType<typeof makeLocalStorageTodoRepository>;
};

type StrictRegistrationPair<T extends object> = {
  [K in keyof T]-?: Resolver<T[K]>;
};

export const buildContainer = (): AwilixContainer<ContainerRegistrations> => {
  const container = createContainer<ContainerRegistrations>({ injectionMode: 'PROXY' });
  const registrations: StrictRegistrationPair<ContainerRegistrations> = {
    addTodoUseCase: asFunction(makeAddTodoUseCase, { lifetime: Lifetime.SCOPED }),
    clearCompletedTodosUseCase: asFunction(makeClearCompletedTodosUseCase, { lifetime: Lifetime.SCOPED }),
    clearOpenTodosUseCase: asFunction(makeClearOpenTodosUseCase, { lifetime: Lifetime.SCOPED }),
    completeAllTodosUseCase: asFunction(makeCompleteAllTodosUseCase, { lifetime: Lifetime.SCOPED }),
    getTodosUseCase: asFunction(makeGetTodosUseCase, { lifetime: Lifetime.SCOPED }),
    removeTodoUseCase: asFunction(makeRemoveTodoUseCase, { lifetime: Lifetime.SCOPED }),
    restoreTodosUseCase: asFunction(makeRestoreTodosUseCase, { lifetime: Lifetime.SCOPED }),
    todoRepository: asFunction(makeLocalStorageTodoRepository, { lifetime: Lifetime.SCOPED }),
    toggleTodoUseCase: asFunction(makeToggleTodoUseCase, { lifetime: Lifetime.SCOPED }),
    updateTodoUseCase: asFunction(makeUpdateTodoUseCase, { lifetime: Lifetime.SCOPED }),
  };
  container.register(registrations);
  return container;
};

export const resolveTodoListUseCases = (container: AwilixContainer<ContainerRegistrations>): TodoListUseCases => ({
  addTodoUseCase: container.cradle.addTodoUseCase,
  clearCompletedTodosUseCase: container.cradle.clearCompletedTodosUseCase,
  clearOpenTodosUseCase: container.cradle.clearOpenTodosUseCase,
  completeAllTodosUseCase: container.cradle.completeAllTodosUseCase,
  getTodosUseCase: container.cradle.getTodosUseCase,
  removeTodoUseCase: container.cradle.removeTodoUseCase,
  restoreTodosUseCase: container.cradle.restoreTodosUseCase,
  toggleTodoUseCase: container.cradle.toggleTodoUseCase,
  updateTodoUseCase: container.cradle.updateTodoUseCase,
});
