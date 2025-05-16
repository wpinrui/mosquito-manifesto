export interface Person {
  id: string;
  name: string;
  role: "leader" | "candidate" | "volunteer" | "employee" | "none";
  partyId: string | null;
  isAlive: boolean;
  dateOfBirth: string;
  dateOfDeath: string | null;
  isIncarcerated: boolean;
  hometownId: string;
  eventLog: string;
}

export type Event = {
  date: string; // ISO 8601 format
  baseSignificance: number;
  currentSignificance: number; // factoring date decay
  partyImpact: Record<number, number>; // key is the ID
  candidateImpact: Record<number, number>; // key is the ID
  neutralDescription: string;
  mainstreamDescription: string;
  alternativeDescription: string;
  conservatismMultiplier: number;
  liberalismMultiplier: number;
  socialismMultiplier: number;
  capitalismMultiplier: number;
};
