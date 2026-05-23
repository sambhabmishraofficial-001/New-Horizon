"use client";

import { useMemo } from "react";

const LAB_COLORS: Record<string, string> = {
  ".": "transparent",
  W: "#86efac",
  w: "#4ade80",
  F: "#c4bfb4",
  f: "#a8a399",
  B: "#7d8fa3",
  b: "#5a6a7d",
  D: "#949eaa",
  d: "#6e7884",
  X: "#9ec8e8",
  x: "#6a8aa8",
  C: "#1e3a52",
  c: "#4a7ab0",
  M: "#4a5568",
  m: "#8a9aaa",
  G: "#4caf7a",
  g: "#2d8f5e",
  E: "#6b7280",
  e: "#454b54",
  Y: "#e8c84a",
  y: "#f5e6a8",
  P: "#d88aa0",
  p: "#b86a82",
  H: "#3d3428",
  S: "#f0c9a8",
  A: "#dce8f4",
  L: "#eef1f5",
  l: "#c5cdd8",
  T: "#6b8f71",
  R: "#8b7355",
  K: "#2a2a28",
  O: "#88c4f0",
};

type Grid = string[][];

const W = 60;
const H = 30;

function createGrid(): Grid {
  return Array.from({ length: H }, () => Array.from({ length: W }, () => "."));
}

function fillRect(
  grid: Grid,
  x: number,
  y: number,
  width: number,
  height: number,
  char: string
) {
  for (let row = y; row < y + height && row < H; row++) {
    for (let col = x; col < x + width && col < W; col++) {
      if (row >= 0 && col >= 0) grid[row][col] = char;
    }
  }
}

function drawSprite(
  grid: Grid,
  sprite: readonly string[],
  originX: number,
  originY: number,
  overwrite = true
) {
  sprite.forEach((line, dy) => {
    line.split("").forEach((cell, dx) => {
      if (cell === ".") return;
      const x = originX + dx;
      const y = originY + dy;
      if (y < 0 || y >= H || x < 0 || x >= W) return;
      if (overwrite || grid[y][x] === ".") grid[y][x] = cell;
    });
  });
}

function buildLabGrid(): Grid {
  const g = createGrid();

  fillRect(g, 0, 0, W, 10, "w");
  fillRect(g, 0, 10, W, 1, "W");
  for (let y = 22; y < H - 1; y++) {
    for (let x = 0; x < W; x++) {
      g[y][x] = (x + y) % 3 === 0 ? "f" : "F";
    }
  }
  fillRect(g, 0, H - 1, W, 1, "f");

  fillRect(g, 20, 2, 20, 5, "X");
  fillRect(g, 21, 3, 18, 3, "x");

  fillRect(g, 3, 11, 54, 1, "Y");
  g[11][8] = "y";
  g[11][28] = "y";
  g[11][48] = "y";

  fillRect(g, 4, 13, 52, 4, "D");
  fillRect(g, 5, 17, 50, 1, "d");

  fillRect(g, 6, 14, 10, 3, "B");
  fillRect(g, 6, 17, 2, 5, "b");
  fillRect(g, 14, 14, 8, 3, "B");
  fillRect(g, 20, 17, 2, 5, "b");

  fillRect(g, 24, 14, 10, 3, "B");
  fillRect(g, 34, 17, 2, 5, "b");
  fillRect(g, 42, 14, 12, 3, "B");
  fillRect(g, 50, 17, 2, 5, "b");

  fillRect(g, 8, 15, 6, 4, "M");
  g[15][9] = "m";
  g[16][10] = "K";
  g[17][11] = "m";

  fillRect(g, 18, 14, 8, 5, "C");
  fillRect(g, 19, 15, 6, 3, "c");
  g[15][20] = "O";
  g[16][21] = "c";

  fillRect(g, 44, 14, 4, 6, "G");
  g[14][45] = "g";
  g[15][46] = "G";
  g[16][45] = "g";

  fillRect(g, 50, 15, 5, 4, "E");
  g[14][52] = "e";
  g[16][51] = "P";
  g[17][52] = "p";

  fillRect(g, 28, 15, 12, 1, "B");
  fillRect(g, 30, 16, 8, 2, "b");

  fillRect(g, 2, 12, 3, 6, "w");
  fillRect(g, 55, 12, 3, 6, "w");
  g[13][3] = "P";
  g[14][3] = "p";
  g[15][3] = "P";
  g[13][56] = "G";
  g[14][57] = "g";

  return g;
}

const HUMAN_LAB_A: readonly string[] = [
  "..HHH..",
  ".HSSSH.",
  ".HLLLH.",
  "..TTT..",
  "..LLL..",
  ".L...L.",
  ".F...F.",
  "..FFF..",
];

const HUMAN_LAB_B: readonly string[] = [
  "..HHH..",
  ".HSSSH.",
  ".HAAAH.",
  "..BBB..",
  "..BBB..",
  ".B...B.",
  ".F...F.",
  "..FFF..",
];

const HUMAN_LAB_C: readonly string[] = [
  "..HHH..",
  ".HSSSH.",
  ".HRRRH.",
  "..LLL..",
  "..LLL..",
  ".L...R.",
  ".F...F.",
  "..FFF..",
];

function PixelCanvas({ grid, scale = 2 }: { grid: Grid; scale?: number }) {
  const height = H * scale;
  const width = W * scale;

  return (
    <div
      className="macbook__pixel-canvas"
      style={{ width, height, position: "relative", imageRendering: "pixelated" }}
      aria-hidden
    >
      {grid.map((row, y) =>
        row.map((cell, x) => {
          const color = LAB_COLORS[cell];
          if (!color || color === "transparent") return null;
          return (
            <span
              key={`${x}-${y}`}
              style={{
                position: "absolute",
                left: x * scale,
                top: y * scale,
                width: scale,
                height: scale,
                backgroundColor: color,
              }}
            />
          );
        })
      )}
    </div>
  );
}

export function MacbookPixelHumans() {
  const grid = useMemo(() => {
    const next = buildLabGrid();
    drawSprite(next, HUMAN_LAB_A, 8, 20);
    drawSprite(next, HUMAN_LAB_B, 26, 20);
    drawSprite(next, HUMAN_LAB_C, 44, 20);
    return next;
  }, []);

  return (
    <div className="macbook__pixel-scene" aria-hidden>
      <PixelCanvas grid={grid} scale={2} />
      <div className="macbook__pixel-scanline" />
    </div>
  );
}
