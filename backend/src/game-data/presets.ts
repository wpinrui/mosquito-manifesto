import {
  BasicDemographic,
  PillarStats,
} from "../services/demographic-service/types";

export const sampleSingaporeDistribution: BasicDemographic = {
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

export const ideologyDistributions: Record<string, PillarStats> = {
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
