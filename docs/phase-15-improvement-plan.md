# Analise Pos-MVP E Plano Da Fase 15

Data: 2026-05-26.

Escopo: analise do estado atual do jogo depois do primeiro build jogavel e
planejamento de novos incrementos para melhorar profundidade, leitura,
retencao e capacidade de expansao.

## Resumo Executivo

O jogo ja provou o loop principal: abrir, iniciar, jogar 3 fases, morrer,
respawnar, usar checkpoints, reiniciar com `R`, pausar, mutar audio, concluir
fases em sequencia e gerar build de producao. A base tecnica tambem esta boa
para evoluir: fases sao dados declarativos, existem validadores, testes
unitarios, smoke test Playwright e checklist manual.

O proximo ganho real nao e simplesmente criar muitas fases. Antes de crescer o
conteudo, o jogo precisa de mais ferramentas de expressao: uma acao principal
real, feedback melhor de morte, leitura visual mais forte das traps e algum
registro local que faca o jogador querer repetir uma fase. Isso transforma o MVP
de "funciona" para "da vontade de jogar mais".

A decisao recomendada para expansao e linear em blocos de 3 fases. Hub, mundos
separados e editor ficam para depois. O segundo bloco deve existir apenas depois
que os incrementos centrais da Fase 15 estiverem prontos para ensinar e cobrar
novas ideias sem inflar frustracao.

## Diagnostico Atual

### Produto E Loop

Forcas:

- O ciclo tentativa -> morte -> aprendizado -> respawn e curto e ja esta
  validado.
- As 3 fases iniciais tem identidade funcional clara: introducao cruel, timing
  com interacao e fechamento com memoria/precisao.
- Checkpoints, reset de sala e contador de mortes sustentam a proposta de jogo
  dificil sem punicao lenta.
- A transicao entre fases preserva o contador de mortes e fecha o MVP com uma
  tela final simples.

Riscos:

- Depois da terceira fase nao existe ainda motivo sistemico para repetir: nao ha
  melhor tempo, menor numero de mortes, medalha local ou selecao de fase.
- A progressao atual termina quando o MVP termina; se apenas adicionarmos
  `level-04`, o jogo ganha tamanho, mas nao ganha profundidade.
- O jogo ainda depende muito da memoria do jogador sobre a morte anterior; falta
  feedback explicito curto que ajude a transformar erro em aprendizado.

### Controles E Mecanicidade

Forcas:

- Movimento horizontal, pulo, coyote time e jump buffer estao separados em
  logica testavel.
- Input ja declara acao principal e secundaria.
- A acao secundaria ja tem uso real com alavanca/porta.

Riscos:

- A acao principal foi definida em `IDEIA.md` como Dash, mas ainda nao existe
  como movimento jogavel. Hoje `primary` serve apenas como input/feedback de
  acao, sem mudar a fisica.
- As constantes de dash ja existem em `PLAYER_MOVEMENT`, mas nao ha sistema de
  estado, cooldown, colisao durante dash ou testes de comportamento.
- Sem uma nova acao expressiva, novas fases tendem a repetir as mesmas cinco
  traps em layouts diferentes.

### Conteudo E Fases

Forcas:

- O schema de fase cobre terreno, hazards, traps, itens, objetos interativos,
  audio, assets e metadados de dificuldade.
- A validacao reduz risco de fases quebradas por ids duplicados, geometria fora
  dos limites ou referencias ausentes.
- O trio inicial ja tem regras de curva e testes de conteudo.

Riscos:

- Fases em TypeScript ainda sao viaveis, mas o custo de autoria cresce a cada
  mapa novo.
- Falta um modelo formal para "bloco de 3 fases" alem da convencao do MVP.
- O jogo ainda nao tem ferramentas de playtest por fase: iniciar em uma fase
  especifica, forcar checkpoint, medir mortes por trecho ou registrar causa de
  morte.

### Armadilhas E Leitura

Forcas:

- As traps do MVP resetam, nao criam espera longa e estao documentadas em
  revisao de justica.
- Existem sprites dedicados para traps, itens e marcadores.
- Projeteis e estados transitorios sao limpos corretamente no reset.

Riscos:

- A maioria das traps ainda tem comportamento visual simples demais: surge,
  some ou troca alpha, mas nao comunica estado com animacao curta.
- A morte e compreensivel depois de ver o local, mas o jogo nao mostra causa,
  fonte ou frase curta de aprendizado.
- A dificuldade pode parecer barata se novas fases aumentarem precisao sem
  melhorar telegraph, animacao e feedback.

### UI, Retencao E Progresso

Forcas:

- HUD e pausa estao compactos e nao ocupam a area critica de jogo.
- Tela inicial e transicao ja existem.
- O jogador entende mortes, fase atual e mute.

Riscos:

- Nao ha "continuar" ou "selecionar fase" depois que o jogador chega a fases
  futuras.
- Nao ha persistencia local para melhores marcas.
- A tela final ainda e final de MVP, nao fim de bloco/campanha expansivel.

### Audio E Sensacao

Forcas:

- Audio manager, mute, musica do MVP, sons de personagem e sons de fase existem.
- Repeticao de morte/respawn foi testada sem acumulo progressivo.

Riscos:

- A musica ainda e uma base unica; novas fases podem ficar sem identidade se
  todas usarem o mesmo loop.
- Sons de traps ainda podem ser mais informativos: disparo, rachadura,
  plataforma caindo, porta abrindo e morte por fonte especifica.

### Qualidade Tecnica

Forcas:

- Testes unitarios e smoke test cobrem os contratos principais.
- Performance inicial ficou estavel em ~60 FPS no ambiente medido.
- Build de producao passa.

Riscos:

- O aviso de chunk grande do Vite continua. Nao bloqueia o jogo, mas vira divida
  quando conteudo, audio e menus crescerem.
- O hook debug existe apenas em dev, mas ainda nao ha um modo formal de QA para
  iniciar fases, simular mortes e coletar diagnostico.

## Direcao Recomendada

1. Preservar expansao linear por enquanto.
2. Trabalhar em blocos de 3 fases.
3. Antes de criar muitas fases, implementar uma mecanica expressiva nova.
4. Toda mecanica nova deve ter uma fase que ensina, outra que distorce e outra
   que combina.
5. Melhorar feedback de erro antes de aumentar precisao exigida.
6. Adicionar retencao local simples antes de sistemas online ou hub.

## Fase 15 - Incrementos De Profundidade E Retencao

Objetivo: transformar o primeiro build jogavel em uma base pos-MVP mais
repetivel, legivel e expansivel, sem perder restart rapido nem inflar escopo.

### Task 15.1 - Implementar Dash Controlado

Problema: a acao principal ja esta definida no design e nos bindings, mas ainda
nao existe como movimento.

Escopo:

- Criar estado puro de dash com duracao, cooldown, direcao e bloqueios.
- Integrar dash ao movimento horizontal sem quebrar pulo, coyote time ou colisao.
- Usar `J`/`Z` como acao principal real.
- Reproduzir som e animacao de acao principal apenas quando o dash acontecer.
- Garantir que dash nao atravesse solidos.
- Resetar dash em morte, respawn e reinicio manual.

Pronto quando:

- Dash tem distancia previsivel.
- Cooldown impede spam.
- Testes unitarios cobrem duracao, cooldown, direcao e reset.
- Smoke/manual confirma que `J`/`Z` altera movimento sem quebrar as 3 fases.

### Task 15.2 - Feedback De Morte E Aprendizado

Problema: o jogador morre rapido, mas o jogo ainda nao registra bem "por que"
ele morreu.

Escopo:

- Registrar a causa da morte: queda, hazard, trap, projetil ou esmagamento.
- Guardar id da fonte quando existir.
- Mostrar mensagem curta no HUD ou no respawn por menos de 1 segundo.
- Evitar tutorial explicativo longo.
- Emitir evento de morte com causa para testes e futuras estatisticas.

Pronto quando:

- Cada morte do MVP gera causa consistente.
- Mensagem nao atrapalha input nem respawn rapido.
- Testes cobrem mapeamento de causa e formatacao da mensagem.

### Task 15.3 - Melhorar Leitura Visual Das Traps

Problema: as traps funcionam, mas ainda precisam de feedback visual melhor para
parecerem crueis e justas.

Escopo:

- Adicionar estados visuais para traps acionadas, armadas e resetadas.
- Criar animacao curta de surgimento para `spike-pop`.
- Criar frame/estado de rachadura para `breakable-floor`.
- Criar feedback de preparacao ou rastro para projetil simples.
- Diferenciar bloco falso e piso quebravel sem entregar tudo antes da primeira
  morte.

Pronto quando:

- Cada trap mortal atual tem feedback visual pos-acionamento.
- A revisao de justica e atualizada com os novos estados visuais.
- Smoke/manual confirma que sprites nao confundem hitboxes.

### Task 15.4 - Resultados Locais Por Fase

Problema: concluir uma fase hoje nao gera objetivo de repeticao.

Escopo:

- Medir tempo da tentativa atual por fase.
- Registrar mortes por fase.
- Salvar melhor tempo e menor numero de mortes em `localStorage`.
- Mostrar resultado compacto na transicao.
- Manter tudo local, sem ranking online.

Pronto quando:

- Completar uma fase salva melhor marca local.
- Rejogar uma fase pode melhorar marca.
- Reset de campanha nao apaga recordes sem comando explicito.
- Testes cobrem normalizacao e persistencia.

### Task 15.5 - Selecionar E Continuar Fases Desbloqueadas

Problema: expansao linear fica cansativa se o jogador precisar sempre recomecar
do inicio para testar ou repetir uma fase.

Escopo:

- Persistir maior fase desbloqueada localmente.
- Adicionar opcao simples de continuar no menu.
- Adicionar selecao compacta de fases desbloqueadas.
- Manter a campanha linear por padrao.
- Nao criar hub jogavel ainda.

Pronto quando:

- Jogador que concluiu `level-02` pode iniciar pelo progresso salvo.
- Selecionar fase reseta o run atual, mas preserva recordes locais.
- Menu continua simples e legivel.

### Task 15.6 - Planejar E Criar Bloco 2 De Fases

Problema: o jogo precisa crescer, mas com progressao de ideias, nao apenas mais
dificuldade.

Escopo:

- Planejar `level-04`, `level-05` e `level-06`.
- Usar expansao linear: `level-03 -> level-04 -> level-05 -> level-06`.
- Introduzir dash de forma segura em `level-04`.
- Distorcer dash com traps conhecidas em `level-05`.
- Combinar dash, interacao e memoria curta em `level-06`.
- Manter cada fase curta, com checkpoint no meio quando necessario.

Pronto quando:

- As 3 fases novas existem em dados.
- Cada fase tem objetivo, ideia central, checkpoint, saida e riscos conhecidos.
- Testes de conteudo cobrem curva e conclusao logica.
- Checklist manual valida que as fases sao dificeis, mas aprendiveis.

Implementacao inicial:

- `level-03` passa a apontar para `level-04`, mantendo campanha linear.
- `level-04` ensina dash com gaps largos e sem traps novas.
- `level-05` distorce o dash com `falling-platform`, `projectile` e
  `spike-pop`.
- `level-06` combina dash, chave, alavanca, porta, projetil e falso piso final.
- O checklist manual fica em `docs/block-2-gameplay-checklist.md`.

### Task 15.7 - Ferramentas De QA Para Playtest

Problema: quanto mais fases existirem, mais caro fica testar manualmente tudo.

Escopo:

- Criar modo dev para iniciar uma fase especifica por parametro local ou helper.
- Expor snapshot dev de fase, checkpoint, mortes, causa da ultima morte e estado
  de traps.
- Criar comandos internos de QA para ir ao checkpoint e simular conclusao.
- Documentar como usar sem afetar build de producao.

Pronto quando:

- QA consegue testar `level-04` diretamente em dev.
- Build de producao nao expoe comandos de debug.
- Smoke tests podem reaproveitar helpers sem depender de cliques longos.

### Task 15.8 - Otimizacao Inicial Do Build

Problema: o build ja passa, mas o bundle principal esta acima do limite sugerido
pelo Vite.

Escopo:

- Investigar separacao de chunks para Phaser/codigo do jogo.
- Conferir se audio e imagens estao sendo importados de forma adequada.
- Ajustar `vite.config` apenas se houver ganho claro.
- Manter build simples e previsivel.

Pronto quando:

- `npm run build` passa sem regressao.
- O aviso de chunk grande e resolvido ou documentado com motivo para adiar.
- Smoke test continua passando.

## Ordem Recomendada Da Fase 15

1. Dash controlado.
2. Feedback de morte.
3. Leitura visual das traps.
4. Resultados locais por fase.
5. Selecionar/continuar fases desbloqueadas.
6. Bloco 2 de fases.
7. Ferramentas de QA.
8. Otimizacao de build.

Essa ordem evita criar mais conteudo antes de ter uma mecanica nova, feedback de
aprendizado e meios melhores de testar.

## Fora Da Fase 15

- Ranking online.
- Multiplayer.
- Editor completo de fases.
- Hub jogavel.
- História/cutscenes longas.
- Arte final de todos os mundos.
- Assist mode completo.
- Port mobile/touch.

Esses pontos continuam validos para fases futuras, mas nao sao necessarios para
o proximo salto de qualidade.
