import { afterEach, describe, expect, it, vi } from 'vitest';

import { nowIso } from './time';

describe('nowIso', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return the current timestamp in ISO format', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-28T12:34:56.789Z'));

    expect(nowIso()).toBe('2026-02-28T12:34:56.789Z');
  });
});
