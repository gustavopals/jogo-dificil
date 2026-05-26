# Checklist De Release MVP

Data: 2026-05-26.

Escopo: Task 13.2 da Fase 13, consolidando o primeiro build jogavel do MVP.

## Resultado

- [x] `npm run lint` passou.
- [x] `npm run test` passou.
- [x] `npm run test:e2e` passou.
- [x] `npm run build` passou.
- [x] As 3 fases foram validadas no checklist manual:
      `docs/mvp-gameplay-checklist.md`.
- [x] Estabilidade inicial foi medida:
      `docs/performance-stability-check.md`.
- [x] `README.md` documenta descricao, stack, instalacao, scripts e controles.
- [x] `ROADMAP.md` foi atualizado.
- [x] `IDEIA.md` foi atualizado com o status do primeiro build.

## Evidencias

- Testes unitarios: 42 arquivos, 173 testes.
- Smoke test Playwright: 1 teste passando.
- Build de producao: gerado com sucesso.
- Performance: media de ~60 FPS em Chromium headless/Canvas.
- Estabilidade: 30 mortes seguidas sem drift de objetos da cena.
- Reset: projeteis, markers, traps acionadas e plataformas desativadas foram
  limpos com `R`.
- Audio: repeticao de morte/respawn manteve contagem ativa limitada.

## Observacoes

- O Vite ainda exibe o aviso conhecido de chunk acima de 500 kB. Ele nao bloqueia
  o primeiro build jogavel e pode ser tratado em otimizacao pos-MVP.
- O MVP esta apto a ser apresentado como primeiro build jogavel, com escopo
  limitado a 3 fases iniciais e assets temporarios/originais.
