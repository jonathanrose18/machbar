import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { Todo } from "@/domain/model/todo";

import { TodoList } from "./todo-list";

type AddTodoUseCase = { execute: (params: { title: string }) => Promise<Todo> };
type GetTodosUseCase = { execute: () => Promise<Todo[]> };
type RemoveTodoUseCase = { execute: (params: { id: string }) => Promise<void> };
type ToggleTodoUseCase = { execute: (params: { id: string }) => Promise<void> };

let addTodoUseCase: AddTodoUseCase;
let getTodosUseCase: GetTodosUseCase;
let removeTodoUseCase: RemoveTodoUseCase;
let toggleTodoUseCase: ToggleTodoUseCase;

vi.mock("@/di/container", () => ({
  buildContainer: () => ({
    resolve: (name: string) => {
      if (name === "addTodoUseCase") return addTodoUseCase;
      if (name === "getTodosUseCase") return getTodosUseCase;
      if (name === "removeTodoUseCase") return removeTodoUseCase;
      if (name === "toggleTodoUseCase") return toggleTodoUseCase;
      throw new Error(`Unknown dependency: ${name}`);
    },
  }),
}));

const makeTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: "1",
  title: "Todo 1",
  done: false,
  added_at: "2026-02-01T00:00:00.000Z",
  ...overrides,
});

const deferred = <T,>() => {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

describe("TodoList integration", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    addTodoUseCase = {
      execute: vi.fn().mockResolvedValue(makeTodo({ id: "new" })),
    };
    getTodosUseCase = { execute: vi.fn().mockResolvedValue([]) };
    removeTodoUseCase = { execute: vi.fn().mockResolvedValue(undefined) };
    toggleTodoUseCase = { execute: vi.fn().mockResolvedValue(undefined) };
  });

  it("should show loading skeleton during initial fetch and then render todos", async () => {
    const fetchDeferred = deferred<Todo[]>();
    getTodosUseCase = { execute: vi.fn(() => fetchDeferred.promise) };

    const { container } = render(<TodoList />);

    expect(container.querySelector('[aria-busy="true"]')).not.toBeNull();

    await act(async () => {
      fetchDeferred.resolve([makeTodo({ id: "a", title: "Task A" })]);
      await fetchDeferred.promise;
    });

    expect(await screen.findByText("Task A")).toBeInTheDocument();
  });

  it("should optimistically add a todo and rollback with error when add fails", async () => {
    const addDeferred = deferred<Todo>();
    addTodoUseCase = { execute: vi.fn(() => addDeferred.promise) };
    render(<TodoList />);

    fireEvent.click(await screen.findByRole("button", { name: "Add todo" }));
    fireEvent.change(screen.getByLabelText("Add new task"), {
      target: { value: "  New Task  " },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByText("New Task")).toBeInTheDocument();
    expect(addTodoUseCase.execute).toHaveBeenCalledWith({ title: "New Task" });

    await act(async () => {
      addDeferred.reject(new Error("Add failed"));
      try {
        await addDeferred.promise;
      } catch {
        // expected rejection
      }
    });

    await waitFor(() => {
      expect(screen.queryByText("New Task")).not.toBeInTheDocument();
      expect(screen.getByText("Add failed")).toBeInTheDocument();
    });
  });

  it("should rollback optimistic toggle when toggle fails", async () => {
    const toggleDeferred = deferred<void>();
    getTodosUseCase = {
      execute: vi
        .fn()
        .mockResolvedValue([
          makeTodo({ id: "t-1", title: "Toggle me", done: false }),
        ]),
    };
    toggleTodoUseCase = { execute: vi.fn(() => toggleDeferred.promise) };

    render(<TodoList />);

    const checkbox = await screen.findByRole("checkbox");
    expect(checkbox).toHaveAttribute("aria-checked", "false");

    fireEvent.click(checkbox);
    expect(toggleTodoUseCase.execute).toHaveBeenCalledWith({ id: "t-1" });
    expect(checkbox).toHaveAttribute("aria-checked", "true");

    await act(async () => {
      toggleDeferred.reject(new Error("Toggle failed"));
      try {
        await toggleDeferred.promise;
      } catch {
        // expected rejection
      }
    });

    await waitFor(() => {
      expect(screen.getByRole("checkbox")).toHaveAttribute(
        "aria-checked",
        "false",
      );
      expect(screen.getByText("Toggle failed")).toBeInTheDocument();
    });
  });

  it("should show an error banner when initial fetch fails", async () => {
    getTodosUseCase = {
      execute: vi.fn().mockRejectedValue(new Error("Load failed")),
    };

    render(<TodoList />);

    expect(await screen.findByText("Load failed")).toBeInTheDocument();
  });

  it("should rollback optimistic remove when remove fails", async () => {
    const removeDeferred = deferred<void>();
    getTodosUseCase = {
      execute: vi
        .fn()
        .mockResolvedValue([
          makeTodo({ id: "r-1", title: "Delete me", done: false }),
        ]),
    };
    removeTodoUseCase = { execute: vi.fn(() => removeDeferred.promise) };

    render(<TodoList />);

    expect(await screen.findByText("Delete me")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Remove todo Delete me" }));
    expect(removeTodoUseCase.execute).toHaveBeenCalledWith({ id: "r-1" });

    await waitFor(() => {
      expect(screen.queryByText("Delete me")).not.toBeInTheDocument();
    });

    await act(async () => {
      removeDeferred.reject(new Error("Remove failed"));
      try {
        await removeDeferred.promise;
      } catch {
        // expected rejection
      }
    });

    await waitFor(() => {
      expect(screen.getByText("Delete me")).toBeInTheDocument();
      expect(screen.getByText("Remove failed")).toBeInTheDocument();
    });
  });
});
