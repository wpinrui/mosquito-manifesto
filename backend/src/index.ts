import express, { Request, Response, NextFunction } from "express";
import { pollConstituencyResultMulti } from "./services/election-service/simulateVote";
import { getCandidates } from "./services/candidate-service/candidateService";
import { singaporeDemographic } from "./game-data/presets";

const app = express();
const PORT = 3001;

// app.use((req: Request, res: Response, next: NextFunction) => {
//   console.log(
//     `Incoming request:\nMethod: ${req.method}\nURL: ${
//       req.originalUrl
//     }\nParams: ${JSON.stringify(req.params)}\nQuery: ${JSON.stringify(
//       req.query
//     )}\nBody: ${JSON.stringify(req.body)}\n`
//   );
//   next();
// });

app.use(express.json());

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
