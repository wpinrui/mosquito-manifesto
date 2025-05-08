import { VoterProfile } from "../demographic-service/types";
import { LlmClient } from "./llmService";

const voterPrompt = (profile: VoterProfile) =>
  `Write a vivid but concise character sketch (~100 words) of a fictional Singaporean voter based on the traits below. The bio should reflect their likely voting behavior in a general election. Use a natural, human tone. The voter must have a Singaporean Chinese name appropriate for their age and gender.

Clearly convey whether they:
- Usually vote for the government party (unless candidate is severely disliked),
- Usually vote for the opposition (unless candidate is untrustworthy),
- Are swing voters (vote based on mood or conditions),
- Are critical voters (evaluate manifestos, candidates, and debate performance).

Reflect their income, life satisfaction, policy awareness, and current concerns. Mention how they typically stay informed or if they don’t. Keep the tone realistic, not satirical or exaggerated.

Age: ${profile.age}
Gender: ${profile.gender}
Income: ${profile.incomeLevel}
Ideology: ${profile.ideology}
Education: ${profile.education}
Awareness: ${profile.politicalAwareness}
Personality: ${JSON.stringify(profile.personalityTraits, null, 0)}
---`.trim();

export const generateVoterProfileDescription = async (
  profile: VoterProfile
) => {
  const response = await LlmClient.chat.completions.create({
    model: "gpt-4.1-nano",
    messages: [
      {
        role: "user",
        content: voterPrompt(profile),
      },
    ],
  });
  console.log(response);
  return response.choices[0].message.content;
};
