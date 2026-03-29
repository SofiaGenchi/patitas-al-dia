export interface PetProfile {
  id: string; // the name normalized
  petName: string;
  selectedIcon: string;
  emoji: string;
  pin: string;
  createdAt: number;
}

export interface FoodRecord {
  id: string;
  profileId: string;
  by: string;
  note: string;
  createdAt: number;
}
