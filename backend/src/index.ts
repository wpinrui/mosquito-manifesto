import express from "express";
import {
  generateDerivedVoter,
  generateVoter,
  hello,
} from "./services/demographic-service/demographicService";

const app = express();
const PORT = 3001;
console.log(hello);

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

app.get("/generate_voter", async (_req, res) => {
  const voter = generateVoter();
  console.log(voter);
  const derivedVoter = generateDerivedVoter(voter);
  console.log(derivedVoter);
  res.send(derivedVoter);
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
