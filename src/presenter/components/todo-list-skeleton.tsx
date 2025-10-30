import { Skeleton } from '@/presenter/components/ui/skeleton';

export function TodoListSkeleton() {
  return (
    <div className='rounded-md border p-4' aria-live='polite' aria-busy='true'>
      <Skeleton className='h-4 w-1/3' />
      <Skeleton className='mt-3 h-3 w-full' />
      <Skeleton className='mt-2 h-3 w-11/12' />
    </div>
  );
}
