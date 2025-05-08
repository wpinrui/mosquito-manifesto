import express, { Request, Response, NextFunction } from "express";
import { generateVoterProfileDescription } from "./services/llm-service/generateVoterProfileDescription";
import { DemographicDistribution } from "./services/demographic-service/types";
import { generateVoter } from "./services/demographic-service/demographicService";
import {
  pollConstituencyResultMulti,
  simulateVote,
} from "./services/election-service/simulateVote";
import { getCandidates } from "./services/candidate-service/candidateService";

const app = express();
const PORT = 3001;

const singaporeDemographic: DemographicDistribution = {
  ageMean: 45,
  ageStd: 15,
  genderDist: {
    male: 0.49,
    female: 0.5,
    nonbinary: 0.01,
  },
  incomeMean: 5000,
  incomeStd: 3000,
  ideologyDist: {
    "pro-gov": 0.45,
    neutral: 0.25,
    "anti-gov": 0.3,
  },
  awarenessMean: 0.6,
  awarenessStd: 0.2,
  educationDist: {
    none: 0.01,
    primary: 0.05,
    secondary: 0.35,
    tertiary: 0.4,
    postgraduate: 0.19,
  },
  personalityMeans: {
    openness: 0.5,
    conscientiousness: 0.65,
    extraversion: 0.45,
    agreeableness: 0.7,
    neuroticism: 0.45,
  },
  personalityStds: {
    openness: 0.15,
    conscientiousness: 0.1,
    extraversion: 0.2,
    agreeableness: 0.1,
    neuroticism: 0.15,
  },
};

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(
    `Incoming request:\nMethod: ${req.method}\nURL: ${
      req.originalUrl
    }\nParams: ${JSON.stringify(req.params)}\nQuery: ${JSON.stringify(
      req.query
    )}\nBody: ${JSON.stringify(req.body)}\n`
  );
  next();
});

app.use(express.json());

app.get("/hello", async (_req: Request, res: Response) => {
  const voter = generateVoter(singaporeDemographic);
  const description = await generateVoterProfileDescription(voter);
  console.log("Generated Voter Profile Description:", description);

  const final = await simulateVote(description || "", getCandidates());
  res.send(`${description}\n${JSON.stringify(final)}`);
});

app.get("/simulate", async (_req, res) => {
  const result = await pollConstituencyResultMulti(
    singaporeDemographic,
    getCandidates()
  );
  res.send(result);
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
