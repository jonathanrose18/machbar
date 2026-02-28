export const normalizeTodoId = (id: string): string => {
  const trimmedId = id.trim();
  if (!trimmedId) {
    throw new Error('Id cannot be empty');
  }
  return trimmedId;
};
