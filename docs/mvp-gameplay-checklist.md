# Checklist Manual De Gameplay Do MVP

Data: 2026-05-26.

Escopo: Task 12.3 da Fase 12, validando se o primeiro build cumpre os
criterios definidos em `IDEIA.md`.

## Ambiente

- Chromium via Playwright, viewport 960x540.
- Dev server: `npm run dev -- --host 127.0.0.1 --port 5173`.
- Build de producao: `npm run build`.
- Preview de producao: `npm run preview -- --host 127.0.0.1 --port 4173`.
- WebGL desativado na sessao guiada para manter o caminho Canvas estavel no
  ambiente headless atual.

## Metodo

- Entrada real de teclado usada para `Enter`, `D`, `R`, `Esc`, `M` e `K`.
- Posicionamento controlado via `window.__JOGO_DIFICIL_GAME__`, disponivel
  apenas em modo de desenvolvimento, usado para cobrir rapidamente saidas,
  checkpoints e cenarios de morte sem transformar a checagem manual em mais uma
  suite permanente.
- Console e `pageerror` foram monitorados durante a sessao.

## Resultado

- [x] Fase 1 testada do inicio ao fim.
  - Menu iniciou `level-01`.
  - Canvas apareceu em 480x270.
  - Pino apareceu no spawn.
  - Saida da fase acionou transicao para `level-02`.
- [x] Fase 2 testada do inicio ao fim.
  - `level-02` carregou apos a transicao.
  - Checkpoint intermediario ativou.
  - Alavanca com `K` abriu a porta de saida.
  - Saida da fase acionou transicao para `level-03`.
- [x] Fase 3 testada do inicio ao fim.
  - `level-03` carregou apos a transicao.
  - Checkpoint antes da secao cruel ativou.
  - Saida final acionou tela final simples.
- [x] Morte por cada tipo de perigo direto do MVP testada.
  - Queda por hazard de buraco.
  - Espinhos fixos.
  - Armadilha `spike-pop`.
  - Projetil lateral.
  - Piso falso levando a queda.
- [x] Respawn em cada checkpoint testado.
  - Fase 1: mortes apos o checkpoint voltaram para `level-01-mid`.
  - Fase 2: morte apos o checkpoint voltou para `level-02-mid`.
  - Fase 3: morte apos o checkpoint voltou para `level-03-before-cruel`.
- [x] Reinicio manual com `R` testado.
  - `R` reposicionou no checkpoint ativo.
  - O contador de mortes permaneceu em `Mortes 0`.
- [x] Pause testado.
  - `Esc` abriu a cena de pausa.
  - `Esc` retomou a fase.
- [x] Mute testado.
  - `M` alternou mute durante pausa.
  - `M` alternou mute durante a fase.
- [x] Build de producao testado.
  - `npm run build` passou.
  - Preview de producao carregou o canvas em 480x270.
  - O hook dev-only `window.__JOGO_DIFICIL_GAME__` nao apareceu no build de
    producao.
  - Nenhum erro critico apareceu no console.

## Observacoes

- O build ainda mostra o aviso conhecido do Vite sobre chunk acima de 500 kB.
  Isso nao bloqueia o MVP e fica melhor enquadrado na Task 12.4 ou em uma etapa
  futura de otimizacao.
- A checagem valida fluxo, comandos, respawn e conclusao das fases, mas nao
  substitui playtest humano longo de sensacao, tempo de salto e leitura fina de
  armadilhas.
