type TodoListHeaderProps = {
  readonly count: number;
};

export function TodoListHeader({ count }: TodoListHeaderProps) {
  return (
    <header className='flex items-end justify-between'>
      <div>
        <h2 className='text-xl font-semibold tracking-tight'>My Tasks</h2>
        <p className='text-muted-foreground text-sm'>Manage your todos quickly and easily</p>
      </div>
      {count > 0 && (
        <span className='text-muted-foreground text-xs rounded-md border px-2 py-0.5' aria-live='polite'>
          {count} open
        </span>
      )}
    </header>
  );
}
