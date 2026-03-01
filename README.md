# Machbar

A todo app built with Next.js + TypeScript, following a pragmatic Clean Architecture approach with optimistic UI updates.

- Demo: [machbar.vercel.app](https://machbar.vercel.app)

## Stack

- Next.js 16 (App Router + Turbopack)
- React 19
- TypeScript 5
- Awilix (dependency injection)
- Tailwind CSS 4 + Radix UI primitives
- Vitest + Testing Library
- Biome

## Architecture (brief)

```text
src/
  domain/                    # Core business model + domain rules
  application/               # Ports + Use Cases
  adapters/                  # Infrastructure (localStorage)
  presenter/                 # React UI + ViewModel Hook
  di/                        # DI registrations (Awilix)
  app/                       # Next.js App Router + app-level composition root
```

Dependency direction:

- `domain` knows nothing else.
- `application` depends on `domain` and Ports.
- `adapters` implement Ports from `application`.
- `presenter` consumes injected Use Cases (props/provider), no container knowledge.
- `app` builds the composition root and injects Use Cases into presenter.
- `di` wires up concrete implementations used by the composition root.

## Actual Data Flow (Add Todo)

1. UI calls `addTodo(title)` in the ViewModel.
2. ViewModel creates a temporary todo and updates local UI state optimistically.
3. ViewModel calls `addTodoUseCase.execute({ title })`.
4. Use Case normalizes/validates the title.
5. Repository adapter creates the canonical Todo object and persists it in `localStorage`.
6. ViewModel replaces the temporary todo with the persisted todo (or rolls back on error).

## Important Files

- Domain model: `src/domain/model/todo.ts`
- Domain rules: `src/domain/model/title.ts`
- Domain factory: `src/domain/model/todo-factory.ts`
- Port: `src/application/ports/todo-repository.ts`
- Use Cases: `src/application/use-case/*.ts`
- Adapter: `src/adapters/persistence/localstorage/todo-repository.ts`
- ViewModel: `src/presenter/todos/useTodoListViewModel.ts`
- App composition root: `src/app/todo-list-root.tsx`
- DI wiring: `src/di/container.ts`

## Run locally

Prerequisite: Node.js `>=20.9.0`

```bash
npm install
npm run dev
```

Quality checks:

```bash
npm test
npm run lint
npm run format
```
