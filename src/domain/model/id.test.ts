import { describe, expect, it } from 'vitest';

import { normalizeTodoId } from './id';

describe('normalizeTodoId', () => {
  it('should trim surrounding whitespace', () => {
    expect(normalizeTodoId('  abc-123  ')).toBe('abc-123');
  });

  it('should throw for empty or whitespace-only id', () => {
    expect(() => normalizeTodoId('')).toThrow('Id cannot be empty');
    expect(() => normalizeTodoId('   ')).toThrow('Id cannot be empty');
  });
});
