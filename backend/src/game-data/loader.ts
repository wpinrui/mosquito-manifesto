import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import {
  BasicDemographic,
  Direction,
  PillarStats,
} from "../services/demographic-service/types";

export function loadDemographic(): BasicDemographic {
  const filePath = path.resolve(__dirname, "demographic.csv");
  const csv = fs.readFileSync(filePath, "utf8");
  const records = parse(csv, { columns: true });

  const lookup: Record<string, { mean: number; std: number }> = {};
  for (const row of records) {
    lookup[row.type] = {
      mean: parseFloat(row.mean),
      std: parseFloat(row.std),
    };
  }

  return {
    ageDistribution: lookup["age"],
    incomeDistribution: lookup["income"],
    politicalAwarenessDistribution: lookup["awareness"],
  };
}

export function loadIdeology(): Record<string, PillarStats> {
  const filePath = path.resolve(__dirname, "ideology.csv");
  const csv = fs.readFileSync(filePath, "utf8");
  const records = parse(csv, { columns: true });

  const result: Record<string, PillarStats> = {};
  for (const row of records) {
    result[row.name] = {
      mean: parseFloat(row.mean),
      std: parseFloat(row.std),
      directions: {
        age: row.ageDirection as Direction,
        income: row.incomeDirection as Direction,
        awareness: row.awarenessDirection as Direction,
      },
    };
  }
  return result;
}
