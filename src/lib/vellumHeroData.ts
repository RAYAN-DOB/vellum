export type FloorKey = "rdc" | "etage" | "toiture";

export type DetailLayer =
  | "structure"
  | "openings"
  | "dimensions"
  | "annotations"
  | "furniture"
  | "electrical"
  | "plumbing";

export type Wall3D = {
  id: string;
  floor: Exclude<FloorKey, "toiture">;
  position: [number, number, number];
  size: [number, number, number];
  kind?: "outer" | "partition" | "low";
};

export type Furniture3D = {
  id: string;
  floor: Exclude<FloorKey, "toiture">;
  position: [number, number, number];
  size: [number, number, number];
  material: "wood" | "stone" | "fabric" | "brass";
};

export type FloorSpec = {
  id: FloorKey;
  label: string;
  short: string;
  title: string;
  y: number;
  size: [number, number, number];
  planNo: string;
  deliverable: string;
  quoteLine: string;
  rooms: string[];
};

export const heroFloors: FloorSpec[] = [
  {
    id: "rdc",
    label: "Rez-de-chaussée",
    short: "RDC",
    title: "Plan RDC / circulation et pièces de vie",
    y: 0,
    size: [5.9, 0.09, 4.15],
    planNo: "A-101",
    deliverable: "Plan coté + ouvertures",
    quoteLine: "Base devis menuiseries, cloisons, surfaces.",
    rooms: ["Entrée", "Séjour", "Cuisine", "Bureau", "SDE"],
  },
  {
    id: "etage",
    label: "Étage 1",
    short: "R+1",
    title: "Plan étage / chambres et trémie",
    y: 1.18,
    size: [5.25, 0.09, 3.72],
    planNo: "A-102",
    deliverable: "Plan chambres + annotations",
    quoteLine: "Base devis cloisons, reprises, corrections.",
    rooms: ["Palier", "Suite", "Chambre", "Bain", "Dressing"],
  },
  {
    id: "toiture",
    label: "Toiture",
    short: "TOIT",
    title: "Plan toiture / pentes et relevés",
    y: 2.58,
    size: [5.65, 0.14, 4.14],
    planNo: "A-103",
    deliverable: "Plan toiture + détails techniques",
    quoteLine: "Base devis charpente, isolation, relevés.",
    rooms: ["Pente 35%", "Acrotère", "Lucarne", "EP", "Faîtage"],
  },
];

export const layerDefaults: Record<DetailLayer, boolean> = {
  structure: true,
  openings: true,
  dimensions: true,
  annotations: true,
  furniture: true,
  electrical: false,
  plumbing: false,
};

export const walls3d: Wall3D[] = [
  { id: "rdc-north", floor: "rdc", position: [0, 0.44, -1.86], size: [5.62, 0.88, 0.18], kind: "outer" },
  { id: "rdc-south", floor: "rdc", position: [0, 0.44, 1.86], size: [5.62, 0.88, 0.18], kind: "outer" },
  { id: "rdc-west", floor: "rdc", position: [-2.81, 0.44, 0], size: [0.18, 0.88, 3.9], kind: "outer" },
  { id: "rdc-east", floor: "rdc", position: [2.81, 0.44, 0], size: [0.18, 0.88, 3.9], kind: "outer" },
  { id: "rdc-kitchen", floor: "rdc", position: [-0.92, 0.44, -0.24], size: [0.13, 0.86, 2.2], kind: "partition" },
  { id: "rdc-office", floor: "rdc", position: [1.28, 0.44, 0.52], size: [1.7, 0.86, 0.13], kind: "partition" },
  { id: "rdc-water", floor: "rdc", position: [1.94, 0.44, -0.92], size: [0.13, 0.86, 1.66], kind: "partition" },
  { id: "rdc-island", floor: "rdc", position: [-1.72, 0.3, 0.84], size: [1.25, 0.6, 0.14], kind: "low" },
  { id: "etage-north", floor: "etage", position: [0, 1.42, -1.62], size: [5.02, 0.76, 0.16], kind: "outer" },
  { id: "etage-south", floor: "etage", position: [0, 1.42, 1.62], size: [5.02, 0.76, 0.16], kind: "outer" },
  { id: "etage-west", floor: "etage", position: [-2.51, 1.42, 0], size: [0.16, 0.76, 3.42], kind: "outer" },
  { id: "etage-east", floor: "etage", position: [2.51, 1.42, 0], size: [0.16, 0.76, 3.42], kind: "outer" },
  { id: "etage-palier", floor: "etage", position: [-0.3, 1.42, 0.1], size: [0.12, 0.76, 2.08], kind: "partition" },
  { id: "etage-bath", floor: "etage", position: [1.08, 1.42, -0.45], size: [1.58, 0.76, 0.12], kind: "partition" },
  { id: "etage-dressing", floor: "etage", position: [1.65, 1.42, 0.82], size: [0.12, 0.76, 1.48], kind: "partition" },
];

export const furniture3d: Furniture3D[] = [
  { id: "sofa", floor: "rdc", position: [0.38, 0.2, 1.08], size: [1.22, 0.3, 0.48], material: "fabric" },
  { id: "table", floor: "rdc", position: [-0.12, 0.22, -0.9], size: [0.92, 0.18, 0.52], material: "wood" },
  { id: "island", floor: "rdc", position: [-1.82, 0.32, 0.6], size: [0.92, 0.34, 0.48], material: "stone" },
  { id: "desk", floor: "rdc", position: [1.72, 0.26, 1.08], size: [0.82, 0.22, 0.42], material: "wood" },
  { id: "bed-a", floor: "etage", position: [-1.35, 1.15, 0.88], size: [1.12, 0.26, 0.72], material: "fabric" },
  { id: "bed-b", floor: "etage", position: [1.2, 1.15, 0.82], size: [1.02, 0.24, 0.66], material: "fabric" },
  { id: "vanity", floor: "etage", position: [1.3, 1.15, -0.95], size: [0.7, 0.22, 0.3], material: "stone" },
];
