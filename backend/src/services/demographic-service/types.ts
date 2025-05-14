export type BasicVoter = {
  // independent variables
  age: number;
  incomePercentile: number;
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
