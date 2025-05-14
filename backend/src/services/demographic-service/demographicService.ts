import { BasicVoter, DerivedVoter } from "./types";

const coeffs: Record<
  string,
  {
    mean: Partial<Record<keyof BasicVoter | "intercept", number>>;
    std: Partial<Record<"intercept", number>>;
  }
> = {
  socialism: {
    mean: {
      intercept: 60,
      age: -0.3,
      incomePercentile: 0.25,
      politicalAwareness: 10,
    },
    std: {
      intercept: 12,
    },
  },
  liberalism: {
    mean: {
      intercept: 40,
      age: 0.2,
      incomePercentile: 0.2,
      politicalAwareness: 10,
    },
    std: {
      intercept: 10,
    },
  },
  incumbencyBias: {
    mean: {
      intercept: 20,
      age: 0.1,
      incomePercentile: -0.2,
      politicalAwareness: 5,
    },
    std: {
      intercept: 15,
    },
  },
};

function sampleNormal(mean: number, std: number): number {
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + std * z;
}

function computeMean(voter: BasicVoter, target: keyof typeof coeffs): number {
  const c = coeffs[target].mean;
  return (
    (c.intercept ?? 0) +
    (c.age ?? 0) * voter.age +
    (c.incomePercentile ?? 0) * voter.incomePercentile +
    (c.politicalAwareness ?? 0) * voter.politicalAwareness
  );
}

function normalize(value: number, min: number = 0, max: number = 100): number {
  return Math.max(min, Math.min(max, value)) / max;
}

export function generateVoter(voter: BasicVoter): DerivedVoter {
  const socialismMean = computeMean(voter, "socialism");
  const liberalismMean = computeMean(voter, "liberalism");
  const incumbencyMean = computeMean(voter, "incumbencyBias");

  const socialism = normalize(
    sampleNormal(socialismMean, coeffs.socialism.std.intercept ?? 10)
  );
  const liberalism = normalize(
    sampleNormal(liberalismMean, coeffs.liberalism.std.intercept ?? 10)
  );
  const incumbencyBias = normalize(
    sampleNormal(incumbencyMean, coeffs.incumbencyBias.std.intercept ?? 10)
  );

  return {
    ...voter,
    socialism,
    capitalism: 1 - socialism, // Capitalism is complementary to socialism
    liberalism,
    conservatism: 1 - liberalism, // Conservatism is complementary to liberalism
    incumbencyBias,
  };
}
