import fs from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

// Gera arte de ambiente e efeitos em HD (Fase 18, Task 18.9).
// Tilesets 32x32 e sprites de gameplay desenhados em pixel art nativo,
// seguindo a paleta semantica de `src/data/art/visual-direction.ts`:
// perigo (vermelho), energia/seguro (ciano), foco/coletavel (amarelo),
// saida/tell (coral) e trap especial (roxo). Sem antialias: cada pixel
// e colocado de forma deliberada.

const ROOT = process.cwd();
const SPRITE_DIR = path.join(ROOT, "assets", "sprites");
const TILESET_DIR = path.join(ROOT, "assets", "tilesets");

const PALETTE = {
  void: [0x5a, 0x7a, 0x92],
  panel: [0xa8, 0xc8, 0xd8],
  metal: [0x9a, 0x85, 0x72],
  text: [0xf5, 0xf7, 0xfb],
  shadow: [0x3a, 0x32, 0x28],
  safe: [0x6b, 0xae, 0x5a],
  hero: [0xf4, 0xd3, 0x5e],
  hazard: [0xd4, 0x5a, 0x5a],
  exit: [0xe7, 0x6f, 0x51],
  specialTrap: [0x9b, 0x5d, 0xe5],
  grass: [0x6b, 0xae, 0x5a],
  grassLight: [0x8f, 0xcf, 0x6d],
  wood: [0xb8, 0x7a, 0x4a],
  woodLight: [0xd4, 0x9a, 0x5c],
  dirt: [0x8c, 0x6b, 0x4a],
};

function clampByte(value) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

// Clareia (factor > 1) ou escurece (factor < 1) uma cor base mantendo o tom.
function shade(color, factor) {
  return [
    clampByte(color[0] * factor),
    clampByte(color[1] * factor),
    clampByte(color[2] * factor),
  ];
}

function mix(a, b, t) {
  return [
    clampByte(a[0] + (b[0] - a[0]) * t),
    clampByte(a[1] + (b[1] - a[1]) * t),
    clampByte(a[2] + (b[2] - a[2]) * t),
  ];
}

class Canvas {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.data = new Uint8Array(width * height * 4);
  }

  px(x, y, color, alpha = 255) {
    const ix = Math.round(x);
    const iy = Math.round(y);
    if (ix < 0 || iy < 0 || ix >= this.width || iy >= this.height) {
      return;
    }
    const i = (iy * this.width + ix) * 4;
    this.data[i] = color[0];
    this.data[i + 1] = color[1];
    this.data[i + 2] = color[2];
    this.data[i + 3] = alpha;
  }

  rect(x, y, w, h, color, alpha = 255) {
    for (let yy = y; yy < y + h; yy += 1) {
      for (let xx = x; xx < x + w; xx += 1) {
        this.px(xx, yy, color, alpha);
      }
    }
  }

  hline(x, y, w, color, alpha = 255) {
    this.rect(x, y, w, 1, color, alpha);
  }

  vline(x, y, h, color, alpha = 255) {
    this.rect(x, y, 1, h, color, alpha);
  }

  outline(x, y, w, h, color, alpha = 255) {
    this.hline(x, y, w, color, alpha);
    this.hline(x, y + h - 1, w, color, alpha);
    this.vline(x, y, h, color, alpha);
    this.vline(x + w - 1, y, h, color, alpha);
  }

  // Bisel de bloco: highlight no topo/esquerda, sombra na base/direita.
  bevel(x, y, w, h, lightColor, darkColor, alpha = 255) {
    this.hline(x, y, w, lightColor, alpha);
    this.vline(x, y, h, lightColor, alpha);
    this.hline(x, y + h - 1, w, darkColor, alpha);
    this.vline(x + w - 1, y, h, darkColor, alpha);
  }

  // Losango/diamante centrado preenchido.
  diamond(cx, cy, radius, color, alpha = 255) {
    for (let yy = -radius; yy <= radius; yy += 1) {
      const span = radius - Math.abs(yy);
      for (let xx = -span; xx <= span; xx += 1) {
        this.px(cx + xx, cy + yy, color, alpha);
      }
    }
  }

  disc(cx, cy, radius, color, alpha = 255) {
    for (let yy = -radius; yy <= radius; yy += 1) {
      for (let xx = -radius; xx <= radius; xx += 1) {
        if (xx * xx + yy * yy <= radius * radius) {
          this.px(cx + xx, cy + yy, color, alpha);
        }
      }
    }
  }

  ring(cx, cy, radius, thickness, color, alpha = 255) {
    const inner = radius - thickness;
    for (let yy = -radius; yy <= radius; yy += 1) {
      for (let xx = -radius; xx <= radius; xx += 1) {
        const d = xx * xx + yy * yy;
        if (d <= radius * radius && d > inner * inner) {
          this.px(cx + xx, cy + yy, color, alpha);
        }
      }
    }
  }

  async save(file) {
    await sharp(Buffer.from(this.data.buffer), {
      raw: { width: this.width, height: this.height, channels: 4 },
    })
      .png({ compressionLevel: 9 })
      .toFile(file);
  }
}

// ---------------------------------------------------------------------------
// Tilesets 32x32 (repetiveis em grade)
// ---------------------------------------------------------------------------

// Helper: preenche uma célula de tijolo com bevel e textura sutil.
function fillBrick(c, x, y, w, h) {
  const face  = [0x78, 0x64, 0x50];
  const tex   = [0x6c, 0x58, 0x48];
  const eTop  = [0x9c, 0x88, 0x72];
  const eLight= [0x8a, 0x76, 0x62];
  const eDark = [0x44, 0x36, 0x2a];
  c.rect(x, y, w, h, face);
  // textura granulada sutil
  for (let iy = y + 2; iy < y + h - 1; iy++) {
    for (let ix = x + 2; ix < x + w - 1; ix++) {
      if ((ix * 7 + iy * 11) % 13 === 0) c.px(ix, iy, tex, 140);
    }
  }
  // bevel direcional: luz no topo/esquerda, sombra na base/direita
  c.hline(x, y, w, eTop);
  c.vline(x, y + 1, h - 1, eLight);
  c.hline(x + 1, y + h - 1, w - 1, eDark);
  c.vline(x + w - 1, y + 1, h - 2, eDark);
}

function drawSolidBlock() {
  // Pedra em padrão de tijolos offset — funciona em caverna, floresta e templo.
  const c = new Canvas(32, 32);
  const mortar = [0x1e, 0x16, 0x10];
  c.rect(0, 0, 32, 32, mortar);
  // Fileira 1 (y 0-12): dois tijolos
  fillBrick(c,  0,  0, 14, 13);
  fillBrick(c, 15,  0, 17, 13);
  // Fileira 2 (y 14-31): três tijolos offset (meio | inteiro | meio)
  fillBrick(c,  0, 14,  8, 18);
  fillBrick(c,  9, 14, 14, 18);
  fillBrick(c, 24, 14,  8, 18);
  return c;
}

function drawPlatform() {
  // Prancha de madeira escura com acabamento metálico.
  const c = new Canvas(32, 32);
  const wood      = [0x5a, 0x3c, 0x20];
  const woodGrain = [0x72, 0x50, 0x2e];
  const woodDark  = [0x36, 0x22, 0x10];
  const woodEdge  = [0x84, 0x5c, 0x38];
  const metal     = [0xa8, 0xb0, 0xb8];
  const metalDark = [0x68, 0x70, 0x78];
  const support   = [0x3c, 0x26, 0x14];

  // Superfície da plataforma (y 0-11): 3 pranchas com grão horizontal
  c.rect(0, 0, 32, 12, wood);
  for (let y = 2; y <= 9; y += 2) c.hline(0, y, 32, woodGrain, 110);
  // Divisórias entre pranchas
  c.vline(10, 0, 12, woodDark, 230);
  c.vline(21, 0, 12, woodDark, 230);
  // Highlight na borda esquerda de cada prancha
  c.vline( 0, 1, 10, woodEdge, 160);
  c.vline(11, 1, 10, woodEdge, 130);
  c.vline(22, 1, 10, woodEdge, 130);
  // Trim metálico no topo (a aresta mais visível ao jogador)
  c.hline(0, 0, 32, metal);
  c.px( 4, 0, metalDark);
  c.px(15, 0, metalDark);
  c.px(27, 0, metalDark);
  // Sombra na base da superfície
  c.hline(0, 11, 32, woodDark);
  c.hline(0, 12, 32, [0x24, 0x16, 0x08], 180);
  // Pilar de suporte central (y 14-30)
  c.rect(12, 14, 8, 17, support);
  c.vline(12, 14, 17, shade(support, 1.35), 200);
  c.vline(19, 14, 17, shade(support, 0.60), 200);
  c.hline(12, 14,  8, shade(support, 1.40), 180);
  c.hline(0, 31, 32, PALETTE.shadow, 90);
  return c;
}

function drawBackgroundPanel() {
  const c = new Canvas(32, 32);
  const sky = PALETTE.panel;
  const cloud = mix(PALETTE.text, sky, 0.35);
  const hill = mix(PALETTE.grass, PALETTE.dirt, 0.3);

  c.rect(0, 0, 32, 32, sky);
  // gradiente suave de ceu
  for (let y = 0; y < 20; y += 1) {
    c.hline(0, y, 32, mix(sky, PALETTE.void, y / 40), 255);
  }
  // colina distante simpatica
  for (let x = 0; x < 32; x += 1) {
    const hillY = 22 + Math.round(Math.sin(x / 5) * 2);
    c.hline(x, hillY, 1, hill, 180);
    c.hline(x, hillY + 1, 1, shade(hill, 0.8), 140);
  }
  // nuvem pixel pequena
  c.disc(10, 8, 3, cloud, 100);
  c.disc(14, 9, 2, cloud, 80);
  c.disc(24, 6, 2, cloud, 70);
  return c;
}

function drawSpikes() {
  // Espinhos metálicos ameaçadores com pontas vermelho-sangue.
  const c = new Canvas(32, 32);
  const baseFill    = [0x1e, 0x1a, 0x16];
  const baseEdge    = [0x34, 0x2e, 0x2a];
  const spikeDark   = [0x70, 0x0c, 0x0c];
  const spikeMid    = [0xac, 0x1e, 0x1e];
  const spikeBright = [0xd2, 0x38, 0x2a];
  const spikeTip    = [0xf0, 0x74, 0x5e];

  // Base metálica (y 26-31)
  c.rect(0, 26, 32, 6, baseFill);
  c.hline(0, 26, 32, baseEdge);
  c.hline(0, 31, 32, shade(baseFill, 0.6));
  for (let x = 3; x < 30; x += 5) c.px(x, 28, baseEdge, 120);

  const teeth = 4;
  const tw = 32 / teeth;
  for (let t = 0; t < teeth; t++) {
    const cx = t * tw + tw / 2; // centros: 4, 12, 20, 28
    for (let y = 0; y < 26; y++) {
      const half = Math.max(0.5, (y / 25) * (tw / 2 - 1));
      const x0 = Math.round(cx - half);
      const x1 = Math.round(cx + half);
      for (let x = x0; x <= x1; x++) {
        let col;
        if (y <= 2) {
          col = spikeTip;
        } else if (x === x0) {
          col = spikeBright; // borda esquerda iluminada
        } else if (x === x1) {
          col = spikeDark;   // borda direita em sombra
        } else if (x <= cx) {
          col = spikeMid;    // interior esquerdo (mais claro)
        } else {
          col = spikeDark;   // interior direito (mais escuro)
        }
        c.px(x, y, col);
      }
    }
    // Ponto extra brilhante na ponta absoluta
    c.px(Math.round(cx), 0, mix(spikeTip, [0xff, 0xff, 0xff], 0.35));
  }
  return c;
}

// ---------------------------------------------------------------------------
// Sprites de trap (32x32, projetil 16x16)
// ---------------------------------------------------------------------------

function drawTrapSpikes() {
  // Trap de spike-pop: espinhos iguais ao hazard para leitura consistente.
  return drawSpikes();
}

function drawFalseBlock() {
  // Tijolo idêntico ao normal com uma costura roxa quase imperceptível.
  const c = drawSolidBlock();
  const trap = PALETTE.specialTrap;
  c.hline(9, 16, 14, trap, 130);
  c.px( 8, 16, shade(trap, 0.55), 120);
  c.px(23, 16, shade(trap, 0.55), 120);
  c.px(16, 15, shade(trap, 1.35), 100);
  return c;
}

function drawFallingPlatform() {
  // Plataforma instável: superfície igual à normal mas com alertas de queda.
  const c = drawPlatform();
  const crack = PALETTE.hazard;
  const cyan  = PALETTE.safe;
  // Contorno de alerta (borda oscila entre ciano e perigo)
  c.outline(0, 0, 32, 12, mix(cyan, crack, 0.45), 170);
  // Micro-fendas na superfície
  c.px( 6, 3, crack, 200); c.px( 7, 6, crack, 200); c.px( 8, 9, crack, 180);
  c.px(25, 2, crack, 200); c.px(24, 5, crack, 200); c.px(26, 8, crack, 180);
  // Pontos de alerta abaixo da superfície
  for (let x = 2; x < 32; x += 5) c.px(x, 13, crack, 150);
  return c;
}

function drawBreakableFloor() {
  // Tijolo que vai quebrar: rachaduras vermelhas atravessam o padrão de pedra.
  const c = drawSolidBlock();
  const crack      = PALETTE.hazard;
  const crackDark  = shade(PALETTE.hazard, 0.50);
  const crackLight = mix(PALETTE.hazard, PALETTE.text, 0.42);

  // Interpolação suave entre pontos de rachadura
  function drawCrack(pts, alpha) {
    let prev = null;
    for (const [x, y] of pts) {
      c.px(x, y, crack, alpha);
      if (prev) {
        const [px, py] = prev;
        const steps = Math.max(Math.abs(x - px), Math.abs(y - py));
        for (let s = 1; s < steps; s++) {
          c.px(
            Math.round(px + (x - px) * s / steps),
            Math.round(py + (y - py) * s / steps),
            crack,
            Math.round(alpha * 0.8),
          );
        }
      }
      prev = [x, y];
    }
  }

  // Rachadura principal (diagonal esquerda)
  drawCrack([[8, 0], [8, 4], [10, 8], [9, 13], [11, 18], [10, 24], [12, 31]], 230);
  // Rachadura secundária (diagonal direita)
  drawCrack([[22, 2], [21, 7], [23, 12], [22, 18], [24, 25]], 200);
  // Pontos brilhantes nas origens das rachaduras (leitura imediata)
  c.px(8,  0, crackLight, 230);
  c.px(22, 2, crackLight, 200);
  // Sombra ao lado das fissuras
  c.px( 9, 4, crackDark, 160);
  c.px(11, 8, crackDark, 140);
  c.px(23, 7, crackDark, 140);
  return c;
}

function drawTrapProjectile() {
  const c = new Canvas(16, 16);
  const purple = PALETTE.specialTrap;
  c.diamond(8, 8, 6, shade(purple, 0.7));
  c.diamond(8, 8, 5, purple);
  c.diamond(8, 8, 2, shade(purple, 1.4));
  c.px(8, 8, PALETTE.text);
  // rastro de pontas claras
  c.px(2, 8, shade(purple, 1.3));
  c.px(14, 8, shade(purple, 1.3));
  return c;
}

// ---------------------------------------------------------------------------
// Sprites de energia (Centelha/Rajada Ciano)
// ---------------------------------------------------------------------------

function drawEnergySpark() {
  const c = new Canvas(16, 16);
  const cyan = PALETTE.safe;
  c.diamond(8, 8, 6, cyan, 90);
  c.diamond(8, 8, 4, cyan, 200);
  c.diamond(8, 8, 2, mix(cyan, PALETTE.text, 0.6));
  c.px(8, 8, PALETTE.text);
  // streak horizontal
  c.hline(1, 8, 14, cyan, 120);
  return c;
}

function drawEnergyBurstBeam() {
  // Segmento tileavel horizontal do feixe.
  const c = new Canvas(32, 32);
  const cyan = PALETTE.safe;
  // nucleo brilhante central, bordas translucidas para nao tapar hazards
  c.rect(0, 13, 32, 6, cyan, 150);
  c.rect(0, 14, 32, 4, mix(cyan, PALETTE.text, 0.4), 210);
  c.hline(0, 15, 32, PALETTE.text, 235);
  c.hline(0, 16, 32, PALETTE.text, 235);
  // faiscas que correm pelo feixe
  for (let x = 2; x < 32; x += 8) {
    c.px(x, 12, cyan, 180);
    c.px(x + 4, 19, cyan, 180);
  }
  return c;
}

function drawEnergyImpact() {
  const c = new Canvas(32, 32);
  const cyan = PALETTE.safe;
  c.disc(16, 16, 11, cyan, 70);
  c.disc(16, 16, 7, cyan, 150);
  c.disc(16, 16, 4, mix(cyan, PALETTE.text, 0.5), 230);
  c.disc(16, 16, 2, PALETTE.text);
  // estrela de impacto
  for (const [dx, dy] of [
    [0, -13],
    [0, 13],
    [-13, 0],
    [13, 0],
    [-9, -9],
    [9, -9],
    [-9, 9],
    [9, 9],
  ]) {
    c.px(16 + dx, 16 + dy, PALETTE.text, 210);
    c.px(16 + Math.round(dx * 0.6), 16 + Math.round(dy * 0.6), cyan, 220);
  }
  return c;
}

function drawEnergyTargetActive() {
  const c = new Canvas(32, 32);
  const cyan = PALETTE.safe;
  const yellow = PALETTE.hero;
  c.disc(16, 16, 13, shade(cyan, 0.5), 80);
  c.ring(16, 16, 12, 2, cyan);
  c.ring(16, 16, 9, 1, shade(cyan, 1.3), 200);
  c.disc(16, 16, 6, shade(yellow, 0.8));
  c.disc(16, 16, 4, yellow);
  c.disc(16, 16, 2, mix(yellow, PALETTE.text, 0.6));
  // marcas cardinais
  for (const [dx, dy] of [
    [0, -12],
    [0, 12],
    [-12, 0],
    [12, 0],
  ]) {
    c.px(16 + dx, 16 + dy, PALETTE.text);
  }
  return c;
}

function drawCrackedBlockBroken() {
  const c = new Canvas(32, 32);
  const base = shade(PALETTE.metal, 0.8);
  c.rect(0, 0, 32, 32, base, 235);
  c.bevel(0, 0, 32, 32, shade(base, 1.2), shade(base, 0.5), 235);
  // fendas claras de bloco partido
  const fissure = mix(PALETTE.safe, PALETTE.text, 0.3);
  const seams = [
    [16, 0],
    [15, 5],
    [17, 10],
    [16, 15],
    [14, 20],
    [16, 26],
    [16, 31],
    [0, 16],
    [6, 15],
    [11, 17],
    [21, 15],
    [26, 17],
    [31, 16],
  ];
  for (const [x, y] of seams) {
    c.px(x, y, fissure);
  }
  // quina superior direita faltando (fragmentado)
  c.rect(24, 0, 8, 7, base, 0);
  c.px(24, 7, PALETTE.shadow, 180);
  c.px(31, 7, PALETTE.shadow, 180);
  return c;
}

// ---------------------------------------------------------------------------
// Itens (32x32)
// ---------------------------------------------------------------------------

function drawRequiredChip() {
  const c = new Canvas(32, 32);
  const yellow = PALETTE.hero;
  const cyan = PALETTE.safe;
  c.rect(9, 9, 14, 14, shade(yellow, 0.7));
  c.bevel(9, 9, 14, 14, shade(yellow, 1.25), shade(yellow, 0.5));
  c.rect(12, 12, 8, 8, cyan);
  c.rect(14, 14, 4, 4, mix(cyan, PALETTE.text, 0.5));
  // pernas de chip
  for (const x of [11, 15, 19]) {
    c.vline(x, 6, 3, shade(yellow, 1.2));
    c.vline(x, 23, 3, shade(yellow, 1.2));
  }
  for (const y of [11, 15, 19]) {
    c.hline(6, y, 3, shade(yellow, 1.2));
    c.hline(23, y, 3, shade(yellow, 1.2));
  }
  return c;
}

function drawMechanismKey() {
  const c = new Canvas(32, 32);
  const coral = PALETTE.exit;
  const light = shade(coral, 1.3);
  const dark = shade(coral, 0.55);
  // cabeca circular vazada
  c.ring(11, 11, 6, 3, coral);
  // highlight no arco superior-esquerdo
  c.px(7, 8, light);
  c.px(8, 7, light);
  c.px(9, 6, light);
  c.disc(11, 11, 2, PALETTE.void);
  // haste diagonal
  for (let i = 0; i < 13; i += 1) {
    c.px(15 + i, 15 + i, coral);
    c.px(15 + i, 16 + i, dark);
    c.px(16 + i, 15 + i, light);
  }
  // dentes da ponta
  c.rect(25, 25, 4, 2, coral);
  c.rect(22, 22, 2, 4, coral);
  return c;
}

function drawOptionalToken() {
  const c = new Canvas(32, 32);
  const cyan = PALETTE.safe;
  const yellow = PALETTE.hero;
  c.diamond(16, 16, 11, shade(cyan, 0.55), 110);
  c.diamond(16, 16, 9, cyan);
  c.diamond(16, 16, 6, shade(cyan, 1.2));
  c.diamond(16, 16, 4, yellow);
  c.px(16, 16, PALETTE.text);
  // contorno duro do losango
  for (let i = 0; i <= 9; i += 1) {
    c.px(16 - i, 16 - (9 - i), shade(cyan, 0.4));
    c.px(16 + i, 16 - (9 - i), shade(cyan, 0.4));
    c.px(16 - i, 16 + (9 - i), shade(cyan, 0.4));
    c.px(16 + i, 16 + (9 - i), shade(cyan, 0.4));
  }
  return c;
}

// ---------------------------------------------------------------------------
// Marcadores (32x32)
// ---------------------------------------------------------------------------

function drawCheckpointBase(active) {
  const c = new Canvas(32, 32);
  const accent = active ? PALETTE.safe : PALETTE.hero;
  const post = active ? mix(PALETTE.metal, PALETTE.safe, 0.2) : PALETTE.metal;
  // poste
  c.rect(13, 4, 6, 27, shade(post, 0.85));
  c.bevel(13, 4, 6, 27, shade(post, 1.3), shade(post, 0.5));
  c.hline(11, 31, 10, PALETTE.shadow);
  // bandeira/faixa
  c.rect(19, 6, 9, 7, shade(accent, active ? 1.0 : 0.8));
  c.outline(19, 6, 9, 7, shade(accent, 1.3), active ? 255 : 180);
  if (active) {
    // brilho ativo
    c.disc(16, 18, 3, accent, 120);
    c.px(16, 18, PALETTE.text);
    c.hline(19, 9, 9, PALETTE.text, 200);
  } else {
    c.hline(19, 9, 9, shade(accent, 0.6), 200);
  }
  return c;
}

function drawCheckpointInactive() {
  return drawCheckpointBase(false);
}

function drawCheckpointActive() {
  return drawCheckpointBase(true);
}

function drawExitMarker() {
  const c = new Canvas(32, 32);
  const coral = PALETTE.exit;
  const frame = shade(coral, 0.55);
  // batente da porta
  c.rect(6, 2, 20, 30, frame);
  c.rect(8, 4, 16, 28, coral);
  c.bevel(8, 4, 16, 28, shade(coral, 1.25), shade(coral, 0.6));
  // painel central claro (saida)
  c.rect(13, 8, 6, 18, mix(coral, PALETTE.text, 0.55));
  c.rect(14, 10, 4, 14, mix(coral, PALETTE.hero, 0.4));
  // maçaneta
  c.px(21, 18, PALETTE.text);
  c.px(21, 19, shade(coral, 0.5));
  // seta de saida
  c.hline(14, 16, 4, coral);
  return c;
}

// ---------------------------------------------------------------------------

const SPRITE_TASKS = [
  ["trap-spikes.png", drawTrapSpikes],
  ["trap-false-block.png", drawFalseBlock],
  ["trap-falling-platform.png", drawFallingPlatform],
  ["trap-breakable-floor.png", drawBreakableFloor],
  ["trap-projectile.png", drawTrapProjectile],
  ["energy-cyan-spark-projectile.png", drawEnergySpark],
  ["energy-cyan-burst-beam.png", drawEnergyBurstBeam],
  ["energy-impact.png", drawEnergyImpact],
  ["energy-target-active.png", drawEnergyTargetActive],
  ["energy-cracked-block-broken.png", drawCrackedBlockBroken],
  ["item-required-chip.png", drawRequiredChip],
  ["item-mechanism-key.png", drawMechanismKey],
  ["item-optional-token.png", drawOptionalToken],
  ["marker-checkpoint-inactive.png", drawCheckpointInactive],
  ["marker-checkpoint-active.png", drawCheckpointActive],
  ["marker-exit.png", drawExitMarker],
];

const TILESET_TASKS = [
  ["lab-solid-block.png", drawSolidBlock],
  ["lab-platform.png", drawPlatform],
  ["lab-background-panel.png", drawBackgroundPanel],
  ["lab-hazard-spikes.png", drawSpikes],
];

async function main() {
  await fs.mkdir(SPRITE_DIR, { recursive: true });
  await fs.mkdir(TILESET_DIR, { recursive: true });

  for (const [name, draw] of SPRITE_TASKS) {
    await draw().save(path.join(SPRITE_DIR, name));
  }
  for (const [name, draw] of TILESET_TASKS) {
    await draw().save(path.join(TILESET_DIR, name));
  }

  console.log(
    `Gerados ${SPRITE_TASKS.length} sprites e ${TILESET_TASKS.length} tilesets HD.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
