export type Gender = "male" | "female" | "nonbinary";
export type Ideology =
  | "gov-fan"
  | "opp-fan"
  | "leans-gov"
  | "leans-opp"
  | "leans-incumbent"
  | "swing-emotional"
  | "swing-critical";
export type Education =
  | "none"
  | "primary"
  | "secondary"
  | "tertiary"
  | "postgraduate";

export type PersonalityTrait =
  | "happiness" // General life satisfaction; higher = vote ruling
  | "resentment" // Frustration with inequality, elites, or unfair systems
  | "trust-in-authority" // Belief in institutions, police, government credibility
  | "desire-for-change" // Feels things should be different; more willing to vote opp
  | "risk-tolerance"; // Willingness to shake up the system vs prefer stability

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
