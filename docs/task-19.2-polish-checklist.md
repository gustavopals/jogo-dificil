# Checklist De Polimento Pos-HD (Task 19.2)

Data: 2026-05-29.

Escopo: validar que a experiencia HD parece intencional e coesa do menu ao boss
final, com musica variando por bloco, contraste fino revisado e playtest longo
em 960x540.

Referencia tecnica: `docs/hd-visual-standard.md`, `docs/hd-migration-qa-checklist.md`.

## Preparacao

- [ ] Rodar `npm run dev -- --host 127.0.0.1 --port 5173`.
- [ ] Confirmar canvas logico `960x540` via `window.__JOGO_DIFICIL_QA__.readScaleInfo()`.
- [ ] Confirmar que o volume global (`M`) e o botao de musica do HUD funcionam.
- [ ] Reservar uma sessao continua de pelo menos 45 minutos para a campanha completa.

## Musica Por Bloco

Esperado apos a Task 19.2:

| Bloco | Fases   | Loop esperado              | Tema                |
| ----- | ------- | -------------------------- | ------------------- |
| 1     | 01-03   | `mvp-loop.wav`             | Pulos de Azar       |
| 2     | 04-06   | `block-2-dash-loop.wav`    | Dash Sob Suspeita   |
| 3     | 07-10   | `block-3-energy-loop.wav`  | Nucleo Ciano        |

Checklist:

- [ ] Menu toca `Entrada Pulante` sem competir com SFX de UI.
- [ ] `level-01` inicia com `Pulos de Azar`.
- [ ] Ao entrar em `level-04`, a musica muda para o loop do bloco 2.
- [ ] Ao entrar em `level-07`, a musica muda para o loop do bloco 3.
- [ ] Transicoes dentro do mesmo bloco nao reiniciam o loop do zero.
- [ ] Sting de fim de fase continua audivel e curto.
- [ ] Boss arenas (03, 06, 10) mantem leitura de tells e SFX sem saturacao.

Regenerar loops placeholder: `npm run assets:block-music`.

## Playtest Longo (960x540)

Jogar do menu ate `level-10` sem atalhos de QA, registrando cansaco, ritmo e
legibilidade:

- [ ] Menu: animacao do Pino, frases e mute de musica parecem intencionais.
- [ ] Bloco 1 (01-03): ritmo de morte/respawn nao frustra; spike-pop legivel.
- [ ] Bloco 2 (04-06): dash e gaps longos nao cansam; HUD nao encobre perigo.
- [ ] Bloco 3 (07-10): energia ciano, alvos e rajada nao escondem hazards.
- [ ] Finale (10): Giga Fabio legivel; nucleo distinto de energia comum.
- [ ] Nenhuma fase parece "escala errada" ou placeholder solto apos HD.

Atalhos uteis para repetir trechos:

- `startLevel("level-XX")`, `goToCheckpoint(...)`, `fillEnergy()`.
- `startBoss("boss-hirolito-narguilito" | "boss-dr-imports" | "boss-giga-fabio")`.

## Contraste Fino (Boss / Trap / Energia)

Revisar cenas caoticas com checklist rapido:

- [ ] Espinhos e projeteis de trap ficam acima de feixes/aura do Pino.
- [ ] Piso quebravel (`breakable-floor`) distingue-se de bloco falso e perigo vermelho.
- [ ] Bloco rachado de energia (`energy-cracked-block`) distingue-se de ciano ativo.
- [ ] Weak point de boss aberto usa ciano/amarelo sem confundir com hazards.
- [ ] Pips de vida do boss distinguiveis de energia carregada no HUD.
- [ ] Medidor de energia vazio usa traco muted sem competir com fill ciano.

## Cenas De UI

- [ ] HUD ocupa no maximo ~7% da area util (topo seguro).
- [ ] Pausa legivel em 960x540; retorno ao jogo sem glitch de musica.
- [ ] Transicao entre fases mantem musica coerente com o bloco destino.
- [ ] Game over / conclusao da campanha fecha o arco sem quebra de tom.

## Bateria Automatizada Antes De Commit

- [ ] `npm run lint`
- [ ] `npm test`
- [ ] `npm run build`
- [ ] `npm run test:e2e` (se ambiente Playwright disponivel)

Testes relevantes:

- `tests/level-music-routing.test.ts`
- `tests/visual-readability.test.ts`
- `tests/music-audio.test.ts`
- `tests/hud.test.ts`

## Criterio De Pronto (Task 19.2)

Marcar a task concluida quando:

- Playtest longo registrado sem bloqueadores de legibilidade ou audio.
- Musica varia por bloco e permanece confortavel em sessoes repetidas.
- Contrastes finos de boss/trap/energia passam na revisao acima.
