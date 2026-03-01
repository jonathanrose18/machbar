import { Header } from '@/presenter/components/header';
import { TodoListRoot } from '@/app/todo-list-root';

export default function Home() {
  return (
    <>
      <Header />
      <TodoListRoot />
    </>
  );
}
