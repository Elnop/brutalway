import { describe, expect, it } from 'vitest';
import { toRoomDraft } from '@/features/editor/shared/toRoomDraft.ts';

describe('toRoomDraft', () => {
  it('trims the name and parses the dimensions', () => {
    expect(toRoomDraft({ name: '  Office ', width: '2.5', length: '3' })).toStrictEqual({ name: 'Office', width: 2.5, length: 3 });
  });

  it('rejects an empty name or a dimension that is not positive', () => {
    expect(toRoomDraft({ name: ' ', width: '2', length: '3' })).toBeNull();
    expect(toRoomDraft({ name: 'Office', width: '0', length: '3' })).toBeNull();
    expect(toRoomDraft({ name: 'Office', width: '2', length: 'abc' })).toBeNull();
  });
});
