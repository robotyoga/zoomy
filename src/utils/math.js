export function clamp(value, min = 0, max = 1) {
  if (typeof value !== 'number') return NaN
  return Math.min(
    max,
    Math.max(
      min,
      value,
    ),
  );
}
