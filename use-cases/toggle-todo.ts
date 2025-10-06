import type { TodoRepository } from "@/domain/todo";

export class ToggleTodo {
  constructor(private repo: TodoRepository) {}
  execute(id: string) {
    return this.repo.toggle(id);
  }
}
