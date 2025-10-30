import { createContainer, asFunction, Lifetime } from 'awilix';

import { makeAddTodoUseCase } from '@/application/use-case/add-todo';
import { makeGetTodosUseCase } from '@/application/use-case/get-todos';
import { makeLocalStorageTodoRepository } from '@/adapters/persistence/localstorage/todo-repository';
import { makeRemoveTodoUseCase } from '@/application/use-case/remove-todo';

export const buildContainer = () => {
  const container = createContainer({ injectionMode: 'PROXY' });
  container.register({
    addTodoUseCase: asFunction(makeAddTodoUseCase, { lifetime: Lifetime.SCOPED }),
    getTodosUseCase: asFunction(makeGetTodosUseCase, { lifetime: Lifetime.SCOPED }),
    removeTodoUseCase: asFunction(makeRemoveTodoUseCase, { lifetime: Lifetime.SCOPED }),
    todoRepository: asFunction(makeLocalStorageTodoRepository, { lifetime: Lifetime.SCOPED }),
  });
  return container;
};
