import { sampleFromDistribution, sampleGaussian } from "../../utils/random";
import { DemographicDistribution, VoterProfile } from "./types";

export function generateVoter(demo: DemographicDistribution): VoterProfile {
  const personalityTraits: Record<string, number> = {};
  for (const trait in demo.personalityMeans) {
    const key = trait as keyof typeof demo.personalityMeans;
    personalityTraits[key] = parseFloat(
      sampleGaussian(
        demo.personalityMeans[key],
        demo.personalityStds[key],
        0,
        1
      ).toFixed(3)
    );
  }

  return {
    age: Math.floor(sampleGaussian(demo.ageMean, demo.ageStd, 18, 90)),
    gender: sampleFromDistribution(demo.genderDist),
    incomeLevel: Math.floor(sampleGaussian(demo.incomeMean, demo.incomeStd, 0)),
    ideology: sampleFromDistribution(demo.ideologyDist),
    politicalAwareness: parseFloat(
      sampleGaussian(demo.awarenessMean, demo.awarenessStd, 0, 1).toFixed(3)
    ),
    education: sampleFromDistribution(demo.educationDist),
    personalityTraits,
  };
}
