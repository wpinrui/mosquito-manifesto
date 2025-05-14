export type BasicVoter = {
  // independent variables (raw values)
  age: number;
  income: number;
  politicalAwareness: number;
};

export type DerivedVoter = {
  // derived by a base distribution skewed by age, income, and political awareness
  socialism: number;
  capitalism: number;
  liberalism: number;
  conservatism: number;
  incumbencyBias: number;
} & BasicVoter;

export interface Distribution {
  mean: number;
  std: number;
}

export interface BasicDemographic {
  ageDistribution: Distribution;
  incomeDistribution: Distribution;
  politicalAwarenessDistribution: Distribution;
}

export type Direction = "asc" | "desc" | "flat";

export type PillarStats = {
  mean: number;
  std: number;
  directions: {
    age: Direction;
    income: Direction;
    awareness: Direction;
  };
};
