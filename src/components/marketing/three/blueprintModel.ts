/**
 * Fictional floor plan for the Vellum "plan → volume" hero.
 *
 * NON-SENSITIVE, fully invented geometry — never derived from real client
 * drawings. Used only as decorative source data for the WebGL massing scene.
 *
 * Coordinate system (meters):
 *   - x runs left↔right, z runs front↔back, both centered near the origin.
 *   - Footprint is roughly 12m (x) × 9m (z): x ∈ [-6, 6], z ∈ [-4.5, 4.5].
 *   - Walls are 2D segments at y = 0; the scene extrudes them upward in y.
 *
 * Layout: a small office/apartment — entry hall, open studio, two side rooms
 * and a service core, with a couple of deliberate door gaps in the partitions.
 */

export type WallSegment = {
  x1: number;
  z1: number;
  x2: number;
  z2: number;
};

export type RoomLabel = {
  /** Centroid-ish anchor for an optional 2D label, in plan coordinates. */
  x: number;
  z: number;
  label: string;
};

/** Outer footprint half-extents, handy for centering the camera / grid. */
export const PLAN_HALF_X = 6;
export const PLAN_HALF_Z = 4.5;

/**
 * ~18 wall segments. The perimeter is broken in two places to read as a main
 * entrance and a back service door; interior partitions leave doorway gaps.
 */
export const PLAN_WALLS: WallSegment[] = [
  // ── Perimeter ───────────────────────────────────────────────────────────
  // Front wall (split for the main entrance, gap from x = -0.8 to 0.8)
  { x1: -6, z1: 4.5, x2: -0.8, z2: 4.5 },
  { x1: 0.8, z1: 4.5, x2: 6, z2: 4.5 },
  // Right wall
  { x1: 6, z1: 4.5, x2: 6, z2: -4.5 },
  // Back wall (split for a service door, gap from x = 3.4 to 4.6)
  { x1: 6, z1: -4.5, x2: 4.6, z2: -4.5 },
  { x1: 3.4, z1: -4.5, x2: -6, z2: -4.5 },
  // Left wall
  { x1: -6, z1: -4.5, x2: -6, z2: 4.5 },

  // ── Primary cross partition (separates front studio from back rooms) ─────
  // Runs along z = -0.4, with a doorway gap from x = -1.2 to -0.2
  { x1: -6, z1: -0.4, x2: -1.2, z2: -0.4 },
  { x1: -0.2, z1: -0.4, x2: 2.2, z2: -0.4 },
  { x1: 3.4, z1: -0.4, x2: 6, z2: -0.4 },

  // ── Entry vestibule (short walls framing the main entrance) ──────────────
  { x1: -0.8, z1: 4.5, x2: -0.8, z2: 2.6 },
  { x1: 0.8, z1: 4.5, x2: 0.8, z2: 2.6 },
  { x1: -0.8, z1: 2.6, x2: 0.8, z2: 2.6 },

  // ── Back-left room (private office) ──────────────────────────────────────
  // Vertical partition at x = -1.8, gap near the cross-partition door
  { x1: -1.8, z1: -0.4, x2: -1.8, z2: -2.6 },
  { x1: -1.8, z1: -3.4, x2: -1.8, z2: -4.5 },

  // ── Back-right service core (kitchenette / utilities) ────────────────────
  { x1: 2.4, z1: -0.4, x2: 2.4, z2: -2.8 },
  { x1: 2.4, z1: -2.8, x2: 4.4, z2: -2.8 },
  { x1: 4.4, z1: -2.8, x2: 4.4, z2: -4.5 },

  // ── Detail nib off the right wall (column / pier) ────────────────────────
  { x1: 6, z1: 1.2, x2: 4.9, z2: 1.2 },
];

/**
 * Optional room anchors. Purely decorative; the scene may ignore these.
 */
export const PLAN_ROOMS: RoomLabel[] = [
  { x: -2.6, z: 2.0, label: "STUDIO" },
  { x: 4.0, z: 2.0, label: "ATELIER" },
  { x: -3.6, z: -2.6, label: "BUREAU" },
  { x: 0.6, z: -2.6, label: "REUNION" },
  { x: 4.0, z: -1.6, label: "SERVICE" },
];

/** Nominal massing parameters reused by the scene. */
export const WALL_HEIGHT = 2.8; // meters
export const WALL_THICKNESS = 0.15; // meters
