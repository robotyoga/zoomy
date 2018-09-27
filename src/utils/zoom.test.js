import {
  getTranslation,
} from './zoom';

describe('the zoom utils', () => {
  it('gets the correct translation for a given scale delta and position', () => {
    expect(getTranslation(0.1, 0).toBe(0));
    expect(getTranslation(1, 0).toBe(0));
    expect(getTranslation(10, 0).toBe(0));

    expect(getTranslation(1, 1).toBe(-0.5));
    expect(getTranslation(1, -1).toBe(0.5));
  });
});
