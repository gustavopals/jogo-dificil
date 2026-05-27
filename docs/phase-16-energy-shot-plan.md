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

## Regra Visual Anti-Cópia

O kit `Energia Ciano` pode usar o arquétipo amplo de golpe de energia shonen,
mas deve ter leitura própria do Pino e do jogo. A direção visual final precisa
passar por esta regra antes de entrar como asset.

Permitido:

- Paleta ciano, branco e azul-esverdeado, ligada à faixa e ao cabelo do Pino.
- Poses assimétricas e compactas, com uma mão projetando energia e a outra
  estabilizando corpo/faixa.
- Energia em lascas, faíscas, linhas quebradas e segmentos pixelados.
- `Centelha Ciano` como pequeno disparo pontudo, curto e rápido.
- `Carga Ciano` como aura baixa, próxima ao corpo, com partículas pequenas.
- `Rajada Ciano` como feixe curto, segmentado e horizontal, com recuo do Pino.

Proibido:

- Pose de duas mãos em concha juntando energia no centro.
- Feixe gigante contínuo atravessando a tela inteira.
- Aura amarela/dourada de transformação.
- Grito/nome de golpe inspirado em obra famosa.
- Ícones, símbolos, silhuetas, cabelo, poses ou enquadramentos reconhecíveis de
  Dragon Ball ou outro anime específico.
- Transformação visual que mude Pino para parecer personagem existente.

Checklist de aprovação visual:

- A pose funciona em silhueta mesmo sem efeitos.
- A energia parece ciano/laboratório, não cópia de anime específico.
- O efeito não cobre hazards pequenos.
- O disparo cabe no grid do jogo e mantém leitura em 1x.
- O sprite do Pino mantém hitbox 10x22px; só o visual pode extrapolar.

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
mantém `K`/`X` como ação secundária principal. A action `charge-energy` foi
adicionada ao input mapper e fica ligada a `L`/`C`; a lógica de carregar energia
será integrada nas próximas subtasks.

O input de `K`/`X` também passa por um resolvedor de intenção testável:

- Pressionar perto de objeto interativo preserva a interação atual.
- Toque curto sem interação gera intenção futura de `Centelha Ciano`.
- Segurar só inicia a preparação runtime da `Rajada Ciano` quando
  `canPrepareCyanBurst` permite, exigindo energia cheia e sem cooldown/estado
  ocupado.
- Soltar após preparação gera intenção futura de disparo da `Rajada Ciano`.

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

Schema declarativo inicial:

- `LevelDefinition.energyTargets` lista alvos opcionais por fase, com `id`,
  `kind`, `area`, `acceptedPowers`, `hitPoints` e `resetOnRespawn`.
- `acceptedPowers` declara explicitamente se o alvo aceita `cyan-spark`,
  `cyan-burst` ou ambos; a cena não precisa inferir isso pelo tipo visual.
- `activatesObjectId` aponta para um objeto interativo existente quando o alvo
  deve abrir porta, acionar mecanismo ou liberar passagem.
- `activationDurationMs` permite declarar ativações temporárias para núcleos
  pesados sem colocar temporizador hardcoded na fase.
- `relayWindowMs` declara a janela de sequência dos `energy-relay`.
- `hitGroupId` agrupa hurtboxes de boss para manter um hit por boss por Rajada.
- `blocksMovement` e `absorbsEnergy` deixam blocos rachados e absorvedores
  claros no dado, antes da implementação completa de cada comportamento.
- A validação exige `absorbsEnergy: true` para `energy-absorber` e rejeita
  `activatesObjectId` nesse tipo para manter o alvo sem recompensa mecânica.

`energy-switch` implementado:

- Entra como alvo leve quando `acceptedPowers` inclui `cyan-spark` e/ou
  `cyan-burst`.
- Ao ser atingido, fica ativo, zera sua vida runtime e deixa de receber novas
  colisões de energia.
- Se declarar `activatesObjectId`, ativa o objeto interativo apontado; isso já
  permite abrir portas ou acionar mecanismos existentes.
- O reset da sala restaura switches com `resetOnRespawn: true` e preserva os
  que forem declarados como persistentes.

`energy-cracked-block` implementado:

- Só é alvo válido para `cyan-burst`; a validação de fase rejeita blocos rachados
  que aceitam `cyan-spark`.
- Enquanto não quebrado, entra nos sólidos da sala por padrão;
  `blocksMovement: false` permite declarar bloco rachado visual/alvo sem
  bloquear movimento.
- A `Rajada Ciano` aplica dano ao bloco; dano parcial mantém o bloco ativo e
  sólido, dano suficiente marca `isBroken` e remove o sólido no mesmo refresh da
  sala.
- `Centelha Ciano` não ativa nem danifica o bloco rachado. Se o bloco bloqueia
  movimento, a centelha só colide com ele como sólido comum.
- Respawn restaura ou preserva o estado quebrado conforme `resetOnRespawn`.

`energy-relay` implementado:

- Só é alvo válido para `cyan-spark`; a validação de fase rejeita relays que
  aceitam `cyan-burst`.
- `hitPoints` representa a quantidade de pulsos de `Centelha Ciano` exigida
  para completar a sequência.
- Cada pulso reduz `hitPointsRemaining` em 1 e reinicia a janela declarada em
  `relayWindowMs`.
- Se `relayWindowMs` expira antes do próximo pulso, a sequência reseta para a
  contagem inicial.
- Ao completar a sequência, o relay fica ativo, deixa de receber colisões e
  aciona `activatesObjectId` quando declarado.

`energy-absorber` implementado:

- Declara `absorbsEnergy: true` para deixar claro no dado que é um alvo falso
  criado para consumir poder sem benefício.
- Pode aceitar `cyan-spark`, `cyan-burst` ou ambos via `acceptedPowers`, mas não
  pode declarar `activatesObjectId`.
- Cada acerto registra `absorbedEnergyHits` no estado runtime, sem reduzir vida,
  sem quebrar, sem ativar objeto e sem resolver o alvo.
- Depois de absorver energia, continua disponível para novas colisões de
  `Centelha Ciano` e `Rajada Ciano`.
- O reset da sala limpa o contador de absorções quando `resetOnRespawn` é
  verdadeiro e preserva o estado quando o alvo for declarado persistente.

`energy-core` implementado:

- Só é alvo válido para `cyan-burst`; a validação de fase rejeita núcleos que
  aceitam `cyan-spark`.
- Recebe dano forte da `Rajada Ciano` até zerar `hitPointsRemaining`; antes disso
  permanece inativo e pode exigir mais de uma Rajada.
- Ao ativar, fica fora das próximas colisões de energia e aciona
  `activatesObjectId` quando declarado, permitindo abrir uma passagem pesada.
- Se declarar `activationDurationMs`, mantém `activationRemainingMs` no runtime,
  fecha o objeto ativado ao expirar, restaura a vida do núcleo e volta a ficar
  disponível para nova Rajada.
- Sem `activationDurationMs`, a ativação permanece até reset de sala ou até ser
  preservada por `resetOnRespawn: false`.

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

Estado puro implementado:

- `src/game/physics/player-energy.ts` concentra energia atual, atividade
  (`idle`, `charging`, `burst-preparing`, `burst-firing`), cooldown da
  `Centelha Ciano`, cooldown da `Rajada Ciano`, preparação da rajada e duração
  ativa do feixe.
- O update é determinístico e recebe apenas estado anterior, delta, input de
  carga, disponibilidade de carga, estado de chão/ar e pedido de ação de
  energia.
- Reset de energia recria estado limpo com valor inicial configurável, pronto
  para ser conectado a fase/checkpoint na próxima subtask.

Energia inicial por fase/checkpoint:

- `LevelDefinition.initialEnergy` define a energia inicial do começo da fase.
- `CheckpointDefinition.initialEnergy` sobrescreve o valor da fase para aquele
  checkpoint.
- Se nenhum valor for declarado, o fallback continua sendo 40.
- `ActiveCheckpoint.initialEnergy` carrega o valor resolvido, para respawn e
  reinício manual restaurarem a energia correta nas próximas integrações.

Reset de estados temporários:

- `LevelScene` mantém um `playerEnergyState` runtime iniciado pelo checkpoint
  ativo.
- Segurar `L`/`C` atualiza a energia pelo estado puro, respeitando chão/ar.
- Enquanto a `Carga Ciano` está disponível no chão, o movimento horizontal cai
  para 30% e o dash fica bloqueado; pular, ficar no ar ou estar em dash impede a
  carga naquele frame.
- Morte, respawn automático, reinício manual com `R` e troca via checkpoint
  limpam carga, cooldowns, preparação, duração de rajada e intenção secundária,
  restaurando a energia inicial configurada no checkpoint ativo.
- Pausa limpa carga, cooldowns, preparação, duração de rajada e intenção
  secundária, mas preserva a energia acumulada pelo jogador.

Renderização inicial da `Centelha Ciano`:

- Toque curto em `K`/`X`, sem interação próxima, cria um projétil horizontal
  pequeno na frente do Pino.
- A centelha usa retângulo ciano com contorno branco para manter leitura de
  pixel art original sem depender de asset final.
- A cena só renderiza quando o estado puro aceita `cyan-spark`, consumindo 10
  energia e iniciando cooldown de 180 ms.
- Falta de energia ou cooldown ativo bloqueiam a renderização; falta de energia
  dispara feedback curto com partículas quebradas e pulso coral/ciano no Pino.
- `src/game/physics/energy-projectiles.ts` move a centelha a 420 px/s e remove
  o projétil ao atingir 128 px de alcance.
- A atualização da centelha remove o projétil ao colidir com sólidos, alvos
  genéricos, hurtboxes de boss ou ao atingir o alcance máximo. Alvos e bosses
  entram como candidatos retangulares para as próximas tasks conectarem aos
  schemas reais.
- O limite de dois disparos ativos fica centralizado em
  `canSpawnCyanSparkProjectile`; a cena bloqueia o terceiro disparo antes de
  consumir energia ou iniciar cooldown.
- O feedback de energia insuficiente só responde à rejeição
  `cyan-spark`/`insufficient-energy`; cooldown e limite de projéteis continuam
  silenciosos até a subtask de HUD/audio dedicada.

Preparação inicial da `Rajada Ciano`:

- Segurar `K`/`X` por 500 ms com energia cheia dispara o intent
  `special-charge-start` e envia `cyan-burst-prepare` para o estado puro.
- A cena alimenta o resolvedor de intenção com `canPrepareCyanBurst`, então 99
  de energia, cooldown ativo ou atividade ocupada não iniciam a preparação.
- A preparação coloca a energia em `burst-preparing` e inicia a contagem de
  preparação da rajada.
- A direção da rajada fica travada no facing do Pino no momento em que
  `cyan-burst-prepare` é aceito; tentar virar durante `burst-preparing` não muda
  a direção guardada para o feixe.
- A cena mostra um pulso ciano/branco curto e partículas perto da mão do Pino
  quando a preparação começa.
- Soltar `K`/`X` quando a preparação pura já está pronta envia
  `cyan-burst-fire`, entra em `burst-firing` e renderiza um feixe horizontal de
  192x12 px por 280 ms.
- O custo de 100 energia é aplicado apenas quando `cyan-burst-fire` é aceito; a
  preparação mantém energia cheia e cancelar preparação não consome recurso.
- O feixe usa a direção travada da preparação e é limpo automaticamente quando
  `cyan-burst-finished` sai do estado puro.
- A Rajada resolve colisão pura contra sólidos e alvos retangulares; sólidos
  comuns cortam o comprimento visual do feixe.
- `energy-cracked-block` entra como bloco especial sólido enquanto não quebrado;
  uma Rajada aplica 2 de dano forte e remove o bloco dos sólidos quando a vida
  chega a zero.
- Alvos genéricos e `boss-hurtbox` também recebem 2 de dano por Rajada aceita,
  preparando o contrato de vida dos bosses da fase 17.
- A cena aplica o impacto no momento do disparo, não a cada frame do feixe; a
  regra formal usa `hitGroupId` para impedir múltiplas hurtboxes do mesmo boss
  de receberem dano na mesma Rajada.
- Enquanto o feixe ativo existir, a cena mantém um registro dos bosses já
  atingidos pela Rajada atual e limpa esse registro ao cancelar, resetar ou
  receber `cyan-burst-finished`.

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

- Criar sprites do Pino carregando energia. Implementado com
  `player-pino-charge-01.png` e `player-pino-charge-02.png`, ambos 14x26px,
  usando aura baixa ciano e pose assimétrica própria.
- Criar sprites do Pino disparando `Centelha Ciano`. Implementado com
  `player-pino-cyan-spark-01.png` e `player-pino-cyan-spark-02.png`, ambos
  14x26px, com braço estendido, recuo curto e faísca ciano no punho.
- Criar sprites do Pino preparando e soltando `Rajada Ciano`. Implementado com
  `player-pino-cyan-burst-prepare-01.png`,
  `player-pino-cyan-burst-prepare-02.png`,
  `player-pino-cyan-burst-fire-01.png` e
  `player-pino-cyan-burst-fire-02.png`, todos 14x26px, com energia segmentada no
  punho, recuo do corpo e início curto de feixe.
- Criar projétil, feixe, impacto, alvo ativo e bloco quebrado. Implementado com
  `energy-cyan-spark-projectile.png` (8x8px),
  `energy-cyan-burst-beam.png`, `energy-impact.png`,
  `energy-target-active.png` e `energy-cracked-block-broken.png` (16x16px),
  mantendo leitura ciano compacta e fragmentos sem ocupar a tela inteira.
- Registrar animações em dados, mantendo hitbox do Pino 10x22px. Implementado
  em `PINO_ANIMATIONS` com estados `cyan-charge`, `cyan-spark`,
  `cyan-burst-prepare` e `cyan-burst-fire`, todos apontando para os sprites do
  Pino e carregando `hitboxPx` fixo em 10x22px.
- Garantir que efeitos não escondem hazards pequenos. Implementado com regra
  central em `visual-readability`: hazards diretos, `spike-pop` e projéteis de
  trap ficam acima dos efeitos de energia, e efeitos largos de energia têm alpha
  máximo de 0.56.

### Task 16.7 - Audio E HUD De Energia

- Criar sons originais de carga, energia cheia, tiro, falha, especial e impacto.
  Implementado com oito WAVs originais em `assets/audio/sfx/`:
  `energy-charge-loop.wav`, `energy-charge-full.wav`, `energy-shot.wav`,
  `energy-shot-empty.wav`, `energy-special-windup.wav`,
  `energy-special-fire.wav`, `energy-impact-small.wav` e
  `energy-impact-heavy.wav`.
- Integrar sons ao audio manager e ao mute global. Implementado com cues puros
  em `player-energy-audio-feedback`, emitidos pela `LevelScene` via eventos
  `audio:play-requested`/`audio:stop-requested`; o `AudioScene` registra os
  WAVs e o `AudioManager` aplica mute global também no loop de carga ativo.
- Criar medidor pequeno de energia no HUD. Implementado como barra segmentada
  compacta na faixa superior do HUD, sincronizada por `playerEnergy` no
  `gameStateStore`; a `LevelScene` publica energia atual, máximo e estado de
  carga sem adicionar texto tutorial fixo.
- Dar feedback de energia cheia e energia insuficiente. Implementado com pulso
  branco/ciano no medidor quando a energia chega ao máximo e piscada coral curta
  quando uma ação é rejeitada por energia insuficiente, mantendo som e efeito do
  Pino já existentes.
- Evitar texto tutorial fixo na tela. Implementado mantendo o HUD de energia
  sem labels de controle ou instruções permanentes; a leitura acontece por barra
  segmentada, cor, pulso, piscada, áudio e animação do Pino.

### Task 16.8 - Criar Bloco 3 De Fases

- Criar `level-07` para ensinar `Centelha Ciano` e recarga. Implementado como
  `Faisca De Treino`: sala segura sem traps, energia inicial 20 para dois tiros
  simples, tres `energy-switch` abrindo portas em sequencia e checkpoint de
  recarga com energia 0 antes do terceiro alvo.
- Criar `level-08` para distorcer com absorvedor e bloco rachado. Implementado
  como `O Alvo Mente`: `energy-absorber` falso antes da primeira leitura, alvo
  correto depois de `spike-pop`, checkpoint de carga segura e
  `energy-cracked-block` bloqueando a rota ate receber `Rajada Ciano`.
- Criar `level-09` para combinar dash, tiro simples, especial e interação.
  Implementado como `Carga Em Movimento`: gap inicial de dash, `energy-relay`
  de tres `Centelha Ciano`, checkpoint antes da combinacao final,
  `energy-core` temporario acionado por `Rajada Ciano` e alavanca final com
  `K`/`X`.
- Encadear `level-06 -> level-07 -> level-08 -> level-09`. Implementado com
  `nextLevelId` em `level-06`, `level-07` e `level-08`; `level-09` encerrou a
  campanha de 9 fases ate a abertura da Fase 17, quando passou a apontar para
  `level-10`.
- Criar checklist manual do Bloco 3. Implementado em
  `docs/block-3-gameplay-checklist.md`, cobrindo validacao automatizada,
  playtest por fase, energia, HUD, audio, reset, cadeia e criterios de ajuste.

### Task 16.9 - Testes E QA Da Energia

- Testes unitários do estado de energia. Implementado em
  `tests/player-energy.test.ts`, cobrindo estado inicial, clamp de energia,
  delta negativo, carga, recarga cheia, gasto/cooldown da `Centelha Ciano`,
  preparação/cancelamento/disparo da `Rajada Ciano`, rejeições por energia,
  cooldown, estado ocupado e reset/limpeza de temporários.
- Testes unitários de input tap/hold/carga. Implementado em
  `tests/secondary-action-intent.test.ts` e `tests/input-bindings.test.ts`,
  cobrindo toque curto de `K`/`X` para `Centelha Ciano`, hold de `K`/`X` para
  preparar/disparar/cancelar `Rajada Ciano`, prioridade de interação próxima e
  `L`/`C` como ação segurada `charge-energy` separada de `secondary`.
- Testes de colisão da `Centelha Ciano`. Implementado em
  `tests/energy-projectiles.test.ts` e `tests/level-energy-targets.test.ts`,
  cobrindo colisão com sólidos, alvos leves, hurtboxes de boss, varredura entre
  frames, direção esquerda, erro vertical, múltiplos projéteis, prioridade entre
  colisão e limite de alcance e mapeamento dos alvos declarativos que aceitam
  `cyan-spark`.
- Testes de hit único da `Rajada Ciano`. Implementado em
  `tests/energy-projectiles.test.ts`, cobrindo múltiplas hurtboxes no mesmo
  `hitGroupId`, bosses já atingidos na rajada ativa, repetição de checks do
  mesmo feixe sem novo dano e reset do rastreamento para uma nova rajada.
- Testes de schema/validação dos alvos de energia. Implementado em
  `tests/level-schema.test.ts` e `tests/level-validation.test.ts`, cobrindo
  export dos tipos declarativos, todos os `EnergyTargetKind`, poderes aceitos,
  caso válido com todos os tipos, geometria, `hitPoints`, duplicidade de ids,
  regras por tipo, timers positivos, `activatesObjectId` e referências
  inválidas.
- Testes de conteúdo para `level-07`, `level-08` e `level-09`. Implementado em
  `tests/block-3-content.test.ts`, cobrindo registro das fases, validação,
  cadeia `level-06 -> level-07 -> level-08 -> level-09`, metadata de curva,
  assets mínimos, treino seguro de `Centelha Ciano`, recarga, absorvedor, bloco
  rachado, relay, core temporário, alavanca final e reset dos gates.
- Smoke Playwright cobrindo carregar energia, tiro simples, especial e alvo
  ativado. Implementado em `e2e/game-smoke.e2e.ts`, usando input real de
  `K`/`L`: `level-07` dispara `Centelha Ciano` e ativa o primeiro
  `energy-switch`; `level-08` vai ao checkpoint, carrega energia, solta
  `Rajada Ciano` e quebra o `energy-cracked-block`.
- Ferramentas de QA para energia cheia, cooldown zerado e leitura de estado.
  Implementado com `fillEnergy()`, `clearEnergyCooldowns()` e
  `readEnergyState()` em `window.__JOGO_DIFICIL_QA__`, permitindo forcar energia
  cheia, limpar cooldowns/estados temporarios e ler energia, atividade, timers e
  disponibilidade de `Centelha Ciano`/`Rajada Ciano`.

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
