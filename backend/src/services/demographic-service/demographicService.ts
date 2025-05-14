import { sampleSingaporeDistribution } from "../../game-data/presets";
import { normalCDF, boundedSample, sampleNormal } from "../../utils/math";
import {
  BasicDemographic,
  BasicVoter,
  DerivedVoter,
  Direction,
  PillarStats,
} from "./types";

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
  ideologyDistributions: Record<string, PillarStats>,
  pillar: keyof typeof ideologyDistributions
): number {
  const { mean, std, directions } = ideologyDistributions[pillar];

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
  const age = sampleNormal(
    sampleSingaporeDistribution.ageDistribution.mean,
    sampleSingaporeDistribution.ageDistribution.std
  );
  const income = sampleNormal(
    sampleSingaporeDistribution.incomeDistribution.mean,
    sampleSingaporeDistribution.incomeDistribution.std
  );
  const politicalAwareness = sampleNormal(
    sampleSingaporeDistribution.politicalAwarenessDistribution.mean,
    sampleSingaporeDistribution.politicalAwarenessDistribution.std
  );
  return {
    age,
    income,
    politicalAwareness,
  };
}

export function generateDerivedVoter(
  voter: BasicVoter,
  basicDistribution: BasicDemographic,
  pillarStats: Record<string, PillarStats>
): DerivedVoter {
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
    pillarStats,
    "socialism"
  );
  const liberalismMean = computePercentileMean(
    agePercentile,
    incomePercentile,
    politicalAwarenessPercentile,
    pillarStats,
    "liberalism"
  );
  const incumbencyMean = computePercentileMean(
    agePercentile,
    incomePercentile,
    politicalAwarenessPercentile,
    pillarStats,
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
