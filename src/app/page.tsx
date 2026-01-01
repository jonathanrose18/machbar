import { Header } from '@/presenter/components/header';
import { TodoList } from '@/presenter/components/todo-list';

export default function Home() {
  return (
    <>
      <Header />
      <TodoList />
    </>
  );
}
