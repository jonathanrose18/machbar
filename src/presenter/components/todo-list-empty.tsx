export function TodoListEmpty() {
  return (
    <div className='text-muted-foreground rounded-md border px-4 py-8 text-center text-sm' aria-live='polite'>
      No tasks available. Add a new one above.
    </div>
  );
}
