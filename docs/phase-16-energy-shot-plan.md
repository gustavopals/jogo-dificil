# Plano Da Fase 16 - Energia Ciano

## Objetivo

Adicionar um kit de energia original para o Pino, inspirado no arquétipo de
golpes shonen e jogos clássicos de luta/anime, sem copiar nomes, poses, gritos,
efeitos ou identidade visual de Dragon Ball ou de qualquer obra existente.

A fase 16 deixa de ser apenas um disparo carregado e passa a planejar três
camadas claras:

- `Centelha Ciano`: tiros pequenos e rápidos de energia.
- `Carga Ciano`: botão dedicado para carregar energia segurando.
- `Rajada Ciano`: poder especial de feixe carregado, curto e forte.

O poder deve aumentar profundidade de gameplay sem transformar o jogo em combate
livre. A função principal continua sendo abrir caminhos, ativar mecanismos,
quebrar obstáculos específicos, preparar o boss da fase 17 e criar timing em
plataformas difíceis.

## Decisão Fechada De Nomes, Custos, Limites E Papéis

Nomes finais para implementação:

- Kit/recurso: `Energia Ciano`, ID interno `cyan-energy`.
- Tiro simples: `Centelha Ciano`, ID interno `cyan-spark`.
- Recarga manual: `Carga Ciano`, ID interno `cyan-charge`.
- Especial carregado: `Rajada Ciano`, ID interno `cyan-burst`.

Tabela de balanceamento fechada para a primeira implementação:

| Poder            | Custo            | Limites principais                                            | Papel de gameplay                                      |
| ---------------- | ---------------- | ------------------------------------------------------------- | ------------------------------------------------------ |
| `Centelha Ciano` | 10 energia       | Cooldown 180 ms, alcance 128 px, 2 projéteis ativos           | Ativar alvos leves, acertar weak points e cortar ritmo |
| `Carga Ciano`    | Sem custo direto | Só carrega no chão, 45 energia/s, movimento a 30%, sem dash   | Criar escolha de risco para recuperar recurso          |
| `Rajada Ciano`   | 100 energia      | Preparação 500 ms, duração 280 ms, alcance 192 px, 1 hit/boss | Quebrar bloqueios fortes e abrir janela contra bosses  |

Limites globais:

- Energia máxima: 100.
- Energia inicial padrão por fase/checkpoint: 40.
- Energia pode ser sobrescrita por fase ou checkpoint quando o design exigir.
- Morte, respawn, `R` e troca de fase limpam carga ativa, projéteis, feixes,
  cooldowns e hits pendentes.
- Nenhum poder mira diagonalmente no MVP da fase 16.
- Nenhum poder substitui pulo, dash ou leitura de trap.
- Nenhum poder causa dano contínuo em boss; cada `Rajada Ciano` registra no
  máximo um hit por boss.

Critério de balanceamento:

- `Centelha Ciano` deve ser frequente o bastante para parecer divertida, mas
  cara o bastante para exigir `Carga Ciano`.
- `Carga Ciano` deve ser curta e arriscada, nunca uma espera longa após cada
  morte.
- `Rajada Ciano` deve parecer especial, mas depender de janela vulnerável para
  não trivializar chefões e obstáculos.

## Diferença Operacional Entre Os Poderes

`Centelha Ciano`, `Carga Ciano` e `Rajada Ciano` não são variações do mesmo
botão. Cada uma ocupa um papel diferente no loop.

### `Centelha Ciano`

Função: ação rápida de gasto baixo.

- É o poder de uso frequente.
- Serve para alvos leves, weak points simples, relays curtos e projéteis
  canceláveis.
- Mantém o ritmo de plataforma porque sai rápido e tem alcance curto.
- Não quebra bloqueios pesados.
- Não substitui dash.
- Não deve resolver uma arena inteira de longe.

### `Carga Ciano`

Função: recuperação manual de recurso.

- É uma decisão de risco, não um ataque.
- Enche a barra de `Energia Ciano` quando o jogador segura `L`/`C`.
- Reduz mobilidade e bloqueia dash para criar vulnerabilidade real.
- Não dispara projétil.
- Não ativa alvo.
- Não causa dano.
- Não deve virar espera longa depois de cada respawn.

### `Rajada Ciano`

Função: especial de alto compromisso.

- É o poder de impacto alto e uso raro.
- Gasta energia cheia e exige preparação antes do disparo.
- Quebra bloqueios fortes, ativa núcleos pesados e causa dano real em bosses.
- Trava direção para exigir leitura antes de soltar.
- Não pode ser usada como spam.
- Não causa dano contínuo por vários frames no mesmo boss.
- Não deve cancelar perigo já assumido pelo jogador.

Regra de leitura:

- `Centelha Ciano` comunica velocidade.
- `Carga Ciano` comunica vulnerabilidade.
- `Rajada Ciano` comunica compromisso e recompensa.

## Matriz De Ativação, Quebra E Bloqueio

Esta matriz define o contrato de interação dos poderes para implementação,
schema de fase e testes.

### `Centelha Ciano`

Pode ativar:

- `energy-switch` leve.
- `energy-relay`, contando como um pulso da sequência.
- Weak points simples de boss 1 e boss 2 durante `recover`.
- Projéteis canceláveis, como `boulder-toss` do `Giga Fabio`, se o projétil
  declarar `canBeCanceledBy: "cyan-spark"`.

Pode quebrar:

- Nenhum bloco sólido de fase.
- Apenas projéteis ou objetos frágeis explicitamente marcados como canceláveis.

Pode bloquear/cancelar:

- Projéteis fracos declarados como canceláveis.
- Pequenos mecanismos temporários que aceitem pulso curto.

Não afeta:

- `energy-cracked-block`.
- `energy-core`.
- Sólidos comuns.
- Boss final como dano real.
- Traps comuns que não declararem interação com energia.

### `Carga Ciano`

Pode ativar:

- Nada diretamente.

Pode quebrar:

- Nada.

Pode bloquear/cancelar:

- Bloqueia dash enquanto o botão de carga estiver segurado.
- Reduz movimento horizontal para 30%.
- Cancela a própria carga quando o jogador pula, morre, respawna, reinicia ou
  troca de fase.

Não afeta:

- Alvos de energia.
- Bosses.
- Projéteis.
- Traps.
- Portas, blocos ou relays.

### `Rajada Ciano`

Pode ativar:

- `energy-switch`, como pulso forte.
- `energy-core`, como ativação pesada.
- Weak points de todos os bosses durante janela vulnerável.
- Portas, pontes ou saídas ligadas a um alvo pesado por `defeatUnlocks` ou
  `targetUnlocks`.

Pode quebrar:

- `energy-cracked-block`.
- Núcleos frágeis declarados como `breakableBy: "cyan-burst"`.
- Escudos temporários de boss declarados como vulneráveis à rajada.

Pode bloquear/cancelar:

- Pode limpar projéteis fracos se o projétil declarar vulnerabilidade à rajada.
- Pode interromper um boss apenas quando o estado atual aceitar hit.

Não afeta:

- Sólidos comuns; a rajada para ao bater neles.
- Boss em invulnerabilidade.
- Boss fora de janela vulnerável, exceto se a definição do boss permitir.
- Hazards permanentes.
- Vários alvos atrás de um bloqueador sólido.

## Tese De Gameplay

Energia no Pino deve ser uma ferramenta de precisão, não uma arma universal.

- `Centelha Ciano` resolve alvos pequenos, ativa mecanismos e permite timing
  rápido.
- `Rajada Ciano` resolve obstáculos especiais e causa impacto forte, mas exige
  energia cheia, preparação e risco.
- `Carga Ciano` cria uma escolha: parar para carregar ou avançar vulnerável.
- O jogador deve entender o estado de energia sem tutorial textual longo.
- Tudo precisa resetar de forma previsível em morte, respawn e reinício manual.

## Controles Planejados

Manter o mapa atual e adicionar uma ação nova de energia:

- `J`/`Z`: dash, continua como ação principal.
- `K`/`X`: ação secundária de energia/interação.
- `L`/`C`: carregar energia segurando.

Regras de prioridade:

- Toque curto em `K`/`X` perto de objeto interativo: interagir.
- Toque curto em `K`/`X` sem interação próxima: disparar `Centelha Ciano`.
- Segurar `K`/`X` com energia cheia: preparar `Rajada Ciano`.
- Soltar `K`/`X` após a janela mínima da especial: disparar `Rajada Ciano`.
- Soltar cedo demais: cancelar com feedback curto, sem criar feixe.
- Segurar `L`/`C`: carregar energia enquanto o Pino fica vulnerável.
- Soltar `L`/`C`: manter energia acumulada; não dispara poder automaticamente.

Essa escolha separa o botão de carregar energia do botão de disparar, mas ainda
mantém `K`/`X` como ação secundária principal. Na implementação, o input mapper
deve ganhar uma action nova, provisoriamente `charge-energy`.

## Regras Fechadas De Energia

Valores fechados para a primeira implementação:

- Energia máxima: 100.
- Energia inicial da fase/checkpoint: configurável, padrão 40.
- Taxa de carga no chão: 45 energia/s.
- Taxa de carga no ar: 0 energia/s no MVP da fase 16.
- Movimento durante carga: 30% da velocidade horizontal.
- Dash durante carga: bloqueado.
- Pulo durante carga: cancela a carga antes de pular.
- Morte, respawn, `R` e troca de fase: limpam carga, projéteis, feixes e
  cooldowns.
- Energia após respawn: volta para o valor configurado no checkpoint atual, para
  evitar softlock e recarga longa depois de cada morte.

## Centelha Ciano

Tiro simples, pequeno e repetível.

- Input: toque curto em `K`/`X`, sem interação próxima.
- Custo: 10 energia.
- Cooldown: 180 ms.
- Velocidade: 420 px/s.
- Alcance máximo: 128 px.
- Hitbox: aproximadamente 8x5 px.
- Máximo de disparos ativos: 2.
- Direção: horizontal, usando a direção atual do Pino.
- Colisão: some ao tocar sólido, alvo válido, boss ou limite de alcance.
- Sem energia suficiente: toca feedback de falha curto e não cria projétil.

Papel de gameplay:

- Ativar `energy-switch`.
- Ligar `energy-relay` curto.
- Acertar pontos fracos pequenos.
- Dar feedback de combate leve sem dominar a plataforma.

## Rajada Ciano

Poder especial de feixe, original e mais teatral.

- Input: segurar `K`/`X` com energia cheia e soltar após a preparação.
- Custo: 100 energia.
- Preparação mínima: 500 ms.
- Duração do feixe: 280 ms.
- Cooldown após disparo: 1.200 ms.
- Alcance máximo: 192 px.
- Altura do feixe: aproximadamente 12 px.
- Direção: horizontal, travada na direção em que a preparação começou.
- Movimento durante preparação/disparo: Pino fica quase parado e vulnerável.
- Colisão: atinge alvos no caminho, quebra blocos especiais e causa dano forte
  no boss, mas para em sólido bloqueador.
- Dano no boss: um acerto por rajada, mesmo que o feixe encoste por vários
  frames.

Papel de gameplay:

- Quebrar `energy-cracked-block`.
- Ativar alvo pesado que a `Centelha Ciano` não consegue.
- Criar momento de risco e recompensa.
- Preparar a linguagem de combate para o boss da fase 17.

## Alvos E Interações

Tipos de objeto planejados para a fase:

- `energy-switch`: alvo simples ativado por `Centelha Ciano` ou `Rajada Ciano`.
- `energy-cracked-block`: bloco quebrável apenas pela `Rajada Ciano`.
- `energy-relay`: receptor que precisa de uma sequência curta de tiros simples.
- `energy-absorber`: alvo falso/controlado que consome energia sem benefício.
- `energy-core`: alvo pesado que exige `Rajada Ciano` e pode abrir passagem
  temporária.

Fora do escopo inicial:

- Mira diagonal ou livre.
- Combos longos de luta.
- Upgrades permanentes ou árvore de habilidades.
- Vários especiais diferentes no mesmo bloco.
- Dano variável complexo.

## Arquitetura

Implementação recomendada:

- Criar lógica pura em `src/game/physics/player-energy.ts`.
- Criar lógica pura de projéteis em `src/game/physics/energy-projectiles.ts`.
- Criar estado runtime visual em `src/game/systems/player-energy-system.ts`.
- Estender `src/shared/input.ts` e `src/game/input/input-bindings.ts` com
  `charge-energy`.
- Estender tipos declarativos de fase para alvos de energia e valores iniciais
  de energia por fase/checkpoint.
- Integrar input na `LevelScene`, preservando prioridade de interação perto de
  objetos.
- Reusar o reset de sala para limpar centelhas, rajadas, carga em andamento e
  estado temporário de alvos.
- Adicionar API de QA em dev para ler energia atual, forçar energia cheia e
  testar alvo ativado.

## Visual, Animações E Assets

Direção visual:

- Energia ciano com núcleo branco curto e borda azul-esverdeada.
- Pino não usa pose de mãos em concha; a pose deve ser lateral, compacta e
  própria, com uma mão estabilizando a faixa e outra projetando energia.
- A carga usa aura perto do cabelo/faixa/mão, sem cobrir hazards pequenos.
- A especial usa feixe pixelado curto, com recuo do Pino e partículas laterais.

Sprites/animações novos:

- `player-energy-charge-start`: 2 frames, transição para carregar.
- `player-energy-charge-loop`: 3 frames, aura pulsando.
- `player-energy-full`: 2 frames, brilho curto quando a energia enche.
- `player-energy-shot`: 2 frames, disparo da `Centelha Ciano`.
- `player-energy-special-windup`: 3 frames, preparação da `Rajada Ciano`.
- `player-energy-special-fire`: 2 frames, feixe ativo e recuo.
- `energy-spark-projectile`: 2 frames para a centelha.
- `energy-spark-impact`: 3 frames para impacto pequeno.
- `energy-beam-core`: segmento repetível do feixe especial.
- `energy-beam-impact`: 4 frames para impacto forte.
- `energy-target-idle`, `energy-target-active` e `energy-target-broken`.

Partículas planejadas:

- Faíscas pequenas durante carga.
- Anel curto quando energia chega a 100.
- Trilha curta atrás da `Centelha Ciano`.
- Fragmentos ciano ao quebrar bloco pela `Rajada Ciano`.

## Audio E HUD

Audio:

- `energy-charge-loop`: som baixo em loop enquanto segura `L`/`C`.
- `energy-charge-full`: ping curto quando energia chega a 100.
- `energy-shot`: disparo seco e divertido da `Centelha Ciano`.
- `energy-shot-empty`: falha curta sem energia.
- `energy-special-windup`: subida rápida antes do feixe.
- `energy-special-fire`: disparo especial curto.
- `energy-impact-small`: impacto da centelha.
- `energy-impact-heavy`: impacto da rajada/bloco quebrado.

HUD:

- Adicionar medidor pequeno de energia no HUD, perto do contador de mortes ou no
  canto direito.
- Mostrar energia como barra segmentada simples, não como painel grande.
- Quando energia estiver cheia, pulsar discretamente uma vez.
- Quando tentar disparar sem energia, piscar o medidor sem bloquear input.
- O botão de mute existente deve afetar esses efeitos conforme o mute global de
  SFX já definido.

## Bloco 3 De Fases

Usar a regra já definida para expansão: ensinar, distorcer, combinar.

### `level-07` - Faísca De Treino

Função: ensinar energia sem pressão injusta.

- Começa com energia suficiente para dois tiros simples.
- Primeiro alvo usa `Centelha Ciano` em ambiente seguro.
- O jogador aprende `L`/`C` segurando para recarregar energia.
- Uma porta simples abre com `energy-switch`.
- Sem armadilha nova junto do primeiro disparo.

### `level-08` - O Alvo Mente

Função: distorcer a confiança do jogador.

- Introduz `energy-absorber` como alvo falso.
- Introduz `energy-cracked-block`, quebrável apenas pela `Rajada Ciano`.
- O jogador precisa carregar energia em um lugar seguro, mas visualmente tenso.
- Um alvo correto fica depois de uma armadilha conhecida.
- Uma surpresa pode punir disparo sem leitura, mas deve ficar compreensível após
  a primeira morte.

### `level-09` - Carga Em Movimento

Função: combinar dash, centelha, rajada e interação.

- O jogador alterna dash, tiro simples e recarga curta.
- Um `energy-relay` exige sequência de `Centelha Ciano`.
- Um `energy-core` exige `Rajada Ciano` para abrir passagem temporária.
- A combinação final tem checkpoint logo antes.
- Fechamento prepara a linguagem visual para o boss da fase 17.

## Tasks Planejadas

### Task 16.1 - Definir Kit Energia Ciano

- Fechar nomes, custos, limites e papel de cada poder.
- Documentar diferença entre `Centelha Ciano`, `Carga Ciano` e `Rajada Ciano`.
- Registrar o que cada poder pode ativar, quebrar ou bloquear.
- Registrar regra visual para evitar cópia de referências famosas.
- Atualizar `IDEIA.md` com as decisões finais.

### Task 16.2 - Input E Estado De Energia

- Adicionar action `charge-energy` ao input mapper.
- Mapear `L`/`C` como botão de carregar energia.
- Preservar `K`/`X` para interação, tiro simples e especial por segurar.
- Criar estado puro de energia, carga, cooldown e reset.
- Cobrir energia inicial por fase/checkpoint.
- Garantir que morte, pausa, respawn e `R` limpam estados temporários.

### Task 16.3 - Implementar Centelha Ciano

- Renderizar tiro pequeno horizontal.
- Consumir energia e respeitar cooldown.
- Mover projétil com velocidade e alcance máximo declarados.
- Colidir com sólidos, alvos, boss e limite de alcance.
- Limitar a dois disparos ativos.
- Criar feedback de falha quando falta energia.

### Task 16.4 - Implementar Rajada Ciano Especial

- Implementar preparação por segurar `K`/`X`.
- Exigir energia cheia.
- Travar direção durante preparação.
- Renderizar feixe curto com duração limitada.
- Consumir energia ao disparar.
- Quebrar blocos especiais e causar dano forte em alvo/boss.
- Impedir múltiplos hits no mesmo boss pela mesma rajada.

### Task 16.5 - Alvos De Energia

- Criar schema declarativo para alvos de energia.
- Implementar `energy-switch`.
- Implementar `energy-cracked-block`.
- Implementar `energy-relay`.
- Implementar `energy-absorber`.
- Implementar `energy-core`.
- Integrar alvos ao estado runtime e ao reset de sala.
- Cobrir validação e ativação com testes unitários.

### Task 16.6 - Animações E Arte Do Poder

- Criar sprites do Pino carregando energia.
- Criar sprites do Pino disparando `Centelha Ciano`.
- Criar sprites do Pino preparando e soltando `Rajada Ciano`.
- Criar projétil, feixe, impacto, alvo ativo e bloco quebrado.
- Registrar animações em dados, mantendo hitbox do Pino 10x22px.
- Garantir que efeitos não escondem hazards pequenos.

### Task 16.7 - Audio E HUD De Energia

- Criar sons originais de carga, energia cheia, tiro, falha, especial e impacto.
- Integrar sons ao audio manager e ao mute global.
- Criar medidor pequeno de energia no HUD.
- Dar feedback de energia cheia e energia insuficiente.
- Evitar texto tutorial fixo na tela.

### Task 16.8 - Criar Bloco 3 De Fases

- Criar `level-07` para ensinar `Centelha Ciano` e recarga.
- Criar `level-08` para distorcer com absorvedor e bloco rachado.
- Criar `level-09` para combinar dash, tiro simples, especial e interação.
- Encadear `level-06 -> level-07 -> level-08 -> level-09`.
- Criar checklist manual do Bloco 3.

### Task 16.9 - Testes E QA Da Energia

- Testes unitários do estado de energia.
- Testes unitários de input tap/hold/carga.
- Testes de colisão da `Centelha Ciano`.
- Testes de hit único da `Rajada Ciano`.
- Testes de schema/validação dos alvos de energia.
- Testes de conteúdo para `level-07`, `level-08` e `level-09`.
- Smoke Playwright cobrindo carregar energia, tiro simples, especial e alvo
  ativado.
- Ferramentas de QA para energia cheia, cooldown zerado e leitura de estado.

## Riscos

- Energia virar combate livre e trivializar plataformas.
- O input secundário ficar ambíguo perto de alavancas.
- O jogador se sentir obrigado a recarregar por tempo demais após morrer.
- O feixe especial cobrir hazards pequenos.
- Semelhança excessiva com referências famosas.

Mitigações:

- Custos, cooldowns, alcance curto e limite de projéteis ativos.
- Prioridade clara: interação próxima vence toque curto; especial exige segurar.
- Energia por checkpoint e recarga curta.
- Efeitos pequenos, com alpha controlado e sem ocupar área crítica.
- Pose, nomes, paleta, áudio e silhueta originais.

## Pronto Quando

- `Centelha Ciano`, `Carga Ciano` e `Rajada Ciano` funcionam como kit original,
  testável e limitado.
- O jogador entende carregar, gastar, falhar, disparar e acertar pela leitura
  audiovisual.
- O poder interage com alvos declarativos e reseta corretamente.
- O Bloco 3 ensina, distorce e combina a mecânica em 3 fases curtas.
- Lint, testes, build e smoke passam.
