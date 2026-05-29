# Checklist Manual De QA Da Migracao HD

Data: 2026-05-29.

Escopo: Task 18.10 da Fase 18. Roteiro manual para validar resolucao 960x540,
tile 32, spritesheets, fisica recalibrada, legibilidade de traps e bosses em
cada fase da campanha.

## Preparacao

- [ ] Rodar `npm run dev -- --host 127.0.0.1 --port 5173`.
- [ ] Abrir o jogo no navegador com console visivel.
- [ ] Confirmar canvas logico `960x540` (`window.__JOGO_DIFICIL_QA__.readScaleInfo()`).
- [ ] Confirmar contrato de colisao do Pino:
      hitbox `36x80`, visual `56x104`, escala `worldPhysicsScale: 2`.
- [ ] Para acelerar playtest, usar `startLevel(...)`, `goToCheckpoint(...)`,
      `fillEnergy()` e `clearEnergyCooldowns()` quando aplicavel.
- [ ] Registrar `pageerror`, assets quebrados, audio preso, queda de FPS ou
      diferenca entre visual e hitbox (`readPlayerHitbox()`).

## Matriz Por Fase

| Fase       | Nome                  | Foco principal da validacao HD                          |
| ---------- | --------------------- | ------------------------------------------------------- |
| `level-01` | Entrada Cruel         | Spawn, gaps, spike-pop legivel em tile 32               |
| `level-02` | Primeira Mentira      | Plataforma que cai, respawn rapido, terreno coerente    |
| `level-03` | Quase Seguro          | Arena Hirolito, weak point e tells em porte grande      |
| `level-04` | Treino De Dash        | Gaps longos, HUD sem cobrir gameplay                    |
| `level-05` | Dash Sob Suspeita     | Falling platform, projetil e spike-pop pos-checkpoint   |
| `level-06` | Memoria Em Movimento  | Interacao + arena Dr. Imports                           |
| `level-07` | Faisca De Treino      | Energia ciano, alvos pequenos legiveis                   |
| `level-08` | O Alvo Mente          | Absorvedor, bloco rachado, rajada sem encobrir hazards  |
| `level-09` | Carga Em Movimento    | Relay, core temporario, combinacao completa do kit      |
| `level-10` | O Ultimo Nucleo       | Arena Giga Fabio, saida final, conclusao da campanha    |
| `level-11` | Circuito Relampago    | Desafio pos-campanha: dash + spike-pop + porta ciano    |

## Checklist Transversal (Todas As Fases)

Repetir em cada fase:

- [ ] Iniciar com `startLevel("level-XX")` e confirmar spawn correto.
- [ ] Confirmar que terreno, hazards e traps respeitam tile 32 sem softlock.
- [ ] Morrer uma vez e confirmar respawn em ~450 ms no checkpoint esperado.
- [ ] Reiniciar com `R` e confirmar reset completo da sala.
- [ ] Confirmar checkpoint ativo mais legivel que inativo.
- [ ] Confirmar saida visivel; se boss vivo, saida bloqueada com sinal claro.
- [ ] Confirmar que efeitos de energia/dash nao escondem espinhos ou tells.
- [ ] Confirmar camera follow/deadzone sem perder leitura de perigo na borda.
- [ ] Concluir a fase ou usar `completeLevel()` e validar transicao.

## Checklist Por Boss

### Hirolito Narguilito (`level-03`)

- [ ] `startBoss("boss-hirolito-narguilito")`.
- [ ] Boss legivel em 960x540 sem zoom; weak point distinguivel de hazards.
- [ ] Porta fecha, tells visiveis, 2 hits validos em `recover`.
- [ ] Derrota abre porta e mantem progressao para `level-04`.

### Dr. Imports (`level-06`)

- [ ] `startBoss("boss-dr-imports")`.
- [ ] Movimento entre ancora legivel; garrafa e paper-wall com contraste.
- [ ] 3 hits validos; rajada nao aplica multiplos hits no mesmo feixe.
- [ ] Derrota abre porta e mantem progressao para `level-07`.

### Giga Fabio (`level-10`)

- [ ] `startBoss("boss-giga-fabio")`.
- [ ] Boss final legivel; nucleo so aceita `Rajada Ciano`.
- [ ] 4 hits validos; tells e vida no corpo distinguiveis de energia/traps.
- [ ] Derrota abre saida final e conclusao da campanha.

## Validacao De Escala E Hitbox

- [ ] `readScaleInfo()` retorna resolucao 960x540, tile 32, escala 2.
- [ ] Com jogador vivo na fase, `readPlayerHitbox()` retorna retangulo 36x80.
- [ ] Hitbox world alinhada ao chao/checkpoints sem mortes injustas laterais.
- [ ] Silhueta HD do Pino maior que baseline antigo, mas colisao previsivel.

## Bateria Automatizada Antes De Commit

- [ ] `npm run lint`
- [ ] `npm run test`
- [ ] `npm run build`
- [ ] `npm run test:e2e -- e2e/game-smoke.e2e.ts`

## Criterios De Ajuste

Registrar ajuste quando:

- trap ou hazard some em cena caotica;
- boss/energia/UI competem pela mesma cor sem contraste;
- respawn/restart demoram mais que a referencia de 300-600 ms;
- colisao parece maior ou menor que o visual sugere;
- fase deixa de ser concluivel apos migracao HD.
