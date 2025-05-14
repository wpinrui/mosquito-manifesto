import express from "express";
import { generateVoter } from "./services/demographic-service/demographicService";

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

app.get("/generate_voter", async (_req, res) => {
  const { age, incomePercentile, politicalAwareness } = _req.query;

  if (
    typeof age !== "string" ||
    typeof incomePercentile !== "string" ||
    typeof politicalAwareness !== "string"
  ) {
    throw new Error(
      "Invalid input: age, incomePercentile, and politicalAwareness must be strings"
    );
  }

  const result = await generateVoter({
    age: Number(age),
    incomePercentile: Number(incomePercentile),
    politicalAwareness: Number(politicalAwareness),
  });

  console.log(result);
  res.send(result);
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
