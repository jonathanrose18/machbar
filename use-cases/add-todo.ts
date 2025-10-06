import type { TodoRepository } from "@/domain/todo";

export class AddTodo {
  constructor(private repo: TodoRepository) {}
  execute(title: string) {
    return this.repo.add(title);
  }
}
