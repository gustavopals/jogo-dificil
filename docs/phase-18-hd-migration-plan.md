# Fase 18 - Migracao HD Pixel E Spritesheets

Data: 2026-05-29.

Status: **Migracao concluida.** O padrao oficial pos-migracao esta em
`docs/hd-visual-standard.md`. Este documento permanece como registro historico
do baseline congelado, metas e criterios de rollback usados durante a execucao.

Escopo original: Task 18.1 da Fase 18, congelando baseline tecnico atual e definindo
alvos oficiais da migracao para 960x540 + tile 32, com foco em qualidade
visual, legibilidade de gameplay e seguranca de execucao por IA.

## 1. Baseline Congelado (Estado Atual)

Este baseline e a referencia oficial para comparar regressao durante a migracao.

### 1.1 Escala de jogo

- Resolucao logica atual: `480x270` (`src/game/constants.ts`).
- Tile base atual: `16x16` (`src/game/constants.ts`).
- FPS alvo: `60` (`src/game/constants.ts` e `src/game/config.ts`).
- Canvas: `FIT`, `pixelArt: true`, `roundPixels: true`
  (`src/game/config.ts`).
- Deadzone da camera na fase: `8x5` tiles (128x80 px)
  (`src/game/scenes/level-scene.ts`).

### 1.2 Escala do personagem principal

- Pino visual atual: `14x26`.
- Hitbox atual: `10x22`.
- Margens atuais: esquerda/direita `2`, topo `3`, base `1`.
- Pivot atual: centro inferior (`0.5`, `1`).
- Animacao atual baseada em PNG por frame (sem spritesheet).

### 1.3 Escala de bosses e gameplay sprites

- Boss 1 (`Hirolito`): `48x56`.
- Boss 2 (`Dr. Imports`): `48x64`.
- Boss final (`Giga Fabio`): `64x80`.
- Projetis pequenos (trap/energia): `8x8`.
- Projetis de boss: `16x16` e `24x24`.
- Traps/itens/checkpoints/saida majoritariamente em celula de tile.

### 1.4 Escala dos mapas

- Altura base das fases: `270 px`.
- Larguras atuais variam entre `960`, `1440` e `768` px (dependendo da fase).
- Campanha ativa com 10 fases declarativas (`level-01` a `level-10`).

### 1.5 Baseline de performance e build

- Medicao registrada no MVP (headless): media ~`60 FPS`
  (`docs/performance-stability-check.md`).
- Build com chunking atual:
  - app: ~`104 kB` (gzip ~`32 kB`);
  - phaser-vendor: ~`1.199 kB` (gzip ~`319 kB`);
  (`docs/build-optimization.md`).
- Baseline recente de qualidade no roadmap:
  - lint, unitarios, build e smoke e2e passando no fechamento da Fase 17.

## 2. Metas Visuais Oficiais Da Migracao

Metas obrigatorias para considerar a Fase 18 bem-sucedida.

### 2.1 Escala global alvo

- Nova resolucao logica: `960x540`.
- Novo tile base: `32x32`.
- Manter composicao de tela em aproximadamente `30x17` tiles visiveis.
- Manter pixel art sem antialias e sem blur.

### 2.2 Metas do Pino

- Runtime visual alvo: faixa entre `48x96` e `64x128`.
- Hitbox alvo inicial: faixa entre `24x40` e `32x56`
  (sempre menor que o visual).
- Pipeline de animacao migra para spritesheet.
- Pino deve manter leitura clara em 1x (960x540) durante corrida, pulo e dash.

### 2.3 Metas dos bosses

- Runtime visual alvo por boss: faixa entre `96x96` e `128x160`.
- Weak point e tells devem permanecer legiveis sem zoom.
- Vida visual do boss deve continuar distinguivel de hazards e energia.

### 2.4 Metas de spritesheets

- Celula padrao para personagem e boss: `128x128`.
- Sheet padrao inicial: `512x512` (grade 4x4).
- Sheet expandido permitido: `1024x1024` para animacoes densas.
- Nomes e metadata de origem/licenca seguem `assets/ASSETS.md`.

### 2.5 Metas para UI e leitura de fase

- HUD nao pode cobrir area critica de gameplay.
- Checkpoints, saida, traps e itens devem continuar com leitura imediata.
- Efeitos de energia nao podem esconder hitbox de perigo.

## 3. Alvos De Performance E Qualidade

### 3.1 Alvos de runtime

- Dev e build devem sustentar alvo de `60 FPS` em fluxo normal.
- Quedas curtas abaixo de 60 sao aceitaveis em efeitos pesados, mas:
  - media de sessao de teste deve ficar >= `58 FPS`;
  - sem degradacao progressiva em 30 mortes/respawns sequenciais.

### 3.2 Alvos de estabilidade

- Zero `console.error` ou `pageerror` no smoke principal.
- Reset de sala deve limpar corretamente:
  - projeteis, traps acionadas, plataformas desativadas e estados temporarios.
- Respawn e reinicio com `R` devem manter tempo de retorno rapido
  (mesma janela de 300-600 ms como referencia inicial).

### 3.3 Alvos de build

- `npm run lint`, `npm run test`, `npm run build` e smoke e2e obrigatorios.
- Nenhum asset novo deve quebrar preload.
- Crescimento de build deve ser monitorado por fase para evitar explosao tardia.

## 4. Criterio De Rollback Por Fase

Rollback deve ser acionado quando houver regressao grave sem correcao rapida
no mesmo pacote de trabalho.

### 4.1 Gatilhos de rollback

- Campanha deixa de ser concluivel por softlock.
- Colisao do player fica injusta ou inconsistente em pontos basicos.
- Respawn/restart deixam de funcionar de forma previsivel.
- Smoke e2e principal quebra com erro critico de runtime.
- Queda de performance persistente com media < 58 FPS em cenário equivalente.

### 4.2 Como rollback e aplicado

- Reverter apenas o pacote da task atual (nao reverter trabalho validado anterior).
- Restaurar baseline da task anterior marcada como concluida.
- Registrar no `ROADMAP.md`:
  - motivo;
  - arquivo/area afetada;
  - evidencias (teste/erro/medicao);
  - proxima tentativa recomendada.

### 4.3 Regra de progresso seguro

- Migracao segue por etapas pequenas:
  1. infraestrutura;
  2. player;
  3. mapas piloto;
  4. bosses;
  5. polimento.
- Nao avancar para a proxima task sem validacao minima da atual.

## 5. Riscos Principais Da Migracao E Mitigacoes

### 5.1 Risco: perda do feeling de gameplay

- Sintoma: jogo fica lento, "pesado" ou injusto mesmo com arte melhor.
- Mitigacao:
  - recalibrar fisica cedo (Task 18.8);
  - comparar movimentos-chave com baseline congelado;
  - priorizar hitbox justa sobre fidelidade visual absoluta.

### 5.2 Risco: arte HD reduzir legibilidade de perigo

- Sintoma: trap/boss/energia confundem leitura em cenas caoticas.
- Mitigacao:
  - manter paleta semantica;
  - reforcar contraste entre perigo, energia e UI;
  - validar com checklists manuais por fase/boss.

### 5.3 Risco: aumento de custo de renderizacao e memoria

- Sintoma: stutter em combate, subida de uso de GPU/CPU, preload pesado.
- Mitigacao:
  - limitar dimensoes e quantidade de sheets por etapa;
  - medir performance por task;
  - otimizar assets antes de expandir conteudo.

### 5.4 Risco: regressao de progressao e dados de fase

- Sintoma: saidas/checkpoints fora de lugar, colisoes quebradas, fases invalidadas.
- Mitigacao:
  - migracao de coordenadas com regra unica controlada;
  - validacao automatica de schema e conteudo apos cada fase migrada;
  - `level-01` como piloto antes de escalar para `level-02` a `level-10`.

### 5.5 Risco: escopo inflar e travar entrega

- Sintoma: mistura de refatoracao, arte e conteudo novo no mesmo pacote.
- Mitigacao:
  - respeitar ordem da Fase 18 no `ROADMAP.md`;
  - separar tarefas por objetivo tecnico claro;
  - registrar bloqueio ao inves de "pular" para tarefas futuras.

## 6. Contrato Da Task 18.1

Task 18.1 e considerada concluida quando:

- baseline tecnico esta congelado neste documento;
- metas visuais/performance estao definidas e auditaveis;
- criterio de rollback esta acordado;
- riscos principais estao registrados com mitigacoes praticas;
- `ROADMAP.md` marca os cinco itens da Task 18.1 como concluidos.

Proxima task recomendada: **Task 18.2 - Infraestrutura De Escala Global**.
