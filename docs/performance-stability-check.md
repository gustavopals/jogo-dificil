# Performance E Estabilidade Do MVP

Data: 2026-05-26.

Escopo: Task 12.4 da Fase 12, validando se o jogo suporta muitas tentativas
sem degradar perceptivelmente.

## Ambiente

- Chromium via Playwright, viewport 960x540.
- Dev server: `npm run dev` em `http://127.0.0.1:5173/`.
- Caminho Canvas usado com WebGL desativado no Chromium headless.
- Build de producao validado previamente na Task 12.3 e repetido nesta rodada
  com `npm run build`.

## Resultado Medido

- FPS desktop/headless:
  - 49 amostras coletadas durante 5 segundos.
  - Media: 60.16 FPS.
  - Minimo: 60.00 FPS.
  - Maximo: 60.58 FPS.
- Repeticao de morte/respawn:
  - 30 mortes seguidas por hazard de queda na Fase 1.
  - Contador chegou a `Mortes 30`.
  - Quantidade de objetos da `LevelScene` ficou estavel: minimo 18, maximo 18.
  - Nenhum `console.error` ou `pageerror`.
- Reset de traps/projeteis:
  - Plataforma que cai e projetil da Fase 2 foram ativados.
  - Reinicio com `R` limpou projeteis, markers de projetil, traps acionadas e
    plataformas desativadas.
  - Snapshot apos reset: `projectiles = 0`, `triggeredTraps = 0`,
    `disabledPlatforms = 0`, `projectileMarkerCount = 0`.
- Audio:
  - Durante 30 mortes, a contagem de sons ativos ficou entre 3 e 5.
  - Nao houve crescimento progressivo de handles ativos apos respawns repetidos.
  - Contrato unitario adicional cobre musica, variacoes de morte e respawn
    repetidos com contagem ativa limitada.

## Contratos Automatizados

- `tests/performance-stability.test.ts` cobre reset repetido de sala por 60
  tentativas, garantindo que projeteis, traps, plataforma que cai e objeto
  interativo voltem ao estado inicial.
- O mesmo arquivo cobre repeticao de musica, morte e respawn por 90 ciclos,
  mantendo apenas um handle ativo por audio relevante.

## Observacoes

- O aviso conhecido do Vite sobre chunk acima de 500 kB continua existindo e
  nao indicou degradacao perceptivel nesta medicao.
- A medicao headless confirma estabilidade tecnica inicial; playtest humano
  longo ainda deve validar cansaco, legibilidade e sensacao de ritmo.
