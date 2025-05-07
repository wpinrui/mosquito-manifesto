import express, { Request, Response, NextFunction } from "express";

const app = express();
const PORT = 3001;

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

app.get("/hello", (_req: Request, res: Response) => {
  res.send("Hello world");
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
