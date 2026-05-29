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

function drawSolidBlock() {
  const c = new Canvas(32, 32);
  const base = PALETTE.metal;
  const light = shade(base, 1.22);
  const dark = shade(base, 0.68);
  const grass = PALETTE.grass;
  const grassLight = PALETTE.grassLight;

  c.rect(0, 0, 32, 32, base);
  // grama no topo (Stardew: blocos de chao com capa verde)
  c.rect(0, 0, 32, 6, grass);
  c.hline(0, 0, 32, grassLight);
  for (let x = 2; x < 32; x += 5) {
    c.px(x, 1, grassLight);
    c.px(x + 1, 2, shade(grass, 1.1));
  }
  // textura de terra/pedra
  for (let y = 8; y < 30; y += 5) {
    c.hline(3, y, 26, shade(base, y % 10 === 3 ? 1.05 : 0.92), 80);
  }
  c.hline(0, 31, 32, dark);
  c.vline(31, 6, 26, shade(base, 0.55), 100);
  c.hline(6, 6, 26, light, 60);
  // detalhe simpatico: flor pequena
  c.px(24, 4, [0xff, 0x6b, 0x9d]);
  c.px(25, 3, PALETTE.hero);
  return c;
}

function drawPlatform() {
  const c = new Canvas(32, 32);
  const wood = PALETTE.wood;
  const woodLight = PALETTE.woodLight;
  const dark = shade(wood, 0.55);

  c.rect(0, 0, 32, 32, shade(wood, 0.75));
  // tabuas de madeira (Stardew-style)
  c.rect(0, 0, 32, 8, wood);
  c.hline(0, 0, 32, woodLight);
  c.hline(0, 7, 32, dark);
  for (let x = 0; x < 32; x += 8) {
    c.vline(x, 0, 8, dark, 120);
  }
  c.hline(0, 4, 32, shade(wood, 0.85), 80);
  // suporte inferior
  for (let x = 4; x < 32; x += 8) {
    c.rect(x, 10, 3, 20, shade(wood, 0.45));
  }
  c.hline(0, 31, 32, PALETTE.shadow);
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
  const c = new Canvas(32, 32);
  const red = PALETTE.hazard;
  const light = shade(red, 1.2);
  const dark = shade(red, 0.65);
  const base = mix(PALETTE.dirt, PALETTE.metal, 0.4);

  c.rect(0, 26, 32, 6, base);
  c.hline(0, 26, 32, shade(base, 1.15));
  c.hline(0, 31, 32, PALETTE.shadow);

  const teeth = 4;
  const w = 32 / teeth;
  for (let t = 0; t < teeth; t += 1) {
    const cx = Math.round(t * w + w / 2);
    for (let y = 0; y < 26; y += 1) {
      const half = Math.round(((y / 25) * (w / 2 - 1)) + 0.0001);
      for (let x = cx - half; x <= cx + half; x += 1) {
        c.px(x, y, red);
      }
      c.px(cx - half, y, light);
      c.px(cx + half, y, dark);
    }
    c.px(cx, 0, mix(red, PALETTE.text, 0.4));
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
  const c = drawSolidBlock();
  // tell discreto de armadilha: costura roxa interna
  const trap = PALETTE.specialTrap;
  c.hline(9, 16, 14, trap, 150);
  c.px(8, 16, shade(trap, 0.6), 150);
  c.px(23, 16, shade(trap, 0.6), 150);
  c.px(16, 15, shade(trap, 1.3), 120);
  return c;
}

function drawFallingPlatform() {
  const c = new Canvas(32, 32);
  const base = PALETTE.metal;
  const light = shade(base, 1.3);

  c.rect(0, 0, 32, 14, base);
  c.bevel(0, 0, 32, 14, light, shade(base, 0.5));
  // borda ciano (instavel)
  c.outline(0, 0, 32, 14, mix(PALETTE.safe, base, 0.15));
  // alerta inferior: tracejado de perigo
  for (let x = 1; x < 32; x += 4) {
    c.rect(x, 15, 2, 2, PALETTE.hazard);
  }
  // pino central de fixacao soltando
  c.rect(14, 16, 4, 3, shade(base, 0.4));
  return c;
}

function drawBreakableFloor() {
  const c = new Canvas(32, 32);
  const base = shade(PALETTE.metal, 0.92);
  const light = shade(base, 1.25);
  const dark = shade(base, 0.5);

  c.rect(0, 0, 32, 32, base);
  c.bevel(0, 0, 32, 32, light, dark);
  c.hline(0, 31, 32, PALETTE.shadow);

  // rachaduras vermelhas legiveis (vai quebrar)
  const crack = PALETTE.hazard;
  const cracks = [
    [6, 2],
    [7, 6],
    [10, 9],
    [9, 14],
    [12, 18],
    [11, 23],
    [14, 28],
    [20, 3],
    [22, 8],
    [19, 12],
    [23, 16],
    [21, 21],
    [24, 26],
  ];
  let prev = null;
  for (const [x, y] of cracks) {
    c.px(x, y, crack);
    c.px(x, y + 1, shade(crack, 0.7));
    if (prev) {
      const steps = Math.max(Math.abs(x - prev[0]), Math.abs(y - prev[1]));
      for (let s = 1; s < steps; s += 1) {
        const t = s / steps;
        c.px(
          Math.round(prev[0] + (x - prev[0]) * t),
          Math.round(prev[1] + (y - prev[1]) * t),
          crack,
          200,
        );
      }
    }
    prev = [x, y];
  }
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
