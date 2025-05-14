import { erf } from "mathjs";

export function sampleNormal(mean: number, stdDev: number): number {
  let u1 = 0;
  let u2 = 0;

  // Avoid log(0)
  while (u1 === 0) u1 = Math.random();
  while (u2 === 0) u2 = Math.random();

  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return z0 * stdDev + mean;
}

export function boundedSample(mean: number, std: number): number {
  const value = sampleNormal(mean, std);
  return Math.max(0, Math.min(1, value)); // clamp to [0, 1]
}

export function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

export function normalCDF(x: number, mean: number, std: number): number {
  const z = (x - mean) / std;
  return 0.5 * (1 + erf(z / Math.SQRT2));
}
