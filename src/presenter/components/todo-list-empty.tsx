import { CheckCircle2 } from 'lucide-react';

import { Card } from '@/presenter/components/ui/card';

export function TodoListEmpty() {
  return (
    <Card className='p-12 md:p-16 border-2 border-dashed border-gray-300 bg-white'>
      <div className='flex flex-col items-center justify-center text-center'>
        <CheckCircle2 className='w-8 h-8 text-primary' />
        <h2 className='text-2xl font-bold text-gray-900 mb-2'>No tasks yet</h2>
        <p className='text-sm text-gray-500'>Use the input above to add one</p>
      </div>
    </Card>
  );
}
