export const normalizeTodoTitle = (title: string): string => {
  const trimmedTitle = title.trim();
  if (!trimmedTitle) {
    throw new Error('Title cannot be empty');
  }
  return trimmedTitle;
};
