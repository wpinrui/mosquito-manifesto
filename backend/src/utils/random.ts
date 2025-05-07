export function sampleFromDistribution<T extends string>(
  dist: Record<T, number>
): T {
  const entries = Object.entries(dist) as [T, number][];
  const rand = Math.random();
  let acc = 0;
  for (const [key, weight] of entries) {
    acc += weight;
    if (rand <= acc) return key;
  }
  return entries[entries.length - 1][0];
}

export function sampleGaussian(
  mean: number,
  std: number,
  min = 0,
  max = Infinity
): number {
  let value: number;
  do {
    const u = 1 - Math.random();
    const v = 1 - Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    value = mean + std * z;
  } while (value < min || value > max);
  return value;
}
