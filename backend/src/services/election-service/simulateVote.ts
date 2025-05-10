import { randBinomial } from "../../utils/math";
import { generateVoter } from "../demographic-service/demographicService";
import {
  DemographicDistribution,
  Ideology,
} from "../demographic-service/types";
import { generateVoterProfileDescription } from "../llm-service/generateVoterProfileDescription";
import { LlmClient } from "../llm-service/llmService";
import { makeSimulateVoteUserPrompt } from "./prompts";

export const simulateVote = async (
  voterDescription: string,
  partyInfos: string[],
  ideology: Ideology,
  hasDisqualifier: (index: number) => boolean
): Promise<{ votedIndex: number }> => {
  if (ideology === "gov-fan") return { votedIndex: 1 };
  if (ideology === "opp-fan") return { votedIndex: 0 };

  if (ideology === "leans-gov" || ideology === "leans-opp") {
    // if one disqualified, vote for the other
    if (hasDisqualifier(0) && !hasDisqualifier(1)) return { votedIndex: 1 };
    if (!hasDisqualifier(0) && hasDisqualifier(1)) return { votedIndex: 0 };
  }

  const response = await LlmClient.chat.completions.create({
    model: "gpt-4.1-nano",
    messages: [
      {
        role: "user",
        content: makeSimulateVoteUserPrompt(voterDescription, partyInfos),
      },
    ],
  });

  const content = response.choices[0].message.content ?? "";
  const indexMatch = content.match(/VotedIndex:\s*(\d+)/i);

  if (!indexMatch) {
    console.error("Could not parse voted index from model output:", content);
    throw new Error("Could not parse voted index from model output");
  }

  return {
    votedIndex: parseInt(indexMatch[1], 10),
  };
};

export async function pollConstituencyResultMulti(
  demographics: DemographicDistribution,
  candidates: string[],
  electorateSize = 25000,
  noiseThreshold = 0.05
) {
  electorateSize = Math.random() * 0.1 * electorateSize + 0.9 * electorateSize;
  const numCandidates = candidates.length;
  const voteCounts = new Array<number>(numCandidates).fill(0);
  const ideologyVotes = new Map<string, number[]>();

  const hasDisqualifierBoolArr = await Promise.all(
    candidates.map(async (_, index) => {
      const disqualified = await LlmClient.chat.completions.create({
        model: "gpt-4.1-nano",
        messages: [
          {
            role: "user",
            content: `Does the following candidate have any red flags? ${candidates[index]} Respond with "yes" or "no".`,
          },
        ],
      });
      return (
        disqualified.choices[0].message.content
          ?.toLowerCase()
          .includes("yes") || false
      );
    })
  );

  for (let i = 0; i < 100; i++) {
    const voter = generateVoter(demographics);
    const desc = generateVoterProfileDescription(voter);

    const result = await simulateVote(
      desc || "",
      candidates,
      voter.ideology,
      (index) => hasDisqualifierBoolArr[index]
    );

    if (
      result.votedIndex === undefined ||
      result.votedIndex < 0 ||
      result.votedIndex >= numCandidates
    ) {
      continue;
    }

    voteCounts[result.votedIndex]++;

    const ideology = voter.ideology;
    if (!ideologyVotes.has(ideology)) {
      ideologyVotes.set(ideology, new Array<number>(numCandidates).fill(0));
    }
    ideologyVotes.get(ideology)![result.votedIndex]++;
    console.log(
      `Voter ${i + 1} (${voter.ideology}) voted for ${
        result.votedIndex === 0 ? "Opposition" : "Ruling"
      } candidate. \n${desc}\n\n`
    );
  }

  const totalSampled = voteCounts.reduce((sum, v) => sum + v, 0);
  const finalProportions = voteCounts.map((v) => v / totalSampled);

  const finalVotes = finalProportions.map((p) => {
    const noise = Math.random() * noiseThreshold;
    const noisyProportion = p + (Math.random() * 2 - 1) * noise;
    return randBinomial(
      electorateSize,
      Math.max(0, Math.min(1, noisyProportion))
    );
  });

  const totalFinalVotes = finalVotes.reduce((sum, v) => sum + v, 0);
  const adjustmentFactor = electorateSize / totalFinalVotes;
  const adjustedFinalVotes = finalVotes.map((votes) =>
    Math.round(votes * adjustmentFactor)
  );

  const winnerIndex = adjustedFinalVotes.indexOf(
    Math.max(...adjustedFinalVotes)
  );

  return {
    candidates: candidates.map((name, i) => ({
      name: i === 0 ? "Opposition" : "Ruling",
      votes: adjustedFinalVotes[i],
      percentage: (adjustedFinalVotes[i] / electorateSize) * 100,
    })),
    winner: {
      name: winnerIndex === 0 ? "Opposition" : "Ruling",
    },
    ideologyVotes: Object.fromEntries(ideologyVotes),
  };
}
