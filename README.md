# Machbar

Todo App with Next.js + TypeScript, built following a pragmatic Clean Architecture approach.

- Demo: [machbar.vercel.app](https://machbar.vercel.app)

## Stack

- Next.js 16
- React 19
- TypeScript
- Awilix (DI)
- Vitest + Testing Library
- Biome

## Architecture (brief)

```text
src/
  domain/                    # Core model (currently mostly types)
  application/               # Ports + Use Cases
  adapters/                  # Infrastructure (localStorage)
  presenter/                 # React UI + ViewModel Hook
  di/                        # Composition Root (Awilix)
  app/                       # Next.js App Router
```

Dependency direction:

- `domain` knows nothing else.
- `application` depends on `domain` and Ports.
- `adapters` implements Ports from `application`.
- `presenter` consumes Use Cases via the Container.
- `di` wires up the implementations.

## Actual Data Flow (Add Todo)

1. UI calls `addTodo(title)` in the ViewModel.
2. ViewModel calls `addTodoUseCase.execute({ title })`.
3. Use Case validates/trims the title.
4. Repository adapter creates the Todo object and persists it in `localStorage`.
5. Use Case returns, ViewModel updates the UI state.

## Important Files

- Domain model: `src/domain/model/todo.ts`
- Port: `src/application/ports/todo-repository.ts`
- Use Cases: `src/application/use-case/*.ts`
- Adapter: `src/adapters/persistence/localstorage/todo-repository.ts`
- ViewModel: `src/presenter/todos/useTodoListViewModel.ts`
- DI: `src/di/container.ts`

## Run locally

Prerequisite: Node.js `>=20.9.0`

```bash
npm install
npm run dev
```

Additionally:

```bash
npm test
npm run lint
```
