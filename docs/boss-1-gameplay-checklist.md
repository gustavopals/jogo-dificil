# Checklist Manual Do Boss 1

Data: 2026-05-27.

Escopo: `Hirolito Narguilito`, primeiro boss da campanha, implementado no fim
de `level-03` como fechamento do Bloco 1.

## Valores Esperados

- Fase: `level-03`.
- Checkpoint de entrada: `level-03-before-hirolito`.
- Vida: 2 hits.
- Patrulha: `28px/s` entre duas ancoras curtas.
- Ataques: `smoke-puff` e `hose-snap`, alternados em sequencia deterministica.
- Windup dos ataques: `550ms`.
- Recover vulneravel: `1200ms`.
- Cooldown apos ataque: `1500ms`.
- Dano valido: `Centelha Ciano` ou `Rajada Ciano` acertando o cristal aceso
  durante `recover`.

## Preparacao

- Rodar `npm run dev -- --host 127.0.0.1 --port 5173`.
- Abrir a campanha normalmente e chegar ao fim de `level-03`.
- Para repetir o teste rapidamente em modo dev, usar:
  `window.__JOGO_DIFICIL_QA__.startLevel("level-03")` e depois
  `window.__JOGO_DIFICIL_QA__.goToCheckpoint("level-03-before-hirolito")`.
- Manter console aberto e observar `pageerror`, erros de asset, audio em loop
  indevido ou queda perceptivel de FPS.

## Checklist De Playtest Manual

- [ ] Chegar ao checkpoint `level-03-before-hirolito` sem que a caminhada ate a
      arena pareca longa depois de uma morte.
- [ ] Entrar na arena e confirmar que a porta de entrada fecha, a saida continua
      bloqueada e o boss fica ativo.
- [ ] Confirmar que o sprite do Hirolito aparece inteiro, com 2 pips de vida no
      corpo e cristal apagado fora da janela vulneravel.
- [ ] Observar `smoke-puff`: o tell aparece antes, a fumaca sai lenta e o
      jogador consegue pular ou se reposicionar sem leitura injusta.
- [ ] Acertar a fumaca com `Centelha Ciano` e confirmar que ela some sem matar o
      jogador nem quebrar o fluxo da luta.
- [ ] Observar `hose-snap`: o tell baixo no chao aparece antes e a hitbox final
      corresponde visualmente a area avisada.
- [ ] Morrer uma vez para o `hose-snap` de proposito e confirmar que a causa da
      morte fica compreensivel na tentativa seguinte.
- [ ] Durante `recover`, confirmar que o cristal acende em ciano/amarelo e fica
      legivel mesmo com projeteis, efeitos de energia e pips de vida na tela.
- [ ] Disparar `Centelha Ciano` fora do `recover` e confirmar que o boss nao
      perde vida.
- [ ] Disparar `Centelha Ciano` no cristal aceso e confirmar que remove
      exatamente 1 pip de vida.
- [ ] Soltar `Rajada Ciano` no cristal aceso e confirmar que remove exatamente
      1 pip, sem multiplos hits pela mesma rajada.
- [ ] Confirmar que o boss morre com exatamente 2 hits validos e que a porta de
      saida abre apos a derrota.
- [ ] Encostar no corpo do boss enquanto ele esta vivo e confirmar morte por
      contato, sem matar apos o boss ficar derrotado.
- [ ] Morrer para `smoke-puff`, corpo e `hose-snap` e confirmar respawn no
      checkpoint `level-03-before-hirolito`.
- [ ] Usar `R` durante a luta e confirmar reset de boss, portas, projeteis,
      cristal, energia temporaria e posicao do jogador.
- [ ] Pausar durante windup, ataque e recover, depois retomar e confirmar que
      timers, audio e input continuam consistentes.
- [ ] Ativar mute durante a luta e confirmar que entrada, windup, ataque, hit e
      derrota respeitam o mute global.
- [ ] Vencer a luta e atravessar a saida, confirmando transicao para `level-04`.
- [ ] Repetir a luta completa duas vezes e confirmar que a ordem dos ataques,
      resets e abertura de porta continuam deterministicas.

## Criterio De Ajuste

- Se jogadores novos nao perceberem o cristal no primeiro recover, aumentar
  brilho/pulso do cristal antes de mexer na vida do boss.
- Se a luta parecer apertada, aumentar `recover` ou reduzir velocidade da
  fumaca antes de remover ataques.
- Se a luta parecer longa, reduzir cooldown apenas depois de confirmar que o
  jogador entende a janela vulneravel.
- Se mortes exigirem caminhada repetida, aproximar ainda mais o checkpoint da
  entrada da arena.
- Se efeitos de energia esconderem tell, cristal ou projeteis, reduzir alpha ou
  depth dos efeitos antes de alterar hitboxes.
