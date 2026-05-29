# Otimizacao Inicial Do Build

Data: 2026-05-26.

Escopo: Task 15.8 da Fase 15, investigando o aviso de chunk grande do Vite e
separando o que for seguro sem inflar a arquitetura.

## Diagnostico

Antes da Task 15.8, o build sem `vite.config.ts` gerava um unico chunk JS
principal:

- `dist/assets/index-*.js`: ~1.303 kB, gzip ~352 kB.
- O Vite exibia aviso de chunk acima de 500 kB.

O conteudo desse chunk misturava codigo do jogo, sprites pequenos inlinados e
Phaser. A maior parte do tamanho vinha do Phaser 3, que chega como um modulo ESM
grande.

## Decisao

Criar `vite.config.ts` com separacao explicita de vendor e politica HD de assets:

- `phaser-vendor`: todos os modulos de `node_modules/phaser`.
- `vendor`: demais dependencias de `node_modules`, caso existam.
- `assetsInlineLimit`: 4096 bytes — externaliza sheets HD e PNGs grandes.
- `chunkSizeWarningLimit`: 1400 kB, documentado como limite aceito para o
  vendor do Phaser.

Isso nao reduz o tamanho total baixado no primeiro carregamento, mas melhora
cache e revisao: mudancas frequentes no jogo passam a invalidar o chunk pequeno
do app, nao o bundle inteiro com Phaser. Sheets e sprites grandes passam a ser
servidos como arquivos estaticos reutilizaveis.

## Preload HD (Task 18.11)

- `src/game/asset-load-policy.ts` define o que entra em `RUNTIME_IMAGE_ASSETS`.
- Com spritesheets ativos, PNGs legados de Pino e bosses ficam fora do preload.
- Sheets continuam em `SPRITESHEET_ASSETS` com celulas `128x128`.
- Testes: `tests/asset-load-policy.test.ts`.

## Resultado

Depois da configuracao:

- `dist/assets/index-*.js`: ~104 kB, gzip ~32 kB.
- `dist/assets/phaser-vendor-*.js`: ~1.199 kB, gzip ~319 kB.
- `dist/assets/rolldown-runtime-*.js`: ~0.56 kB, gzip ~0.36 kB.
- O build nao exibe mais o aviso de chunk grande.

## Assets

- Audio ja sai como arquivos separados em `dist/assets/*.wav`; nao ha ganho
  claro em mexer nesse fluxo agora.
- Sprites e tiles pequenos continuam inlinados pelo limite padrao do Vite. Como
  o chunk do app ficou em ~104 kB, nao ha motivo imediato para externalizar
  esses PNGs.

## Proximo Passo Futuro

Se o jogo crescer muito, avaliar carregamento por fase para audio/assets
especificos. Isso e mais relevante do que dividir artificialmente o Phaser agora.
