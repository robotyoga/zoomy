import * as math from './math';

describe('the math utils', () => {
  it('clamps values correctly', () => {
    expect(math.clamp(0.5, -1, 1)).toEqual(0.5);
    expect(math.clamp(0.5, 1, 2)).toEqual(1);
    expect(math.clamp('0.5', 0, 1)).toEqual(NaN);
    expect(math.clamp('1', 0, 2)).toEqual(NaN);
    expect(math.clamp(1, 0, 2)).toEqual(1);
    expect(math.clamp(Infinity, -Infinity, Infinity)).toEqual(Infinity);
    expect(math.clamp(Infinity, Infinity, -Infinity)).toEqual(-Infinity);
    expect(math.clamp(0.00000000000000001, 0, 1)).toEqual(0.00000000000000001);

  });
});
