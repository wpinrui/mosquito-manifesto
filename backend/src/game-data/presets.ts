import {
  BasicDemographic,
  PillarStats,
} from "../services/demographic-service/types";
import { loadDemographic, loadIdeology } from "./loader";

export const getSampleSingaporeDistribution = (): BasicDemographic =>
  loadDemographic();

export const getIdeologyDistributions = (): Record<string, PillarStats> =>
  loadIdeology();
