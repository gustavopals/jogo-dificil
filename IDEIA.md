# IDEIA.md

## Visão

Criar um jogo de navegador 2D de plataforma, extremamente difícil, rápido de reiniciar e baseado em surpresa, precisão e aprendizado por tentativa e erro.

A inspiração de sensação é Trap Adventure 2, mas o jogo deve ter identidade própria: personagens, mundo, fases, música, armadilhas, arte e narrativa originais.

## Pilares

- Difícil, mas aprendível.
- Mortes rápidas e restart imediato.
- Humor cruel e situações inesperadas.
- Controles precisos.
- Fases planejadas, não improvisadas.
- Armadilhas memoráveis.
- Visual e som com personalidade própria.

## Identidade Original

Definido inicialmente:

- Personagem principal provisório: Pino, uma criatura original pequena, teimosa
  e legível em pixel art de baixa resolução.

Ainda vamos definir:

- Nome do jogo.
- Tema visual final.
- Nome definitivo do personagem principal.
- Mundo.
- Tom de humor.
- Estilo de música.
- Estilo de arte.

Não copiar:

- Sprites, mapas, músicas, personagens, nomes ou layout de fases de Trap Adventure 2.
- Armadilhas específicas em sequência igual.
- UI ou apresentação visual do jogo de referência.

## Antes de Desenvolver: Decisões Base

Antes de iniciar a implementação, vamos fechar as decisões que reduzem retrabalho. O processo será feito em sequência: uma pergunta por bloco, registro da resposta neste arquivo e avanço para o próximo ponto.

Status geral: concluído.

### Ordem de Decisão

1. Stack técnica.
2. MVP do jogo.
3. Regras de física e movimento.
4. Mapa de controles.
5. Loop de morte e respawn.
6. Formato das fases.
7. Pipeline de assets.
8. Critério de pronto do primeiro build.
9. Resolução base e tamanho de tile.
10. Funções da ação principal e secundária.
11. Comportamento do canvas.

### Ponto 1 - Stack Técnica

Status: Decidido.

Decisões a registrar:

- Engine do jogo.
- Linguagem.
- Ferramenta de desenvolvimento e build.
- Testes.
- Validação no navegador.
- Lint e formatação.
- Gerenciador de pacotes.
- Comandos iniciais do projeto.

Proposta inicial:

- TypeScript.
- Vite.
- Phaser 3.
- Vitest para lógica pura.
- Playwright para smoke tests no navegador.
- ESLint e Prettier.
- `npm` como gerenciador de pacotes, salvo se decidirmos outro.

Decisão:

- Engine do jogo: Phaser 3.
- Linguagem: TypeScript.
- Desenvolvimento e build: Vite.
- Testes de lógica pura: Vitest.
- Validação no navegador: Playwright.
- Padrão de código: ESLint e Prettier.
- Gerenciador de pacotes: `npm`.
- Esta stack será usada por ser adequada para jogo 2D de navegador, permitir desenvolvimento rápido e manter boa organização de código.

### Ponto 2 - MVP do Jogo

Status: Decidido.

Decisões a registrar:

- O que precisa existir na primeira versão jogável.
- O que fica fora do primeiro build.
- Quantidade de fases no primeiro build.
- Sistemas obrigatórios.
- Sistemas opcionais.

Decisão:

- O objetivo geral de cada fase será levar o jogador de um ponto A até um ponto B do mapa.
- O primeiro MVP terá 3 mapas iniciais.
- Cada mapa deve ser difícil, divertido e desafiador, com obstáculos, armadilhas e situações que exigem tentativa, erro e aprendizado.
- O foco do MVP será validar o loop principal: entrar na fase, avançar, morrer, aprender, reiniciar rápido, superar o trecho e chegar ao fim.

Precisa existir na primeira versão jogável:

- Personagem com movimento básico.
- As 5 ações de gameplay reconhecidas pelo input.
- 3 fases iniciais jogáveis.
- Ponto de início e ponto de fim em cada fase.
- Obstáculos e armadilhas simples.
- Morte e respawn rápido.
- Checkpoints.
- Contador de mortes.
- Transição entre fases.
- Áudio básico para pulo, morte, checkpoint e fim de fase.
- Tela simples de início.
- Build abrindo no navegador sem erro crítico.

Fora do MVP inicial:

- Ranking online.
- Editor de fases.
- Conquistas completas.
- Replay fantasma.
- História completa.
- Arte final de todos os assets.
- Trilha sonora completa.

### Ponto 3 - Regras de Física e Movimento

Status: Decidido.

Decisões a registrar:

- Velocidade horizontal.
- Aceleração e desaceleração.
- Altura do pulo.
- Gravidade.
- Pulo variável ou fixo.
- Coyote time.
- Jump buffer.
- Colisão com chão, paredes e plataformas.

Decisão:

- O movimento será preciso, rápido e responsivo.
- Aceleração horizontal deve existir, mas ser curta para o personagem responder quase imediatamente.
- Desaceleração deve ser rápida para permitir correções finas em plataformas pequenas.
- O pulo será variável: toque curto gera pulo menor, segurar o botão gera pulo mais alto.
- O jogo terá `coyote time` curto para perdoar levemente pulos logo depois de sair da plataforma.
- O jogo terá `jump buffer` curto para registrar pulo apertado pouco antes de tocar no chão.
- A gravidade será mais forte do que em um platformer lento, mantendo ritmo rápido e quedas claras.
- Colisão inicial: chão e paredes sólidas.
- Plataformas atravessáveis ficam fora do MVP inicial, salvo necessidade clara nos 3 primeiros mapas.

Valores iniciais para protótipo:

- Velocidade horizontal máxima: 190 px/s.
- Aceleração: 1800 px/s².
- Desaceleração no chão: 2200 px/s².
- Desaceleração no ar: 900 px/s².
- Velocidade inicial do pulo: -430 px/s.
- Gravidade: 1200 px/s².
- Corte de pulo ao soltar botão: reduzir velocidade vertical restante para 45%.
- `coyote time`: 90 ms.
- `jump buffer`: 100 ms.

Implementação inicial do movimento horizontal:

- Lógica pura criada em `src/game/physics/horizontal-movement.ts`.
- `LevelScene` consulta `move-left` e `move-right` pelo `ActionInput`, calcula a
  direção horizontal e envia velocidade para a entidade `Player`.
- Velocidade horizontal máxima: 190 px/s.
- Aceleração horizontal: 1800 px/s².
- Desaceleração no chão: 2200 px/s².
- Desaceleração no ar: 900 px/s².
- Troca de direção usa aceleração somada à desaceleração do estado atual para o
  personagem virar rápido sem ultrapassar a velocidade máxima.
- Gravidade vertical da entidade `Player` permanece desativada nesta etapa para
  manter o protótipo horizontal estável até as tasks de pulo e colisão.

Implementação inicial do pulo:

- Lógica pura criada em `src/game/physics/jump-movement.ts`.
- `LevelScene` consulta a ação `jump` por `isDown`, `wasPressed` e
  `wasReleased`, mantendo estado de coyote time e jump buffer entre frames.
- Velocidade inicial do pulo: -430 px/s.
- Gravidade aplicada no cálculo vertical: 1200 px/s².
- Pulo variável: ao soltar o botão durante subida, a velocidade vertical
  restante é reduzida para 45%.
- `coyote time`: 90 ms.
- `jump buffer`: 100 ms.

Implementação inicial de colisão básica:

- Lógica pura criada em `src/game/physics/solid-collision.ts`.
- `LevelScene` mantém uma sala de teste com chão, paredes laterais e
  plataformas sólidas curtas, todos definidos como retângulos sólidos
  temporários.
- A colisão usa a hitbox real do Pino, com sprite visual 12x24px, hitbox 10x22px
  e pivô no centro inferior.
- O resolvedor cinemático aplica movimento por eixo, bloqueia chão, paredes,
  topo e parte inferior de sólidos, e evita atravessar blocos finos mesmo em
  passos maiores de simulação.
- Plataformas atravessáveis continuam fora do MVP inicial; a plataforma de teste
  atual é totalmente sólida.

Implementação inicial da câmera:

- `LevelScene` usa limites temporários de mapa com 960x270px, equivalente a duas
  telas da resolução base.
- A câmera principal do Phaser segue o sprite do Pino e respeita os limites do
  mapa provisório.
- A câmera usa `roundPixels` para manter leitura de pixel art e reduzir tremor
  visual durante movimento normal.
- Uma deadzone inicial de 128x80px evita microcorreções constantes e ainda
  mantém obstáculos próximos legíveis no enquadramento.

Validação inicial do movimento:

- Testes unitários cobrem movimento horizontal, pulo variável, coyote time, jump
  buffer e colisão sólida.
- Checklist manual criado em `docs/movement-checklist.md`.
- Validação automática no navegador passou em Chromium headless via Playwright,
  usando fallback `PLAYWRIGHT_HOST_PLATFORM_OVERRIDE=ubuntu24.04-x64` e WebGL
  desativado para evitar limitação de framebuffer do ambiente.
- Nenhum valor de física foi ajustado nesta rodada; os valores atuais seguem
  bons o suficiente para iniciar a estrutura de mapas.

Observação:

Esses valores são ponto de partida. A resolução base, tamanho de tile e tamanho do personagem já estão definidos (Ponto 9): 480x270, tiles de 16px, personagem ~24px de altura. Com isso, o pulo de pico fica em ~77px (~5 tiles) e a velocidade máxima cobre ~12 tiles por segundo. Esses valores ainda devem ser revalidados depois da primeira fase de teste jogável.

### Ponto 4 - Mapa de Controles

Status: Decidido.

Decisões a registrar:

- Tecla para andar para direita.
- Tecla para andar para esquerda.
- Tecla para pular.
- Tecla para ação principal.
- Tecla para ação secundária.
- Tecla para reiniciar rápido.
- Tecla para pausar.
- Tecla para mutar áudio.
- Suporte futuro a controle/gamepad.

Decisão:

- Andar para esquerda: `A` ou `Seta Esquerda`.
- Andar para direita: `D` ou `Seta Direita`.
- Pular: `Espaço`, `W` ou `Seta Cima`.
- Ação principal: `J` ou `Z`.
- Ação secundária: `K` ou `X`.
- Reiniciar rápido: `R`.
- Pausar: `Esc`.
- Mutar áudio: `M`.
- Suporte a gamepad fica planejado para depois do MVP, não obrigatório no primeiro build.

Regras:

- As 5 ações de gameplay devem funcionar sem depender de mouse.
- As alternativas de teclado existem para acomodar jogadores que preferem setas ou `WASD`.
- Comandos de sistema não contam como ações de gameplay.
- O mapa de controles deve ser fácil de trocar no código no futuro.

### Ponto 5 - Loop de Morte e Respawn

Status: Decidido.

Decisões a registrar:

- Tempo até respawn.
- Animação de morte.
- Áudio de morte.
- Reset de armadilhas.
- Uso de checkpoint atual.
- Contador de mortes.
- Reinício manual rápido.
- O que deve ser preservado ou resetado depois da morte.

Decisão:

- Ao morrer, o controle do personagem trava imediatamente.
- A morte toca um som curto e claro.
- A animação de morte deve ser curta, com alvo inicial de até 300 ms.
- O respawn automático deve ser rápido, com alvo inicial entre 300 ms e 600 ms.
- A tecla `R` reinicia rapidamente do último checkpoint ativo.
- O contador de mortes aumenta a cada morte real.
- O jogador volta no último checkpoint ativo.
- Armadilhas, projéteis e plataformas da sala voltam ao estado inicial.
- Itens obrigatórios voltam se ainda forem necessários para completar a fase.
- Itens opcionais coletados podem continuar coletados para não frustrar exploração.
- A música não deve reiniciar a cada morte; ela continua tocando para manter ritmo.

Regras:

- O jogador nunca deve esperar muito para tentar de novo.
- Respawn rápido é parte central da identidade do jogo.
- A causa da morte deve ficar clara antes ou durante o respawn.
- O reset da sala deve evitar softlocks e estados quebrados.
- O reinício manual rápido não deve punir o jogador além de reposicioná-lo no checkpoint.

Implementação inicial do sistema de morte:

- O estado global do jogador usa `playerLifeState` com valores `alive` e
  `dead`.
- Ao registrar morte, o jogo trava o controle, troca para `dead`, incrementa o
  contador e emite `player:died`.
- A mesma morte não pode incrementar o contador mais de uma vez enquanto o
  jogador continua morto.
- Nesta etapa, a `LevelScene` só dispara morte automática por queda abaixo dos
  limites da fase; morte por contato com hazards e traps fica para a Fase 7.
- Na etapa 6.1, `respawnAtCheckpoint` já devolvia o estado para `alive`; a
  etapa 6.2 conectou esse caminho ao respawn automático da `LevelScene`.

Implementação inicial do respawn automático:

- Após uma morte, a `LevelScene` agenda retorno automático em 450 ms, dentro da
  janela decidida de 300 ms a 600 ms.
- O jogador volta para o checkpoint ativo via `respawnAtCheckpoint`, preservando
  contador de mortes e checkpoint atual.
- O `Player` é restaurado com velocidade zerada, corpo físico reativado e estado
  de pulo reiniciado.
- O controle volta junto com o respawn; a animação de recuperação é curta e não
  bloqueia input.
- A cena não é reiniciada nesse fluxo, então a música futura poderá continuar
  tocando sem resetar a cada morte.

Implementação inicial do reinício manual:

- `R` reposiciona imediatamente o jogador no checkpoint ativo usando o mesmo
  caminho de restauração do respawn.
- Reinício manual enquanto o jogador está vivo não conta como morte. A razão é
  manter `R` como ferramenta de ritmo e correção rápida, não como punição.
- Se `R` for pressionado enquanto o jogador está morto, ele cancela a espera do
  respawn automático e volta ao checkpoint sem incrementar uma nova morte.
- Na etapa 6.3, o reinício manual passou a limpar timers de respawn, estado de
  pulo, recuperação visual e estado transitório de conclusão da fase. A etapa
  6.4 conectou esse caminho ao reset lógico completo da sala.

Implementação inicial do reset de sala:

- O reset de sala agora possui estado runtime próprio em `room-state`, separado
  da cena.
- Armadilhas declaradas voltam ao estado não acionado quando `resetOnRespawn` é
  verdadeiro.
- Projéteis runtime são sempre limpos no reset para evitar mortes ou colisões
  antigas após respawn.
- Plataformas que caem voltam para a área declarada e deixam de estar em queda
  ou desativadas quando são resetáveis.
- Objetos interativos resetáveis voltam ao `startsActive` declarado.
- Itens obrigatórios coletados são restaurados no respawn; itens opcionais
  coletados podem permanecer coletados quando `persistsAfterDeath` é verdadeiro.
- Nesta etapa o reset ainda é lógico. A Fase 7 vai conectar esse estado aos
  comportamentos visuais reais de traps, projéteis, plataformas e itens.

Implementação inicial do HUD de mortes:

- O contador de mortes fica no canto superior esquerdo, em painel compacto e
  semitransparente.
- O texto usa monospace pequeno e alto contraste para continuar legível sobre o
  placeholder visual das fases.
- O HUD se atualiza pela assinatura do `gameStateStore`, então cada morte
  registrada aparece imediatamente.
- A área do contador é limitada para não cobrir o centro da tela nem trechos
  críticos de plataforma.
- A frase exibida é curta: `Mortes N`.

### Ponto 6 - Formato das Fases

Status: Decidido.

Decisões a registrar:

- Estrutura dos dados de uma fase.
- Como registrar spawn, saída e checkpoints.
- Como registrar obstáculos, armadilhas e itens.
- Como registrar música e sons.
- Como registrar assets necessários.
- Como registrar dificuldade, desafio principal e recompensa.

Decisão:

- No MVP, as fases serão declarativas em TypeScript.
- Os arquivos de fase devem ficar em `src/data/levels/`.
- Cada fase inicial pode ser um arquivo próprio, por exemplo `level-01.ts`, `level-02.ts` e `level-03.ts`.
- Os mapas serão definidos por arrays e objetos simples para acelerar iteração e manter controle total no início.
- Ferramentas externas como Tiled podem ser avaliadas depois do MVP, se o volume de mapas justificar.

Estrutura inicial de uma fase:

- `id`: identificador estável da fase.
- `name`: nome provisório ou definitivo.
- `order`: ordem na campanha inicial.
- `theme`: tema visual ou ambiente.
- `bounds`: tamanho total do mapa.
- `spawn`: ponto inicial do jogador.
- `exit`: ponto de conclusão da fase.
- `checkpoints`: lista de checkpoints.
- `terrain`: chão, paredes e plataformas sólidas.
- `hazards`: perigos diretos, como espinhos e quedas.
- `traps`: armadilhas com gatilhos e comportamento.
- `items`: itens obrigatórios e opcionais.
- `interactiveObjects`: portas, botões, alavancas e mecanismos.
- `audio`: música e sons específicos da fase.
- `difficulty`: dificuldade estimada.
- `mainChallenge`: desafio principal da fase.
- `progressReward`: recompensa de progresso.
- `assets`: sprites, tilesets, sons e músicas necessários.

Regras:

- Fase deve ser conteúdo, não código improvisado dentro da cena.
- IDs de fase, checkpoints, armadilhas e itens devem ser estáveis.
- Os dados devem permitir reset da sala após morte.
- A estrutura deve suportar os 3 mapas iniciais antes de crescer.
- Se a estrutura começar a ficar difícil de editar, reavaliar uso de editor de mapas.

Implementação inicial do schema de fases:

- Interfaces de fase consolidadas em `src/shared/levels.ts`, cobrindo
  `LevelDefinition`, `TerrainDefinition`, `HazardDefinition`, `TrapDefinition`,
  `ItemDefinition`, `CheckpointDefinition` e `ExitDefinition`.
- Helper de autoria criado em `src/data/levels/schema.ts` com `defineLevel`,
  para escrever fases declarativas com autocomplete e validação TypeScript.
- Terreno do MVP aceita apenas `solid`, mantendo plataformas atravessáveis fora
  do escopo inicial.
- Traps do schema inicial cobrem os tipos planejados para o MVP:
  `false-block`, `falling-platform`, `spike-pop`, `projectile` e
  `breakable-floor`.
- Teste de schema criado em `tests/level-schema.test.ts` com uma fase completa
  de exemplo validada por TypeScript.

Implementação inicial do validador de fases:

- Validador puro criado em `src/data/levels/validation.ts`.
- `validateLevel` valida uma fase individual e retorna issues sem lançar
  exceção.
- `validateLevels` valida uma lista de fases e detecta `level.id` duplicado
  entre arquivos.
- Regras iniciais cobertas: IDs duplicados dentro da fase, spawn dentro dos
  limites, saída dentro dos limites, checkpoints dentro dos limites, retângulos
  de terreno válidos e dentro dos limites, e assets referenciados declarados em
  `assets`.
- API local de fases exposta por `src/data/levels/index.ts`.
- Testes unitários criados em `tests/level-validation.test.ts`.

Implementação inicial de renderização de terreno:

- Registry inicial criado em `src/data/levels/registry.ts`, com
  `LEVEL_DEFINITIONS`, `getLevelDefinition` e `getRequiredLevelDefinition`.
- `LevelScene` deixou de declarar chão, paredes e plataformas em código fixo e
  passou a carregar a fase atual pelo `currentLevelId`.
- Terreno sólido agora vem de `level.terrain`, é desenhado como retângulos
  placeholder e alimenta a colisão do jogador.
- Helper puro criado em `src/game/systems/level-terrain.ts`, com extração de
  retângulos sólidos e cor placeholder por tipo de terreno.

Implementação inicial de spawn, saída e checkpoints:

- `gameStateStore.startLevel` aceita uma posição de spawn definida pelos dados
  da fase, mantendo o checkpoint inicial com id `${levelId}-start`.
- `MenuScene` inicia `level-01` usando `level.spawn` vindo do registry.
- `LevelScene` renderiza marcador de spawn, saída e checkpoints com retângulos
  placeholder.
- Contato com checkpoint é detectado pela hitbox real do Pino e ativa
  `gameStateStore.setActiveCheckpoint` uma vez por checkpoint ativo.
- Contato com a saída chama `gameStateStore.completeLevel`; transição visual e
  carregamento da próxima fase continuam para a Task 10.4.
- Helper puro criado em `src/game/systems/level-progress.ts` para checkpoint
  inicial, overlap de checkpoint e overlap de saída.

Implementação inicial das 3 fases em dados:

- `src/data/levels/level-01.ts`: Fase 1, `Entrada Cruel`, introdutória, com
  terreno simples, checkpoint, saída para `level-02`, perigo de queda e primeira
  trap `spike-pop` declarada.
- `src/data/levels/level-02.ts`: Fase 2, `O Caminho Nao Confia Em Voce`, com
  terreno segmentado, gap, checkpoint, saída para `level-03`, alavanca
  declarativa e trap `falling-platform`.
- `src/data/levels/level-03.ts`: Fase 3, `Quase Seguro`, com sequência curta de
  plataformas, checkpoint, saída final, item opcional e trap `false-block`.
- `LEVEL_DEFINITIONS` exporta as fases na ordem `level-01`, `level-02`,
  `level-03`.
- Todas as fases têm ponto A (`spawn`) e ponto B (`exit`), validados pelo schema
  e pelo registry.

Implementação inicial do sistema base de hazards:

- Hazards são perigos diretos declarados em `level.hazards` e podem matar por
  contato quando `isInstantDeath` é verdadeiro.
- `fall` usa causa de morte `fall`; demais hazards diretos usam causa `hazard`.
- `LevelScene` desenha hazards com placeholder visual: espinhos como triângulos
  fixos e áreas de queda como retângulos semitransparentes.
- `level-01` recebeu um espinho fixo inicial para validar contato mortal sem
  depender de traps.
- As áreas de queda declaradas nas fases agora participam do sistema de morte;
  o plano abaixo do limite da fase continua como fallback de segurança.

Implementação inicial do sistema base de traps:

- Traps continuam sendo conteúdo declarativo em `level.traps`, com `id`, `kind`,
  `trigger`, área opcional, `resetOnRespawn` e `config`.
- A base runtime usa `roomState.traps` para saber se cada trap está armada,
  acionada ou resolvida.
- Gatilhos por posição (`area` e `touch`) disparam quando a hitbox do jogador
  sobrepõe `trap.trigger.area`; gatilhos `interaction` ficam reservados para os
  objetos/ações da Task 7.5.
- Ao cruzar um gatilho, a `LevelScene` marca a trap como acionada e atualiza o
  placeholder visual.
- O feedback visual inicial mostra a área de gatilho e, quando existir, a área
  física/corpo da trap. Após acionamento, o marcador fica mais evidente.
- O feedback sonoro futuro foi reservado como metadado `trap:<kind>:<event>`,
  sem tocar áudio ainda.
- Reset por respawn/reinício manual reutiliza `resetRoomStateForRespawn`, então
  traps com `resetOnRespawn` voltam armadas.

Implementação inicial das traps do MVP:

- `false-block` e `breakable-floor` removem a área física da lista de sólidos da
  sala após o gatilho, usando subtração de retângulos para preservar partes
  restantes do terreno quando necessário.
- `falling-platform` reutiliza o estado runtime de plataformas móveis e passa a
  ficar `isFalling`/`isDisabled` quando acionada.
- `spike-pop` fica mortal após o gatilho e mata por contato com causa `trap`.
- `projectile` cria um projétil simples a partir da área da trap, com velocidade
  configurável por `config.velocityX`/`config.velocityY`, e mata por contato.
- `level-02` recebeu uma trap de projétil lateral e `level-03` recebeu chão
  quebrável. As três fases iniciais agora declaram os cinco tipos de trap do
  MVP: bloco falso, plataforma que cai, espinho que surge, projétil simples e
  chão quebrável.

Implementação inicial de itens:

- Itens continuam declarativos em `level.items`, com `id`, `kind`, `position`,
  `hitbox`, `persistsAfterDeath`, asset opcional e, quando necessário,
  `activatesObjectId`.
- `LevelScene` renderiza itens como marcadores placeholder, coleta por overlap
  da hitbox real do Pino e reduz o alpha do marcador quando o item é coletado.
- `optional` cobre coletáveis opcionais e pode persistir após morte quando
  `persistsAfterDeath` é verdadeiro.
- `required` cobre item obrigatório simples; no MVP inicial ele é restaurado no
  respawn quando `persistsAfterDeath` é falso.
- `key` cobre item de ativação de mecanismo. Ao coletar, o sistema ativa o
  objeto interativo apontado por `activatesObjectId` no `roomState`.
- O validador de fases agora denuncia `activatesObjectId` que não aponta para
  nenhum objeto interativo declarado na mesma fase.
- `level-01` recebeu um chip obrigatório simples, `level-02` recebeu uma chave
  que ativa o mecanismo declarado e `level-03` mantém o token opcional
  persistente.

Implementação inicial de objetos interativos:

- Objetos interativos continuam declarativos em `level.interactiveObjects`, com
  `id`, `kind`, `area`, estado inicial, reset por respawn e, quando necessário,
  `action`/`targetObjectId`.
- `door` é uma porta simples: quando está inativa, entra na lista de sólidos da
  sala e bloqueia o jogador; quando fica ativa, deixa de bloquear.
- `lever`, `button` e `mechanism` são acionáveis por overlap com a hitbox do
  Pino e ação configurada. A ação padrão é `secondary`, com suporte também a
  `primary`.
- Ao ativar um objeto com `targetObjectId`, o sistema ativa também o objeto
  alvo, permitindo mecanismos simples como alavanca abrindo porta.
- `LevelScene` renderiza objetos interativos com placeholder visual e atualiza o
  alpha/contorno quando o estado muda.
- O reset de sala reaproveita `resetRoomStateForRespawn`; objetos com
  `resetOnRespawn` voltam ao estado inicial.
- `level-02` recebeu uma porta simples de saída. A alavanca pode abrir a porta
  com ação secundária; na Fase 8, a chave passou a ativar um mecanismo visual
  separado para preservar a alavanca como solução da porta.
- O validador de fases agora denuncia `targetObjectId` inexistente em objetos
  interativos.

Revisão inicial de justiça das armadilhas:

- A revisão da Fase 7 está registrada em `docs/trap-fairness-review.md`.
- Critérios usados: causa compreensível depois da morte, ausência de softlock,
  nenhuma espera longa após erro e riscos conhecidos por fase.
- Todas as traps atuais do MVP são resetáveis por respawn/reinício manual.
- Configurações de atraso de trap ficam abaixo do tempo de respawn automático.
- Portas fechadas precisam ser resetáveis e ter pelo menos um abridor declarado.
- Riscos principais que seguem para fases futuras: trocar marcadores por
  animações/som curtos, conferir a legibilidade do projetil lateral em playtest,
  implementar feedback de queda da plataforma sem alongar a espera e validar o
  salto depois do chão falso da `level-03` com arte final.

Implementação inicial da Fase 1, `Entrada Cruel`:

- A fase 1 passou a ser um percurso introdutório completo, com ponto A no spawn
  inicial e ponto B na saída para `level-02`.
- O chão foi segmentado em quatro trechos: início, pós-primeiro salto,
  checkpoint e final.
- Foram adicionados três buracos pequenos com hazards de queda para ensinar
  pulo sem exigir precisão extrema.
- O chip obrigatório simples fica antes do primeiro buraco, reforçando coleta
  básica antes da parte hostil.
- O espinho fixo introduz perigo visível e o `spike-pop` fica como primeira
  armadilha surpresa antes do checkpoint.
- O checkpoint intermediário fica depois da primeira surpresa, reduzindo
  repetição inútil antes da seção final.
- A fase declara metadados mínimos de som para checkpoint e trap; reprodução
  real continua para a Fase 9, quando o Audio Manager existir.

Implementação inicial da Fase 2, `O Caminho Nao Confia Em Voce`:

- A fase 2 passou a ter ponto A no spawn inicial e ponto B na saída para
  `level-03`.
- O terreno foi segmentado em início, trecho intermediário e chegada, com dois
  gaps de queda curtos para exigir leitura sem pedir perfeição excessiva.
- A plataforma `level-02-step-timing` introduz timing com a trap
  `level-02-falling-platform`.
- A porta final fica fechada por padrão e exige a alavanca
  `level-02-lever-exit` com ação secundária.
- A chave `level-02-mechanism-key` ativa um mecanismo visual separado, mantendo
  a alavanca como solução real da porta.
- O checkpoint intermediário fica depois da primeira travessia, reduzindo
  repetição antes da seção da saída.
- A pegadinha visual da saída vem do projétil lateral
  `level-02-side-projectile`, disparado depois do checkpoint.
- A fase declara metadados mínimos de som para alavanca e projétil; reprodução
  real continua para a Fase 9, quando o Audio Manager existir.

Implementação inicial da Fase 3, `Quase Seguro`:

- A fase 3 passou a fechar o MVP inicial, com ponto A no spawn inicial e ponto B
  na saída final.
- A primeira metade virou uma sequência curta de três plataformas estreitas para
  exigir precisão sem alongar demais a tentativa.
- A plataforma `level-03-platform-precision-02` é quebrável e sustenta o token
  opcional `level-03-risk-token`, criando risco e recompensa sem bloquear a
  conclusão.
- O checkpoint `level-03-before-cruel` fica depois da sequência de precisão e
  antes da seção mais cruel.
- A saída fica sobre `level-03-exit-platform`, mas o trecho
  `level-03-false-floor` remove parte do chão e testa desconfiança/memória curta
  antes do fim.
- Dois hazards de queda cobrem a sequência inicial e a seção cruel da saída.
- A fase declara metadados mínimos de som para token e piso falso; reprodução
  real continua para a Fase 9, quando o Audio Manager existir.

Balanceamento inicial da curva das três primeiras fases:

- A progressão ficou definida como: Fase 1 introduz crueldade básica, Fase 2
  exige timing/interação e Fase 3 combina leitura, memória curta e precisão.
- Cada fase inicial usa uma piada principal diferente: `spike-pop`,
  `falling-platform`/projétil e `breakable-floor`/`false-block`.
- O primeiro desafio relevante deve aparecer em até 14 tiles depois do spawn.
- O primeiro desafio depois de um checkpoint deve aparecer em até 12 tiles, para
  reduzir caminhada inútil antes de uma nova tentativa.
- A decisão detalhada foi registrada em `docs/initial-curve-balance.md` e
  protegida por `tests/initial-curve-balance.test.ts`.

Revisão final da Fase 8:

- As três fases iniciais agora têm ponto A, ponto B, checkpoint, perigos,
  armadilhas e contratos de conclusão cobertos por testes de conteúdo.
- A curva inicial foi revisada em conjunto para garantir progressão clara,
  variedade de armadilhas e pouca caminhada antes das tentativas relevantes.
- A Fase 8 ficou pronta para commit com validação automática e smoke test no
  navegador.

Implementação inicial do Audio Manager:

- `src/game/systems/audio-manager.ts` centraliza volume geral, volume de música,
  volume de efeitos, mute e fila de reprodução quando o navegador ainda bloqueia
  autoplay.
- `AudioScene` fica ativa desde o boot e conecta o manager aos eventos internos
  `audio:play-requested`, `audio:stop-requested` e `audio:mute-changed`.
- `PhaserAudioEngine` adapta o manager ao Sound Manager do Phaser e ignora de
  forma segura sons ainda não carregados, mantendo a infraestrutura pronta para
  as próximas tasks sem exigir assets finais agora.
- O mute global continua vindo de `gameStateStore`, então `M` muda o estado do
  jogo, atualiza o HUD e sincroniza o manager.
- Sons bloqueados por autoplay ficam enfileirados até o Phaser emitir
  `unlocked` ou até a primeira interação de teclado/mouse registrada pela
  `AudioScene`.

Implementação inicial dos sons do personagem:

- Foram gerados placeholders originais em `.wav` para pulo, aterrissagem, três
  mortes, respawn, ação primária e ação secundária do Pino.
- Os metadados ficam em `src/data/audio/player-audio.ts`, separados do manager,
  para manter a troca futura por assets finais simples.
- `PreloadScene` carrega os sons do personagem via `AUDIO_ASSETS`.
- `LevelScene` emite cues de pulo, aterrissagem e ações por eventos de áudio,
  sem tocar Phaser Sound diretamente.
- `AudioScene` escuta `player:died` e `player:respawned` para tocar variações
  de morte e respawn sem acoplar o estado global ao motor de áudio.
- O som de aterrissagem só dispara depois de queda real acima de velocidade
  mínima, evitando ruído em microcolisões.

Implementação inicial dos sons de fase:

- Foram gerados placeholders originais em `.wav` para checkpoint, fim de fase,
  coleta de item, armadilha ativada, plataforma caindo e projétil disparando.
- Os metadados ficam em `src/data/audio/level-audio.ts`, mantendo os cues de
  fase separados dos sons do personagem.
- `AudioScene` escuta `checkpoint:activated` e `level:completed` para tocar os
  sons de checkpoint e fim de fase a partir dos eventos globais existentes.
- `LevelScene` emite cues de coleta de item e ativação de traps quando o estado
  da sala muda, evitando som antes de uma interação realmente acontecer.
- `level-audio-feedback.ts` reserva cues específicos para plataforma caindo e
  projétil disparando, usando um som genérico curto para as demais traps do MVP.

Implementação inicial da música do MVP:

- O tema inicial se chama `Passos Tortos`: um loop discreto em 92 BPM com pulso
  curto, acordes menores e volume baixo para sustentar tensão sem cansar em
  repetição.
- O loop temporário original fica em `assets/audio/music/mvp-loop.wav` e a
  vinheta musical de fim de fase fica em
  `assets/audio/music/mvp-level-complete-sting.wav`.
- Os metadados ficam em `src/data/audio/music-audio.ts`, separados dos sons de
  personagem e dos sons de fase.
- `PreloadScene` pede o início do loop depois que os assets foram carregados;
  se o navegador ainda bloquear autoplay, o `AudioManager` mantém o pedido na
  fila até a primeira interação.
- O loop não é disparado por morte ou respawn, e o `AudioManager` evita
  reiniciar uma música que já esteja ativa com o mesmo id.
- Ao completar a fase, `AudioScene` toca a vinheta curta de conclusão junto do
  feedback de fim de fase já existente.

Implementação inicial da tela inicial:

- A tela de abertura usa `Jogo Difícil` como nome provisório e mantém apenas uma
  linha de comando visível: `INICIAR FASE 1: ENTER / ESPAÇO`.
- O visual deixa claro que é um jogo de plataforma: Pino aparece no chão, a
  saída fica à direita e os hazards sugerem a crueldade da fase sem explicar o
  jogo por texto.
- `MenuScene` aceita Enter, Espaço e toque/click, mas todos passam por uma trava
  simples para evitar iniciar a fase mais de uma vez.
- A lista de cenas agora começa por `BootScene`; ela lança `AudioScene`, entra
  no preload e só então chega ao menu, garantindo que a tela inicial realmente
  apareça antes da fase.
- O contrato de conteúdo e posicionamento base fica em
  `src/game/ui/start-screen.ts`, com teste dedicado para garantir copy curta,
  comando claro e início pela Fase 1.

Implementação inicial do HUD:

- O HUD fica como uma faixa superior mínima para reservar uma área previsível e
  reduzir interferência no espaço principal de plataforma.
- A esquerda mostra `Mortes N`; o centro mostra `Fase X: Nome`; a direita só
  mostra `MUDO` quando o áudio estiver mutado.
- A fase exibida vem do registry de fases, usando `order` e `name`, não o id
  interno como `level-01`.
- O texto debug antigo de `LevelScene` foi removido porque disputava espaço com
  o HUD.
- `src/game/ui/hud.ts` concentra layout, estilos e formatadores para manter a
  cena Phaser fina e os contratos testáveis.

Implementação inicial de pausa e mute:

- `Esc` é tratado diretamente por `LevelScene` para pausar e por `PauseScene`
  para retomar, evitando depender de leitura frame-a-frame para comandos de
  sistema.
- `M` alterna mute tanto durante a fase quanto na tela de pausa; o HUD e o
  overlay de pausa refletem o estado vindo de `gameStateStore`.
- Pausar usa `this.scene.pause()` na fase e lança `PauseScene`, então movimento,
  armadilhas, colisões e timers da fase deixam de avançar enquanto o overlay
  está ativo.
- `AudioScene` já escutava `audio:mute-changed`; os testes do `AudioManager`
  agora cobrem volumes ativos indo para zero ao mutar e voltando ao desmutar.
- O overlay de pausa fica propositalmente curto: título, comando para voltar,
  comando de áudio e estado atual do som.

Implementação inicial da transição entre fases:

- Ao tocar a saída, `LevelScene` emite `level:completed` e muda para
  `LevelTransitionScene`, evitando que a fase continue processando depois da
  conclusão.
- A transição entre fases é curta e automática: mostra fase concluída, próxima
  fase e mortes acumuladas por cerca de 1 segundo antes de iniciar a próxima
  fase.
- A decisão para o MVP é preservar o contador de mortes ao avançar entre as 3
  fases, para medir o run inteiro; ele só é resetado quando o jogador reinicia a
  partir da tela final.
- Após a Fase 3, a mesma cena mostra uma tela final simples com mortes totais e
  `ENTER reinicia`.
- A vinheta de fim de fase continua sendo disparada por `AudioScene`; ao entrar
  na próxima fase, a transição pede o loop musical do MVP novamente.

Implementação inicial da direção visual:

- Estilo escolhido: pixel art de baixa resolução, mantendo a base técnica já
  definida para 480x270, grid de 16x16px, renderização `pixelArt` e leitura em
  escala 1x.
- Tese visual: laboratório de testes hostil, com fundos escuros, blocos
  industriais, silhuetas limpas e acentos saturados para perigo, progresso e
  falsa segurança.
- Paleta inicial semântica registrada em `src/data/art/visual-direction.ts`:
  fundo `#111217`, painel `#242630`, metal `#3f4958`, texto `#f5f7fb`,
  sombra `#050608`, seguro/checkpoint `#80d7c2`, herói/item `#f4d35e`, perigo
  `#e35d6a`, saída/truque `#e76f51` e trap especial `#9b5de5`.
- Tile base mantido em 16x16px.
- Tamanho final aproximado do Pino mantido em 12x24px visual, com hitbox 10x22px
  e proporção de 0,75 tile de largura por 1,5 tile de altura.
- Regras para novos assets: ler em 1x antes de detalhar, usar cor por
  significado, manter perigos/objetivos mais claros que o fundo, preferir
  contorno duro de 1px e evitar textura que confunda colisão.
- Referência operacional adicional registrada em `docs/visual-direction.md`.

### Ponto 7 - Pipeline de Assets

Status: Decidido.

Decisões a registrar:

- Pastas de sprites, mapas, áudio, fontes e efeitos.
- Padrão de nomes.
- Formato dos sprites.
- Formato dos mapas.
- Formato dos áudios.
- Separação entre assets temporários e finais.
- Registro de licença ou origem dos assets.

Decisão:

- `assets/sprites/`: personagens, armadilhas, itens, inimigos e objetos visuais.
- `assets/tilesets/`: tiles de cenário.
- `assets/audio/music/`: músicas.
- `assets/audio/sfx/`: efeitos sonoros.
- `assets/fonts/`: fontes.
- `assets/temp/`: assets temporários e protótipos.
- `assets/ASSETS.md`: registro de origem, licença e observações de uso.

Padrões:

- Usar nomes em `kebab-case`.
- Exemplos: `player-idle.png`, `trap-spike-pop.wav`, `checkpoint-activate.ogg`.
- Sprites devem usar `.png`.
- Áudio deve usar `.ogg`; usar fallback `.mp3` somente se necessário.
- Mapas do MVP serão definidos em TypeScript, então não haverá arquivos externos de mapa no início.
- Assets temporários devem ficar em `assets/temp/` e não devem ser confundidos com assets finais.
- Todo asset precisa ser original, gerado para o projeto ou ter licença compatível.
- Nenhum asset copiado de Trap Adventure 2 ou de outro jogo deve entrar no projeto.

### Ponto 8 - Critério de Pronto do Primeiro Build

Status: Decidido.

Decisões a registrar:

- O jogo abre no navegador.
- O personagem responde aos controles.
- As 3 fases iniciais são jogáveis.
- Morte e respawn funcionam.
- Checkpoints funcionam.
- Contador de mortes funciona.
- Áudio básico funciona.
- Não há erro crítico no console.
- Build de produção funciona.

Decisão:

O primeiro build será considerado pronto quando:

- O projeto abrir com `npm run dev`.
- O build de produção rodar com `npm run build`.
- Não houver erro crítico no console.
- Uma tela inicial simples aparecer.
- O personagem aparecer no mapa.
- Os controles responderem.
- O personagem andar, pular e colidir corretamente.
- As 3 fases iniciais existirem e puderem ser concluídas.
- Cada fase tiver ponto A e ponto B.
- Morte funcionar.
- Respawn rápido funcionar.
- `R` reiniciar do checkpoint.
- Contador de mortes aparecer e incrementar.
- Pelo menos um checkpoint funcionar.
- Cada fase tiver pelo menos uma armadilha ou obstáculo.
- Áudio básico funcionar ou poder ser mutado.
- Smoke test no navegador passar.
- `README.md` documentar os comandos básicos de execução.

Observação:

O primeiro build não precisa ter arte final, trilha final, história completa, ranking, replay fantasma ou conquistas completas. Ele precisa provar que o ciclo principal do jogo funciona.

### Ponto 9 - Resolução Base e Tamanho de Tile

Status: Decidido.

Decisões a registrar:

- Resolução base do jogo.
- Tamanho do tile.
- Tamanho aproximado do personagem em pixels.
- Relação entre resolução base e telas comuns.

Decisão:

- Resolução base: 480x270 pixels.
- Tamanho do tile: 16x16 pixels.
- Tamanho aproximado do personagem: ~24px de altura, ~12px de largura.
- Grid resultante: 30 tiles de largura por ~17 tiles de altura.
- A resolução base escala 1:1 para resoluções comuns:
  - 2x → 960x540.
  - 3x → 1440x810.
  - 4x → 1920x1080 (Full HD).
- Os valores de física definidos no Ponto 3 continuam válidos: pulo de pico ~77px equivale a ~5 tiles.

Regras:

- Todo sprite e tileset deve respeitar a base de 16px.
- Personagem e elementos importantes devem ser legíveis em escala 1x.
- Mapas devem ser desenhados pensando no grid de 16px.
- Mudanças nessa resolução base depois de assets criados forçam retrabalho — evitar.

### Ponto 10 - Funções da Ação Principal e Secundária

Status: Decidido.

Decisões a registrar:

- Função da ação principal.
- Função da ação secundária.
- Como cada ação se integra ao design de fases.

Decisão:

- Ação principal: Dash.
  - Impulso horizontal curto e rápido.
  - Duração inicial: ~150 ms.
  - Cooldown inicial: ~300 ms.
  - Utilizável no chão e no ar.
  - Aumenta teto de habilidade e permite atravessar gaps maiores ou esquivar projéteis.
- Ação secundária: Interagir.
  - Aciona alavancas, botões e mecanismos.
  - Abre portas.
  - Pega ou usa itens contextuais.
  - Sem cooldown.

Regras:

- O Dash deve ser previsível: mesma distância sempre, sem variação por tempo de botão.
- A Fase 1 não precisa exigir Dash; ele é introduzido na Fase 2.
- Interagir é usado a partir da Fase 2, com primeiro mecanismo simples.
- Valores exatos de duração, distância e cooldown do Dash serão ajustados durante o protótipo de movimento.
- Ações principal e secundária não devem ser obrigatórias para concluir a Fase 1.

### Ponto 11 - Comportamento do Canvas

Status: Decidido.

Decisões a registrar:

- Modo de escala do canvas.
- Suporte a pixel art.
- FPS alvo.
- Suporte a mobile/touch no MVP.
- Aspect ratio.

Decisão:

- Modo de escala do Phaser: `FIT`.
- Auto-center: `CENTER_BOTH`.
- `pixelArt: true` para manter nitidez.
- `roundPixels: true` para evitar sub-pixel rendering.
- FPS alvo: 60.
- Aspect ratio fixo: 16:9 (480x270).
- Letterbox quando o aspect ratio da janela não bater.
- Escala inteira priorizada quando possível.
- Mobile e touch ficam fora do MVP.

Regras:

- O jogo deve ser jogável apenas com teclado no MVP.
- Telas com aspect ratio diferente recebem barras pretas, não distorção.
- A escala deve ser inteira sempre que a janela permitir, para manter pixel art nítido.
- Suporte a controle/gamepad e touch ficam planejados para depois do MVP.

## Roadmap de Desenvolvimento com IA

Documento operacional: `ROADMAP.md`.

O desenvolvimento deve seguir o roadmap por fases, tasks e subtasks. Cada IA que trabalhar no projeto deve:

- Ler `IDEIA.md`, `CLAUDE.md`, `AGENTS.md` e `ROADMAP.md`.
- Executar o primeiro item pendente que desbloqueia progresso real.
- Fazer mudanças pequenas e verificáveis.
- Marcar tasks e subtasks concluídas em `ROADMAP.md`.
- Registrar bloqueios no próprio roadmap quando existirem.
- Atualizar `IDEIA.md` sempre que uma decisão de design mudar.

Regra prática:

- `IDEIA.md` define o produto e as decisões.
- `ROADMAP.md` define a execução item a item.
- `CLAUDE.md` e `AGENTS.md` definem como agentes devem trabalhar no repositório.

## Fases de Desenvolvimento Iniciais

O desenvolvimento inicial será dividido em fases pequenas e bem definidas. A ideia é construir primeiro uma base jogável 2D de plataforma, sem sistemas grandes demais antes de validar personagem, leitura visual, animação e movimento.

### Fase 1 - Personagem Principal: Conceito e Desenho

Definir quem é o personagem principal, como ele aparece na tela e como sua silhueta funciona em um jogo 2D de plataforma difícil.

Esta fase não depende ainda de física final, mapas completos, armadilhas ou áudio. O foco é criar uma identidade visual clara para o personagem e preparar a base para animações e gameplay.

### Fase 2 - Animações do Personagem

Criar as animações principais do personagem com base no desenho aprovado na Fase 1.

Animações esperadas:

- Idle.
- Correr.
- Pular.
- Cair.
- Ação principal.
- Ação secundária.
- Morrer.
- Respawn.
- Vitória/fim de fase.

### Fase 3 - Movimentação do Personagem no Mapa

Implementar o controle jogável básico do personagem em uma cena 2D de plataforma.

Ações de gameplay iniciais:

- Andar para direita.
- Andar para esquerda.
- Pular.
- Ação principal.
- Ação secundária.

Respostas básicas do personagem:

- Cair com gravidade consistente.
- Colidir com chão e paredes.
- Reiniciar rapidamente a posição.

### Fase 4 - Desenvolvimento dos Mapas Iniciais

Criar a estrutura inicial de mapas do jogo com 3 fases pequenas, planejadas e jogáveis.

O objetivo é validar leitura de cenário, ritmo, obstáculos, itens, checkpoints, câmera, colisões e progressão antes de aumentar o jogo.

### Fase 5 - Desafios, Engajamento e Recompensa

Definir os desafios do jogo e o ciclo que mantém o jogador engajado mesmo morrendo muitas vezes.

O foco é transformar tentativa, erro, morte e repetição em algo divertido, rápido e recompensador.

### Fase 6 - Música, Som e Feedback Auditivo

Desenvolver a identidade sonora do jogo: tema musical, sons das ações do personagem, morte, pulo, armadilhas, itens, checkpoints e vitória.

O som precisa reforçar humor, desafio, feedback e ritmo sem cansar o jogador durante muitas tentativas.

### Fase 7 - Loop Jogável Mínimo com 3 Fases

Conectar personagem, movimento, 3 fases iniciais, desafios, áudio, morte, respawn, contador de mortes, reinício rápido e transição de fase.

## Fase 1 - Personagem Principal

Ideias a definir:

- Nome.
- Silhueta.
- Tamanho base.
- Personalidade.
- Ações que o desenho deve suportar depois.
- Motivo para atravessar as fases.

Animações futuras que a Fase 1 deve prever, mas não produzir:

- Idle.
- Correr.
- Pular.
- Cair.
- Ação principal.
- Ação secundária.
- Morrer.
- Respawn.
- Vitória/fim de fase.

### Objetivo da Fase 1

Sair desta fase com um personagem principal reconhecível, original e pronto para ser animado. O desenho deve funcionar em tamanho pequeno, ser fácil de ler durante movimento rápido e combinar com a proposta cruel e bem-humorada do jogo.

### Escopo da Fase 1

Esta fase cobre:

- Conceito visual do personagem.
- Forma geral e silhueta.
- Proporções básicas.
- Paleta inicial.
- Tamanho base em pixels ou unidades de jogo.
- Direção de personalidade.
- Primeira pose de referência.
- Regras de hitbox visual e hitbox real.

Esta fase não cobre:

- Animações completas.
- Física final de movimentação.
- Inimigos.
- Armadilhas.
- Mapa completo.
- Música ou efeitos sonoros.

### Direção Inicial do Personagem

O personagem deve ser pensado para um jogo 2D de plataforma com dificuldade alta. Ele precisa comunicar rapidamente onde está olhando, se está no chão ou no ar e qual é seu volume aproximado de colisão.

Requisitos iniciais:

- Silhueta clara mesmo em tamanho pequeno.
- Cabeça, corpo ou ponto focal fácil de identificar.
- Contraste suficiente com cenários claros e escuros.
- Design original, sem copiar personagens de outros jogos.
- Visual simples o bastante para animar várias ações.
- Expressividade suficiente para sustentar humor cruel nas mortes.

### Desenho do Personagem

Entregáveis esperados:

- Esboço frontal ou 3/4 do personagem.
- Versão em pose neutra para idle.
- Indicação de escala em relação ao tile do cenário.
- Paleta de cores inicial.
- Notas sobre personalidade e expressão.
- Observação de quais partes podem deformar ou exagerar em animações.

Decisões de conceito fechadas na Task 3.1:

- Nome provisório: Pino.
- Tipo: criatura original. Não é humano e não é um objeto animado literal.
- Função narrativa provisória: Pino é um pequeno testador de salas impossíveis,
  teimoso o bastante para voltar depois de cada morte.
- Personalidade visual: curioso, desconfiado e levemente desajeitado, com humor
  seco. Ele parece sempre pronto para cair em uma armadilha que já suspeitava
  existir.
- Silhueta: corpo compacto em formato de cápsula inclinada, frente levemente
  pontuda para indicar direção, antena curta no topo e dois pés pequenos e
  separados na base.
- Proporção geral: personagem alto e estreito, com leitura aproximada de 2:1
  entre altura e largura. Cabeça e corpo funcionam como uma massa única para
  preservar legibilidade em 24px de altura.
- Rosto e direção: um visor/olho frontal grande indica para onde Pino está
  olhando. O sprite pode ser espelhado, mas o ponto frontal deve continuar
  óbvio.
- Acessórios importantes: antena curta e ponta frontal; ambos podem exagerar em
  animações de dash, morte e respawn, mas não devem entrar na hitbox principal.
- Limitação visual proposital: pernas curtas e corpo geométrico. O personagem
  deve parecer preciso para colisão, mas vulnerável e cômico quando morre.
- Paleta inicial de placeholder: corpo amarelo-sinalização, visor claro/ciano,
  sombra azul-petróleo e acento coral para feedback de dano ou perigo.
- Regra para próximas tarefas: a Task 3.2 pode ajustar medidas, hitbox, pivô e
  margens sem redesenhar o conceito; a Task 3.3 deve produzir o primeiro
  placeholder visual seguindo esta silhueta.

### Tamanho e Leitura

Decisões de escala fechadas na Task 3.2:

- Resolução base do jogo: 480x270.
- Tamanho dos tiles: 16x16px.
- Área visual do sprite: 12x24px.
- Hitbox real inicial: 10x22px, centralizada dentro da área visual.
- Margem entre sprite e hitbox: 1px em cada lado, topo e base. Antena, ponta
  frontal e deformações visuais podem ocupar essa margem, mas não devem mudar a
  colisão principal.
- Pivô do personagem: centro inferior do sprite, equivalente a x=6px e y=24px
  dentro da área visual. Checkpoints e respawn devem usar esse ponto como
  posição de referência.
- Relação com tile: sprite visual de 0,75 tile de largura por 1,5 tile de
  altura; hitbox de 0,625 tile de largura por 1,375 tile de altura.
- Leitura prática: Pino cabe visualmente em dois tiles de altura com folga e
  ocupa menos de um tile de largura, favorecendo plataformas estreitas e colisão
  previsível.

Regra prática:

A hitbox deve favorecer precisão e justiça. O sprite pode ter detalhes externos, mas a colisão principal precisa ser previsível para o jogador.

### Placeholder Visual Inicial

Decisões de placeholder fechadas na Task 3.3:

- Primeiro asset: `assets/sprites/player-pino-idle.png`.
- Formato: PNG transparente, 12x24px, sem escala interna.
- Pose: idle neutro, com corpo em cápsula e pés pequenos.
- Direção: Pino olha para a direita por padrão; visor, ponta frontal e acento
  coral ficam do lado direito para leitura imediata de direção.
- Contraste: corpo amarelo-sinalização contra fundo escuro, contorno
  azul-petróleo e visor ciano claro.
- Uso: asset temporário de gameplay para leitura, posicionamento, escala e
  animações futuras. Pode ser substituído pela arte final mantendo a mesma área
  visual e pivô definidos na Task 3.2.

### Dados De Animação

Decisões de animação fechadas na Task 3.4:

- Arquivo declarativo inicial: `src/data/characters/pino-animations.ts`.
- Animações esperadas para o Pino: `idle`, `run`, `jump`, `fall`, `death`,
  `respawn`, `primary-action` e `secondary-action`.
- As animações centrais de movimento agora usam frames dedicados criados na
  Fase 11.3. Ações principal e secundária ainda usam frames reaproveitados até
  terem arte própria.
- `idle` e `run` são animações em loop. `jump`, `fall`, `death`, `respawn`,
  `primary-action` e `secondary-action` são animações de execução única no
  placeholder.
- A ação principal representa o dash. A ação secundária representa interação.
- A seleção de animação segue prioridade: respawn, morte, ação principal, ação
  secundária, ar subindo, ar caindo, corrida e idle.
- A `LevelScene` registra as animações no Phaser e escolhe a animação inicial a
  partir do estado do personagem, em vez de fixar uma textura diretamente.

### Entidade Player

Decisões de entidade fechadas na Task 3.5:

- Classe inicial: `src/game/entities/player.ts`.
- A entidade `Player` encapsula o sprite Arcade, registro de animações,
  aplicação de hitbox, estado físico e estado visual.
- Estado físico: posição, velocidade, aterramento e hitbox real.
- Estado visual: direção, animação atual, vida, respawn e flags de ação.
- A hitbox aplicada no corpo Arcade usa as medidas da Task 3.2: 10x22px com
  offset de 1px em relação ao sprite visual 12x24px.
- A `LevelScene` não cria mais sprite solto do jogador; ela instancia `Player`,
  chama `updateMovement` no `update` da cena e destrói a entidade no shutdown.
- Métodos iniciais expostos: `updateMovement`, `die`, `respawn`,
  `finishRespawn`, `getEntityState`, `getPhysicsState`, `getVisualState`,
  `getSprite` e `destroy`.
- Movimento completo, input real, colisão com terreno e resposta de pulo ficam
  para a Fase 4. Nesta etapa, a entidade prepara o ponto de integração sem
  implementar controles finais.

### Critérios de Pronto da Fase 1

A Fase 1 estará pronta quando:

- O personagem tiver nome provisório ou definitivo.
- A silhueta principal estiver definida.
- O tamanho base estiver definido ou temporariamente registrado.
- A paleta inicial estiver escolhida.
- Existir uma pose de referência pronta para guiar sprites/animações.
- As principais decisões visuais estiverem registradas neste arquivo.
- A Fase 2 puder começar sem redesenhar o personagem do zero.

## Controles

Decisão atual:

O jogo terá 5 ações de gameplay:

- Andar para direita.
- Andar para esquerda.
- Pular.
- Ação principal.
- Ação secundária.

Comandos de sistema não contam como ações de gameplay:

- Reiniciar rápido.
- Pausar.
- Mutar áudio.

Funções definidas (ver Ponto 10):

- Ação principal: Dash.
- Ação secundária: Interagir.
- Pulo variável por tempo de botão: sim (ver Ponto 3).
- Teclas: ver Ponto 4.

Implementação inicial do mapa de input:

- Bindings puros: `src/game/input/input-bindings.ts`.
- Adaptador Phaser: `src/game/input/action-input.ts`.
- A gameplay deve consultar ações por `isDown`, `wasPressed`, `wasReleased` e
  `getState`, evitando condicionais espalhadas por tecla.
- `LevelScene` e `PauseScene` usam a ação `pause` em vez de ouvir `Esc`
  diretamente. `LevelScene` usa a ação `mute` em vez de ouvir `M` diretamente.

Decisões pendentes:

- O jogo terá suporte a controle/gamepad? (fora do MVP)

## Ações e Sistemas

Controles de gameplay definidos:

- Andar para direita.
- Andar para esquerda.
- Pular.
- Ação principal.
- Ação secundária.

Funções definidas (ver Ponto 10):

- Ação principal: Dash (impulso horizontal curto, ~150 ms, cooldown ~300 ms, chão e ar).
- Ação secundária: Interagir (alavancas, botões, portas, itens contextuais).

Sistemas candidatos:

- Checkpoints.
- Timer opcional.
- Contador de mortes.
- Replay fantasma.
- Ranking local.
- Assist mode opcional.
- Seleção de fases.
- Segredos.
- Conquistas internas.

## Armadilhas

Categorias para explorar:

- Blocos falsos.
- Espinhos móveis.
- Plataformas que somem.
- Chão que cai.
- Projéteis surpresa.
- Câmera enganosa.
- Saídas falsas.
- Checkpoints traiçoeiros, mas justos.
- Regras que mudam temporariamente.
- Inimigos com padrões simples e cruéis.

Regra de design:

Uma armadilha pode surpreender, mas depois da morte o jogador deve conseguir entender a lógica.

## Fase 4 - Desenvolvimento dos Mapas Iniciais

### Objetivo da Fase 4

Criar os primeiros mapas do jogo em formato pequeno e controlado. A meta inicial é ter 3 fases de plataforma 2D que testem o personagem, a movimentação e a leitura do jogador sem ainda tentar cobrir o jogo inteiro.

Essas fases devem ser curtas, difíceis e fáceis de reiniciar. Cada uma precisa ensinar uma ideia, distorcer essa ideia e terminar antes de cansar.

### Escopo Inicial

A Fase 4 cobre:

- Estrutura base de uma fase.
- Planejamento das 3 primeiras fases.
- Layout inicial de terreno.
- Obstáculos básicos.
- Itens iniciais.
- Checkpoints.
- Pontos de spawn.
- Saídas de fase.
- Áreas de morte.
- Pontos de câmera.
- Lista de assets necessários por fase.

A Fase 4 não cobre:

- Todos os mundos do jogo.
- Fase final.
- Ranking online.
- Sistema completo de conquistas.
- Cutscenes complexas.
- Polimento final de arte e áudio.

### Quantidade Inicial de Fases

O jogo começará com 3 fases iniciais. Depois que essas fases estiverem jogáveis e validadas, o jogo poderá crescer com novos mundos, fases extras e variações de mecânicas.

As 3 fases iniciais serão:

- Fase 1: introduzir controles, escala do personagem e primeira surpresa simples.
- Fase 2: introduzir timing, obstáculos mais ativos e uso inicial de itens ou objetos interativos.
- Fase 3: combinar leitura de cenário, armadilha surpresa e uma pequena sequência de precisão.

### Estrutura Padrão de uma Fase

Cada fase deve ser documentada com:

- Nome provisório ou definitivo.
- Objetivo da fase.
- Ideia central.
- Mecânica nova ou variação principal.
- Tamanho aproximado.
- Ponto de spawn.
- Ponto de saída.
- Checkpoints.
- Obstáculos.
- Armadilhas.
- Itens.
- Objetos interativos.
- Áreas de morte.
- Inimigos, se existirem.
- Comportamento esperado da câmera.
- Dificuldade estimada.
- Desafio principal.
- Recompensa de progresso.
- Assets necessários.
- Riscos de design.
- Critério de pronto.

### Estrutura Interna de Mapa

Cada fase deve ser montada em camadas claras:

- Terreno: chão, paredes, plataformas e limites.
- Colisão: blocos sólidos e plataformas atravessáveis, se existirem.
- Perigo: espinhos, quedas, projéteis, esmagadores e armadilhas.
- Interação: botões, alavancas, portas, mecanismos e itens.
- Spawn: início da fase, checkpoints e respawn.
- Objetivo: saída, portal, bandeira ou elemento de fim de fase.
- Decoração: elementos visuais sem colisão.
- Câmera: limites, zonas de atenção e enquadramento.

### Obstáculos Iniciais

Obstáculos candidatos para as 3 primeiras fases:

- Buracos.
- Espinhos fixos.
- Plataformas estreitas.
- Plataformas que caem.
- Blocos falsos.
- Blocos que aparecem depois de uma ação.
- Projéteis simples.
- Portas ou barreiras.
- Chão quebrável.

Regras para obstáculos:

- Cada obstáculo deve ter uma leitura visual clara.
- O jogador pode ser surpreendido, mas deve entender a causa da morte.
- Obstáculos não devem criar softlock.
- Uma fase inicial não deve misturar muitos obstáculos novos ao mesmo tempo.

### Itens Iniciais

Itens candidatos:

- Chave.
- Moeda ou coletável simples.
- Item de ativação de mecanismo.
- Item de tutorial prático para ação principal ou secundária.
- Item opcional de risco e recompensa.

Regras para itens:

- Todo item precisa ter função clara.
- Itens obrigatórios devem ficar no caminho principal ou ser sinalizados.
- Itens opcionais devem recompensar exploração ou execução difícil.
- Nenhum item deve depender de leitura ambígua demais.

### Modelo das 3 Fases Iniciais

#### Fase 1 - Entrada Cruel

Função:

- Ensinar andar, pular, colisão, morte e restart rápido.

Conteúdo inicial:

- Terreno simples.
- Buracos pequenos.
- Primeira armadilha surpresa.
- Um checkpoint, se a fase ficar longa demais.
- Saída clara.

Risco principal:

- A primeira surpresa não pode parecer bug ou injustiça sem leitura depois da morte.

#### Fase 2 - O Caminho Não Confia em Você

Função:

- Introduzir obstáculos com timing e primeira interação simples.

Conteúdo inicial:

- Plataformas mais estreitas.
- Obstáculo ativo simples.
- Item ou mecanismo ligado à ação principal ou secundária.
- Checkpoint no meio.
- Saída com pequena pegadinha visual.

Risco principal:

- Não exigir precisão extrema antes do jogador dominar o controle básico.

#### Fase 3 - Quase Seguro

Função:

- Misturar leitura de cenário, precisão e armadilha memorável.

Conteúdo inicial:

- Sequência curta de pulos precisos.
- Bloco falso ou chão quebrável.
- Item opcional de risco e recompensa.
- Checkpoint antes da parte mais cruel.
- Saída que testa a desconfiança do jogador.

Risco principal:

- Evitar acúmulo de ideias novas. A fase deve parecer uma evolução das duas primeiras.

### Critérios de Pronto da Fase 4

A Fase 4 estará pronta quando:

- As 3 fases iniciais estiverem planejadas neste arquivo.
- Cada fase tiver objetivo, ideia central, obstáculos, itens e saída definidos.
- A estrutura padrão de fase estiver validada para guiar implementação.
- Os assets necessários para os mapas estiverem listados.
- A Fase 5 puder começar definindo desafios, engajamento e recompensas.

## Fase 5 - Desafios, Engajamento e Recompensa

### Objetivo da Fase 5

Definir como o jogo será divertido mesmo com muitas mortes. O jogador deve sentir que cada tentativa ensina alguma coisa, que a próxima tentativa será melhor e que vencer um trecho difícil vale o esforço.

A dificuldade deve gerar tensão, riso, surpresa e vontade de tentar de novo, não cansaço gratuito.

### Escopo da Fase 5

Esta fase cobre:

- Tipos de desafio.
- Ritmo de tentativa e erro.
- Feedback de morte.
- Recompensas por progresso.
- Desafios opcionais.
- Uso de itens para engajamento.
- Curva de dificuldade das 3 fases iniciais.
- Regras para evitar frustração inútil.

Esta fase não cobre:

- Balanceamento final do jogo inteiro.
- Ranking online.
- Monetização.
- História completa.
- Sistemas complexos de progressão.

### Ciclo Principal de Desafio

O ciclo básico do jogo será:

- Observar o cenário.
- Tentar atravessar.
- Ser surpreendido ou errar por precisão.
- Morrer rapidamente.
- Entender o que aconteceu.
- Reiniciar quase imediatamente.
- Tentar de novo com mais conhecimento.
- Superar o trecho e receber uma pequena recompensa.

Regra central:

A morte deve ser parte do aprendizado. Se o jogador morre e não entende nada, o desafio falhou.

### Tipos de Desafio

Desafios principais:

- Precisão de pulo.
- Timing de plataformas ou obstáculos.
- Leitura de cenário.
- Memória curta de armadilhas.
- Reação rápida a uma surpresa.
- Uso da ação principal.
- Uso da ação secundária.
- Escolha entre caminho seguro e caminho arriscado.

Desafios opcionais:

- Coletável em lugar perigoso.
- Atalho difícil.
- Sequência sem morrer.
- Passagem secreta.
- Item que exige usar ação principal ou secundária com precisão.
- Desafio de tempo local, sem exigir ranking online no início.

### Como Manter a Morte Divertida

Regras de engajamento:

- Respawn deve ser muito rápido.
- O jogador não deve repetir caminhadas longas antes de tentar de novo.
- A causa da morte precisa ser visualmente compreensível.
- Mortes podem ser engraçadas, mas não devem humilhar o jogador.
- Animações de morte devem ser curtas ou puláveis.
- Sons de morte devem ter personalidade, sem irritar em repetição.
- Checkpoints devem ficar antes de trechos longos ou muito difíceis.
- O contador de mortes deve funcionar como parte da identidade do jogo, não como punição pesada.

### Recompensas de Progresso

Recompensas iniciais:

- Chegar a um checkpoint.
- Abrir caminho novo.
- Coletar item opcional.
- Descobrir passagem secreta.
- Completar uma fase.
- Reduzir número de mortes em nova tentativa.
- Encontrar uma morte ou armadilha memorável.

Possíveis sistemas futuros:

- Medalhas locais por fase.
- Melhor tempo local.
- Menor número de mortes por fase.
- Lista de segredos encontrados.
- Replay fantasma.
- Mensagens curtas após mortes específicas.

### Curva das 3 Fases Iniciais

Fase 1:

- Ensinar que morrer é esperado.
- Garantir respawn rápido.
- Usar uma surpresa simples e memorável.
- Recompensar o jogador por entender a lógica básica do jogo.

Fase 2:

- Aumentar exigência de timing.
- Introduzir um desafio ligado à ação principal ou secundária.
- Criar primeiro risco opcional com recompensa.
- Usar checkpoint para evitar repetição cansativa.

Fase 3:

- Misturar precisão, leitura e memória curta.
- Criar uma armadilha mais marcante.
- Apresentar recompensa opcional mais difícil.
- Confirmar que o jogador aprendeu a desconfiar do cenário.

### Regras Contra Frustração Inútil

Evitar:

- Trechos longos antes da parte difícil.
- Morte sem causa clara.
- Armadilha puramente aleatória.
- Hitbox visualmente enganosa demais.
- Checkpoint antes de armadilha inevitável.
- Sequências que exigem tentativa perfeita por muito tempo.
- Repetição de uma mesma piada ou armadilha sem variação.
- Punições lentas depois da morte.

Preferir:

- Desafios curtos e intensos.
- Pequenas vitórias frequentes.
- Surpresas que ficam óbvias depois.
- Humor visual rápido.
- Risco e recompensa opcional.
- Checkpoints posicionados para manter ritmo.
- Progressão clara de ideias entre fases.

### Critérios de Pronto da Fase 5

A Fase 5 estará pronta quando:

- Cada uma das 3 fases iniciais tiver pelo menos um desafio principal definido.
- Cada fase tiver uma razão clara para o jogador querer tentar de novo.
- O ciclo de morte, feedback e respawn estiver documentado.
- Existirem regras claras para evitar frustração inútil.
- Pelo menos uma recompensa de progresso estiver definida para cada fase.
- A Fase 6 puder definir música, sons e feedback auditivo em cima dos desafios reais.

## Fase 6 - Música, Som e Feedback Auditivo

### Objetivo da Fase 6

Definir a identidade sonora do jogo e criar uma lista clara de músicas, efeitos sonoros e feedbacks auditivos necessários para o primeiro bloco jogável.

O áudio deve ajudar o jogador a entender ações, mortes, armadilhas, sucesso e erro. Como o jogo terá muitas mortes e repetições, o som precisa ser expressivo, rápido e agradável em repetição.

### Escopo da Fase 6

Esta fase cobre:

- Tema musical principal.
- Direção musical das 3 fases iniciais.
- Sons das ações do personagem.
- Sons de morte e respawn.
- Sons de obstáculos, itens e armadilhas.
- Sons de checkpoint e vitória.
- Regras de volume, mute e mixagem.
- Regras para evitar sons cansativos em repetição.

Esta fase não cobre:

- Trilha sonora completa do jogo final.
- Dublagem extensa.
- Música de todos os mundos futuros.
- Mixagem final profissional.
- Implementação técnica completa do sistema de áudio.

### Direção Musical Inicial

Decisões pendentes:

- Estilo musical principal.
- Tema principal do jogo.
- Variação musical por fase ou por bloco de fases.
- Ritmo da música durante trechos difíceis.
- Como a música reage a morte, checkpoint e vitória.

Regras:

- A música deve combinar com humor cruel e jogo de plataforma difícil.
- O loop musical deve funcionar bem por várias tentativas.
- A música não pode competir com sons importantes de gameplay.
- As fases iniciais podem usar uma música base com pequenas variações.
- Tudo deve ter licença compatível ou ser criado para o projeto.

### Tema Principal

O tema principal deve representar a identidade do jogo. Ele precisa ser marcante, mas não cansativo.

Características desejadas:

- Loop curto ou médio, fácil de repetir.
- Melodia reconhecível.
- Energia suficiente para manter ritmo.
- Espaço no arranjo para efeitos sonoros aparecerem.
- Possibilidade de variações mais tensas, engraçadas ou vitoriosas.

Entregáveis esperados:

- Descrição do estilo.
- Referência de clima, sem copiar músicas existentes.
- BPM aproximado.
- Instrumentos ou timbres principais.
- Versão de loop para gameplay.
- Vinheta curta de vitória ou fim de fase.

### Sons do Personagem

Sons necessários para o personagem:

- Pular.
- Cair ou aterrissar.
- Andar ou correr, se passos forem usados.
- Ação principal.
- Ação secundária.
- Receber impacto.
- Morrer.
- Respawn.
- Chegar ao fim da fase.

Regras para sons do personagem:

- Sons devem ser curtos e legíveis.
- Pulo e morte precisam ser reconhecíveis imediatamente.
- Som de morte deve ter variações para não cansar.
- Ação principal e ação secundária devem soar diferentes.
- Passos só devem existir se não deixarem o jogo barulhento.

### Sons de Morte e Respawn

Como o jogador vai morrer muitas vezes, essa parte é crítica.

Direção:

- Morte deve ter impacto rápido.
- Respawn deve comunicar retorno imediato ao controle.
- A morte pode ser engraçada, mas não longa.
- Sons de morte devem ter pequenas variações.
- O jogador deve poder reiniciar sem esperar o áudio terminar.

Possíveis variações:

- Morte por espinho.
- Morte por queda.
- Morte por esmagamento.
- Morte por projétil.
- Morte por armadilha surpresa.

### Sons de Mapa, Itens e Armadilhas

Sons candidatos:

- Coletar item.
- Ativar mecanismo.
- Abrir porta.
- Bloco falso quebrando ou sumindo.
- Plataforma caindo.
- Espinho surgindo.
- Projétil disparando.
- Checkpoint ativado.
- Saída de fase liberada.

Regras:

- Sons de armadilha devem ajudar o jogador a entender o que aconteceu.
- Sons importantes devem ter prioridade sobre sons decorativos.
- Itens opcionais devem ter som recompensador.
- Checkpoint deve ter som claro e positivo.
- Armadilhas não devem depender apenas do som para serem compreendidas.

### Áudio das 3 Fases Iniciais

Fase 1:

- Música simples e energética.
- Som de pulo claro.
- Som de morte rápido.
- Primeiro som de armadilha surpresa.
- Som de fim de fase.

Fase 2:

- Música pode ganhar camada extra ou variação.
- Som de mecanismo ou item ligado à ação principal/secundária.
- Som de obstáculo ativo.
- Som de checkpoint.

Fase 3:

- Música com mais tensão ou variação rítmica.
- Sons de armadilha mais marcantes.
- Som de item opcional.
- Som de saída que reforça desconfiança ou alívio.

### Mixagem e Controle

Regras iniciais:

- O jogo deve ter opção de mute.
- O jogo deve ter controle de volume.
- Separar volume de música e efeitos se possível.
- O jogo deve funcionar bem sem áudio.
- Sons repetidos rapidamente devem ter limite ou variação de pitch/volume.
- Nenhum som deve estourar, mascarar feedback importante ou incomodar em repetição.

### Critérios de Pronto da Fase 6

A Fase 6 estará pronta quando:

- O tema musical inicial estiver descrito.
- As necessidades sonoras do personagem estiverem listadas.
- Sons de morte, pulo, ações, respawn, itens, armadilhas e checkpoint estiverem planejados.
- As 3 fases iniciais tiverem direção sonora mínima.
- As regras de volume, mute e repetição estiverem documentadas.
- A Fase 7 puder integrar áudio ao loop jogável mínimo.

## Mapas e Progressão

Estrutura inicial:

- Primeiro bloco jogável: 3 fases iniciais.
- Expansão futura: novos mundos, fases extras e variações de mecânicas.
- Fase final futura: revisão cruel de tudo que o jogo ensinou.

Para cada fase registrar:

- Nome.
- Objetivo.
- Ideia central.
- Mecânica nova ou variação principal.
- Obstáculos.
- Novas armadilhas.
- Itens.
- Objetos interativos.
- Checkpoints.
- Ponto de spawn.
- Ponto de saída.
- Dificuldade.
- Desafio principal.
- Recompensa de progresso.
- Música.
- Sons e feedback auditivo.
- Assets necessários.
- Riscos de design.

## Arte

Direção pendente:

- Pixel art, cartoon vetorial ou outro estilo.
- Paleta principal.
- Resolução base.
- Tamanho dos tiles.
- Tamanho do personagem.
- Estilo de UI.

## Backlog Inicial

- Fechar decisões base antes de iniciar desenvolvimento.
- Executar `ROADMAP.md` item a item, marcando progresso.
- Definir nome do jogo.
- Escolher stack técnica.
- Criar projeto base.
- Fase 1: definir personagem principal, silhueta, desenho e escala.
- Fase 2: criar animações principais do personagem.
- Fase 3: criar protótipo de movimentação no mapa.
- Fase 4: planejar e estruturar as 3 fases iniciais.
- Fase 5: definir desafios, engajamento e recompensas das 3 fases iniciais.
- Fase 6: definir música, sons e feedback auditivo.
- Fase 7: conectar loop jogável mínimo com 3 fases.
- Criar obstáculos, itens e armadilhas iniciais.
- Definir resolução base e tamanho de tile.
- Adicionar restart rápido.
- Adicionar contador de mortes.
- Criar pipeline de assets.

## Decisões Registradas

- O jogo será de navegador.
- O gênero base será plataforma 2D difícil.
- O desenvolvimento inicial será focado em uma base 2D de plataforma.
- A primeira fase de desenvolvimento será o personagem principal: conceito, desenho, silhueta, escala e leitura visual.
- O MVP do jogo terá 3 mapas iniciais, cada um com objetivo de ir do ponto A ao ponto B.
- A física inicial será precisa e responsiva, com pulo variável, `coyote time` e `jump buffer` curtos.
- O personagem terá 5 ações de gameplay: andar para direita, andar para esquerda, pular, ação principal e ação secundária.
- Mapa inicial de teclado definido: `A/D` ou setas para movimento, `Espaço/W/Seta Cima` para pulo, `J/Z` para ação principal, `K/X` para ação secundária, `R` para reiniciar, `Esc` para pausar e `M` para mutar.
- O primeiro bloco de mapas terá somente 3 fases iniciais antes de expandir o jogo.
- As fases do MVP serão declarativas em TypeScript dentro de `src/data/levels/`.
- Pipeline de assets definido com pastas por domínio, nomes em `kebab-case`, sprites `.png`, áudio `.ogg` e registro de origem/licença em `assets/ASSETS.md`.
- O jogo deve tratar morte frequente como parte divertida do aprendizado, com respawn rápido, feedback claro e recompensas de progresso.
- Loop de morte definido: controle trava, morte curta, respawn em 300-600 ms, retorno ao checkpoint, reset da sala e música contínua.
- Música e efeitos sonoros devem reforçar feedback, humor e ritmo sem cansar o jogador durante muitas mortes.
- Antes da implementação, serão documentadas as decisões base de stack, MVP, física, controles, morte/respawn, fases, assets e primeiro build.
- Critério de pronto do primeiro build definido: dev server, build, tela inicial, personagem, controles, 3 fases concluíveis, morte, respawn, checkpoints, contador, áudio básico, smoke test e README.
- Roadmap operacional definido em `ROADMAP.md` para desenvolvimento com IA por fases, tasks e subtasks.
- Stack técnica definida: TypeScript, Vite, Phaser 3, Vitest, Playwright, ESLint, Prettier e npm.
- Resolução base do jogo: 480x270 com tiles de 16px, escalando 1:1 para 960x540, 1440x810 e 1920x1080.
- Ação principal: Dash (impulso horizontal curto, no chão e no ar). Ação secundária: Interagir (alavancas, botões, portas, itens).
- Canvas usa modo `FIT` do Phaser, com pixel art ativado, letterbox em aspect ratio diferente e 60 FPS alvo. Sem mobile/touch no MVP.
- Direção visual inicial definida como pixel art de baixa resolução em
  laboratório de testes hostil, com tile 16x16px, Pino em aproximadamente
  12x24px e paleta semântica para fundo, UI, terreno, herói, perigo, saída e
  traps especiais.
- Tileset placeholder inicial definido para mapas do MVP: bloco sólido,
  plataforma, perigo de espinhos e fundo de painel escuro em 16x16px, todos
  originais do projeto e renderizados como texturas repetíveis nas fases.
- Trap Adventure 2 é referência de sensação, não fonte de cópia.
- O projeto será estruturado desde o início, com planejamento de personagens, animações, mapas, músicas e ações.
- Personagem principal provisório definido como Pino: criatura original compacta
  com corpo em cápsula, visor frontal, antena curta, pés pequenos e humor visual
  desconfiado/desajeitado.
- Escala inicial de Pino definida: sprite visual 12x24px, hitbox real 10x22px,
  margem visual de 1px em todos os lados, pivô no centro inferior e relação de
  0,75x1,5 tile para o sprite.
- Placeholder visual inicial de Pino criado em
  `assets/sprites/player-pino-idle.png`, com corpo amarelo, contorno
  azul-petróleo, visor ciano e indicação de direção para a direita.
- Arte inicial de movimento do Pino criada em sprites 12x24px para idle,
  corrida em dois frames, pulo, queda, morte em dois frames e respawn em dois
  frames. A hitbox continua 10x22px; a mudança é somente visual.
- Dados declarativos de animação do Pino criados em
  `src/data/characters/pino-animations.ts`, cobrindo idle, run, jump, fall,
  death, respawn, ação principal e ação secundária com seleção por estado.
- Entidade `Player` criada em `src/game/entities/player.ts`, separando estado
  físico e visual, aplicando a hitbox real e expondo métodos básicos de morte,
  respawn e atualização de movimento.
- Mapa de input inicial implementado em `src/game/input`, com bindings para
  movimento, pulo, ações principal/secundária, reinício, pausa e mute.
- Movimento horizontal inicial implementado com velocidade máxima de 190 px/s,
  aceleração de 1800 px/s² e desaceleração separada para chão e ar.
- Pulo inicial implementado com velocidade de -430 px/s, gravidade de
  1200 px/s², corte variável para 45%, coyote time de 90 ms e jump buffer de
  100 ms.

## Perguntas Abertas

- Qual será o nome do jogo?
- O nome provisório Pino será mantido ou trocado antes da arte final?
- A dificuldade será puramente cruel ou terá camadas de acessibilidade?
- O jogo terá história ou será mais arcade?
- Depois das 3 fases iniciais, a expansão será por fases lineares, hub de seleção ou mundos separados?
- Qual será o estilo musical principal do jogo?
- A música será única para as 3 fases iniciais ou terá variações por fase?
- Persistência: mortes e checkpoints sobrevivem ao fechar a aba (`localStorage`) ou resetam por sessão?
- Onde o jogo será hospedado (GitHub Pages, Vercel, Netlify, outro)?
