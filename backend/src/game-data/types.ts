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
  