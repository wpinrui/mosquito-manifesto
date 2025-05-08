import { generateVoter } from "../demographic-service/demographicService";
import { DemographicDistribution } from "../demographic-service/types";
import { generateVoterProfileDescription } from "../llm-service/generateVoterProfileDescription";
import { LlmClient } from "../llm-service/llmService";

function randBinomial(n: number, p: number): number {
  const mean = n * p;
  const stdDev = Math.sqrt(n * p * (1 - p));
  return Math.max(0, Math.min(n, Math.round(mean + stdDev * randNormal())));
}

function randNormal(): number {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random(); // avoid log(0)
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

export const simulateVote = async (
  voterDescription: string,
  partyInfos: string[]
): Promise<{ votedIndex: number }> => {
  const prompt = `
  You are simulating a realistic voter decision for the Jalan Kayu SMC election.
  
  ## Voter Description
  """
  ${voterDescription}
  """
  
  ## Candidates
  ${partyInfos.map((info, i) => `Candidate ${i}:\n${info.trim()}`).join("\n\n")}
  
  ## Instructions
  You are a vote simulator in a fictional country with political candidates contesting in a single-member constituency.

Your goal is to simulate how a typical voter would vote after reviewing all available candidate profiles. This includes considering:
- Their background
- Public statements and behavior
- Personal character and temperament
- Community engagement
- Policy positions (if any)
- Public perception, reputation, and media portrayal

You are not judging policy soundness or doing fact-checking. You are simulating how a typical, realistic voter would **react emotionally and logically** to the candidate based on available information.

---

Guidelines for evaluation:

1. **Moral character and behavior are the top priority**.
   - If a candidate is openly **rude, racist, elitist, dishonest, or cruel**, this is an automatic red line for most voters.
   - No level of community work, policy strength, or charisma can redeem a candidate who fails the basic standards of decency.
   - Voters care about whether the candidate can lead with **moral authority and empathy**, especially in times of crisis.

2. **Voting Tendencies**:
   - If a voter is **pro-government**, they will vote for the government party unless the candidate is severely disliked.
   - If a voter is **anti-government**, they will vote for the opposition party unless the candidate is untrustworthy.
   - If a voter is a **swing voter**, they will vote based on their mood, personality, policy alignment and media portrayal.
   - If a voter is a **critical voter**, they will evaluate the candidates based on their manifestos, debate performance, and public statements.
---

  ### Respond ONLY in this format:
  
  VotedIndex:
  [0 for Candidate 0, 1 for Candidate 1]
  `.trim();

  const response = await LlmClient.chat.completions.create({
    model: "gpt-4.1-nano",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const content = response.choices[0].message.content ?? "";
  const match = content.match(/VotedIndex:\s*(\d+)/);

  if (!match) {
    console.error("Could not parse voted index from model output:", content);
    throw new Error("Could not parse voted index from model output");
  }

  const obj = {
    votedIndex: parseInt(match[1], 10),
    explanation: content.replace(/VotedIndex:\s*\d+\s*Explanation:\s*/, ""),
  };
  console.log(obj);
  return obj;
};

export async function pollConstituencyResultMulti(
  demographics: DemographicDistribution,
  candidates: string[],
  candidateNames: string[] = ["Opposition", "Ruling"],
  electorateSize = 25000,
  maxSamples = 20,
  noiseThreshold = 0.05, // noise to apply
  closeRange = 0.45 // close range is defined between 45%-55%
) {
  const numCandidates = candidates.length;
  const voteCounts = new Array<number>(numCandidates).fill(0);

  let winnerFound = false;
  let sampleCount = 0;

  // Simulate votes
  while (sampleCount < maxSamples && !winnerFound) {
    // Simulate 10 votes
    for (let i = 0; i < 10; i++) {
      const voter = generateVoter(demographics);
      const desc = await generateVoterProfileDescription(voter);
      const result = await simulateVote(desc || "", candidates);

      if (
        result.votedIndex === undefined ||
        result.votedIndex < 0 ||
        result.votedIndex >= numCandidates
      ) {
        console.error(
          `Invalid votedIndex: ${result.votedIndex}, skipping vote.`
        );
        continue;
      }

      voteCounts[result.votedIndex]++;
    }

    const totalVotes = voteCounts.reduce((sum, v) => sum + v, 0);
    const voteProportions = voteCounts.map((v) => v / totalVotes);
    const leaderIndex = voteCounts.indexOf(Math.max(...voteCounts));
    const leaderProportion = voteProportions[leaderIndex];

    console.log(`Sample ${sampleCount + 1}: voteCounts = ${voteCounts}`);

    // Check for tie (within a very close range)
    if (Math.max(...voteCounts) - Math.min(...voteCounts) <= 1) {
      // There's a tie or near tie, continue sampling
      // We keep the sample count, but no winner is declared yet
      if (sampleCount === 19) {
        // If we reach 20 samples without a clear winner, make a win by 1 scenario
        winnerFound = true;
        voteCounts[leaderIndex] += 1; // Make sure the winner gets at least 1 vote more than the other
      }
    } else {
      winnerFound = true;
    }

    sampleCount++;
  }

  // Final results
  const totalSampled = voteCounts.reduce((sum, v) => sum + v, 0);
  const finalProportions = voteCounts.map((v) => v / totalSampled);

  // Apply noise to the final proportions
  const finalVotes = finalProportions.map((p) => {
    const noise = Math.random() * noiseThreshold; // Random noise between 0 and noiseThreshold
    const noisyProportion = p + (Math.random() * 2 - 1) * noise; // Apply noise
    return randBinomial(
      electorateSize,
      Math.max(0, Math.min(1, noisyProportion))
    );
  });

  // Normalize final votes to match electorate size
  const totalFinalVotes = finalVotes.reduce((sum, v) => sum + v, 0);
  const adjustmentFactor = electorateSize / totalFinalVotes;

  // Adjust votes proportionally to ensure the sum is exactly electorateSize
  const adjustedFinalVotes = finalVotes.map((votes) =>
    Math.round(votes * adjustmentFactor)
  );

  // Calculate the result (winner, etc.)
  const winnerIndex = adjustedFinalVotes.indexOf(
    Math.max(...adjustedFinalVotes)
  );
  const winnerPercentage =
    (adjustedFinalVotes[winnerIndex] / electorateSize) * 100;

  console.log(`Final Votes: ${adjustedFinalVotes}`);

  return {
    candidates: candidates.map((name, i) => ({
      name,
      votes: adjustedFinalVotes[i],
      percentage: (adjustedFinalVotes[i] / electorateSize) * 100,
    })),
    winner: {
      name: candidateNames[winnerIndex],
      votes: adjustedFinalVotes[winnerIndex],
      percentage: winnerPercentage,
    },
  };
}
