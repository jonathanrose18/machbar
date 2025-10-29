import { createContainer, asFunction, Lifetime } from 'awilix';

import { makeLocalStorageTodoRepository } from '@/adapters/persistence/localstorage/todo-repository';
import { makeGetTodosUseCase } from '@/application/use-case/get-todos';

export const buildContainer = () => {
  const container = createContainer({ injectionMode: 'PROXY' });
  container.register({
    getTodosUseCase: asFunction(makeGetTodosUseCase, { lifetime: Lifetime.SCOPED }),
    todoRepository: asFunction(makeLocalStorageTodoRepository, { lifetime: Lifetime.SCOPED }),
  });
  return container;
};
