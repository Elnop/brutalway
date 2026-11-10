import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { oklab, oklabDistance } from '#src/oklab.ts';
import type { Oklab } from '#src/ColorTypes.ts';

function rounded(color: Oklab | undefined) {
  return color === undefined
    ? undefined
    : {
        l: Number(color.l.toFixed(3)),
        a: Number(color.a.toFixed(3)),
        b: Number(color.b.toFixed(3)),
      };
}

describe('oklab', () => {
  it('converts white and black to the ends of the lightness axis', () => {
    assert.deepEqual(rounded(oklab('#ffffff')), { l: 1, a: 0, b: 0 });
    assert.deepEqual(rounded(oklab('#000')), { l: 0, a: 0, b: 0 });
  });

  it('reads the same red from a short hex, a long hex, rgb() with numbers or percents and rgba()', () => {
    const red = rounded(oklab('#ff0000'));
    assert.deepEqual(red, { l: 0.628, a: 0.225, b: 0.126 });
    assert.deepEqual(rounded(oklab('#F00')), red);
    assert.deepEqual(rounded(oklab('rgb(255 0 0)')), red);
    assert.deepEqual(rounded(oklab('rgb(100%, 0%, 0%)')), red);
    assert.deepEqual(rounded(oklab('rgba(255, 0, 0, 0.5)')), red);
  });

  it('reads oklch() as polar Oklab and the underscores of a Tailwind arbitrary value as spaces', () => {
    assert.deepEqual(rounded(oklab('oklch(0.6 0.2 90)')), { l: 0.6, a: 0, b: 0.2 });
    assert.deepEqual(rounded(oklab('rgb(0_0_255)')), rounded(oklab('#0000ff')));
  });

  it('gives undefined for a value it cannot convert', () => {
    assert.equal(oklab('red'), undefined);
    assert.equal(oklab('hsl(0 100% 50%)'), undefined);
    assert.equal(oklab('rgb(1 2)'), undefined);
    assert.equal(oklab('var(--color-ink)'), undefined);
  });
});

describe('oklabDistance', () => {
  it('is zero for the same color and grows with the difference', () => {
    const white = { l: 1, a: 0, b: 0 };
    assert.equal(oklabDistance(white, white), 0);
    assert.equal(oklabDistance(white, { l: 0, a: 0, b: 0 }), 1);
    assert.equal(oklabDistance({ l: 0, a: 0.3, b: 0 }, { l: 0, a: 0, b: 0.4 }), 0.5);
  });
});
