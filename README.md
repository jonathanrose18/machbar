# Machbar

A small Todo application built with Next.js and TypeScript, structured using Clean Architecture to keep domain logic independent from UI and infrastructure.

- Demo: [machbar.vercel.app](https://machbar.vercel.app)

## Why Clean Architecture?

Clean Architecture helps you:
- Keep business rules independent from frameworks and IO concerns
- Test domain and application logic in isolation
- Replace frameworks, UI, or storage without changing core logic
- Enforce one-way dependencies from outer layers inward

## Layered Architecture (inside-out)

1. Domain (Enterprise Business Rules)
   - Pure business entities and value objects
   - No framework, no IO

2. Application (Application Business Rules)
   - Use cases orchestrating domain logic
   - Defines ports (interfaces) for required services
   - No knowledge of UI or persistence details

3. Adapters (Interface Adapters)
   - Implement ports for specific technologies (e.g., LocalStorage)
   - Translate between external models and domain/application models

4. Presenter/UI (Frameworks & Drivers)
   - React/Next.js components
   - Consumes view models produced by the application layer
   - Contains only presentation concerns

5. DI/Composition Root
   - Wires implementations to ports
   - Provides an entry point for the UI to resolve use cases

### Dependency Injection (DI): Wiring in the Container vs. Tight Coupling

- Goal: Use cases depend on ports (abstractions), not on concrete technologies.
- How: The DI container centrally wires which implementation fulfills which port.
- Benefits: Swappable infrastructure, better testability, adherence to Dependency Inversion.

Your container wiring:

```ts
import { createContainer, asFunction, Lifetime } from 'awilix';

import { makeAddTodoUseCase } from '@/application/use-case/add-todo';
import { makeGetTodosUseCase } from '@/application/use-case/get-todos';
import { makeLocalStorageTodoRepository } from '@/adapters/persistence/localstorage/todo-repository';

export const buildContainer = () => {
  const container = createContainer({ injectionMode: 'PROXY' });
  container.register({
    addTodoUseCase: asFunction(makeAddTodoUseCase, { lifetime: Lifetime.SCOPED }),
    getTodosUseCase: asFunction(makeGetTodosUseCase, { lifetime: Lifetime.SCOPED }),
    todoRepository: asFunction(makeLocalStorageTodoRepository, { lifetime: Lifetime.SCOPED }),
  });
  return container;
};
```

Anti-pattern (tight coupling inside the use case — avoid):

```ts
// Tight coupling: the use case creates the concrete implementation
import { makeLocalStorageTodoRepository } from '@/adapters/persistence/localstorage/todo-repository';

export const makeAddTodoUseCase = () => {
  const repo = makeLocalStorageTodoRepository(); // technology decision inside the use case
  return {
    execute: ({ title }: { title: string }) => repo.add(title),
  };
};
```

#### Awilix: `injectionMode` and `lifetime`

- injectionMode: `'PROXY'`
  - Awilix uses proxies to lazily resolve dependencies upon property access.
  - Advantages: less boilerplate, tolerant to resolution order, convenient for factory-style wiring.

- lifetime: `Lifetime.SCOPED`
  - One instance per scope (e.g., per container/request).
  - In this app: a fresh instance for each built container, keeping use cases and adapters consistent within that scope.
  - Alternatives:
    - `Lifetime.SINGLETON`: one instance for the container’s lifetime.
    - `Lifetime.TRANSIENT`: a new instance every time the dependency is resolved.

## Folder Structure

```text
src/
  domain/                 # Entities and domain types
    model/
      todo.ts
      types/
        index.ts

  application/            # Use cases and ports
    ports/
      todo-repository.ts  # Port (interface) for persistence
    use-case/
      add-todo.ts         # Use case
      get-todos.ts        # Use case

  adapters/               # Technology-specific implementations
    persistence/
      localstorage/
        todo-repository.ts

  presenter/              # UI components and view models
    components/
      add-todo-input.tsx
      todo-list.tsx
      ui/
        button.tsx
        input-group.tsx
        input.tsx
        textarea.tsx
    lib/
      utils.ts
    todos/
      useTodoListViewModel.ts

  di/
    container.ts          # Composition root (DI wiring)

app/ (Next.js)            # Pages, layout, and global styles
```

## Dependency Rules

- Outer layers depend on inner layers, never the reverse
- Domain: depends on nothing
- Application: depends only on Domain
- Adapters: depend on Application (ports) and Domain
- Presenter/UI: depends on Application (use cases/view models) and DI
- DI: may reference all layers to compose the graph; nothing depends on DI

## Data Flow (example: Add Todo)

1. UI triggers the `addTodo` action from a view model
2. View model executes `addTodoUseCase` use case (Application)
3. Use case constructs `Todo` (Domain)
4. Use case persists via `TodoRepository` port (Application)
5. LocalStorage repository (Adapter) implements the port and writes to LocalStorage
6. UI updates based on the updated list from `getTodosUseCase` use case

This enforces that the use case knows only the port, not the storage technology.

## Key Files

- Domain: `src/domain/model/todo.ts`
- Port: `src/application/ports/todo-repository.ts`
- Use cases: `src/application/use-case/add-todo.ts`, `src/application/use-case/get-todos.ts`
- Adapter: `src/adapters/persistence/localstorage/todo-repository.ts`
- View model: `src/presenter/todos/useTodoListViewModel.ts`
- DI container: `src/di/container.ts`

## Getting Started

Prerequisites: Node.js 18+

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

## References

- Heavily inspired by Robert C. Martin’s “The Clean Architecture” ([blog.cleancoder.com](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)).

---

- Live Demo: [machbar.vercel.app](https://machbar.vercel.app)
