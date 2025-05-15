import express from "express";
import {
  generateDerivedVoter,
  generateVoter,
} from "./services/demographic-service/demographicService";
import {
  ideologyDistributions,
  sampleSingaporeDistribution,
} from "./game-data/presets";
import { initializeGameData } from "./game-data/initial/initialiseGameData";

initializeGameData();

const app = express();
const PORT = 3001;

app.use(express.json());

app.get("/generate_voter", async (_req, res) => {
  const voter = generateVoter();
  console.log(voter);
  const derivedVoter = generateDerivedVoter(
    voter,
    sampleSingaporeDistribution,
    ideologyDistributions
  );
  console.log(derivedVoter);
  res.send(derivedVoter);
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
