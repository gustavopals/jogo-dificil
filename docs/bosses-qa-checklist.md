# Checklist Manual De QA Dos Bosses

Data: 2026-05-27.

Escopo: roteiro transversal para validar hit, morte, respawn, reset e vitoria
dos tres bosses da Fase 17 antes de commit ou release.

## Preparacao

- [ ] Rodar `npm run dev -- --host 127.0.0.1 --port 5173`.
- [ ] Abrir o jogo no navegador e manter o console visivel.
- [ ] Confirmar que `window.__JOGO_DIFICIL_QA__.bosses` lista:
      `boss-hirolito-narguilito`, `boss-dr-imports` e `boss-giga-fabio`.
- [ ] Para cada boss, iniciar pelo atalho direto:
      `window.__JOGO_DIFICIL_QA__.startBoss("<boss-id>")`.
- [ ] Para testar especial sem esperar recarga, usar
      `window.__JOGO_DIFICIL_QA__.fillEnergy()` e
      `window.__JOGO_DIFICIL_QA__.clearEnergyCooldowns()`.
- [ ] Registrar qualquer `pageerror`, erro de asset, audio preso, queda
      perceptivel de FPS ou diferenca entre visual e hitbox.

## Matriz De Bosses

| Boss                | Fase       | Checkpoint                   | Hits | Dano valido                                                   | Vitoria esperada                    |
| ------------------- | ---------- | ---------------------------- | ---- | ------------------------------------------------------------- | ----------------------------------- |
| Hirolito Narguilito | `level-03` | `level-03-before-hirolito`   | 2    | `Centelha Ciano` ou `Rajada Ciano` no cristal em `recover`    | Abre porta e segue para `level-04`  |
| Dr. Imports         | `level-06` | `level-06-before-dr-imports` | 3    | `Centelha Ciano` ou `Rajada Ciano` no weak point em `recover` | Abre porta e segue para `level-07`  |
| Giga Fabio          | `level-10` | `level-10-before-giga-fabio` | 4    | Somente `Rajada Ciano` no nucleo em `recover`                 | Abre saida final e mostra conclusao |

## Hit E Dano

Repetir para os tres bosses:

- [ ] Entrar na arena e confirmar que a porta de entrada fecha e a saida fica
      bloqueada.
- [ ] Confirmar que o weak point fica apagado fora da janela vulneravel.
- [ ] Atacar fora de `recover` e confirmar que a vida nao muda.
- [ ] Esperar `recover`, atacar o weak point aceso e confirmar que apenas 1 pip
      de vida e removido.
- [ ] Soltar `Rajada Ciano` atravessando o corpo do boss e confirmar que a mesma
      rajada nao aplica multiplos hits.
- [ ] Confirmar feedback visual e sonoro de hit sem esconder tell, projetil,
      weak point ou pips de vida.

Checks especificos:

- [ ] Hirolito: `Centelha Ciano` e `Rajada Ciano` removem 1 hit valido no
      cristal.
- [ ] Dr. Imports: `Centelha Ciano` e `Rajada Ciano` removem 1 hit valido no
      weak point, mas nao atravessam a `paper-wall` ativa como dano limpo.
- [ ] Giga Fabio: `Centelha Ciano` nao remove vida do nucleo, mesmo em
      `recover`; `Rajada Ciano` remove exatamente 1 hit valido.

## Morte

Repetir para os tres bosses:

- [ ] Morrer por contato com o corpo do boss vivo.
- [ ] Morrer por hitbox ativa de ataque.
- [ ] Morrer por projetil quando o boss tiver projetil declarado.
- [ ] Confirmar que a causa da morte fica legivel na tentativa seguinte.
- [ ] Confirmar que o boss derrotado nao mata por contato.

Checks especificos:

- [ ] Hirolito: testar morte por `smoke-puff`, `hose-snap` e corpo.
- [ ] Dr. Imports: testar morte por `import-bottle`, contato ruim durante
      `paper-wall` e corpo.
- [ ] Giga Fabio: testar morte por `floor-slam`, `boulder-toss`,
      `shoulder-charge` e corpo.

## Respawn

Repetir para os tres bosses:

- [ ] Apos morte, confirmar respawn no checkpoint imediatamente antes da arena.
- [ ] Confirmar que a caminhada ate repetir a luta continua curta.
- [ ] Confirmar que a porta de entrada e a porta de saida voltam ao estado
      inicial esperado.
- [ ] Confirmar que vida, timers, projeteis, hitbox ativa, weak point e pips do
      boss voltam ao estado inicial.
- [ ] Confirmar que estados temporarios de energia do Pino sao limpos.

## Reset Manual Com R

Repetir para os tres bosses durante `patrol`, `windup`, `attack`, `recover` e
apos causar 1 hit:

- [ ] Pressionar `R`.
- [ ] Confirmar retorno ao checkpoint de entrada da arena.
- [ ] Confirmar reset da vida do boss.
- [ ] Confirmar limpeza de projeteis de boss.
- [ ] Confirmar que a porta de entrada volta aberta antes da arena e a saida
      volta bloqueada.
- [ ] Confirmar que carga, cooldown, projeteis e efeitos de energia do Pino sao
      limpos.

## Vitoria

Repetir para os tres bosses:

- [ ] Derrotar o boss com o numero exato de hits validos da matriz.
- [ ] Confirmar som/feedback de derrota uma unica vez.
- [ ] Confirmar que os pips de vida somem ou ficam claramente zerados.
- [ ] Confirmar que a porta/saida liberada por `defeatUnlocks` abre.
- [ ] Confirmar que projeteis e hitboxes do boss nao continuam causando morte
      apos derrota.
- [ ] Atravessar a saida e confirmar a progressao correta:
      `level-03 -> level-04`, `level-06 -> level-07` e `level-10 -> tela final`.

## Pausa, Mute E Estabilidade

- [ ] Pausar durante `windup`, `attack` e `recover`, retomar e confirmar que os
      timers continuam coerentes.
- [ ] Ativar mute durante entrada, ataque, hit e derrota, confirmando que todos
      os sons respeitam o mute global.
- [ ] Repetir cada luta completa duas vezes sem recarregar a pagina.
- [ ] Confirmar que nao ficam objetos invisiveis bloqueando passagem apos a
      derrota.
- [ ] Confirmar que `window.__JOGO_DIFICIL_QA__.readSnapshot()` continua
      retornando fase, checkpoint, jogador e objetos de sala depois de morte,
      respawn, reset e vitoria.

## Criterio De Fechamento

- [ ] Os cinco fluxos, hit, morte, respawn, reset e vitoria, passam nos tres
      bosses.
- [ ] Nenhum boss exige caminhada longa para repetir tentativa.
- [ ] Nenhum ataque causa morte sem tell visual suficiente.
- [ ] Nenhum efeito de energia cobre hazards pequenos, projeteis, weak point ou
      pips de vida.
- [ ] Nenhuma luta deixa porta, projetil, hitbox ou estado temporario preso apos
      respawn, `R` ou derrota.
