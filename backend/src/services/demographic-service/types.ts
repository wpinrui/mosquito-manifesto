export type Gender = "male" | "female" | "nonbinary";
export type Ideology = "pro-gov" | "neutral" | "anti-gov";
export type Education =
  | "none"
  | "primary"
  | "secondary"
  | "tertiary"
  | "postgraduate";

export type PersonalityTrait =
  | "openness"
  | "conscientiousness"
  | "extraversion"
  | "agreeableness"
  | "neuroticism";

export interface VoterProfile {
  age: number;
  gender: Gender;
  incomeLevel: number;
  ideology: Ideology;
  politicalAwareness: number;
  education: Education;
  personalityTraits: Record<PersonalityTrait, number>;
}

export interface DemographicDistribution {
  ageMean: number;
  ageStd: number;
  genderDist: Record<Gender, number>;
  incomeMean: number;
  incomeStd: number;
  ideologyDist: Record<Ideology, number>;
  awarenessMean: number;
  awarenessStd: number;
  educationDist: Record<Education, number>;
  personalityMeans: Record<PersonalityTrait, number>;
  personalityStds: Record<PersonalityTrait, number>;
}
