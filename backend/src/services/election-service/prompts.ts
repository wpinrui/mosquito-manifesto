export const makeSimulateVoteUserPrompt = (
  voterDescription: string,
  partyInfos: string[]
) =>
  `
## VOTER DESCRIPTION
${voterDescription}

## Candidates
INDEX 0
${partyInfos[0]}

INDEX 1
${partyInfos[1]}

Above is a list of candidates. Based on the VOTER DESCRIPTION, which candidate would the voter most likely vote for? Please respond with the index of the candidate (0 or 1).
Take note to identify disqualifying factors such as character flaws, criminal history, or incompetence. If the candidate is disqualified, vote for the other candidate. If both candidates are disqualified, vote for the candidate with the least disqualifying factors.

Respond in this format (replace <INDEX> with 0 or 1):
VotedIndex:<INDEX>
`.trim();
