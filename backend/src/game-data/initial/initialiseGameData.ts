import fs from "fs";
import path from "path";

const FILE_NAMES = [
  "constituencies.csv",
  "demographic.csv",
  "ideology.csv",
  "towns.csv",
];

const INITIAL_DIR = __dirname; // same folder
const TARGET_DIR = path.resolve(__dirname, ".."); // one level up

function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

function copyFileIfMissing(fileName: string): void {
  const targetPath = path.join(TARGET_DIR, fileName);
  const initialPath = path.join(INITIAL_DIR, fileName);

  if (!fileExists(targetPath)) {
    fs.copyFileSync(initialPath, targetPath);
  }
}

export function initializeGameData(): void {
  FILE_NAMES.forEach(copyFileIfMissing);
}
