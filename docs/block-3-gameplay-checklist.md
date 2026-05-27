# Checklist Manual Do Bloco 3

Data: 2026-05-27.

Escopo: fases `level-07`, `level-08` e `level-09`, criadas na Task 16.8 para
ensinar, distorcer e combinar o kit `Energia Ciano`.

## Plano Das Fases

| Fase       | Nome                 | Ideia central                                     | Risco principal                                      |
| ---------- | -------------------- | ------------------------------------------------- | ---------------------------------------------------- |
| `level-07` | `Faisca De Treino`   | ensinar `Centelha Ciano` e recarga em sala segura | jogador nao entender falta de energia ou `L`/`C`     |
| `level-08` | `O Alvo Mente`       | distorcer leitura com absorvedor e bloco rachado  | alvo falso parecer bug ou feixe esconder `spike-pop` |
| `level-09` | `Carga Em Movimento` | combinar dash, relay, rajada, core e alavanca     | janela do core/relay parecer apertada ou ambigua     |

## Validacao Automatizada

- [x] `level-06` aponta para `level-07`.
- [x] `level-07` aponta para `level-08`.
- [x] `level-08` aponta para `level-09`.
- [x] `level-09` encerra a campanha atual e leva para a tela final de 9 fases.
- [x] As 3 fases novas passam no validador de fase.
- [x] `level-07` tem energia inicial para duas `Centelha Ciano` e checkpoint de
      recarga com energia 0.
- [x] `level-08` contem `energy-absorber`, `energy-switch`,
      `energy-cracked-block` e `spike-pop` conhecido.
- [x] `level-09` contem `energy-relay`, `energy-core`, alavanca final e
      checkpoint antes da combinacao final.

## Preparacao Para Playtest

- Usar campanha normal para validar fluxo completo desde `level-06`.
- Em modo dev, usar `window.__JOGO_DIFICIL_QA__.startLevel("level-07")` para
  revisar o bloco sem repetir as fases anteriores.
- Usar `goToCheckpoint()` para repetir rapidamente os trechos de recarga,
  bloco rachado e core temporario.
- Manter console aberto e registrar qualquer erro, aviso repetido ou queda de
  FPS perceptivel.

## Checklist De Playtest Manual

- [ ] `level-07`: acertar os dois primeiros `energy-switch` com toques curtos em
      `K`/`X`, abrindo as duas primeiras portas sem precisar recarregar.
- [ ] `level-07`: chegar ao checkpoint com energia 0 e confirmar que tentativa
      sem energia gera feedback visual/sonoro sem travar input.
- [ ] `level-07`: segurar `L`/`C` no chao ate recarregar, acertar o terceiro
      alvo e abrir a porta de saida.
- [ ] `level-07`: morrer no pequeno gap final e respawnar no checkpoint correto,
      com portas/alvos temporarios resetados.
- [ ] `level-08`: disparar no `energy-absorber` falso e confirmar que ele
      consome/absorve energia sem abrir porta, mas com leitura clara de alvo
      falso.
- [ ] `level-08`: acionar o `spike-pop` perto do alvo correto e confirmar que a
      morte fica compreensivel na segunda tentativa.
- [ ] `level-08`: acertar o `energy-switch` correto depois do `spike-pop` e
      abrir a porta sem precisar de timing perfeito.
- [ ] `level-08`: chegar ao checkpoint antes do bloco rachado com energia
      suficiente para preparar `Rajada Ciano`.
- [ ] `level-08`: confirmar que `Centelha Ciano` nao quebra o
      `energy-cracked-block`, enquanto `Rajada Ciano` quebra o bloco.
- [ ] `level-08`: validar que feixe, impacto e alvo ativo nao escondem
      `spike-pop`, buraco ou borda de plataforma.
- [ ] `level-09`: atravessar o gap inicial com dash sem exigir posicionamento
      pixel-perfect.
- [ ] `level-09`: ativar o `energy-relay` com tres `Centelha Ciano` dentro da
      janela e abrir a primeira porta.
- [ ] `level-09`: errar a janela do `energy-relay`, recarregar e tentar de novo
      sem softlock.
- [ ] `level-09`: no checkpoint final, preparar `Rajada Ciano` segurando
      `K`/`X`, verificar direcao travada e abrir o `energy-core` temporario.
- [ ] `level-09`: atravessar a porta do core dentro da janela temporaria sem que
      a pressao pareca injusta.
- [ ] `level-09`: falhar a janela do core, morrer ou reiniciar com `R`, e
      confirmar reset correto de core, portas, projeteis e energia temporaria.
- [ ] `level-09`: usar `K`/`X` perto da alavanca final e confirmar que a
      interacao abre a porta, sem disparo acidental roubar prioridade.
- [ ] Concluir `level-07 -> level-08 -> level-09` sem voltar manualmente para o
      menu.
- [ ] Conferir que `level-09` mostra a tela final atual com 9 fases vencidas.

## Checklist Transversal De Energia

- [ ] `Carga Ciano` em `L`/`C` nao carrega enquanto o jogo esta pausado.
- [ ] Pausar durante carga, projeteis ou preparacao especial nao deixa audio em
      loop indevido ao retomar.
- [ ] Mute global corta SFX de carga, tiro, falha, especial e impacto.
- [ ] O medidor de energia cabe no HUD em desktop e mobile, sem cobrir contador
      de mortes, pausa ou mute.
- [ ] Feedback de energia cheia e energia insuficiente e legivel sem texto
      tutorial fixo na tela.
- [ ] Morte, respawn automatico e reinicio com `R` limpam preparacao da
      `Rajada Ciano`, cooldowns visuais e projeteis ativos.
- [ ] O limite de dois disparos ativos impede spam sem parecer que o controle
      falhou.
- [ ] Resultados locais por fase continuam registrando tempo e mortes em
      `level-07`, `level-08` e `level-09`.

## Criterio De Ajuste

- Se `level-07` exigir morte para entender energia, melhorar feedback de energia
  insuficiente ou posicionamento do terceiro alvo.
- Se `level-08` parecer bugado, reforcar diferenca visual entre absorvedor,
  switch verdadeiro e bloco rachado antes de mexer em dificuldade.
- Se o `spike-pop` ficar escondido por efeitos de energia, reduzir alpha,
  tamanho ou prioridade visual do efeito.
- Se `level-09` punir mais execucao do que leitura, aumentar janela do relay ou
  do core antes de simplificar o layout.
- Se `K`/`X` parecer ambiguo entre interagir, tiro simples e especial, manter a
  regra de prioridade documentada e ajustar distancia/posicao da alavanca.
