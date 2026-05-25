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
- Trap Adventure 2 é referência de sensação, não fonte de cópia.
- O projeto será estruturado desde o início, com planejamento de personagens, animações, mapas, músicas e ações.
- Personagem principal provisório definido como Pino: criatura original compacta
  com corpo em cápsula, visor frontal, antena curta, pés pequenos e humor visual
  desconfiado/desajeitado.
- Escala inicial de Pino definida: sprite visual 12x24px, hitbox real 10x22px,
  margem visual de 1px em todos os lados, pivô no centro inferior e relação de
  0,75x1,5 tile para o sprite.

## Perguntas Abertas

- Qual será o nome do jogo?
- Qual será a estética visual (pixel art com paleta limitada, paleta ampla, estilo cartoon)?
- O nome provisório Pino será mantido ou trocado antes da arte final?
- A dificuldade será puramente cruel ou terá camadas de acessibilidade?
- O jogo terá história ou será mais arcade?
- Depois das 3 fases iniciais, a expansão será por fases lineares, hub de seleção ou mundos separados?
- Qual será o estilo musical principal do jogo?
- A música será única para as 3 fases iniciais ou terá variações por fase?
- Persistência: mortes e checkpoints sobrevivem ao fechar a aba (`localStorage`) ou resetam por sessão?
- Onde o jogo será hospedado (GitHub Pages, Vercel, Netlify, outro)?
