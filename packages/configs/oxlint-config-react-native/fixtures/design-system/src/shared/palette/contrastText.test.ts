import { contrastText } from '@/shared/palette/contrastText.ts';

describe('contrastText', () => {
  it('picks black on a light color', () => {
    expect(contrastText(true)).toBe('#000000');
  });
});
