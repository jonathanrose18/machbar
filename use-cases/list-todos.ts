import type { TodoRepository } from "@/domain/todo";

export class ListTodos {
  constructor(private repo: TodoRepository) {}
  execute() {
    return this.repo.list();
  }
}
