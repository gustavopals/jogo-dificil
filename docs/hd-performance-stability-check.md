# Performance E Estabilidade HD

Data: 2026-05-29.

Escopo: Task 18.11 da Fase 18, validando custo de runtime na base 960x540 com
efeitos ativos, respawns repetidos e preload enxuto de assets HD.

Referencia de metas: `docs/phase-18-hd-migration-plan.md` (secao 3).

## Ambiente

- Resolucao logica: `960x540`, tile `32`, `worldPhysicsScale = 2`.
- Viewport de teste: 960x540 (Playwright/Chromium).
- Build de producao: `npm run build`.
- Preload runtime: `RUNTIME_IMAGE_ASSETS` (sem PNG legado duplicado de Pino/boss).

## Resultado Medido Nesta Rodada

### Build e pacote

- `assetsInlineLimit`: 4096 bytes — sheets HD e PNGs grandes saem como arquivos
  separados em `dist/assets/` (melhor cache HTTP).
- Chunks JS apos build:
  - app (`index-*.js`): ~230 kB, gzip ~73 kB.
  - `phaser-vendor`: ~1.199 kB, gzip ~319 kB.
  - runtime rolldown: ~0.56 kB.
- Audio continua em WAV separados; sem regressao de preload.

### Preload e memoria de textura

- Modo HD ativo (`ACTIVE_PINO_FRAME_SOURCE_MODE = spritesheets`).
- PNGs legados do Pino (20 frames) e bosses (3 placeholders) **nao** entram no
  preload de runtime.
- Sheets carregadas: 2 do Pino + 3 de bosses (`512x512`, celulas `128x128`).
- Regra automatizada: `tests/asset-load-policy.test.ts`.

### Contratos automatizados de estabilidade

- `tests/performance-stability.test.ts`: 60 respawns com traps/projeteis/reset.
- `tests/hd-performance-stability.test.ts`: 40 ciclos com projéteis em escala
  HD e lote de 12 `Centelha Ciano` simuladas por 30 ticks.
- `tests/asset-load-policy.test.ts`: impede preload duplicado legacy + sheet.

### Metas de runtime (referencia)

| Metrica                         | Alvo HD                          | Status nesta task        |
| ------------------------------- | -------------------------------- | ------------------------ |
| FPS medio em fluxo normal       | >= 58 FPS                        | Revalidar no navegador   |
| Respawn/restart                 | 300-600 ms                       | Contrato existente (450) |
| Crescimento apos 30 mortes      | Sem leak de objetos/sons         | Contrato unitario OK     |
| Duplicacao legacy/sheet no preload | Proibida                    | Teste + policy OK        |

## Medicao Manual Recomendada

1. `npm run dev -- --host 127.0.0.1 --port 5173`
2. Abrir `level-07` ou arena de boss com QA hooks.
3. Disparar energia + dash + projéteis de trap em sequencia.
4. Confirmar FPS estavel e ausencia de `console.error`.
5. Usar checklist: `docs/hd-migration-qa-checklist.md`.

## Observacoes

- PNGs legados permanecem no repositorio para pipeline/fallback, mas nao devem
  ser preloaded junto com sheets HD (ver `assets/ASSETS.md`).
- Remocao fisica dos PNGs legados do bundle fica para a Task 18.12, quando a
  migracao HD virar baseline oficial documentado.
