import { VoterProfile } from "../demographic-service/types";
import { LlmClient } from "./llmService";

async function generateRealismQuirk(profile: VoterProfile): Promise<string> {
  const res = await LlmClient.chat.completions.create({
    model: "gpt-4.1-nano",
    messages: [
      {
        role: "user",
        content: `Generate a short, specific personal trivia fact (around 15 words) about a fictional voter, written as a sentence fragment without a name or subject. 
Example style: "Puts bagels in sauce." or "Eats spicy food with eyes closed." or "Laughs while sleeping." 
Here is the voter's profile:\n${JSON.stringify(profile, null, 2)}`,
      },
    ],
  });
  const content = res.choices[0].message.content ?? "";
  return content;
}

function buildIdeologySection(profile: VoterProfile): string {
  const { ideology, age, politicalAwareness, personalityTraits } = profile;
  const name = "Tan Jun Wei"; // Placeholder for the voter's name

  switch (ideology) {
    case "gov-fan":
      return [
        `${name} is a ${age}-year-old voter who will vote for the government party.`,
      ].join("\n");

    case "opp-fan":
      return [
        `${name} is a ${age}-year-old voter who will vote for the opposition party.`,
      ].join("\n");

    case "leans-gov":
      return [
        `${name} is a ${age}-year-old voter who will see if the government party is competent and has no significant character flaws, criminal history or is clearly incompetent. If so, they will vote for the government party. If not, they will vote for the opposition party.`,
      ].join("\n");

    case "leans-opp":
      return [
        `${name} is a ${age}-year-old voter who will see if the opposition party is competent and has no significant character flaws, criminal history or is clearly incompetent. If so, they will vote for the opposition party. If not, they will vote for the government party.`,
      ].join("\n");

    case "leans-incumbent":
      return [
        `${name} is a ${age}-year-old voter who will see if the incumbent party is competent and has no significant character flaws, criminal history or is clearly incompetent. If so, they will vote for the incumbent party. If not, they will vote for the opposition party.`,
      ].join("\n");

    case "swing-emotional":
      return [
        `${name} is a ${age}-year-old voter who votes based on their feelings. Here are the relevant traits:`,
        `- Happiness: ${personalityTraits.happiness}`,
        `- Resentment: ${personalityTraits.resentment}`,
        `- Trust in Authority: ${personalityTraits["trust-in-authority"]}`,
        `- Desire for Change: ${personalityTraits["desire-for-change"]}`,
        `- Risk Tolerance: ${personalityTraits["risk-tolerance"]}`,
        `- Political Awareness: ${politicalAwareness}`,
      ].join("\n");

    case "swing-critical":
      return [
        `${name} is a ${age}-year-old voter who votes based on candidate quality and does not care about party affiliation or incumbency.`,
      ].join("\n");

    default:
      // This should never happen if VoterProfile.ideology is well-typed
      throw new Error(`Unsupported ideology: ${ideology as string}`);
  }
}

export const generateVoterProfileDescription = (profile: VoterProfile) => {
  // const quirk = await generateRealismQuirk(profile);
  const main = buildIdeologySection(profile);
  // console.log(`${main}\n\n${quirk}`);
  return `${main}`;
};
