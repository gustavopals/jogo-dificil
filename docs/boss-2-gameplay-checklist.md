# Checklist Manual Do Boss 2

Data: 2026-05-27.

Escopo: `Dr. Imports`, segundo boss da campanha, implementado no fim de
`level-06` como fechamento do Bloco 2.

## Valores Esperados

- Fase: `level-06`.
- Checkpoint de entrada: `level-06-before-dr-imports`.
- Energia inicial no checkpoint: 80.
- Arena: 22 tiles de largura, centro limpo para dash e duas plataformas
  laterais baixas.
- Vida: 3 hits.
- Movimento: `anchor-swap` entre tres ancoras a `36px/s`.
- Ataques: `import-bottle`, `paper-wall` e `smoke-swap`, em ordem
  deterministica.
- Windup dos ataques: `500ms`.
- Recover vulneravel: `800ms`.
- Cooldown apos ataque: `900ms`.
- Projetil de `import-bottle`: horizontal, `112px/s`, alcance de 18 tiles,
  maximo de 2 ativos e destrutivel por `Centelha Ciano`.
- Dano valido: `Centelha Ciano` ou `Rajada Ciano` acertando o weak point
  durante `recover`.
- `Rajada Ciano` causa no maximo 1 hit no boss por disparo.

## Preparacao

- Rodar `npm run dev -- --host 127.0.0.1 --port 5173`.
- Abrir a campanha normalmente e chegar ao fim de `level-06`.
- Para repetir o teste rapidamente em modo dev, usar:
  `window.__JOGO_DIFICIL_QA__.startLevel("level-06")` e depois
  `window.__JOGO_DIFICIL_QA__.goToCheckpoint("level-06-before-dr-imports")`.
- Para testar dano especial sem esperar recarga, usar
  `window.__JOGO_DIFICIL_QA__.fillEnergy()` e
  `window.__JOGO_DIFICIL_QA__.clearEnergyCooldowns()`.
- Manter console aberto e observar `pageerror`, erros de asset, audio em loop
  indevido ou queda perceptivel de FPS.

## Checklist De Playtest Manual

- [ ] Chegar ao checkpoint `level-06-before-dr-imports` sem que a caminhada ate
      a arena pareca longa depois de uma morte.
- [ ] Entrar na arena e confirmar que a porta de entrada fecha, a saida fica
      bloqueada e o boss entra em estado ativo.
- [ ] Confirmar que o sprite do Dr. Imports aparece inteiro, com 3 pips de vida
      no corpo e weak point apagado fora da janela vulneravel.
- [ ] Confirmar que a arena mantem centro livre para dash mesmo com o boss nas
      tres ancoras.
- [ ] Observar o movimento `anchor-swap` em patrulha e confirmar que o boss anda
      entre esquerda, centro e direita sem teleportes fora de `smoke-swap`.
- [ ] Observar `import-bottle`: o tell aparece antes, o frasco sai horizontal e
      a trajetoria fica legivel contra o cenario e contra a energia ciano.
- [ ] Manter a luta rodando por mais de um ciclo de `import-bottle` e confirmar
      visualmente que nunca existem mais de 2 frascos ativos ao mesmo tempo.
- [ ] Destruir um frasco com `Centelha Ciano` e confirmar que ele some com
      impacto claro, sem causar morte atrasada nem travar o ciclo do boss.
- [ ] Morrer para um frasco de proposito e confirmar que a causa da morte fica
      compreensivel na tentativa seguinte.
- [ ] Observar `paper-wall`: o tell vertical aparece antes, a parede bloqueia
      energia durante o ataque e a area bloqueada corresponde ao visual.
- [ ] Disparar `Centelha Ciano` contra a `paper-wall` ativa e confirmar que o
      boss nao perde vida sem linha limpa para o weak point.
- [ ] Contornar ou esperar a `paper-wall`, acertar o weak point em `recover` e
      confirmar que remove exatamente 1 pip de vida.
- [ ] Observar `smoke-swap`: o tell de fumaca aparece antes, o boss muda para a
      proxima ancora e entra em `recover` sem nascer sobre o jogador de forma
      injusta.
- [ ] Durante `recover`, confirmar que o weak point fica legivel mesmo com
      fumaca roxa, frascos, efeitos de energia e pips de vida.
- [ ] Disparar `Centelha Ciano` fora do `recover` e confirmar que o boss nao
      perde vida.
- [ ] Soltar `Rajada Ciano` no weak point durante `recover` e confirmar que
      remove exatamente 1 pip, sem multiplos hits pela mesma rajada.
- [ ] Confirmar que o boss morre com exatamente 3 hits validos e que a porta de
      saida abre apos a derrota.
- [ ] Encostar no corpo do boss enquanto ele esta vivo e confirmar morte por
      contato, sem matar apos o boss ficar derrotado.
- [ ] Morrer para frasco, corpo e tentativa ruim durante `paper-wall`, depois
      confirmar respawn no checkpoint `level-06-before-dr-imports`.
- [ ] Usar `R` durante patrulha, windup, ataque, recover e apos tomar 1 hit,
      confirmando reset de boss, portas, frascos, weak point, energia
      temporaria e posicao do jogador.
- [ ] Pausar durante windup, ataque e recover, depois retomar e confirmar que
      timers, audio e input continuam consistentes.
- [ ] Ativar mute durante a luta e confirmar que entrada, windup, ataque, hit e
      derrota respeitam o mute global.
- [ ] Vencer a luta e atravessar a saida, confirmando transicao para `level-07`.
- [ ] Repetir a luta completa duas vezes e confirmar que a ordem dos ataques,
      movimento por ancoras, resets e abertura de porta continuam
      deterministicos.

## Criterio De Ajuste

- Se jogadores novos nao entenderem `paper-wall`, aumentar contraste/tell da
  parede antes de reduzir vida do boss.
- Se a arena parecer cheia, reduzir duracao ou velocidade visual dos frascos
  antes de remover `import-bottle`.
- Se morrer para `smoke-swap` parecer injusto, ajustar a ancora de destino ou
  aumentar o tell de fumaca antes de mudar a regra do ataque.
- Se a luta parecer longa, reduzir cooldown apenas depois de confirmar que os 3
  hits estao claros.
- Se a luta parecer facil demais, diminuir energia inicial ou recover somente
  depois de manter o limite de 2 frascos ativos.
- Se efeitos de energia esconderem frascos, parede ou weak point, reduzir alpha
  ou depth dos efeitos antes de alterar hitboxes.
