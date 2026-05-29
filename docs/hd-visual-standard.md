# Padrao Visual HD Oficial

Data: 2026-05-29.

Escopo: baseline definitivo apos a Fase 18. Este documento consolida escala,
spritesheets, preload e leitura de gameplay. O plano historico da migracao
permanece em `docs/phase-18-hd-migration-plan.md`.

## Escala Global

| Constante              | Valor oficial                          | Onde vive                          |
| ---------------------- | -------------------------------------- | ---------------------------------- |
| Resolucao logica       | `960x540` (16:9)                       | `src/game/constants.ts`            |
| Tile base              | `32x32` px                             | `src/game/constants.ts`            |
| Escala fisica espacial | `WORLD_PHYSICS_SCALE = 2`              | `src/game/constants.ts`            |
| Baseline legado        | `480x270`, tile `16` (somente migracao)| `src/game/scale.ts`                |

Regras:

- Novos mapas, traps e colisoes usam a grade de **32px**.
- Fases declarativas em arquivos `level-*.ts` permanecem em coordenadas legadas;
  o runtime aplica `migrateLegacyLevelDefinition` em `src/data/levels/registry.ts`.
- Conversões pontuais de layout usam `src/game/scale.ts` (`scaleLegacyX/Y/Px`).

## Personagem (Pino)

| Aspecto           | Valor runtime oficial |
| ----------------- | --------------------- |
| Visual            | `32x48` px            |
| Hitbox            | `20x36` px (menor)    |
| Pivot             | centro inferior       |
| Fonte de animacao | spritesheets HD       |

Spritesheets:

- `assets/spritesheets/player-pino-core-512.png` — locomocao e estados base.
- `assets/spritesheets/player-pino-energy-512.png` — Carga, Centelha, Rajada.
- Celulas `128x128`, sheet `512x512` (grade 4x4).
- Registry: `src/data/characters/pino-spritesheet-registry.ts`.
- Modo ativo: `ACTIVE_PINO_FRAME_SOURCE_MODE = spritesheets` em
  `pino-animations.ts`.

Geracao: `npm run assets:pino-sheets`.

## Bosses

| Boss        | Visual runtime | Sheet                                      |
| ----------- | -------------- | ------------------------------------------ |
| Hirolito    | `96x112`       | `assets/spritesheets/boss-hirolito-sheet-512.png` |
| Dr. Imports | `96x128`       | `assets/spritesheets/boss-dr-imports-sheet-512.png` |
| Giga Fabio  | `120x128`      | `assets/spritesheets/boss-giga-fabio-sheet-512.png` |

- Celulas `128x128`, sheets `512x512`.
- Registry: `src/data/characters/boss-spritesheet-registry.ts`.
- Perfis de exibicao: `BOSS_HD_VISUAL_PROFILES`.

Geracao: `npm run assets:boss-sheets`.

## Ambiente, Traps E Itens

- Tilesets `32x32`: `assets/tilesets/lab-*.png`.
- Sprites de gameplay `32x32` (traps, itens, marcadores, energia): `assets/sprites/`.
- Projéteis pequenos: `16x16` nativos (`PROJECTILE_SPRITE_SIZE` em
  `src/data/art/gameplay-sprites.ts`).
- Geracao: `npm run assets:environment`.

Paleta semantica: `src/data/art/visual-direction.ts` e
`src/game/systems/visual-readability.ts`.

## Spritesheets — Convencoes

Documento de referencia: `src/data/art/spritesheet-conventions.ts`.

- Celula padrao: `128x128`.
- Tamanhos de sheet permitidos: `512x512` (4x4) e `1024x1024` (8x8).
- Export: PNG pixel art, sem antialias, sem compressao lossy.
- Nomes: `assets/spritesheets/<dominio>-<nome>-<tamanho>.png` em kebab-case.

## Preload E Anti-Duplicacao

Politica: `src/game/asset-load-policy.ts`.

- Runtime preloada `RUNTIME_IMAGE_ASSETS` via `PreloadScene` (somente gameplay HD
  e tilesets; sem PNG legado de personagem).
- Musica de gameplay varia por bloco via `resolveGameplayMusicAudioId()` (fases
  01-03, 04-06, 07-10); ver `docs/task-19.2-polish-checklist.md`.
- PNG legados arquivados em `assets/legacy/`; importados apenas por
  `src/game/legacy-character-image-assets.ts` (fora do bundle principal).
- Sheets carregadas em `SPRITESHEET_ASSETS`.
- Testes: `tests/asset-load-policy.test.ts`, `tests/legacy-asset-cleanup.test.ts`.

## Leitura E Depth

- Escada unica: `DEPTH_LAYERS` em `visual-readability.ts`.
- Perigos e projeteis acima do jogador; efeitos de energia abaixo dos hazards.
- Hazard pequeno: lado `<= 32px` (`smallHazardMaxSizePx = TILE_SIZE_PX`).
- Alpha maximo de efeitos largos: `0.56`.

## Performance E Build

- Vite: `assetsInlineLimit: 4096`, chunk `phaser-vendor` separado.
- Metas: media `>= 58 FPS`, respawn `450ms`, sem preload duplicado.
- Docs: `docs/hd-performance-stability-check.md`, `docs/build-optimization.md`.

## QA

- Checklist manual: `docs/hd-migration-qa-checklist.md`.
- Hooks dev: `readScaleInfo()`, `readPlayerHitbox()` — `docs/dev-qa-tools.md`.
- Testes de campanha HD: `tests/hd-campaign-content.test.ts`.

## Scripts De Assets

```sh
npm run assets:pino-sheets
npm run assets:boss-sheets
npm run assets:environment
```

Registro de licenca e origem: `assets/ASSETS.md`.
