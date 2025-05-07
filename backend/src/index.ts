import express, { Request, Response } from "express";

const app = express();
const PORT = 3001;

app.get("/hello", (_req: Request, res: Response) => {
  console.log(_req.headers);
  res.send("Hello world");
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
