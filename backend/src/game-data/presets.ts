import {
  BasicDemographic,
  PillarStats,
} from "../services/demographic-service/types";
import { loadDemographic, loadIdeology } from "./loader";

export const sampleSingaporeDistribution: BasicDemographic = loadDemographic();

export const ideologyDistributions: Record<string, PillarStats> =
  loadIdeology();
