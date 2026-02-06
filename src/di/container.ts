import { createContainer, asFunction, Lifetime } from 'awilix';

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

export const buildContainer = () => {
  const container = createContainer({ injectionMode: 'PROXY' });
  container.register({
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
  });
  return container;
};
