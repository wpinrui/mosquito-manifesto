import { normalCDF, boundedSample } from "../../utils/math";
import { BasicDemographic, BasicVoter, DerivedVoter } from "./types";

type Direction = "asc" | "desc" | "flat";

type PillarStats = {
  mean: number;
  std: number;
  directions: {
    age: Direction;
    income: Direction;
    awareness: Direction;
  };
};

const basicDistribution: BasicDemographic = {
  ageDistribution: {
    mean: 46,
    std: 14,
  },
  incomeDistribution: {
    mean: 5000,
    std: 2000,
  },
  politicalAwarenessDistribution: {
    mean: 0.4,
    std: 0.3,
  },
};

const pillarStats: Record<string, PillarStats> = {
  socialism: {
    mean: 0.55,
    std: 0.15,
    directions: {
      age: "asc",
      income: "desc",
      awareness: "asc",
    },
  },
  liberalism: {
    mean: 0.45,
    std: 0.1,
    directions: {
      age: "desc",
      income: "flat",
      awareness: "asc",
    },
  },
  incumbencyBias: {
    mean: 0.35,
    std: 0.5,
    directions: {
      age: "asc",
      income: "asc",
      awareness: "flat",
    },
  },
};

function interpolate(
  value: number,
  mean: number,
  std: number,
  direction: Direction
): number {
  if (direction === "flat") return mean;

  const slope = direction === "asc" ? 1 : -1;

  if (value <= 0.1) return mean - slope * std;
  if (value >= 0.9) return mean + slope * std;
  if (value === 0.5) return mean;

  if (value < 0.5) {
    const t = (value - 0.1) / (0.5 - 0.1);
    return (1 - t) * (mean - slope * std) + t * mean;
  } else {
    const t = (value - 0.5) / (0.9 - 0.5);
    return (1 - t) * mean + t * (mean + slope * std);
  }
}

function computePercentileMean(
  agePercentile: number,
  incomePercentile: number,
  awarenessPercentile: number,
  pillar: keyof typeof pillarStats
): number {
  const { mean, std, directions } = pillarStats[pillar];

  const ageComponent = interpolate(agePercentile, mean, std, directions.age);
  const incomeComponent = interpolate(
    incomePercentile,
    mean,
    std,
    directions.income
  );
  const awarenessComponent = interpolate(
    awarenessPercentile,
    mean,
    std,
    directions.awareness
  );

  return (ageComponent + incomeComponent + awarenessComponent) / 3;
}

export function generateVoter(): BasicVoter {
  const age = boundedSample(
    basicDistribution.ageDistribution.mean,
    basicDistribution.ageDistribution.std
  );
  const income = boundedSample(
    basicDistribution.incomeDistribution.mean,
    basicDistribution.incomeDistribution.std
  );
  const politicalAwareness = boundedSample(
    basicDistribution.politicalAwarenessDistribution.mean,
    basicDistribution.politicalAwarenessDistribution.std
  );
  return {
    age,
    income,
    politicalAwareness,
  };
}

export function generateDerivedVoter(voter: BasicVoter): DerivedVoter {
  const { age, income, politicalAwareness } = voter;

  const agePercentile = normalCDF(
    age,
    basicDistribution.ageDistribution.mean,
    basicDistribution.ageDistribution.std
  );
  const incomePercentile = normalCDF(
    income,
    basicDistribution.incomeDistribution.mean,
    basicDistribution.incomeDistribution.std
  );
  const politicalAwarenessPercentile = normalCDF(
    politicalAwareness,
    basicDistribution.politicalAwarenessDistribution.mean,
    basicDistribution.politicalAwarenessDistribution.std
  );

  const socialismMean = computePercentileMean(
    agePercentile,
    incomePercentile,
    politicalAwarenessPercentile,
    "socialism"
  );
  const liberalismMean = computePercentileMean(
    agePercentile,
    incomePercentile,
    politicalAwarenessPercentile,
    "liberalism"
  );
  const incumbencyMean = computePercentileMean(
    agePercentile,
    incomePercentile,
    politicalAwarenessPercentile,
    "incumbencyBias"
  );

  const socialism = boundedSample(socialismMean, pillarStats.socialism.std);
  const liberalism = boundedSample(liberalismMean, pillarStats.liberalism.std);
  const incumbencyBias = boundedSample(
    incumbencyMean,
    pillarStats.incumbencyBias.std
  );

  return {
    ...voter,
    socialism,
    capitalism: 1 - socialism,
    liberalism,
    conservatism: 1 - liberalism,
    incumbencyBias,
  };
}

// === DEMO OUTPUT ===
const presetAges = [0.1, 0.25, 0.5, 0.75, 0.9];
const presetIncomes = [0.1, 0.25, 0.5, 0.75, 0.9];
const presetAwareness = [0.1, 0.25, 0.5, 0.75, 0.9];

console.log("=== MEAN SCORES BY PERCENTILES ===");
for (const key in pillarStats) {
  console.log(`\n=== Target: ${key} ===`);

  for (const awareness of presetAwareness) {
    console.log(`\n--- Political Awareness: ${awareness} ---`);
    console.log("AgePct\tIncomePct\tMean");

    for (const age of presetAges) {
      for (const income of presetIncomes) {
        const mean = computePercentileMean(
          age,
          income,
          awareness,
          key as keyof typeof pillarStats
        );
        console.log(
          `${age.toFixed(2)}\t${income.toFixed(2)}\t\t${mean.toFixed(4)}`
        );
      }
    }
  }
}
console.log("\n=== END ===");

export const hello = "Hello from the demographic service!";
