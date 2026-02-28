import { describe, expect, it } from 'vitest';

import { normalizeTodoTitle } from './title';

describe('normalizeTodoTitle', () => {
  it('should trim surrounding whitespace', () => {
    expect(normalizeTodoTitle('  Learn architecture  ')).toBe('Learn architecture');
  });

  it('should throw for empty or whitespace-only title', () => {
    expect(() => normalizeTodoTitle('')).toThrow('Title cannot be empty');
    expect(() => normalizeTodoTitle('   ')).toThrow('Title cannot be empty');
  });
});
