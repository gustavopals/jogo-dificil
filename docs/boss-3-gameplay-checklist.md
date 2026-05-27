# Checklist Manual Do Boss Final

Data: 2026-05-27.

Escopo: `Giga Fabio`, boss final da campanha, implementado em `level-10` como
fechamento das 10 fases do MVP.

## Valores Esperados

- Fase: `level-10`.
- Checkpoint de entrada: `level-10-before-giga-fabio`.
- Energia inicial no checkpoint: 100.
- Arena: 26 tiles de largura, saida final bloqueada enquanto o boss estiver
  vivo e duas plataformas laterais de recarga.
- Pontos de recarga: `level-10-left-recharge-platform` e
  `level-10-right-recharge-platform`.
- Vida: 4 hits.
- Patrulha: `38px/s` entre duas ancoras curtas.
- Ataques: `floor-slam`, `boulder-toss` e `shoulder-charge`, em ordem
  deterministica.
- `floor-slam`: windup de `800ms`, ativo por `320ms`, recover de `950ms` e
  janela vulneravel aberta no fim.
- `boulder-toss`: windup de `650ms`, ativo por `260ms`, pedra horizontal de
  `104px/s`, alcance de 22 tiles e maximo de 1 pedra ativa.
- `shoulder-charge`: windup de `700ms`, ativo por `360ms`, recover de `950ms`
  e janela vulneravel aberta no fim.
- Dano real: somente `Rajada Ciano` no nucleo aceso durante `recover`.
- `Centelha Ciano`: nao reduz vida do `Giga Fabio`, mas pode cancelar
  projeteis destrutiveis por energia.
- `Rajada Ciano`: remove exatamente 1 hit valido por disparo, sem multiplos
  hits no mesmo boss pela mesma rajada.

## Preparacao

- Rodar `npm run dev -- --host 127.0.0.1 --port 5173`.
- Abrir a campanha normalmente e chegar a `level-10`.
- Para repetir o teste rapidamente em modo dev, usar:
  `window.__JOGO_DIFICIL_QA__.startLevel("level-10")` e depois
  `window.__JOGO_DIFICIL_QA__.goToCheckpoint("level-10-before-giga-fabio")`.
- Para testar dano especial sem esperar recarga, usar
  `window.__JOGO_DIFICIL_QA__.fillEnergy()` e
  `window.__JOGO_DIFICIL_QA__.clearEnergyCooldowns()`.
- Manter console aberto e observar `pageerror`, erros de asset, audio em loop
  indevido ou queda perceptivel de FPS.

## Checklist De Playtest Manual

- [ ] Chegar ao checkpoint `level-10-before-giga-fabio` sem que a caminhada ate
      a arena pareca longa depois de uma morte.
- [ ] Entrar na arena e confirmar que a porta de entrada fecha, a saida final
      fica bloqueada e o boss entra em estado ativo.
- [ ] Confirmar que o sprite do Giga Fabio aparece inteiro, com silhueta maior,
      contraste preto/dourado, 4 pips de vida no corpo e nucleo apagado fora da
      janela vulneravel.
- [ ] Confirmar que as duas plataformas laterais ficam legiveis como pontos de
      recarga e tambem como rotas de escape, sem esconder hazards, projeteis ou
      tells do boss.
- [ ] Gastar energia ate ficar sem `Rajada Ciano`, subir em cada plataforma
      lateral, segurar `L`/`C` e confirmar que a energia volta ao maximo com HUD
      e audio coerentes.
- [ ] Observar `floor-slam`: o tell aparece antes, o impacto baixo no chao
      corresponde ao visual e o jogador consegue evitar com pulo ou plataforma
      lateral.
- [ ] Morrer uma vez para `floor-slam` de proposito e confirmar que a causa da
      morte fica compreensivel na tentativa seguinte.
- [ ] Observar `boulder-toss`: o tell aparece antes, a pedra sai horizontal,
      fica visualmente distinta da energia ciano e nunca passa de 1 pedra ativa
      ao mesmo tempo.
- [ ] Destruir uma pedra com `Centelha Ciano` ou `Rajada Ciano` e confirmar
      impacto claro, sem morte atrasada nem travamento do ciclo do boss.
- [ ] Morrer uma vez para a pedra e confirmar respawn no checkpoint
      `level-10-before-giga-fabio`.
- [ ] Observar `shoulder-charge`: o tell horizontal aparece antes, a faixa
      ativa corresponde ao visual e existe rota clara por pulo, dash ou
      plataforma lateral.
- [ ] Encostar no corpo do boss enquanto ele esta vivo e confirmar morte por
      contato, sem matar apos o boss ficar derrotado.
- [ ] Durante `recover` de `floor-slam` e `shoulder-charge`, confirmar que o
      nucleo acende e continua legivel mesmo com efeitos de poeira, energia,
      pips de vida e projeteis na tela.
- [ ] Disparar `Centelha Ciano` no nucleo aceso durante `recover` e confirmar
      que o boss nao perde vida.
- [ ] Soltar `Rajada Ciano` fora de `recover` e confirmar que o boss nao perde
      vida.
- [ ] Soltar `Rajada Ciano` no nucleo aceso durante `recover` e confirmar que
      remove exatamente 1 pip de vida.
- [ ] Manter a mesma `Rajada Ciano` atravessando o corpo do boss e confirmar
      que ela nao aplica multiplos hits.
- [ ] Confirmar que o boss morre com exatamente 4 `Rajada Ciano` validas e que
      a saida final abre apos a derrota.
- [ ] Atravessar a saida final e confirmar que a tela de conclusao da campanha
      aparece sem tentar carregar uma fase inexistente.
- [ ] Usar `R` durante patrulha, windup, ataque, recover, recarga de energia e
      apos tomar 1 hit, confirmando reset de boss, portas, pedras, nucleo,
      energia temporaria e posicao do jogador.
- [ ] Pausar durante windup, ataque, recover e carga de energia, depois retomar
      e confirmar que timers, audio e input continuam consistentes.
- [ ] Ativar mute durante a luta e confirmar que entrada, windup, ataque, hit,
      carga de energia e derrota respeitam o mute global.
- [ ] Repetir a luta completa duas vezes e confirmar que ordem dos ataques,
      limites de projeteis, resets e abertura da saida continuam
      deterministicos.

## Criterio De Ajuste

- Se jogadores nao entenderem que o boss final exige `Rajada Ciano`, aumentar
  feedback do nucleo e do hit negado por `Centelha Ciano` antes de reduzir vida.
- Se a luta parecer longa, reduzir cooldown ou vida apenas depois de confirmar
  que a recarga nas plataformas esta legivel.
- Se a recarga parecer perigosa demais, alargar ou reposicionar as plataformas
  antes de enfraquecer os ataques.
- Se `boulder-toss` lotar a arena, reduzir velocidade ou cooldown mantendo o
  limite de 1 pedra ativa.
- Se `shoulder-charge` parecer injusto, aumentar windup ou tell antes de mudar
  a hitbox.
- Se efeitos esconderem nucleo, pedra, tells ou plataformas, reduzir alpha ou
  depth dos efeitos antes de alterar regras de dano.
