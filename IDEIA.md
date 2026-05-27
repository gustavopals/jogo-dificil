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
- A colisão usa a hitbox real do Pino, com sprite visual 14x26px, hitbox 10x22px
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

- A tela inicial tem o tema próprio `Entrada Pulante`, um loop original de 8s
  em 120 BPM com arpejo leve e menos pressão que a trilha das fases.
- O tema inicial se chama `Pulos de Azar`: um loop original simples em 96 BPM,
  com pulso chiptune leve, melodia curta e clima divertido para sustentar
  tentativas repetidas sem cansar.
- O loop de menu fica em `assets/audio/music/menu-loop.wav`, o loop de gameplay
  fica em `assets/audio/music/mvp-loop.wav` e a vinheta musical de fim de fase
  fica em
  `assets/audio/music/mvp-level-complete-sting.wav`.
- Os metadados ficam em `src/data/audio/music-audio.ts`, separados dos sons de
  personagem e dos sons de fase.
- `PreloadScene` só carrega os assets de áudio. Depois disso, `MenuScene` pede
  a trilha de abertura e `LevelScene` pede a trilha de gameplay ao entrar; se o
  navegador ainda bloquear autoplay, o `AudioManager` mantém os pedidos na fila
  até a primeira interação.
- O loop não é disparado por morte ou respawn, e o `AudioManager` evita
  reiniciar uma música que já esteja ativa com o mesmo id.
- Ao completar a fase, `AudioScene` toca a vinheta curta de conclusão junto do
  feedback de fim de fase já existente.
- A tela inicial e o HUD têm um botão `♪`/`OFF` para mutar apenas a música; o
  mute global em `M` continua silenciando música e efeitos juntos.

Implementação inicial da tela inicial:

- A tela de abertura usa `Jogo Difícil` como nome provisório e mantém apenas uma
  linha de comando visível: `INICIAR FASE 1: ENTER / ESPAÇO`.
- A tela inicial toca o loop `Entrada Pulante`; ao começar a fase, a música
  troca para `Pulos de Azar` sem manter duas faixas ativas.
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
  mostra `MUDO` quando o áudio estiver mutado. Antes do indicador de mute há um
  botão compacto de música, com `♪` ligado e `OFF` quando a música está mutada.
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
- O botão de música na tela inicial e no HUD alterna `isMusicMuted` em
  `gameStateStore` e emite `audio:music-mute-changed`; o `AudioScene` usa esse
  evento para zerar apenas o volume da categoria de música.
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
- A decisão inicial do MVP era preservar o contador de mortes ao avançar entre
  as 3 fases; no fluxo atual, a mesma regra vale para as 10 fases da campanha.
  O contador só é resetado quando o jogador reinicia a partir da tela final.
- A tela final simples com mortes totais e `ENTER reinicia` aparece ao concluir
  a última fase da campanha atual; desde a abertura da Fase 17, isso acontece
  em `level-10`.
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
- Tamanho visual atual do Pino revisado para 14x26px, com hitbox mantida em
  10x22px e proporção de 0,875 tile de largura por 1,625 tile de altura.
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

Cobertura unitária inicial do primeiro build:

- Os contratos unitários do MVP cobrem validação de fase, mapa de input, coyote
  time, jump buffer, checkpoint ativo e contador de mortes.
- Esses testes ficam como gate rápido antes dos smoke tests no navegador e do
  checklist manual das três fases.

Smoke test inicial no navegador:

- `npm run test:e2e` abre o jogo com Playwright, inicia a Fase 1 pelo menu,
  confirma canvas, existência do Pino, movimento básico e ausência de erro
  crítico no console.
- O jogo expõe `window.__JOGO_DIFICIL_GAME__` apenas em modo de desenvolvimento,
  para permitir validação e2e objetiva de cena e jogador sem afetar o build de
  produção.

Checklist manual inicial do MVP:

- O checklist da Task 12.3 fica registrado em
  `docs/mvp-gameplay-checklist.md`.
- Em 2026-05-26, o fluxo inicial cobriu as 3 fases, mortes principais, respawn
  em cada checkpoint, `R`, pause, mute e preview de produção sem erro crítico no
  console.

Estabilidade inicial do MVP:

- A medição da Task 12.4 fica registrada em
  `docs/performance-stability-check.md`.
- Em 2026-05-26, o jogo manteve média de ~60 FPS em Chromium headless/Canvas,
  suportou 30 mortes seguidas sem drift de objetos da cena, limpou traps e
  projéteis no reset e manteve áudio repetido com contagem ativa limitada.

Primeiro build jogavel:

- `README.md` agora documenta descricao, stack, instalacao, comandos, controles,
  fluxo do MVP e documentos uteis.
- O checklist de release fica registrado em `docs/mvp-release-checklist.md`.
- Em 2026-05-26, o MVP foi considerado apto como primeiro build jogavel: 3 fases
  iniciais concluiveis, morte/respawn/checkpoints, `R`, HUD, audio basico,
  pause/mute, smoke test, build de producao e estabilidade inicial validados.

Expansao pos-MVP e Fase 15:

- A expansao depois das 3 fases iniciais sera linear em blocos curtos de 3
  fases.
- Hub jogavel, mundos separados e editor completo ficam para depois de haver
  mais conteudo validado.
- O segundo bloco deve seguir a regra: ensinar uma ideia, distorcer essa ideia e
  combinar com mecanicas antigas.
- Antes de criar muitas fases, o proximo ganho de qualidade e implementar a
  acao principal como Dash real, melhorar feedback de morte, melhorar leitura
  visual das traps e adicionar motivos locais para rejogar.
- A analise completa e o backlog da Fase 15 ficam registrados em
  `docs/phase-15-improvement-plan.md`.
- Implementacao inicial do Dash controlado:
  - `J`/`Z` agora executa um dash horizontal real.
  - O dash usa velocidade de 420 px/s por 150 ms, com cooldown de 300 ms.
  - Sem direcao horizontal pressionada, o dash usa a direcao atual do Pino.
  - O dash mantem colisao solida, nao atravessa paredes e preserva o movimento
    vertical/pulo.
  - Audio e animacao de acao principal so disparam quando o dash realmente
    inicia.
  - O estado de dash e resetado em morte, respawn automatico e reinicio manual.
- Implementacao inicial do feedback de morte:
  - Eventos `player:died` agora carregam causa e `sourceId` opcional.
  - Hazards informam o proprio id como fonte da morte.
  - Traps informam o id da trap, e projeteis informam o id do projetil.
  - Causas cobertas no contrato atual: `fall`, `hazard`, `trap`,
    `projectile`, `crusher`, `manual-restart` e `unknown`.
  - O HUD mostra uma mensagem curta de aprendizado por 850 ms, sem atrasar o
    respawn nem explicar demais a solucao.
- Implementacao inicial da leitura visual de traps:
  - Traps agora possuem estado visual `armed`, `triggered` e `resolved`.
  - `spike-pop` fica quase escondida enquanto armada e faz surgimento curto
    quando acionada.
  - `breakable-floor` exibe rachadura discreta antes do acionamento e rachadura
    forte depois de resolver.
  - Projeteis recebem rastro visual roxo curto, e o emissor ganha tell mais
    claro ao disparar.
  - A melhoria nao muda hitboxes, colisao, dano, reset de sala ou dificuldade
    declarada das fases.
- Implementacao inicial de resultados locais por fase:
  - Ao concluir uma fase, o jogo mede tempo da tentativa e mortes acumuladas
    apenas naquela fase.
  - Melhor tempo e menor numero de mortes por fase ficam salvos em
    `localStorage` com a chave `jogo-dificil-level-results-v1`.
  - A transicao de fase mostra um resumo compacto com tempo, mortes da fase e
    indicador de novo recorde ou melhor marca anterior.
  - Resetar a campanha nao apaga esses recordes locais; limpeza fica para um
    comando explicito futuro.
- Implementacao inicial do Bloco 2 de fases:
  - A campanha atual agora segue `level-01 -> level-02 -> level-03 ->
    level-04 -> level-05 -> level-06`.
  - `level-04`, `Impulso Medido`, ensina dash com gaps largos, checkpoint no
    meio e sem traps novas.
  - `level-05`, `O Impulso Mente`, distorce o dash com plataforma que cai,
    projetil contrario e spike-pop no pouso de saida.
  - `level-06`, `Memoria Em Movimento`, combina dash, chave, mecanismo,
    alavanca, porta, projetil e falso piso final.
  - A tela final atual aparece depois de `level-06`; selecao/continuacao de
    fases desbloqueadas segue planejada para a Task 15.5.
  - O checklist manual do bloco fica em
    `docs/block-2-gameplay-checklist.md`.
- Implementacao inicial das ferramentas de QA para playtest:
  - Em modo dev, o jogo registra `window.__JOGO_DIFICIL_QA__`.
  - A API permite iniciar fase por id, mover para checkpoint, simular conclusao
    da fase atual e ler snapshot de jogo.
  - O snapshot cobre fase, cenas ativas, checkpoint, mortes, ultima morte,
    jogador, traps, projeteis, itens e objetos interativos.
  - O build de producao nao registra o objeto global de QA.
  - O smoke test Playwright usa esses helpers para iniciar fase em estado
    conhecido sem depender de cliques longos.
- Implementacao inicial da otimizacao de build:
  - `vite.config.ts` separa Phaser em `phaser-vendor`, preservando o codigo do
    jogo em chunk proprio.
  - O chunk principal passou de ~1.303 kB para ~104 kB.
  - O vendor do Phaser permanece grande por natureza da engine, mas agora e
    cacheavel separadamente e documentado.
  - Audio continua como arquivos externos; sprites pequenos seguem inlinados
    pelo Vite porque o chunk do app ficou pequeno.

Fase 16 - Kit de energia original:

- O kit fechado se chama `Energia Ciano`, com ID interno `cyan-energy`.
- A referência é o arquétipo de golpes de energia de anime shonen e jogos
  clássicos de luta, mas o jogo não deve copiar nome, pose, grito, composição
  visual ou identidade de Dragon Ball ou de qualquer obra existente.
- O kit tem três poderes fechados para implementação: `Centelha Ciano`
  (`cyan-spark`) como tiro simples, `Carga Ciano` (`cyan-charge`) como botão
  segurado para encher energia e `Rajada Ciano` (`cyan-burst`) como especial de
  feixe carregado.
- Diferença operacional fechada: `Centelha Ciano` é gasto rápido e frequente,
  `Carga Ciano` é recuperação manual vulnerável e `Rajada Ciano` é especial de
  alto compromisso. Elas devem comunicar, respectivamente, velocidade,
  vulnerabilidade e recompensa.
- Matriz de interação fechada: `Centelha Ciano` ativa switches leves, relays,
  weak points simples e projéteis canceláveis; `Carga Ciano` não ativa nem
  quebra nada, apenas recupera recurso e bloqueia dash/mobilidade; `Rajada
  Ciano` ativa núcleos pesados, quebra `energy-cracked-block`, acerta bosses em
  janela vulnerável e para em sólidos comuns.
- Regra visual anti-cópia fechada: energia sempre ciano/branco/azul-esverdeada,
  com lascas, faíscas e segmentos pixelados; Pino usa pose assimétrica própria,
  sem mãos em concha, aura dourada, grito/nome inspirado em obra famosa, feixe
  gigante contínuo ou silhueta reconhecível de personagem existente.
- Task 16.1 fechada: nomes, IDs internos, custos, limites, papéis, diferença
  operacional, matriz de interação e regra visual anti-cópia passam a ser
  contrato final para implementar o kit `Energia Ciano` nas tasks seguintes.
- Função de gameplay: ferramenta de precisão para ativar alvos, quebrar blocos
  específicos, preparar o boss da fase 17 e criar timing de fase, não arma livre
  para resolver tudo.
- Controle planejado: `K`/`X` continua como ação secundária. Toque curto perto
  de objeto interage; toque curto sem interação dispara `Centelha Ciano`;
  segurar `K`/`X` com energia cheia prepara a `Rajada Ciano`; `L`/`C` fica como
  novo botão segurado para carregar energia.
- Implementação iniciada da Task 16.2: o input mapper reconhece a nova action
  `charge-energy`, com binding padrão `L`/`C`; a lógica de carga ainda será
  conectada ao estado de energia.
- `K`/`X` agora passa por um resolvedor de intenção testável: interação perto de
  objeto continua preservada, toque curto sem interação vira intenção futura de
  `Centelha Ciano` e segurar/soltar fica reservado para a preparação e disparo
  da `Rajada Ciano`.
- Estado puro da `Energia Ciano` criado em `src/game/physics/player-energy.ts`:
  energia atual, atividade de carga/preparação/disparo, cooldowns, preparação,
  duração da rajada, efeitos/rejeições de ação e reset limpo com energia inicial
  configurável.
- Energia inicial por fase/checkpoint entrou no contrato declarativo:
  `LevelDefinition.initialEnergy` define o começo da fase,
  `CheckpointDefinition.initialEnergy` pode sobrescrever por checkpoint e o
  `ActiveCheckpoint` guarda o valor resolvido para respawn/reinício.
- Runtime inicial da `Energia Ciano` conectado na `LevelScene`: `L`/`C` já
  alimenta o estado puro, `K`/`X` lê energia cheia para intenção de especial, e
  morte, pausa, respawn automático e `R` limpam estados temporários previsíveis.
  Pausa preserva energia atual; checkpoint/respawn/R restauram a energia
  configurada no checkpoint ativo.
- `Carga Ciano` agora aplica o compromisso de movimento planejado: no chão, a
  carga reduz velocidade horizontal para 30% e bloqueia dash; pulo, ar e dash
  ativo impedem a carga naquele frame.
- `Centelha Ciano` começou pela renderização: toque curto em `K`/`X`, sem
  interação próxima, cria um tiro horizontal pequeno com retângulo ciano/branco
  na frente do Pino.
- `Centelha Ciano` já consome 10 de energia e respeita cooldown de 180 ms antes
  de renderizar. Se faltar energia ou o cooldown estiver ativo, o tiro não sai;
  feedback de falha fica para subtask própria.
- `Centelha Ciano` agora existe como projétil runtime simples: nasce na frente
  do Pino, anda horizontalmente a 420 px/s e some ao atingir 128 px.
- Colisão da `Centelha Ciano` ficou pura e previsível: remove o projétil ao
  tocar sólidos, alvos retangulares genéricos, hurtboxes de boss ou o limite de
  alcance. A cena já liga sólidos reais; alvos/boss serão conectados quando os
  schemas específicos entrarem.
- O limite de dois disparos ativos da `Centelha Ciano` já está aplicado antes do
  consumo de energia; tentar disparar uma terceira centelha não gasta recurso
  nem inicia cooldown.
- Falha por energia insuficiente na `Centelha Ciano` agora tem feedback curto:
  partículas quebradas perto da mão do Pino e pulso coral/ciano na aura. O
  efeito só toca na rejeição `insufficient-energy`, sem confundir cooldown ou
  limite de projéteis ativos.
- `Rajada Ciano` começou a integração runtime: segurar `K`/`X` por 500 ms com
  energia cheia inicia `cyan-burst-prepare`, muda o estado para
  `burst-preparing` e mostra pulso ciano/branco curto perto da mão do Pino.
- A preparação da `Rajada Ciano` agora usa `canPrepareCyanBurst`: exige energia
  cheia real, sem cooldown e sem atividade ocupada, evitando que 99 de energia
  ou cooldown ativo coloquem o input no modo especial.
- A direção da `Rajada Ciano` fica travada no facing do Pino quando
  `cyan-burst-prepare` é aceito; durante `burst-preparing`, tentar virar não
  muda a direção reservada para o feixe.
- `Rajada Ciano` já renderiza um feixe curto placeholder: soltar `K`/`X` quando
  a preparação está pronta entra em `burst-firing`, mostra um retângulo
  ciano/branco de 192x12 px na direção travada e remove o feixe ao terminar a
  duração de 280 ms.
- O custo da `Rajada Ciano` é debitado no disparo aceito (`cyan-burst-fired`),
  não na preparação; cancelar a preparação preserva a energia cheia.
- A `Rajada Ciano` agora colide com sólidos comuns, que encurtam o feixe, e com
  alvos declarativos retangulares de energia. `energy-cracked-block` funciona
  como bloco sólido especial até receber dano suficiente da Rajada.
- Dano forte inicial fechado para a Rajada: 2 pontos por disparo aceito em
  `energy-cracked-block`, alvos genéricos e `boss-hurtbox`; o impacto é aplicado
  no momento do disparo, não como dano contínuo por frame.
- Hit único de boss fechado: hurtboxes de boss podem compartilhar `hitGroupId`;
  a Rajada aplica no máximo um impacto por grupo e a cena registra bosses já
  atingidos até o feixe terminar ou ser limpo por cancel/reset.
- Valores fechados da energia: máximo 100, energia inicial configurável por
  fase/checkpoint com padrão 40, carga no chão de 45 energia/s e sem carga no ar
  no MVP da fase 16.
- Valores fechados da `Centelha Ciano`: custo 10, cooldown de 180 ms,
  velocidade de 420 px/s, alcance de 128 px, hitbox de cerca de 8x5 px e no
  máximo dois disparos ativos.
- Valores fechados da `Carga Ciano`: sem custo direto, movimento horizontal a
  30%, dash bloqueado durante carga e pulo cancelando a carga antes de sair.
- Valores fechados da `Rajada Ciano`: custo 100, preparação mínima de 500 ms,
  duração de 280 ms, cooldown de 1.200 ms, alcance de 192 px, feixe horizontal
  travado na direção inicial e no máximo um hit por boss por rajada.
- Movimento durante `Carga Ciano`: Pino fica vulnerável, anda a 30% da
  velocidade, não pode dar dash e cancela carga ao pular.
- Tipos de alvo planejados: `energy-switch`, `energy-cracked-block`,
  `energy-relay`, `energy-absorber` e `energy-core`.
- Schema declarativo dos alvos de energia fechado: fases usam
  `LevelDefinition.energyTargets`, com `acceptedPowers`, vida/contagem em
  `hitPoints`, reset por respawn, ativação opcional via `activatesObjectId`,
  timers opcionais (`activationDurationMs`, `relayWindowMs`), `hitGroupId` para
  boss e flags de leitura como `blocksMovement`/`absorbsEnergy`.
- Regras de validação do schema: `energy-cracked-block` e `energy-core` aceitam
  só `cyan-burst`; `energy-relay` aceita só `cyan-spark` e precisa de
  `relayWindowMs`; `energy-absorber` precisa declarar `absorbsEnergy: true` e
  não pode ativar objetos; referências de `activatesObjectId` precisam existir
  em `interactiveObjects`.
- `energy-switch` implementado: recebe colisão de `Centelha Ciano` e/ou
  `Rajada Ciano` conforme `acceptedPowers`, ativa seu estado runtime, deixa de
  ser alvo depois de ativo e aciona `activatesObjectId` para abrir portas ou
  mecanismos já existentes.
- `energy-cracked-block` implementado: aceita somente `Rajada Ciano`, vira sólido
  da sala enquanto não quebrado quando `blocksMovement` não é `false`, ignora
  dano/ativação por `Centelha Ciano`, quebra quando `hitPointsRemaining` chega a
  zero e respeita o reset declarativo da sala.
- `energy-relay` implementado: aceita somente `Centelha Ciano`, usa `hitPoints`
  como quantidade de pulsos, reinicia a janela a cada acerto, reseta a sequência
  quando `relayWindowMs` expira, ativa o próprio alvo ao completar e pode acionar
  `activatesObjectId`.
- `energy-absorber` implementado: declara `absorbsEnergy: true`, pode aceitar
  `Centelha Ciano` e/ou `Rajada Ciano`, consome colisões sem reduzir vida, sem
  quebrar e sem acionar objetos, registra `absorbedEnergyHits` no runtime e
  continua alvo válido após cada absorção.
- `energy-core` implementado: aceita somente `Rajada Ciano`, recebe dano forte
  até ativar, pode acionar `activatesObjectId`, usa `activationRemainingMs` para
  passagens temporárias declaradas por `activationDurationMs`, fecha o objeto e
  rearma a vida ao expirar.
- Sprites da `Carga Ciano` criados para Pino:
  `player-pino-charge-01.png` e `player-pino-charge-02.png`, ambos 14x26px,
  registrados como assets originais e mantendo a hitbox real 10x22px.
- Sprites do disparo da `Centelha Ciano` criados para Pino:
  `player-pino-cyan-spark-01.png` e `player-pino-cyan-spark-02.png`, ambos
  14x26px, com braço estendido, pulso ciano curto e sem extrapolar a hitbox
  real do personagem.
- Sprites da `Rajada Ciano` criados para Pino: dois frames de preparação
  (`player-pino-cyan-burst-prepare-01.png` e
  `player-pino-cyan-burst-prepare-02.png`) e dois frames de soltura
  (`player-pino-cyan-burst-fire-01.png` e
  `player-pino-cyan-burst-fire-02.png`), todos 14x26px, com energia segmentada
  no punho e recuo compacto.
- Kit visual externo dos poderes criado: `energy-cyan-spark-projectile.png`
  representa o projétil pequeno 8x8px da `Centelha Ciano`;
  `energy-cyan-burst-beam.png` é o segmento tileável 16x16px do feixe;
  `energy-impact.png` cobre acertos; `energy-target-active.png` marca alvo de
  energia resolvido/ativo; `energy-cracked-block-broken.png` mostra o bloco
  rachado quebrado em fragmentos. Todos usam ciano próprio do jogo e ocupam
  pouco espaço visual para não esconder hazards.
- Animações de `Energia Ciano` registradas nos dados do Pino:
  `cyan-charge`, `cyan-spark`, `cyan-burst-prepare` e `cyan-burst-fire` entram
  em `PINO_ANIMATIONS`, apontam para os sprites 14x26px já criados e declaram
  `hitboxPx` 10x22px para manter a colisão real estável enquanto a cena troca
  o visual conforme carga, tiro e rajada.
- Legibilidade dos perigos pequenos protegida: `visual-readability` define
  depths para hazards diretos, `spike-pop` e projéteis de trap ficarem acima dos
  efeitos de energia do Pino, enquanto partículas/impactos/feixe largos são
  limitados a alpha máximo 0.56 para não encobrir espinhos ou tells pequenos.
- Sons originais da `Energia Ciano` criados por síntese local: loop baixo de
  `Carga Ciano`, ping de energia cheia, disparo da `Centelha Ciano`, falha sem
  energia, subida e disparo da `Rajada Ciano`, impacto pequeno e impacto pesado.
  Os oito WAVs ficam em `assets/audio/sfx/` e seus metadados ficam em
  `src/data/audio/energy-audio.ts`.
- Animações planejadas: carregar energia, energia cheia, tiro simples, especial
  em preparação, especial disparando, projétil, feixe, impactos e estados de
  alvo/bloco quebrado.
- O HUD deve ganhar medidor pequeno de energia, com feedback discreto para
  energia cheia e energia insuficiente.
- O Bloco 3 deve seguir a regra de expansão: `level-07` ensina `Centelha Ciano`
  e recarga, `level-08` distorce com absorvedor/bloco rachado e `level-09`
  combina dash, tiro simples, especial e interação.
- `level-07`, `Faisca De Treino`, foi criado como a primeira sala do Bloco 3:
  começa com 20 de energia, suficiente para duas `Centelha Ciano`, usa tres
  `energy-switch` para abrir portas simples e coloca um checkpoint seguro com
  energia 0 antes do terceiro alvo para ensinar `Carga Ciano` sem texto fixo.
- `level-08`, `O Alvo Mente`, foi criado para distorcer a confiança no kit de
  energia: um `energy-absorber` falso gasta tiros sem ativar nada, o
  `energy-switch` correto fica depois de um `spike-pop` conhecido e a segunda
  metade exige carregar energia em area segura antes de quebrar um
  `energy-cracked-block` com `Rajada Ciano`.
- `level-09`, `Carga Em Movimento`, foi criado para combinar o kit completo do
  Bloco 3: gap inicial de dash, `energy-relay` de tres `Centelha Ciano`,
  checkpoint antes da combinacao final, `energy-core` temporario aberto por
  `Rajada Ciano` e alavanca final com `K`/`X` para testar prioridade de
  interacao.
- Bloco 3 encadeado na campanha: `level-06` agora aponta para `level-07`,
  `level-07` aponta para `level-08`, `level-08` aponta para `level-09` e
  `level-09` ficou como tela final das 9 fases ate a abertura da Fase 17.
- O checklist manual do Bloco 3 fica em `docs/block-3-gameplay-checklist.md`,
  cobrindo validacao automatizada, playtest de cada fase, reset, HUD, audio,
  resultados locais e criterios de ajuste para energia.
- Testes unitarios do estado puro da `Energia Ciano` ficam em
  `tests/player-energy.test.ts`: eles cobrem clamp de energia, delta negativo,
  carga, cooldowns, gasto, rejeicoes, preparacao/cancelamento/disparo da
  `Rajada Ciano` e reset/limpeza de estados temporarios.
- Testes unitarios de input da `Energia Ciano` ficam em
  `tests/secondary-action-intent.test.ts` e `tests/input-bindings.test.ts`:
  eles cobrem `K`/`X` como tap curto para `Centelha Ciano`, hold para
  preparar/disparar/cancelar `Rajada Ciano`, prioridade de interacao e `L`/`C`
  como carga separada.
- Testes de colisao da `Centelha Ciano` ficam em
  `tests/energy-projectiles.test.ts` e `tests/level-energy-targets.test.ts`:
  eles cobrem solidos, alvos leves, hurtboxes de boss, varredura entre frames,
  direcao esquerda, erro vertical, multiplos projeteis e limite de alcance.
- Testes de hit unico da `Rajada Ciano` ficam em
  `tests/energy-projectiles.test.ts`: eles cobrem multiplas hurtboxes no mesmo
  `hitGroupId`, bosses ja atingidos pela rajada ativa, repeticao de checks do
  mesmo feixe sem dano duplicado e reset para uma nova rajada.
- Testes de schema e validacao dos alvos de energia ficam em
  `tests/level-schema.test.ts` e `tests/level-validation.test.ts`: eles cobrem
  todos os tipos declarativos, poderes aceitos, caso valido completo,
  geometria, `hitPoints`, ids duplicados, regras por tipo, timers positivos e
  referencias.
- Testes de conteudo do Bloco 3 ficam em `tests/block-3-content.test.ts`: eles
  cobrem registro, validacao, cadeia, metadata, assets, treino seguro de
  `Centelha Ciano`, recarga, absorvedor, bloco rachado, relay, core temporario,
  alavanca final e reset dos gates de `level-07`, `level-08` e `level-09`.
- Smoke Playwright de energia fica em `e2e/game-smoke.e2e.ts`: ele usa input
  real para disparar `Centelha Ciano` com `K`, ativar o primeiro
  `energy-switch` de `level-07`, carregar energia com `L`, soltar
  `Rajada Ciano` em `level-08` e quebrar o `energy-cracked-block`. O snapshot
  dev de QA agora expõe `energyTargets` para validar alvos no navegador.
- Hooks de QA de energia ficam em `window.__JOGO_DIFICIL_QA__`: `fillEnergy()`
  força energia cheia, `clearEnergyCooldowns()` limpa cooldowns/estados
  temporarios, e `readEnergyState()` retorna energia, atividade, timers e
  disponibilidade de `Centelha Ciano`/`Rajada Ciano`.
- Documento completo: `docs/phase-16-energy-shot-plan.md`.

Fase 17 - Trinca de chefões:

- A fase 17 foi redesenhada para planejar três chefões dentro da campanha de 10
  fases, usando um sistema compartilhado de arena, estado, ataques, dano e
  reset.
- Distribuição fechada na Task 17.1: `Hirolito Narguilito` fecha `level-03`,
  `Dr. Imports` fecha `level-06` e `Giga Fabio` é o boss final de `level-10`.
  Esta decisão ainda não altera o encadeamento dos dados; a integração fica para
  a Task 17.9, quando as arenas já existirem.
- As imagens em `assets/boss/examples/` servem como referência visual:
  narguilé/cristal/fumaça para Hirolito, casaco escuro/roxo/importações para
  Dr. Imports e brute grande preto/dourado para Giga Fabio.
- Uso das imagens de `assets/boss/examples/` fechado na Task 17.1: elas são
  referência local de tema, silhueta, paleta e props, não assets finais nem
  textura de runtime. Sprites finais devem ser redesenhados em pixel art
  original, com fundo transparente, hitbox separada e registro próprio em
  `assets/ASSETS.md`.
- Regra geral de boss: checkpoint imediatamente antes da arena, porta de entrada
  fecha ao iniciar, saída abre após derrota, um ataque ativo por vez, vida baixa
  e reset completo em morte, respawn e `R`.
- Estados planejados para todos: `inactive`, `intro`, `patrol`, `windup`,
  `attack`, `recover`, `stunned` e `defeated`.
- Visual, papel e dificuldade fechados na Task 17.1:
  `Hirolito Narguilito` é compacto/cômico, com corpo de narguilé, cristal ciano
  e mangueira, primeiro boss de baixa-média dificuldade com 2 hits;
  `Dr. Imports` usa casaco escuro, roxo, maleta/frasco e fumaça, segundo boss de
  dificuldade média com 3 hits, dash e projéteis; `Giga Fabio` é brute grande
  preto/dourado com núcleo no peito/cinto, boss final de dificuldade média-alta
  com 4 hits de `Rajada Ciano`.
- `Hirolito Narguilito`: ataques `smoke-puff` e `hose-snap`, weak point de
  cristal, arena simples no fim de `level-03`.
- `Dr. Imports`: ataques `import-bottle`, `paper-wall` e `smoke-swap`,
  movimento por três âncoras no fim de `level-06`.
- `Giga Fabio`: ataques `floor-slam`, `boulder-toss` e `shoulder-charge`, arena
  dedicada em `level-10` com recarga de energia.
- Regra de dano fechada na Task 17.1: boss só perde vida quando o weak point
  declarado estiver aceso e o estado atual aceitar dano, normalmente em
  `recover`; ataques em `intro`, `patrol`, `windup`, `attack`, `stunned`,
  `defeated` ou durante invulnerabilidade pós-hit geram feedback de bloqueio,
  mas não reduzem vida.
- `Centelha Ciano` causa 1 dano por projétil nos bosses 1 e 2 durante janela
  vulnerável. Em `Giga Fabio`, ela causa 0 dano e serve para cancelar projéteis
  fracos, ativar alvos de arena ou mostrar bloqueio.
- `Rajada Ciano` causa 1 dano em todos os bosses durante janela vulnerável, mas
  cada rajada ativa só pode acertar o mesmo boss uma vez; ela é obrigatória para
  remover vida do `Giga Fabio`.
- Tabela final de vida: `Hirolito Narguilito` tem 2 hits e aceita
  `Centelha Ciano`/`Rajada Ciano` no cristal; `Dr. Imports` tem 3 hits e aceita
  os dois poderes no weak point com linha limpa de ataque; `Giga Fabio` tem 4
  hits e só aceita `Rajada Ciano` no núcleo aceso.
- Integração runtime fechada: impactos de `Centelha Ciano` e `Rajada Ciano`
  contra `boss-hurtbox` agora chamam `applyBossEnergyHit`, que usa
  `damageRules`, estado válido, weak point e invulnerabilidade para reduzir vida
  do boss, aplicar stun ou declarar derrota.
- Hurtbox de boss não é mais tratado como bloco quebrável comum durante a
  `Rajada Ciano`: `LevelScene` resolve `hitGroupId`/`boss-hurtbox` para o
  boss correto e mantém o dano dentro do estado runtime do boss.
- Trava de hit por ataque fechada: regras de boss com `oncePerAttack` gravam
  uma chave em `damageHitLockKeys` usando `sourceAttackId`. A mesma
  `Rajada Ciano` não duplica dano no boss, mas uma nova rajada com outro id pode
  causar o próximo hit se a janela vulnerável estiver válida.
- Contato letal de boss fechado: `findTouchedBossThreat` mata Pino ao tocar
  projétil de boss, hitbox ativa de ataque ou corpo de boss vivo/ativo. Boss
  `inactive` ou `defeated` não mata por contato; projéteis usam causa
  `projectile` e corpo/ataque usam causa `boss`.
- Remoção de projéteis de boss fechada: projéteis somem ao tocar sólidos da
  sala, sair da arena do boss, sair dos bounds da fase ou atingir alcance
  máximo. O reset compartilhado de sala continua limpando `bossProjectiles` em
  morte, respawn automático e reinício manual com `R`.
- Sprites placeholder dos três bosses fechados para playtest visual: Hirolito
  Narguilito usa silhueta compacta de narguile com cristal ciano, Dr. Imports
  usa casaco escuro/maleta/fumaça roxa, e Giga Fabio usa corpo maior com punhos
  dourados e núcleo ciano. Os arquivos ficam em `assets/sprites/bosses/` e são
  placeholders originais até a arte final.
- Sprites de projéteis e impactos de boss fechados para leitura inicial:
  fumaça roxa 16x16 para `smoke-puff`, garrafa/importação 16x16 para
  `import-bottle`, pedra pesada 24x24 para `boulder-toss` e impacto
  coral/amarelo 24x24. A paleta evita ciano dominante para não confundir com a
  energia do Pino.
- Indicador de vida no corpo do boss fechado: cada boss ativo mostra pips
  pequenos no próprio hitbox, com preenchido/vazio e feedback coral durante
  invulnerabilidade. O indicador some em `inactive` e `defeated`, fica no mundo
  da fase em vez de HUD fixo e usa depth abaixo dos hazards pequenos.
- Sons originais de boss fechados para o kit base: `boss-entry`,
  `boss-windup`, `boss-attack`, `boss-hit` e `boss-defeat` são WAVs curtos
  gerados para o projeto. A `LevelScene` toca entrada ao iniciar arena, windup e
  ataque pelos eventos do ciclo, hit quando o boss perde vida e derrota quando
  chega a zero, todos passando pelo mute global do audio manager.
- Contraste visual de boss fechado: `visual-readability` agora centraliza a
  paleta semântica e a regra mínima de distância entre cores primárias. Energia
  do Pino fica ciano/amarelo, traps usam roxo/vermelho como leitura principal e
  bosses usam coral/dourado escuro. O corpo do boss fica abaixo da energia do
  Pino em depth, a vida do boss fica abaixo de hazards pequenos, e traps móveis
  não usam mais o ciano primário da energia.
- Arena do `Hirolito Narguilito` iniciada em `level-03`: o fim da fase foi
  expandido para uma sala final curta com 20 tiles de largura, chão reto, uma
  plataforma baixa central e checkpoint `level-03-before-hirolito` a 4 tiles da
  entrada com 60 de energia inicial. A porta de entrada começa aberta e fecha
  ao iniciar a luta; a porta de saída começa fechada e fica registrada para
  desbloqueio por derrota.
- Ataques do `Hirolito Narguilito` implementados nos dados de `level-03`:
  `smoke-puff` usa um projétil lento de fumaça, destrutível por
  `Centelha Ciano`, e `hose-snap` usa tell/hitbox baixo no chão para ensinar
  leitura de windup. O runtime de boss agora alterna ataques declarados por uma
  sequência determinística, então bosses com mais de um ataque não repetem
  sempre o primeiro.
- Weak point de cristal implementado: o `weakPoint` declarativo do boss agora
  tem feedback visual próprio no corpo, apagado fora da janela vulnerável e
  aceso em ciano/amarelo durante `recover`. O `boss-hurtbox` continua servindo
  para colisão de `Centelha Ciano`/`Rajada Ciano`, mas não desenha mais um
  retângulo genérico de alvo por cima do boss.
- Balanceamento final do `Hirolito Narguilito` para primeiro chefe: 2 de vida,
  patrulha lenta em `28px/s`, `recover` generoso de `1200ms` e cooldown de
  `1500ms`. A luta deve ensinar o ciclo de tell, ataque e cristal vulnerável
  sem exigir execução apertada no primeiro boss.
- Checklist manual do boss 1 criado em
  `docs/boss-1-gameplay-checklist.md`. Ele cobre entrada da arena, fechamento e
  abertura de portas, leitura de `smoke-puff`/`hose-snap`, cristal vulnerável,
  dano por `Centelha Ciano`/`Rajada Ciano`, morte, respawn, reinício com `R`,
  pausa, mute e transição para `level-04`.
- Arena do `Dr. Imports` iniciada no fim de `level-06`: a fase ganhou uma
  terceira tela com aproximação pós-corredor de memória, checkpoint
  `level-06-before-dr-imports` com 80 de energia, arena de 22 tiles, duas
  plataformas laterais baixas, centro limpo para dash e portas de entrada/saída
  já declaradas para o fluxo de boss.
- Ataques do `Dr. Imports` implementados nos dados e runtime: `import-bottle`
  arremessa frasco roxo destrutível por `Centelha Ciano`, `paper-wall` cria uma
  parede temporária que bloqueia `Centelha Ciano` e `Rajada Ciano` durante o
  ataque, e `smoke-swap` move o boss para a próxima âncora antes do `recover`.
  O boss agora fecha `level-06` com 3 de vida, weak point de maleta/peito e
  saída liberada pela derrota.
- Movimento por três âncoras do `Dr. Imports` fechado: o runtime de boss agora
  move bosses em `patrol` entre âncoras usando `speedPxPerSecond`. Para
  `anchor-swap`, as três âncoras são percorridas em sequência, com `facing`
  atualizado pela direção do deslocamento; windup, ataque, recover e stun não
  deslocam o boss para manter os tells legíveis.
- Balanceamento do `Dr. Imports` fechado: 3 hits e limite de 2 projéteis ativos
  no `import-bottle`. Só esse ataque cria projétil, então a arena continua
  exigindo dash, reposicionamento e leitura da `paper-wall`, sem virar spam de
  frascos.
- Checklist manual do `Dr. Imports` criado em
  `docs/boss-2-gameplay-checklist.md`: cobre arena lock, movimento por três
  âncoras, `import-bottle`, limite de 2 frascos ativos, bloqueio da
  `paper-wall`, `smoke-swap`, dano por `Centelha Ciano`/`Rajada Ciano`,
  respawn no checkpoint `level-06-before-dr-imports`, reinício com `R`, pausa,
  mute e transição para `level-07`.
- `level-10`, `O Ultimo Nucleo`, criado como fase final dedicada para
  `Giga Fabio`: a campanha agora encadeia `level-09 -> level-10`, a nova fase
  tem ordem/dificuldade 10, checkpoint `level-10-before-giga-fabio` com energia
  cheia, arena de 26 tiles, duas plataformas laterais, assets placeholder do
  boss final e saída final sem `nextLevelId`.
- `Giga Fabio` entrou no runtime do `level-10` com três ataques declarativos:
  `floor-slam` avisa e acerta uma faixa baixa no chão, `boulder-toss` arremessa
  uma pedra horizontal com no máximo 1 projétil ativo e destruição por energia,
  e `shoulder-charge` avisa uma faixa horizontal larga para cobrar pulo, dash
  ou uso das plataformas laterais. A janela vulnerável abre depois de
  `floor-slam` e `shoulder-charge`; `boulder-toss` serve como pressão de
  reposicionamento.
- Regra de dano real do `Giga Fabio` fechada no runtime: o weak point aceita
  apenas `Rajada Ciano`, `Centelha Ciano` nao remove vida mesmo se acertar o
  núcleo durante `recover`, e cada `Rajada Ciano` valida causa 1 hit antes do
  stun/invulnerabilidade padrão de boss.
- Recarga de energia da arena final fechada sem criar mecânica nova: como
  `Carga Ciano` já recarrega ao segurar `L`/`C` no chão, `level-10` agora usa
  duas plataformas laterais nomeadas como pontos de recarga, uma à esquerda e
  outra à direita do boss. Elas também funcionam como escape do `floor-slam` e
  reduzem risco de softlock depois de gastar uma `Rajada Ciano`.
- Checklist manual do boss final fechado em
  `docs/boss-3-gameplay-checklist.md`: cobre entrada curta pelo checkpoint,
  arena lock, recarga lateral, leitura dos tres ataques, dano apenas por
  `Rajada Ciano`, hit unico por especial, morte, respawn, reset com `R`, pausa,
  mute e tela de conclusao da campanha.
- Progressao da Task 17.9 iniciada: `level-03` segue para `level-04` apenas
  depois do `Hirolito Narguilito`. O `nextLevelId` ja aponta para `level-04`, a
  saida fica bloqueada enquanto o boss vive e a porta final abre via
  `defeatUnlocks` apos a derrota.
- Progressao de `level-06 -> level-07` fechada para a Task 17.9: o
  `level-06` segue para o Bloco 3 apenas depois do `Dr. Imports`. O
  `nextLevelId` ja aponta para `level-07`, a saida fica bloqueada enquanto o
  boss vive e a porta final abre via `defeatUnlocks` apos a derrota.
- Progressao de `level-09 -> level-10` fechada para a Task 17.9: o
  `level-09` deixou de ser a tela final e agora entrega o jogador ao
  `level-10`, que é a última fase registrada e não declara `nextLevelId`.
- Resultados locais passam a ter helper puro para o delta de mortes da fase:
  `createLevelCompletionAttemptFromRunCounters` calcula mortes como diferença
  entre o contador global no início e no fim da fase. Como mortes de boss usam
  `gameStateStore.registerDeath`, elas entram no recorde local de
  `deathCount`/`fewestDeaths`.
- QA direto de boss fechado para a Task 17.9: `window.__JOGO_DIFICIL_QA__`
  agora lista os três bosses em `bosses` e expõe `startBoss(bossId)`. O comando
  usa o `entryCheckpointId` declarativo para abrir `level-03`, `level-06` ou
  `level-10` já no checkpoint da arena correspondente.
- Testes unitários de estado compartilhado da Task 17.10 reforçados: o
  `RoomRuntimeState` agora tem cobertura para múltiplos bosses simultâneos,
  reset seletivo por `resetOnRespawn` e isolamento entre projéteis comuns e
  `bossProjectiles`.
- Testes unitários de ataques e projéteis da Task 17.10 reforçados: o ciclo de
  boss cobre seletor de ataque e estados `intro`/`stunned`, enquanto projéteis
  cobrem origem declarada, default de destruição, limite por boss/ataque e
  remoção isolada de projéteis expirados.
- Testes de validação de schema da Task 17.10 reforçados: bosses agora têm
  cobertura explícita para coleções obrigatórias, ids duplicados internos,
  `maxRangePx`, `isDestructibleBy`, regras de dano e `entryDoorId` ausente.
- Testes de conteúdo dos bosses da Task 17.10 reforçados: `level-03`,
  `level-06` e `level-10` agora têm cobertura extra para ligações de boss,
  `boss-hurtbox`, portas, assets, alcance de projétil e fluxo de vitória do
  boss final.
- Smoke Playwright de bosses da Task 17.10 atualizado: o teste usa
  `window.__JOGO_DIFICIL_QA__.bosses` e `startBoss(...)` para abrir Hirolito,
  Dr. Imports e Giga Fabio direto no checkpoint da arena, validar weak point e
  portas, e caminhar até a entrada da arena fechar.
- Checklist manual transversal dos bosses da Task 17.10 criado em
  `docs/bosses-qa-checklist.md`, cobrindo hit, morte, respawn, reset com `R`,
  vitória, pausa, mute e estabilidade nos três encontros.
- Bateria final da Task 17.10 executada: `npm run lint`, `npm run test`,
  `npm run build` e `npm run test:e2e -- e2e/game-smoke.e2e.ts` passaram. O
  resultado final foi lint limpo, 63 arquivos de teste e 414 testes unitários,
  build de produção gerado e smoke Playwright com 4 cenários passando.
- Task 17.2 iniciada: `BossDefinition` declarativo criado em
  `src/shared/levels.ts` e exposto por `src/shared/index.ts` e
  `src/data/levels/schema.ts`. `LevelDefinition` agora aceita
  `bosses?: readonly BossDefinition[]`, com campos para identidade, arena,
  spawn, direção inicial, vida, hitbox, weak point, movimento, ataques, regras
  de dano, janelas vulneráveis, checkpoint de entrada, porta de entrada,
  desbloqueios por derrota e asset opcional.
- Validação de boss integrada em `src/data/levels/validation.ts`: ids de boss
  entram na checagem de duplicidade, `levelId` precisa bater com a fase, arena
  fica dentro dos bounds, spawn/hitbox/weak point ficam dentro da arena, vida
  precisa ser inteiro positivo, ataques/projéteis precisam ter timers e valores
  válidos, regras de dano e janelas vulneráveis não podem ficar vazias,
  checkpoint de entrada precisa existir e ficar imediatamente antes da arena,
  desbloqueios precisam apontar para `interactiveObjects` existentes e `assetId`
  precisa existir em `assets.sprites`.
- Runtime puro de boss criado em `src/game/physics/boss-state.ts`: o estado
  guarda vida total/restante, estado atual, posição, direção, timers de estado,
  cooldown e invulnerabilidade, ataque ativo, janela vulnerável ativa e regra de
  reset por respawn. Os helpers criam estado inicial, fazem transição de estado,
  avançam timers, aplicam dano com invulnerabilidade e entram em
  `stunned`/`defeated`.
- Integração de boss com estado de sala criada em `src/game/systems/room-state.ts`:
  `RoomRuntimeState` agora guarda `bosses`, `createInitialRoomState` cria estado
  inicial para cada boss declarativo e `resetRoomStateForRespawn` reseta vida,
  estado, timers, ataque ativo, janela vulnerável e invulnerabilidade em
  respawn automático e reinício manual com `R`. Bosses com
  `resetOnRespawn: false` preservam o estado, seguindo o padrão dos demais
  elementos persistentes.
- Task 17.3 iniciada: arena lock de entrada implementado com `entryDoorId`
  opcional em `BossDefinition`. Quando o hitbox do Pino entra na arena de um
  boss `inactive`, `src/game/systems/level-bosses.ts` troca o boss para `intro`
  e fecha a porta de entrada marcando o objeto `door` como inativo/solido; a
  `LevelScene` chama esse fluxo após o movimento do jogador e atualiza colisão e
  marcador visual da porta.
- Saída bloqueada enquanto boss estiver vivo: `LevelScene.updateLevelProgress`
  só completa a fase se `isLevelExitBlockedByLivingBosses` retornar falso.
  Qualquer boss declarado que ainda não esteja `defeated` com vida zerada
  bloqueia a saída, incluindo boss ainda `inactive` para impedir pular a arena.
- Saída aberta após derrota: `defeatUnlocks` em cada boss lista portas/travas
  liberadas, `unlockDefeatedBossObjects` ativa esses objetos quando o boss chega
  em `defeated` ou vida zero, e a `LevelScene` atualiza colisão e marcador
  visual para a arena terminar sem passagem bloqueada.
- Checkpoint antes da arena garantido por dados: cada boss declara
  `entryCheckpointId`; o validador exige referência existente, posição antes da
  entrada da arena, overlap vertical e distância máxima de 8 tiles até a borda
  esquerda da arena.
- Repetição curta de luta garantida em runtime: ao iniciar uma arena de boss,
  `LevelScene.updateBossArenaLocks` ativa automaticamente o checkpoint
  `entryCheckpointId` se ele ainda não for o atual. Morte, respawn automático e
  reinício com `R` passam a voltar direto para a entrada da arena.
- Projéteis de boss separados dos projéteis de trap: `RoomRuntimeState` guarda
  `bossProjectiles` em coleção própria, resetada com a sala, enquanto
  `projectiles` continua exclusivo para traps. `boss-projectiles.ts` cria
  projéteis a partir do ataque, limita `maxActive`, move, calcula hitbox e
  remove por alcance, sólido, arena do boss ou bounds.
- Tells, ataque e recover implementados no runtime base: `boss-attacks.ts`
  avança o boss de `patrol` para `windup`, expõe `tellArea`, entra em `attack`
  com hitbox/projétil, abre `recover` com janela vulnerável/cooldown e retorna
  para `patrol`. A `LevelScene` já avança esse ciclo por frame via
  `updateBossAttackRuntime`.
- Documento completo: `docs/phase-17-boss-plan.md`.

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
- Tipo: lutador original estilizado. Ele é humanoide o bastante para poses de
  luta, mas permanece compacto e cartunesco para leitura de plataforma.
- Função narrativa provisória: Pino é um pequeno testador de salas impossíveis,
  teimoso o bastante para voltar depois de cada morte.
- Personalidade visual: curioso, desconfiado e levemente desajeitado, com humor
  seco. Ele parece sempre pronto para cair em uma armadilha que já suspeitava
  existir.
- Silhueta: corpo compacto de lutador, cabelo espetado grande para leitura de
  topo, tronco azul estreito, faixa coral e dois pés pequenos separados na base.
- Proporção geral: personagem alto e estreito, com leitura aproximada de 2:1
  entre altura e largura. Cabeça e corpo funcionam como uma massa única para
  preservar legibilidade em 24px de altura.
- Rosto e direção: olho/expressão lateral, pose do tronco, cabelo e faixa
  indicam para onde Pino está olhando. O sprite pode ser espelhado, mas a direção
  precisa continuar óbvia.
- Acessórios importantes: cabelo espetado, faixa coral e aura ciano; todos podem
  exagerar em animações de dash, morte e respawn, mas não devem entrar na hitbox
  principal.
- Limitação visual proposital: pernas curtas, tronco estreito e cabelo grande.
  O personagem deve parecer preciso para colisão, mas vulnerável e cômico quando
  morre.
- Paleta atual: cabelo dourado, roupa azul/índigo, energia ciano, pele quente,
  contorno quase preto e acento coral para faixa/dano.
- Regra para próximas tarefas: a Task 3.2 pode ajustar medidas, hitbox, pivô e
  margens sem redesenhar o conceito; a Task 3.3 deve produzir o primeiro
  placeholder visual seguindo esta silhueta.

### Tamanho e Leitura

Decisões de escala fechadas na Task 3.2:

- Resolução base do jogo: 480x270.
- Tamanho dos tiles: 16x16px.
- Área visual atual do sprite: 14x26px.
- Hitbox real: 10x22px, centralizada dentro da área visual.
- Margem entre sprite e hitbox: 2px nas laterais, 3px no topo e 1px na base.
  Cabelo, aura e deformações visuais podem ocupar essa margem, mas não devem
  mudar a colisão principal.
- Pivô do personagem: centro inferior do sprite, equivalente a x=7px e y=26px
  dentro da área visual. Checkpoints e respawn devem usar esse ponto como
  posição de referência.
- Relação com tile: sprite visual de 0,875 tile de largura por 1,625 tile de
  altura; hitbox de 0,625 tile de largura por 1,375 tile de altura.
- Leitura prática: Pino cabe visualmente em dois tiles de altura com folga e
  ocupa menos de um tile de largura, favorecendo plataformas estreitas e colisão
  previsível.

Regra prática:

A hitbox deve favorecer precisão e justiça. O sprite pode ter detalhes externos, mas a colisão principal precisa ser previsível para o jogador.

### Placeholder Visual Inicial

Decisões de placeholder fechadas na Task 3.3:

- Primeiro asset: `assets/sprites/player-pino-idle.png`.
- Formato atual: PNG transparente, 14x26px, sem escala interna.
- Revisão visual posterior: Pino deixou de usar leitura de cápsula amarela para
  evitar semelhança indesejada com personagens existentes. A direção atual é um
  lutador shonen original de laboratório: cabelo espetado dourado, roupa
  azul/índigo, faixa coral e aura ciano.
- Direção: Pino olha para a direita por padrão; pose, olho, cabelo e faixa são
  espelhados pelo Phaser para leitura imediata de direção.
- Contraste: contorno quase preto, roupa azul escura, pele quente, cabelo
  dourado e energia ciano contra fundo escuro.
- Uso: asset atual de gameplay para leitura, posicionamento, escala e animação.
  A hitbox continua sendo a referência de colisão, não os pixels de aura/cabelo.

### Dados De Animação

Decisões de animação fechadas na Task 3.4:

- Arquivo declarativo inicial: `src/data/characters/pino-animations.ts`.
- Animações esperadas para o Pino: `idle`, `run`, `jump`, `fall`, `death`,
  `respawn`, `primary-action` e `secondary-action`.
- As animações centrais de movimento usam frames dedicados. A corrida tem três
  frames, o pulo usa dois frames, a queda alterna ápice/queda e a ação principal
  tem sprite próprio de dash. A ação secundária ainda pode reaproveitar idle até
  ter arte dedicada.
- `idle`, `run`, `jump` e `fall` podem rodar em loop curto para manter vida
  visual. `death`, `respawn`, `primary-action` e `secondary-action` continuam
  com execução curta.
- A ação principal representa o dash, com pose horizontal e rastro. A ação
  secundária representa interação.
- A seleção de animação segue prioridade: respawn, morte, ação principal, ação
  secundária, ar subindo, ar caindo, corrida e idle.
- A `LevelScene` registra as animações no Phaser e escolhe a animação inicial a
  partir do estado do personagem, em vez de fixar uma textura diretamente.
- Efeitos visuais atuais de movimento: aura persistente, ghost de dash, faíscas
  de corrida e bursts de pulo/aterrissagem. Todos são cosméticos e não alteram
  física, colisão ou dano.

### Entidade Player

Decisões de entidade fechadas na Task 3.5:

- Classe inicial: `src/game/entities/player.ts`.
- A entidade `Player` encapsula o sprite Arcade, registro de animações,
  aplicação de hitbox, estado físico e estado visual.
- Estado físico: posição, velocidade, aterramento e hitbox real.
- Estado visual: direção, animação atual, vida, respawn e flags de ação.
- A hitbox aplicada no corpo Arcade usa 10x22px com offset de 2px no eixo X e
  3px no eixo Y em relação ao sprite visual 14x26px.
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
  14x26px e paleta semântica para fundo, UI, terreno, herói, perigo, saída e
  traps especiais.
- Tileset placeholder inicial definido para mapas do MVP: bloco sólido,
  plataforma, perigo de espinhos e fundo de painel escuro em 16x16px, todos
  originais do projeto e renderizados como texturas repetíveis nas fases.
- Trap Adventure 2 é referência de sensação, não fonte de cópia.
- O projeto será estruturado desde o início, com planejamento de personagens, animações, mapas, músicas e ações.
- Personagem principal provisório definido como Pino: lutador original compacto
  de laboratório, com cabelo espetado, roupa azul/índigo, faixa coral, aura
  ciano e humor visual desconfiado/desajeitado.
- Escala atual de Pino definida: sprite visual 14x26px, hitbox real 10x22px,
  margens visuais de 2px nas laterais, 3px no topo e 1px na base, pivô no
  centro inferior e relação de 0,875x1,625 tile para o sprite.
- Arte visual atual de Pino criada em `assets/sprites/player-pino-idle.png`,
  removendo a leitura de cápsula amarela e adotando silhueta shonen original.
- Arte atual de movimento do Pino criada em sprites 14x26px para idle, corrida
  em três frames, pulo em dois frames, queda, dash dedicado, morte em dois
  frames e respawn em dois frames. A hitbox continua 10x22px; a mudança é
  somente visual.
- Fase 16 planejada para adicionar `Energia Ciano`, um kit original com
  `Centelha Ciano` para tiros simples, `Carga Ciano` em `L`/`C` segurado,
  `Rajada Ciano` como especial de feixe carregado, alvos declarativos, medidor
  de energia e novas animações sem copiar Dragon Ball.
- Bloco 3 planejado como `level-07`, `level-08` e `level-09`, ensinando,
  distorcendo e combinando tiro simples, carga de energia, especial, dash e
  interação.
- Primeiro mapa do Bloco 3 implementado: `level-07` entra no registry e nas
  ferramentas de QA como treino seguro de `Centelha Ciano` e recarga, ainda sem
  encadear a saida de `level-06`.
- Segundo mapa do Bloco 3 implementado: `level-08` entra no registry e nas
  ferramentas de QA como distorcao de leitura com absorvedor falso, alvo correto
  depois de trap conhecida e bloco rachado exclusivo da `Rajada Ciano`, ainda
  sem encadear a campanha.
- Terceiro mapa do Bloco 3 implementado: `level-09` entra no registry e nas
  ferramentas de QA como combinacao de dash, relay de `Centelha Ciano`, core
  temporario de `Rajada Ciano` e alavanca final, ainda sem encadear a campanha.
- Encadeamento do Bloco 3 implementado: a campanha atual roda
  `level-06 -> level-07 -> level-08 -> level-09`. A partir da Fase 17,
  `level-09` passou a apontar para `level-10`, deixando de ser a tela final.
- Checklist manual do Bloco 3 criado em
  `docs/block-3-gameplay-checklist.md`, com roteiro de playtest para
  `Centelha Ciano`, `Carga Ciano`, `Rajada Ciano`, absorvedor, bloco rachado,
  relay, core temporario, alavanca final e transicao para a fase final.
- Testes unitarios do estado de energia reforcados em
  `tests/player-energy.test.ts`, fechando a primeira subtask de QA da Fase 16.9.
- Testes unitarios de input tap/hold/carga reforcados em
  `tests/secondary-action-intent.test.ts` e `tests/input-bindings.test.ts`,
  fechando a segunda subtask de QA da Fase 16.9.
- Testes de colisao da `Centelha Ciano` reforcados em
  `tests/energy-projectiles.test.ts` e `tests/level-energy-targets.test.ts`,
  fechando a terceira subtask de QA da Fase 16.9.
- Testes de hit unico da `Rajada Ciano` reforcados em
  `tests/energy-projectiles.test.ts`, fechando a quarta subtask de QA da Fase
  16.9.
- Testes de schema e validacao dos alvos de energia reforcados em
  `tests/level-schema.test.ts` e `tests/level-validation.test.ts`, fechando a
  quinta subtask de QA da Fase 16.9.
- Testes de conteudo para `level-07`, `level-08` e `level-09` reforcados em
  `tests/block-3-content.test.ts`, fechando a sexta subtask de QA da Fase 16.9.
- Smoke Playwright de energia atualizado em `e2e/game-smoke.e2e.ts`, fechando a
  setima subtask de QA da Fase 16.9.
- Hooks de QA de energia criados em `window.__JOGO_DIFICIL_QA__`, fechando a
  oitava subtask de QA da Fase 16.9 com energia cheia, cooldown zerado e leitura
  direta do estado de energia para playtest e smoke.
- Fase 16.9 validada com formatacao, testes unitarios, smoke Playwright, build,
  lint e `git diff --check`.
- Revisao final da Fase 16 fechou dois ajustes de commit: `Carga Ciano` aplica
  a restricao real de movimento/dash planejada, e parar o loop de carga agora
  encerra apenas esse SFX, sem cortar outros efeitos sonoros ativos.
- Fase 17 redesenhada para adicionar três chefões na campanha de 10 fases:
  `Hirolito Narguilito` em `level-03`, `Dr. Imports` em `level-06` e
  `Giga Fabio` como boss final em `level-10`, todos usando arenas curtas,
  tells claros, vida baixa, reset completo e dano integrado à Energia Ciano.
- Task 17.1 iniciada: a distribuição dos bosses foi fechada nesses três pontos
  da campanha, sem mudar ainda `nextLevelId` ou dados de fase. A integração de
  progressão fica para a Task 17.9, depois que as arenas de boss existirem.
- Arte inicial de traps, itens e marcadores criada para o MVP: espinhos,
  bloco falso, plataforma que cai, piso quebrável, projétil, chip obrigatório,
  chave, token opcional, checkpoint inativo/ativo e saída de fase. Todos são
  sprites originais do projeto e usam as mesmas áreas declarativas de gameplay.
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
- Qual será o estilo musical principal do jogo?
- A música será única para as 3 fases iniciais ou terá variações por fase?
- Persistência: mortes e checkpoints sobrevivem ao fechar a aba (`localStorage`) ou resetam por sessão?
- Onde o jogo será hospedado (GitHub Pages, Vercel, Netlify, outro)?
