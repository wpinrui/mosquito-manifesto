import { DemographicDistribution } from "../services/demographic-service/types";

export const singaporeDemographic: DemographicDistribution = {
  ageMean: 45,
  ageStd: 15,
  genderDist: {
    male: 0.49,
    female: 0.5,
    nonbinary: 0.01,
  },
  incomeMean: 5000,
  incomeStd: 3000,
  ideologyDist: {
    "gov-fan": 0.18,
    "opp-fan": 0.1,
    "leans-gov": 0.22,
    "leans-opp": 0.22,
    "leans-incumbent": 0.1,
    "swing-emotional": 0.08,
    "swing-critical": 0.07,
  },
  awarenessMean: 0.6,
  awarenessStd: 0.2,
  educationDist: {
    none: 0.01,
    primary: 0.05,
    secondary: 0.35,
    tertiary: 0.4,
    postgraduate: 0.19,
  },
  personalityMeans: {
    happiness: 0.6,
    resentment: 0.35,
    "trust-in-authority": 0.58,
    "desire-for-change": 0.37,
    "risk-tolerance": 0.32,
  },
  personalityStds: {
    happiness: 0.15,
    resentment: 0.25,
    "trust-in-authority": 0.1,
    "desire-for-change": 0.15,
    "risk-tolerance": 0.25,
  },
};
