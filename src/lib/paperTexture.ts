import * as THREE from "three";

export type ProceduralTextureKind =
  | "paper"
  | "plaster"
  | "concrete"
  | "roof"
  | "wood"
  | "vellum";

type ProceduralTextureOptions = {
  repeat?: [number, number];
  size?: number;
};

const textureColors: Record<
  ProceduralTextureKind,
  { base: string; grain: number; line: string }
> = {
  paper: { base: "#f4ecdc", grain: 18, line: "rgba(52, 45, 35, 0.055)" },
  plaster: { base: "#e8ddc9", grain: 24, line: "rgba(82, 72, 58, 0.045)" },
  concrete: { base: "#d9cfbd", grain: 28, line: "rgba(48, 42, 34, 0.05)" },
  roof: { base: "#dfd4c1", grain: 16, line: "rgba(48, 42, 34, 0.18)" },
  wood: { base: "#b79c72", grain: 22, line: "rgba(64, 43, 26, 0.16)" },
  vellum: { base: "#fff7e8", grain: 14, line: "rgba(16, 77, 72, 0.08)" },
};

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

function clampChannel(value: number) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function noise(x: number, y: number, seed: number) {
  const value = Math.sin(x * 12.9898 + y * 78.233 + seed * 37.719) * 43758.5453;
  return value - Math.floor(value);
}

function drawFineGrain(
  context: CanvasRenderingContext2D,
  kind: ProceduralTextureKind,
  size: number,
) {
  const { base, grain } = textureColors[kind];
  const rgb = hexToRgb(base);
  const image = context.getImageData(0, 0, size, size);
  const seed = kind.length * 17;

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const index = (y * size + x) * 4;
      const fiber = noise(x * 0.08, y * 0.04, seed) * grain - grain / 2;
      const cross = noise(x * 0.02, y * 0.11, seed + 3) * grain * 0.55 - grain * 0.24;
      const wave = Math.sin((x + y * 0.18) * 0.035) * grain * 0.12;
      const amount = fiber + cross + wave;

      image.data[index] = clampChannel(rgb.r + amount);
      image.data[index + 1] = clampChannel(rgb.g + amount * 0.88);
      image.data[index + 2] = clampChannel(rgb.b + amount * 0.62);
      image.data[index + 3] = 255;
    }
  }

  context.putImageData(image, 0, 0);
}

function drawPattern(
  context: CanvasRenderingContext2D,
  kind: ProceduralTextureKind,
  size: number,
) {
  const { line } = textureColors[kind];
  context.strokeStyle = line;
  context.lineWidth = 1;

  if (kind === "paper" || kind === "vellum") {
    const step = kind === "vellum" ? 28 : 32;
    for (let x = 0; x < size; x += step) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, size);
      context.stroke();
    }
    for (let y = 0; y < size; y += step) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(size, y);
      context.stroke();
    }
  }

  if (kind === "roof") {
    context.lineWidth = 2;
    for (let x = 14; x < size; x += 22) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x + 10, size);
      context.stroke();
    }
  }

  if (kind === "wood") {
    context.lineWidth = 1.4;
    for (let y = 16; y < size; y += 26) {
      context.beginPath();
      context.moveTo(0, y + Math.sin(y * 0.08) * 3);
      for (let x = 0; x <= size; x += 18) {
        context.lineTo(x, y + Math.sin(x * 0.035 + y * 0.09) * 5);
      }
      context.stroke();
    }
  }

  if (kind === "concrete" || kind === "plaster") {
    context.lineWidth = 1;
    for (let i = 0; i < 44; i += 1) {
      const x = noise(i, 2, 7) * size;
      const y = noise(i, 4, 9) * size;
      const length = 18 + noise(i, 7, 11) * 54;
      context.globalAlpha = 0.22;
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x + length, y + noise(i, 9, 13) * 11 - 5);
      context.stroke();
    }
    context.globalAlpha = 1;
  }
}

/**
 * Procedural paper / plaster / concrete / roof / wood textures drawn on a
 * canvas (client-only). Keeps the maquette materials looking like a real
 * architect's model without shipping any image assets.
 */
export function createProceduralTexture(
  kind: ProceduralTextureKind,
  options: ProceduralTextureOptions = {},
) {
  const size = options.size ?? 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext("2d");
  if (!context) return null;

  context.fillStyle = textureColors[kind].base;
  context.fillRect(0, 0, size, size);
  drawFineGrain(context, kind, size);
  drawPattern(context, kind, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(...(options.repeat ?? [1, 1]));
  texture.anisotropy = 6;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  return texture;
}
