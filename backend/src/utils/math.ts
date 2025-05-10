export function randBinomial(n: number, p: number): number {
  const mean = n * p;
  const stdDev = Math.sqrt(n * p * (1 - p));
  return Math.max(0, Math.min(n, Math.round(mean + stdDev * randNormal())));
}

function randNormal(): number {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random(); // avoid log(0)
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}
