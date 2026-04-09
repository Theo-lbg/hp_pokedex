export interface Wand {
  wood: string;
  core: string;
  length: number | null;
}

export interface Character {
  id: string;
  name: string;
  species: string;
  gender: string;
  house: string;
  dateOfBirth: string;
  yearOfBirth: number | null;
  patternous: string;
  patronus: string;
  bloodStatus: string;
  hogwartsStudent: boolean;
  hogwartsStaff: boolean;
  school: string;
  wand: Wand;
  actor: string;
  alive: boolean;
  image: string;
}

export interface House {
  id: string;
  name: string;
  headOfHouse: string;
  houseColours: string[];
  founder: string;
  animal: string;
  element: string;
  ghost: string;
}

export interface DuelStats {
  wins: number;
  losses: number;
  totalDuels: number;
}
