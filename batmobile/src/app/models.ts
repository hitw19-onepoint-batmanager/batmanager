export interface User {
  userName: string;
  password: string;
}
export interface Device {
  name: string;
}
export type ObservationStatus = "Idle" | "Ongoing" | "Done";
export interface Coords {
  coordX: number;
  coordY: number;
}
export interface Observation extends Coords {
  _id: string;
  status: ObservationStatus;
  nights: DarkKnight[];
  deviceName: string;
  micNumber: string;
  fixedPointProtocol: boolean;
  pointNumber: number;
  user: string;
  dateStart: Date;
  dateEnd: Date;
  sites: string;
  dominantHabitat: DominantHabitat;
  principalStructuringElement: PrincipalStructuringElement;
  secondaryStructuringElement: SecondaryStructuringElement;
  management: Management;
  lighting: boolean;
  dropHeight: number;
  Comments: string;
}
export interface DarkKnight {
  date: Date;
  weather: WeatherConditions;
}
export enum DominantHabitat {
  "cavité- carrière, mine et grotte",
  "Bâtiments",
  "Plan d'eau-mare(<50m²)",
  "Plan d'eau-étang(>50m²)",
  "Cours d'eau-fleuves et grandes rivières (L>10m)",
  "Cours d'eau-rivière (3m<L<10m)",
  "Milieux rocheux",
  "Forêt feuillue",
  "Forêt résineuse",
  "Forêt mixte",
  "Mise à blanc",
  "Lisière vraie (milieu ouvert/milieux forestier)",
  "Prairie",
  "Culture",
  "Prairie/culture",
  "Pelouse, lande",
  "Zone urbanisée (ville, village)",
  "Autres"
}
export enum PrincipalStructuringElement {
  "Haie",
  "Bande boisée et alignement d'arbres",
  "Arbre isolé",
  "Buissons isolés"
}
export enum SecondaryStructuringElement {
  "Layons forestier",
  "Route (induré, circulation véhicule rapides)",
  "Chemin (induré, circulation véhicule lents)",
  "Sentier (non induré, circulation piétonne)",
  "Autre"
}
export enum Management {
  "Eau-présence de végétation aquatique flottante",
  "Forêt-peuplement avec gros bois (>50cm diam)",
  "Forêt-peuplement jeune (<50cm diam)",
  "Prairie-site pâturé (avec animaux présents)",
  "Praire-site fauché (récemment)",
  "Prairie-site non fauché"
}
export enum WeatherConditions {
  "Nuit calme",
  "Nuit pluvieuse",
  "Nuit orageuse"
}

export interface BatMapLocation {
  lat: number;
  lng: number;
  iconUrl: string;
  label: string;
  type: string;
}
