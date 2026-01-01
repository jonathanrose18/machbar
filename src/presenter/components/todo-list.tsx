"use client";

import { PlusIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { AddTodoForm } from "@/presenter/components/add-todo-form";
import { Button } from "@/presenter/components/ui/button";
import { Separator } from "@/presenter/components/ui/separator";
import { TodoListItem } from "@/presenter/components/todo-list-item";
import { TodoListSkeleton } from "@/presenter/components/todo-list-skeleton";
import { buildContainer } from "@/di/container";
import { useTodoListViewModel } from "@/presenter/todos/useTodoListViewModel";

export function TodoList() {
  const di = useMemo(buildContainer, []);
  const vm = useTodoListViewModel({
    addTodoUseCase: di.resolve("addTodoUseCase"),
    getTodosUseCase: di.resolve("getTodosUseCase"),
    removeTodoUseCase: di.resolve("removeTodoUseCase"),
    toggleTodoUseCase: di.resolve("toggleTodoUseCase"),
  });

  const { todos, loading, error, addTodo, removeTodo, toggleTodo } = vm;

  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = (title: string) => {
    addTodo(title);
    setIsAdding(false);
  };

  return (
    <section className="space-y-4">
      {error && (
        <div className="border-destructive/50 bg-destructive/10 text-destructive rounded-md border px-3 py-2 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <TodoListSkeleton />
      ) : todos.length === 0 ? null : (
        <ul className="grid gap-4">
          {todos.map((todo) => (
            <TodoListItem
              key={todo.id}
              todo={todo}
              onRemove={removeTodo}
              onToggle={toggleTodo}
            />
          ))}
        </ul>
      )}

      {isAdding ? (
        <>
          <Separator />
          <div className="mt-4">
            <AddTodoForm onAdd={handleAdd} />
          </div>
        </>
      ) : (
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground pl-0 mt-2"
          onClick={() => setIsAdding(true)}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Add todo
        </Button>
      )}
    </section>
  );
}
