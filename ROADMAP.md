# ROADMAP.md

Ultima atualizacao: 2026-05-26

## Objetivo

Este documento e o roteiro operacional para desenvolver o jogo com IA, item a
item, sem perder contexto e sem misturar escopos. O `IDEIA.md` define o que o
jogo deve ser. Este arquivo define como vamos construir.

O jogo sera um platformer 2D de navegador, dificil, rapido de reiniciar e
baseado em tentativa, erro, surpresa e aprendizado. O MVP tera 3 mapas iniciais.
Em cada mapa, o jogador deve sair de um ponto A e chegar a um ponto B,
enfrentando obstaculos, armadilhas, mortes rapidas e recompensas de progresso.

## Como Usar Com IA

### Regra Principal

Uma IA deve executar o primeiro item pendente que desbloqueia progresso real,
fazer a menor mudanca coesa possivel, validar o resultado e atualizar este
roadmap antes de encerrar.

### Marcadores

- `[ ]`: pendente.
- `[x]`: concluido.
- `[!]`: bloqueado, com motivo escrito logo abaixo.

Nao marcar um item como concluido se:

- nao foi implementado;
- nao foi testado quando havia teste possivel;
- quebrou algo existente;
- depende de decisao ainda ausente;
- ficou parcialmente feito.

### Padrao de Execucao

Para cada task:

1. Ler `IDEIA.md`, `CLAUDE.md`, `AGENTS.md` e este arquivo.
2. Verificar `git status`.
3. Ler os arquivos proximos da mudanca.
4. Implementar somente o escopo da task.
5. Rodar verificacoes possiveis.
6. Atualizar checkboxes deste roadmap.
7. Atualizar `IDEIA.md` se uma decisao de design mudar.
8. Atualizar `README.md` se comandos ou uso mudarem.
9. Resumir o que mudou e o que foi verificado.

### Protocolo De Continuidade Entre IAs

Toda IA que assumir o projeto deve deixar o proximo agente em condicao de
continuar sem adivinhar contexto.

Ao iniciar uma task:

- confirmar qual fase/task/subtask esta sendo trabalhada;
- citar quais arquivos serao alterados;
- identificar dependencias pendentes;
- nao alterar itens futuros fora do escopo.

Ao concluir uma task:

- marcar os checkboxes concluidos;
- deixar pendente o que nao foi realmente feito;
- registrar bloqueio com `[!]` quando houver;
- registrar comandos executados;
- registrar verificacoes que nao puderam ser feitas;
- indicar a proxima task recomendada.

### Modelo De Pacote De Trabalho Para IA

Quando uma task for grande demais, dividir em pacotes menores com este formato:

```text
ID:
Objetivo:
Arquivos esperados:
Dependencias:
Subtasks:
Criterio de pronto:
Verificacoes:
Riscos:
Proxima task:
```

### Regra de Escopo

Se uma task parece exigir refatoracao grande, ela deve ser dividida em subtasks
menores antes da implementacao. Nao pular para sistemas futuros enquanto o MVP
nao estiver jogavel.

## Analise Da Ideia

### Forcas Do Projeto

- A proposta central e clara: jogo 2D de plataforma dificil, com morte frequente
  e restart rapido.
- O MVP esta bem delimitado: 3 mapas iniciais, objetivo ponto A para ponto B,
  morte, respawn, checkpoints e contador.
- A decisao de fases declarativas em TypeScript reduz dependencia inicial de
  ferramentas externas.
- O uso de Phaser 3 com Vite e TypeScript e adequado para um jogo 2D de
  navegador.
- A separacao entre personagem, movimento, mapas, desafios, audio e loop
  jogavel favorece desenvolvimento incremental com IA.

### Riscos Principais

- Movimento ruim destrói a experiencia inteira.
- Morte frequente pode virar frustracao se respawn, checkpoints ou feedback
  forem lentos.
- Armadilhas podem parecer injustas se nao forem compreensiveis depois da
  morte.
- IA pode implementar features futuras antes do MVP se o roadmap nao for
  seguido.
- Assets temporarios podem virar bagunca se nao houver pipeline desde o inicio.
- Fases em TypeScript podem ficar dificeis de editar se o formato nao for claro.

### Mitigacoes

- Criar primeiro um movimento pequeno, testavel e ajustavel.
- Validar morte e respawn cedo, antes de criar muitas fases.
- Manter cada fase curta, com poucos conceitos novos.
- Usar IDs estaveis para fases, checkpoints, armadilhas e itens.
- Separar dados de fase da cena do Phaser.
- Registrar assets em `assets/ASSETS.md`.
- Usar smoke tests no navegador desde o primeiro build.

## Marcos

- M0: Documentacao e decisoes base.
- M1: Projeto tecnico inicial rodando no navegador.
- M2: Personagem placeholder com movimento preciso.
- M3: Sistema de fases declarativas.
- M4: Morte, respawn, checkpoint e contador.
- M5: Obstaculos, armadilhas e itens do MVP.
- M6: 3 fases iniciais concluiveis.
- M7: Audio, UI e feedback minimo.
- M8: Testes, build e primeiro MVP pronto.
- M9: Polimento e expansao pos-MVP.

## Fase 0 - Fundacao De Produto E Planejamento

Objetivo: garantir que a IA tenha contexto suficiente antes de codar.

### Task 0.1 - Consolidar Visao Do Jogo

- [x] Registrar visao geral em `IDEIA.md`.
- [x] Registrar pilares do jogo.
- [x] Registrar que Trap Adventure 2 e referencia de sensacao, nao fonte de
  copia.
- [x] Registrar identidade original ainda pendente.
- [x] Registrar que o jogo sera 2D de plataforma em navegador.

Pronto quando:

- `IDEIA.md` explica o que o jogo quer ser.
- Ha regra explicita para nao copiar assets, mapas, musica, nomes ou UI de
  outros jogos.

### Task 0.2 - Fechar Decisoes Base Antes De Desenvolver

- [x] Definir stack tecnica.
- [x] Definir MVP.
- [x] Definir regras iniciais de fisica e movimento.
- [x] Definir mapa de controles.
- [x] Definir loop de morte e respawn.
- [x] Definir formato das fases.
- [x] Definir pipeline de assets.
- [x] Definir criterio de pronto do primeiro build.

Pronto quando:

- A secao `Antes de Desenvolver: Decisoes Base` em `IDEIA.md` estiver marcada
  como concluida.

### Task 0.3 - Criar Roadmap Operacional

- [x] Criar `ROADMAP.md`.
- [x] Separar fases, tasks e subtasks.
- [x] Definir regras para IA atualizar status.
- [x] Definir criterios de pronto por fase.
- [x] Referenciar o roadmap em `IDEIA.md`.

Pronto quando:

- A IA consegue escolher a proxima task sem perguntar por onde comecar.

## Fase 1 - Scaffold Tecnico Do Projeto

Objetivo: criar a base tecnica do jogo com Vite, TypeScript, Phaser 3, testes e
estrutura de pastas.

### Task 1.1 - Inicializar Projeto Vite + TypeScript

- [x] Criar `package.json`.
- [x] Instalar Vite com template TypeScript.
- [x] Criar `index.html`.
- [x] Criar `src/main.ts`.
- [x] Confirmar que `npm run dev` inicia o projeto.

Pronto quando:

- O projeto abre no navegador com uma pagina basica.
- Nao ha erro critico no console.

### Task 1.2 - Instalar Dependencias Principais

- [x] Instalar `phaser`.
- [x] Instalar `typescript` se necessario.
- [x] Instalar `vitest`.
- [x] Instalar `@playwright/test`.
- [x] Instalar ESLint.
- [x] Instalar Prettier.

Pronto quando:

- As dependencias aparecem em `package.json`.
- O projeto ainda inicia.

### Task 1.3 - Criar Scripts Do Projeto

- [x] Adicionar `dev`.
- [x] Adicionar `build`.
- [x] Adicionar `preview`.
- [x] Adicionar `test`.
- [x] Adicionar `test:e2e`.
- [x] Adicionar `lint`.
- [x] Adicionar `format`.

Pronto quando:

- Cada comando existe em `package.json`.
- Comandos indisponiveis por configuracao pendente estao documentados.

### Task 1.4 - Criar Estrutura De Pastas

- [x] Criar `src/game/`.
- [x] Criar `src/game/scenes/`.
- [x] Criar `src/game/systems/`.
- [x] Criar `src/game/entities/`.
- [x] Criar `src/game/traps/`.
- [x] Criar `src/game/input/`.
- [x] Criar `src/game/physics/`.
- [x] Criar `src/game/ui/`.
- [x] Criar `src/data/levels/`.
- [x] Criar `src/data/characters/`.
- [x] Criar `src/data/audio/`.
- [x] Criar `src/shared/`.
- [x] Criar `tests/`.
- [x] Criar `docs/`, se necessario.

Pronto quando:

- A estrutura bate com `CLAUDE.md`.
- Nenhuma pasta tem arquivo temporario inutil.

### Task 1.5 - Criar Pipeline Inicial De Assets

- [x] Criar `assets/sprites/`.
- [x] Criar `assets/tilesets/`.
- [x] Criar `assets/audio/music/`.
- [x] Criar `assets/audio/sfx/`.
- [x] Criar `assets/fonts/`.
- [x] Criar `assets/temp/`.
- [x] Criar `assets/ASSETS.md`.
- [x] Documentar regra de nomes em `assets/ASSETS.md`.

Pronto quando:

- A estrutura existe.
- Ha um local claro para assets temporarios e finais.

### Task 1.6 - Configurar TypeScript Estrito

- [x] Criar ou revisar `tsconfig.json`.
- [x] Ativar `strict`.
- [x] Configurar alias de import se for util.
- [x] Garantir que build TypeScript nao aceite erros silenciosos.

Pronto quando:

- `npm run build` valida TypeScript.

### Task 1.7 - Configurar Qualidade De Codigo

- [x] Configurar ESLint.
- [x] Configurar Prettier.
- [x] Garantir que arquivos gerados nao criem ruido.
- [x] Documentar comandos no `README.md`.

Pronto quando:

- `npm run lint` roda.
- `npm run format` roda ou existe comando equivalente.

## Fase 2 - Arquitetura Base Do Jogo

Objetivo: criar o esqueleto interno do jogo antes de adicionar conteudo pesado.

### Task 2.1 - Configuracao Central Do Jogo

- [x] Criar `src/game/config.ts`.
- [x] Definir resolucao base provisoria.
- [x] Definir cor de fundo provisoria.
- [x] Definir escala e renderizacao.
- [x] Definir constantes iniciais de fisica.

Pronto quando:

- O jogo usa uma configuracao central, sem numeros espalhados.

### Task 2.2 - Criar Cenas Principais

- [x] Criar `BootScene`.
- [x] Criar `PreloadScene`.
- [x] Criar `MenuScene`.
- [x] Criar `LevelScene`.
- [x] Criar `HudScene` ou HUD dentro de sistema separado.
- [x] Criar `PauseScene` se necessario.

Pronto quando:

- O fluxo inicial vai de boot para menu e de menu para fase.

### Task 2.3 - Criar Fluxo De Estados

- [x] Definir estado de jogo.
- [x] Definir estado de fase atual.
- [x] Definir contador de mortes.
- [x] Definir checkpoint ativo.
- [x] Definir estado de pausa.
- [x] Definir estado de mute.

Pronto quando:

- Estado importante nao fica perdido em variaveis soltas da cena.

### Task 2.4 - Criar Tipos Compartilhados

- [x] Criar tipo `Vector2Like`.
- [x] Criar tipo `RectLike`.
- [x] Criar tipos de fase.
- [x] Criar tipos de input.
- [x] Criar tipos de audio.
- [x] Criar tipos de entidades.

Pronto quando:

- Dados do jogo sao validados pelo TypeScript.

### Task 2.5 - Criar Sistema De Eventos Internos

- [x] Definir eventos de morte.
- [x] Definir eventos de respawn.
- [x] Definir eventos de checkpoint.
- [x] Definir eventos de fim de fase.
- [x] Definir eventos de audio.

Pronto quando:

- Sistemas nao precisam se acoplar diretamente para tudo.

## Fase 3 - Personagem Principal

Objetivo: ter um personagem legivel, com hitbox previsivel e sprites
placeholder suficientes para desenvolver o gameplay.

### Task 3.1 - Fechar Conceito Inicial Do Personagem

- [x] Definir nome provisório.
- [x] Definir se e humano, objeto animado ou criatura original.
- [x] Definir personalidade visual.
- [x] Definir silhueta.
- [x] Definir proporcao geral.
- [x] Registrar decisoes em `IDEIA.md`.

Pronto quando:

- A IA consegue criar placeholder coerente sem redesenhar a ideia toda.

### Task 3.2 - Definir Escala Do Personagem

- [x] Definir altura visual.
- [x] Definir largura visual.
- [x] Definir hitbox real.
- [x] Definir margem entre sprite e hitbox.
- [x] Definir pivô.
- [x] Registrar relacao com tamanho de tile.

Pronto quando:

- Movimento e colisao podem ser ajustados com base em medidas claras.

### Task 3.3 - Criar Placeholder Visual

- [x] Criar sprite placeholder de idle.
- [x] Criar indicacao visual de direcao.
- [x] Criar contraste suficiente com fundo.
- [x] Registrar asset em `assets/ASSETS.md`.

Pronto quando:

- O personagem aparece e e legivel em tamanho real de jogo.

### Task 3.4 - Criar Dados De Animacao

- [x] Definir animacoes esperadas.
- [x] Criar estrutura declarativa de animacoes.
- [x] Criar animacao `idle` placeholder.
- [x] Criar animacao `run` placeholder.
- [x] Criar animacao `jump` placeholder.
- [x] Criar animacao `fall` placeholder.
- [x] Criar animacao `death` placeholder.
- [x] Criar animacao `respawn` placeholder.
- [x] Criar animacoes de acao principal e secundaria placeholder.

Pronto quando:

- A cena escolhe animacoes por estado do personagem.

### Task 3.5 - Criar Entidade Player

- [x] Criar classe ou modulo `Player`.
- [x] Separar estado visual de estado fisico.
- [x] Aplicar hitbox definida.
- [x] Expor metodos claros para morrer, respawnar e atualizar movimento.

Pronto quando:

- O jogador existe como entidade reutilizavel, nao como codigo solto na cena.

## Fase 4 - Input E Movimento

Objetivo: validar a sensacao de controle antes de construir fases complexas.

### Task 4.1 - Implementar Mapa De Input

- [x] Mapear `A` e seta esquerda.
- [x] Mapear `D` e seta direita.
- [x] Mapear `Espaco`, `W` e seta cima.
- [x] Mapear `J` e `Z`.
- [x] Mapear `K` e `X`.
- [x] Mapear `R`.
- [x] Mapear `Esc`.
- [x] Mapear `M`.
- [x] Criar interface para consulta de input por acao.

Pronto quando:

- A gameplay usa acoes, nao teclas espalhadas no codigo.

### Task 4.2 - Implementar Movimento Horizontal

- [x] Aplicar velocidade maxima inicial de 190 px/s.
- [x] Aplicar aceleracao inicial de 1800 px/s².
- [x] Aplicar desaceleracao no chao de 2200 px/s².
- [x] Aplicar desaceleracao no ar de 900 px/s².
- [x] Permitir troca rapida de direcao.

Pronto quando:

- O personagem responde rapido e para com precisao.

### Task 4.3 - Implementar Pulo

- [x] Aplicar velocidade inicial de pulo de -430 px/s.
- [x] Aplicar gravidade de 1200 px/s².
- [x] Implementar pulo variavel.
- [x] Implementar corte de pulo para 45%.
- [x] Implementar `coyote time` de 90 ms.
- [x] Implementar `jump buffer` de 100 ms.

Pronto quando:

- Pulo curto e pulo alto sao perceptiveis.
- Pulos perto da borda parecem justos.

### Task 4.4 - Implementar Colisao Basica

- [x] Colidir com chao.
- [x] Colidir com paredes.
- [x] Impedir atravessar terreno solido.
- [x] Evitar travar em cantos simples.
- [x] Manter plataformas atravessaveis fora do MVP.

Pronto quando:

- O jogador pode andar e pular em uma sala de teste sem bugs obvios.

### Task 4.5 - Criar Camera Inicial

- [x] Camera segue o jogador.
- [x] Camera respeita limites do mapa.
- [x] Camera nao treme em movimento normal.
- [x] Camera permite ler obstaculos proximos.

Pronto quando:

- O jogador nao sai do enquadramento.

### Task 4.6 - Testar Movimento

- [x] Criar testes de logica pura para buffer/coyote se viavel.
- [x] Criar checklist manual de movimento.
- [x] Validar no navegador.
- [x] Ajustar valores se necessario e registrar mudanca.

Pronto quando:

- Movimento esta bom o suficiente para comecar mapas.

## Fase 5 - Sistema De Fases Declarativas

Objetivo: transformar fases em dados editaveis e renderizaveis.

### Task 5.1 - Criar Schema De Fase

- [x] Criar interfaces para `LevelDefinition`.
- [x] Criar interfaces para `TerrainDefinition`.
- [x] Criar interfaces para `HazardDefinition`.
- [x] Criar interfaces para `TrapDefinition`.
- [x] Criar interfaces para `ItemDefinition`.
- [x] Criar interfaces para `CheckpointDefinition`.
- [x] Criar interfaces para `ExitDefinition`.

Pronto quando:

- Uma fase pode ser escrita com autocomplete e validacao TypeScript.

### Task 5.2 - Criar Validador De Fase

- [x] Validar `id` unico.
- [x] Validar spawn dentro dos limites.
- [x] Validar saida dentro dos limites.
- [x] Validar checkpoints dentro dos limites.
- [x] Validar retangulos de terreno.
- [x] Validar assets referenciados.
- [x] Criar testes unitarios para validacoes.

Pronto quando:

- Erros simples de dados sao pegos antes do jogo rodar.

### Task 5.3 - Renderizar Terreno

- [x] Renderizar blocos solidos temporarios.
- [x] Aplicar colisao nos blocos.
- [x] Usar dados da fase, nao codigo fixo.
- [x] Permitir cores ou sprites placeholder por tipo.

Pronto quando:

- Trocar dados da fase altera o mapa sem mexer na cena.

### Task 5.4 - Renderizar Spawn, Exit E Checkpoints

- [x] Posicionar jogador no spawn.
- [x] Renderizar saida.
- [x] Detectar contato com saida.
- [x] Renderizar checkpoints.
- [x] Ativar checkpoint ao contato.

Pronto quando:

- Uma fase pode comecar, salvar checkpoint e terminar.

### Task 5.5 - Criar As 3 Fases Iniciais Em Dados

- [x] Criar `level-01.ts`.
- [x] Criar `level-02.ts`.
- [x] Criar `level-03.ts`.
- [x] Exportar lista ordenada de fases.
- [x] Garantir que todas usam ponto A e ponto B.

Pronto quando:

- As 3 fases existem como dados, mesmo com geometria simples.

## Fase 6 - Morte, Respawn E Checkpoints

Objetivo: implementar o ciclo mais importante do jogo dificil.

### Task 6.1 - Implementar Sistema De Morte

- [x] Criar estado `alive`.
- [x] Criar estado `dead`.
- [x] Travar controle ao morrer.
- [x] Emitir evento de morte.
- [x] Incrementar contador.

Pronto quando:

- O personagem morre de forma controlada e previsivel.

### Task 6.2 - Implementar Respawn Automatico

- [x] Aguardar entre 300 ms e 600 ms.
- [x] Voltar ao checkpoint ativo.
- [x] Restaurar estado do jogador.
- [x] Retomar controle.
- [x] Manter musica tocando.

Pronto quando:

- O jogador consegue tentar de novo quase imediatamente.

### Task 6.3 - Implementar Reinicio Manual Com `R`

- [x] `R` reposiciona no checkpoint.
- [x] `R` reseta sala.
- [x] Decidir se `R` conta morte quando usado vivo.
- [x] Registrar decisao em `IDEIA.md`.

Pronto quando:

- O jogador pode reiniciar sem esperar cair ou morrer.

### Task 6.4 - Resetar Sala

- [x] Resetar armadilhas.
- [x] Resetar projeteis.
- [x] Resetar plataformas moveis ou que caem.
- [x] Restaurar itens obrigatorios necessarios.
- [x] Preservar itens opcionais coletados quando fizer sentido.

Pronto quando:

- Nenhuma morte cria estado quebrado ou softlock.

### Task 6.5 - HUD De Mortes

- [x] Mostrar contador de mortes.
- [x] Atualizar imediatamente apos morte.
- [x] Garantir legibilidade.
- [x] Nao ocupar area critica de gameplay.

Pronto quando:

- O contador funciona e reforca a identidade do jogo.

## Fase 7 - Obstaculos, Armadilhas E Itens

Objetivo: criar os elementos que tornam os 3 mapas divertidos e dificeis.

### Task 7.1 - Criar Sistema Base De Hazard

- [x] Definir dano/morte por contato.
- [x] Criar espinho fixo.
- [x] Criar area de queda/morte.
- [x] Integrar com sistema de morte.

Pronto quando:

- Perigos simples matam o jogador de forma clara.

### Task 7.2 - Criar Sistema Base De Trap

- [x] Definir interface de trap.
- [x] Definir gatilho por posicao.
- [x] Definir reset por respawn.
- [x] Definir feedback visual basico.
- [x] Definir feedback sonoro futuro.

Pronto quando:

- Traps podem ser adicionadas por dados de fase.

### Task 7.3 - Implementar Traps Do MVP

- [x] Bloco falso.
- [x] Plataforma que cai.
- [x] Espinho que surge.
- [x] Projetil simples.
- [x] Chao quebravel.

Pronto quando:

- Ha pelo menos 3 tipos de trap usaveis nas fases iniciais.

### Task 7.4 - Implementar Itens

- [x] Coletavel opcional.
- [x] Item obrigatorio simples, se usado nas fases.
- [x] Item de ativacao de mecanismo.
- [x] Feedback visual de coleta.
- [x] Estado persistente ate respawn ou fim da fase conforme regra.

Pronto quando:

- Itens ajudam desafio, recompensa ou interacao.

### Task 7.5 - Implementar Objetos Interativos

- [x] Porta simples.
- [x] Botao ou alavanca.
- [x] Mecanismo acionado por acao principal/secundaria.
- [x] Estado resetavel.

Pronto quando:

- Acoes principal e secundaria podem ter utilidade real no mapa.

### Task 7.6 - Revisar Justica Das Armadilhas

- [x] Cada trap deve ter causa compreensivel depois da morte.
- [x] Nenhuma trap deve causar softlock.
- [x] Nenhuma trap deve exigir espera longa apos erro.
- [x] Registrar riscos conhecidos por fase.

Pronto quando:

- As armadilhas parecem cruéis, mas aprendiveis.

## Fase 8 - Conteudo Dos 3 Mapas Iniciais

Objetivo: criar as primeiras fases como conteudo jogavel.

### Task 8.1 - Fase 1: Entrada Cruel

- [x] Definir layout inicial.
- [x] Definir ponto A.
- [x] Definir ponto B.
- [x] Ensinar andar e pular.
- [x] Adicionar buracos pequenos.
- [x] Adicionar primeira armadilha surpresa.
- [x] Adicionar checkpoint se necessario.
- [x] Adicionar som minimo.
- [x] Testar conclusao da fase.

Pronto quando:

- A fase ensina o ciclo basico e pode ser concluida.

### Task 8.2 - Fase 2: O Caminho Nao Confia Em Voce

- [x] Definir layout inicial.
- [x] Definir ponto A.
- [x] Definir ponto B.
- [x] Introduzir timing.
- [x] Adicionar obstaculo ativo simples.
- [x] Usar acao principal ou secundaria.
- [x] Adicionar checkpoint no meio.
- [x] Adicionar pegadinha visual na saida.
- [x] Testar conclusao da fase.

Pronto quando:

- A fase aumenta desafio sem exigir perfeicao excessiva.

### Task 8.3 - Fase 3: Quase Seguro

- [x] Definir layout inicial.
- [x] Definir ponto A.
- [x] Definir ponto B.
- [x] Criar sequencia curta de pulos precisos.
- [x] Adicionar bloco falso ou chao quebravel.
- [x] Adicionar item opcional de risco e recompensa.
- [x] Adicionar checkpoint antes da parte mais cruel.
- [x] Criar saida que testa desconfiança do jogador.
- [x] Testar conclusao da fase.

Pronto quando:

- A fase combina ideias das duas anteriores e fecha o MVP com desafio memoravel.

### Task 8.4 - Balancear Curva Inicial

- [x] Fase 1 deve ser dificil, mas introdutoria.
- [x] Fase 2 deve exigir timing e interacao.
- [x] Fase 3 deve exigir leitura, memoria curta e precisao.
- [x] Evitar repetir a mesma piada sem variacao.
- [x] Evitar longas caminhadas antes da parte dificil.

Pronto quando:

- As 3 fases formam uma progressao clara.

## Fase 9 - Audio E Feedback

Objetivo: adicionar som sem cansar o jogador em repeticao.

### Task 9.1 - Criar Audio Manager

- [x] Controlar volume geral.
- [x] Controlar volume de musica.
- [x] Controlar volume de efeitos.
- [x] Implementar mute.
- [x] Lidar com bloqueio de autoplay do navegador.

Pronto quando:

- O jogo funciona com audio e tambem mutado.

### Task 9.2 - Sons Do Personagem

- [x] Som de pulo.
- [x] Som de aterrissagem, se nao ficar excessivo.
- [x] Som de morte.
- [x] Variacoes de morte.
- [x] Som de respawn.
- [x] Som de acao principal.
- [x] Som de acao secundaria.

Pronto quando:

- Acoes importantes tem feedback curto e legivel.

### Task 9.3 - Sons De Fase

- [x] Checkpoint.
- [x] Fim de fase.
- [x] Coleta de item.
- [x] Armadilha ativada.
- [x] Plataforma caindo.
- [x] Projetil disparando.

Pronto quando:

- O som ajuda o jogador a entender o que aconteceu.

### Task 9.4 - Musica Do MVP

- [x] Definir tema musical inicial.
- [x] Criar ou integrar loop temporario.
- [x] Garantir que a musica nao reinicia a cada morte.
- [x] Criar vinheta curta de fim de fase, se viavel.
- [x] Registrar origem/licenca.

Pronto quando:

- O MVP tem identidade sonora minima sem irritar em repeticao.

## Fase 10 - UI, UX E Fluxo De Jogo

Objetivo: criar interface minima para jogar, reiniciar, pausar e concluir fases.

### Task 10.1 - Tela Inicial

- [x] Mostrar nome provisório do jogo.
- [x] Mostrar comando para iniciar.
- [x] Evitar tela com excesso de texto.
- [x] Iniciar Fase 1.

Pronto quando:

- O jogador consegue iniciar o jogo claramente.

### Task 10.2 - HUD

- [x] Mostrar contador de mortes.
- [x] Mostrar fase atual.
- [x] Mostrar estado de mute se necessario.
- [x] Evitar sobrepor gameplay.

Pronto quando:

- Informacao essencial e visivel sem atrapalhar.

### Task 10.3 - Pausa E Mute

- [x] `Esc` pausa.
- [x] `Esc` retoma.
- [x] `M` muta.
- [x] Estado de pause congela gameplay.
- [x] Audio respeita mute.

Pronto quando:

- Comandos de sistema funcionam sem quebrar input.

### Task 10.4 - Transicao Entre Fases

- [x] Detectar fim de fase.
- [x] Mostrar feedback curto.
- [x] Carregar proxima fase.
- [x] Preservar ou resetar contador conforme decisao.
- [x] Finalizar apos Fase 3 com tela simples.

Pronto quando:

- O jogador consegue jogar as 3 fases em sequencia.

## Fase 11 - Arte E Assets Visuais

Objetivo: sair de placeholders ruins para uma direcao visual consistente.

### Task 11.1 - Definir Direcao Visual Inicial

- [x] Escolher pixel art, cartoon vetorial ou outro estilo.
- [x] Definir paleta inicial.
- [x] Definir tamanho de tile.
- [x] Definir tamanho final aproximado do personagem.
- [x] Registrar no `IDEIA.md`.

Pronto quando:

- Assets novos seguem uma direcao comum.

### Task 11.2 - Tileset Placeholder Coerente

- [x] Criar bloco solido.
- [x] Criar plataforma.
- [x] Criar perigo visual.
- [x] Criar fundo simples.
- [x] Registrar origem/licenca.

Pronto quando:

- Mapas ficam legiveis sem arte final.

### Task 11.3 - Arte Do Personagem

- [x] Melhorar sprite idle.
- [x] Melhorar corrida.
- [x] Melhorar pulo.
- [x] Melhorar queda.
- [x] Melhorar morte.
- [x] Melhorar respawn.

Pronto quando:

- O personagem e reconhecivel e legivel em movimento.

### Task 11.4 - Arte De Traps E Itens

- [x] Espinhos.
- [x] Bloco falso.
- [x] Plataforma que cai.
- [x] Projetil.
- [x] Checkpoint.
- [x] Saida de fase.
- [x] Coletavel opcional.

Pronto quando:

- Objetos importantes sao reconheciveis antes e depois da ativacao.

## Fase 12 - Testes, QA E Qualidade

Objetivo: garantir que o MVP funcione no navegador e seja jogavel.

### Task 12.1 - Testes Unitarios

- [x] Testar validacao de fase.
- [x] Testar input mapper, se isolavel.
- [x] Testar calculos de coyote time/jump buffer, se isolaveis.
- [x] Testar estado de checkpoint.
- [x] Testar contador de mortes.

Pronto quando:

- `npm run test` passa.

### Task 12.2 - Smoke Tests Playwright

- [x] Abrir jogo.
- [x] Iniciar partida.
- [x] Confirmar canvas visivel.
- [x] Confirmar personagem existe.
- [x] Simular movimento basico.
- [x] Confirmar ausência de erro critico no console.

Pronto quando:

- `npm run test:e2e` passa.

### Task 12.3 - Checklist Manual De Gameplay

- [x] Testar Fase 1 do inicio ao fim.
- [x] Testar Fase 2 do inicio ao fim.
- [x] Testar Fase 3 do inicio ao fim.
- [x] Testar morte por cada tipo de perigo.
- [x] Testar respawn em cada checkpoint.
- [x] Testar `R`.
- [x] Testar pause.
- [x] Testar mute.
- [x] Testar build de producao.

Pronto quando:

- O primeiro build cumpre os criterios definidos no `IDEIA.md`.

### Task 12.4 - Performance E Estabilidade

- [x] Verificar FPS em desktop.
- [x] Verificar que nao ha vazamento obvio ao morrer muitas vezes.
- [x] Verificar que projeteis e traps sao limpos no reset.
- [x] Verificar que audio nao acumula sobreposto.

Pronto quando:

- O jogo suporta muitas tentativas sem degradar perceptivelmente.

## Fase 13 - Documentacao De Uso E Primeiro Build

Objetivo: deixar qualquer IA ou pessoa capaz de rodar, testar e continuar.

### Task 13.1 - README Do Projeto

- [x] Descrever o jogo.
- [x] Documentar stack.
- [x] Documentar instalacao.
- [x] Documentar `npm run dev`.
- [x] Documentar `npm run build`.
- [x] Documentar `npm run test`.
- [x] Documentar `npm run test:e2e`.
- [x] Documentar controles.

Pronto quando:

- Um novo agente consegue rodar o projeto lendo apenas `README.md`.

### Task 13.2 - Checklist De Release MVP

- [x] Rodar lint.
- [x] Rodar testes unitarios.
- [x] Rodar smoke tests.
- [x] Rodar build.
- [x] Validar 3 fases manualmente.
- [x] Atualizar `ROADMAP.md`.
- [x] Atualizar `IDEIA.md` se algo mudou.

Pronto quando:

- O MVP pode ser apresentado como primeiro build jogavel.

## Fase 14 - Pos-MVP E Expansao

Objetivo: listar ideias futuras sem contaminar o escopo inicial.

### Task 14.1 - Expansao De Fases

- [x] Avaliar novas fases depois das 3 iniciais.
- [x] Decidir se expansao sera linear, hub ou mundos separados.
- [x] Planejar novas mecanicas uma por vez.
- [x] Evitar aumentar dificuldade sem ensinar antes.

### Task 14.2 - Gamepad :backlog:

- [ ] Mapear controle.
- [ ] Testar input analogico/digital.
- [ ] Criar tela de remapeamento se necessario.

### Task 14.3 - Sistemas Avancados :backlog:

- [ ] Replay fantasma.
- [ ] Medalhas locais.
- [ ] Melhor tempo local.
- [ ] Menor numero de mortes por fase.
- [ ] Segredos.
- [ ] Conquistas internas.
- [ ] Assist mode opcional.

### Task 14.4 - Ferramentas De Mapa :backlog:

- [ ] Avaliar Tiled.
- [ ] Avaliar editor proprio simples.
- [ ] Criar conversor para formato de fase se necessario.

## Fase 15 - Incrementos De Profundidade E Retencao

Objetivo: transformar o primeiro build jogavel em uma base pos-MVP mais
repetivel, legivel e expansivel, priorizando mecanicas expressivas, feedback de
aprendizado e motivos para rejogar antes de inflar o numero de fases.

Documento de analise: `docs/phase-15-improvement-plan.md`.

### Task 15.1 - Implementar Dash Controlado

- [x] Criar estado puro de dash com duracao, cooldown, direcao e reset.
- [x] Integrar `J`/`Z` ao movimento real do jogador.
- [x] Garantir que dash nao atravesse solidos.
- [x] Reproduzir audio/animacao somente quando o dash acontecer.
- [x] Resetar dash em morte, respawn e reinicio manual.
- [x] Cobrir duracao, cooldown, direcao e reset com testes unitarios.

Pronto quando:

- A acao principal tem uso jogavel previsivel e nao quebra as 3 fases atuais.

### Task 15.2 - Feedback De Morte E Aprendizado

- [x] Registrar causa da morte.
- [x] Registrar fonte da morte quando houver id de hazard/trap/projetil.
- [x] Mostrar mensagem curta no HUD ou no respawn.
- [x] Emitir evento de morte com causa para testes e estatisticas futuras.
- [x] Cobrir formatacao e mapeamento de causas com testes.

Pronto quando:

- Cada morte principal do MVP informa uma causa curta sem atrasar o respawn.

### Task 15.3 - Melhorar Leitura Visual Das Traps

- [x] Adicionar estado visual armado/acionado/resetado para traps.
- [x] Criar feedback curto de surgimento para `spike-pop`.
- [x] Criar rachadura visual para `breakable-floor`.
- [x] Criar rastro ou preparacao legivel para projetil.
- [x] Atualizar a revisao de justica das armadilhas.

Pronto quando:

- Traps continuam surpreendendo, mas a causa da morte fica mais clara apos a
  primeira falha.

### Task 15.4 - Resultados Locais Por Fase

- [x] Medir tempo por fase.
- [x] Medir mortes por fase.
- [x] Salvar melhor tempo e menor numero de mortes em `localStorage`.
- [x] Mostrar resultado compacto na transicao.
- [x] Cobrir normalizacao e persistencia com testes.

Pronto quando:

- Concluir uma fase gera uma marca local que incentiva repeticao sem depender de
  ranking online.

### Task 15.5 - Selecionar E Continuar Fases Desbloqueadas

- [ ] Persistir maior fase desbloqueada localmente.
- [ ] Adicionar opcao simples de continuar no menu.
- [ ] Adicionar selecao compacta de fases desbloqueadas.
- [ ] Resetar run atual ao selecionar fase sem apagar recordes locais.
- [ ] Manter campanha linear como fluxo padrao.

Pronto quando:

- O jogador consegue voltar a fases ja desbloqueadas sem criar um hub jogavel.

### Task 15.6 - Planejar E Criar Bloco 2 De Fases

- [ ] Planejar `level-04`, `level-05` e `level-06`.
- [ ] Encadear campanha linear de `level-03` para `level-04`.
- [ ] Introduzir dash em `level-04`.
- [ ] Distorcer dash com traps conhecidas em `level-05`.
- [ ] Combinar dash, interacao e memoria curta em `level-06`.
- [ ] Criar testes de conteudo e checklist manual do bloco.

Pronto quando:

- O segundo bloco tem 3 fases curtas, ensinaveis e concluiveis.

### Task 15.7 - Ferramentas De QA Para Playtest

- [ ] Criar modo dev para iniciar fase especifica.
- [ ] Expor snapshot dev de fase, checkpoint, mortes, causa da ultima morte e
  estado de traps.
- [ ] Criar helpers internos para ir ao checkpoint e simular conclusao.
- [ ] Documentar uso sem afetar build de producao.

Pronto quando:

- Novas fases podem ser testadas diretamente em dev sem repetir todo o jogo.

### Task 15.8 - Otimizacao Inicial Do Build

- [ ] Investigar o aviso de chunk grande do Vite.
- [ ] Avaliar separacao de Phaser/codigo do jogo em chunks.
- [ ] Conferir imports de audio e imagens.
- [ ] Ajustar build apenas se houver ganho claro.
- [ ] Rodar build e smoke test apos mudancas.

Pronto quando:

- O aviso e resolvido ou documentado como divida aceita com motivo claro.

## Ordem Recomendada De Execucao

1. Fase 1: scaffold tecnico.
2. Fase 2: arquitetura base.
3. Fase 4: input e movimento minimo.
4. Fase 3: personagem placeholder integrado.
5. Fase 5: fases declarativas.
6. Fase 6: morte, respawn e checkpoints.
7. Fase 7: obstaculos, armadilhas e itens.
8. Fase 8: 3 fases iniciais.
9. Fase 9: audio.
10. Fase 10: UI/UX.
11. Fase 11: arte e assets.
12. Fase 12: testes e QA.
13. Fase 13: primeiro build.
14. Fase 14: expansao pos-MVP.
15. Fase 15: incrementos de profundidade e retencao.

Observacao: Fase 3 e Fase 4 podem andar juntas, mas o movimento deve ser
validado com placeholder antes de gastar tempo em arte final.

## Definicao Global De Pronto Do MVP

O MVP estara pronto quando:

- [x] `npm run dev` abre o jogo.
- [x] `npm run build` funciona.
- [x] `npm run test` passa.
- [x] `npm run test:e2e` passa ou tem bloqueio documentado.
- [x] Nao ha erro critico no console.
- [x] Tela inicial aparece.
- [x] Personagem aparece no mapa.
- [x] Controles respondem.
- [x] Personagem anda, pula e colide.
- [x] As 3 fases iniciais existem.
- [x] As 3 fases iniciais podem ser concluidas.
- [x] Cada fase tem ponto A e ponto B.
- [x] Cada fase tem pelo menos uma armadilha ou obstaculo.
- [x] Morte funciona.
- [x] Respawn rapido funciona.
- [x] Checkpoint funciona.
- [x] `R` reinicia do checkpoint.
- [x] Contador de mortes funciona.
- [x] Audio basico funciona ou pode ser mutado.
- [x] `README.md` explica como rodar.
- [x] `IDEIA.md` reflete as decisoes finais do MVP.

## Log De Progresso

Use este espaco para registrar marcos importantes. Nao registrar cada micro
alteracao; apenas mudancas que ajudam a proxima IA a entender o estado.

### 2026-05-25

- [x] Roadmap operacional criado.
- [x] Decisoes base documentadas em `IDEIA.md`.
- [x] Task 1.1 concluida: scaffold Vite + TypeScript criado, dependencias
  `vite` e `typescript` instaladas, `npm run dev` validado com resposta HTTP
  200 em `http://127.0.0.1:5173/`.
- [x] Task 1.2 concluida: dependencias principais instaladas em
  `package.json`: `phaser@3`, `typescript`, `vitest`, `@playwright/test`,
  `eslint` e `prettier`. Projeto validado novamente com `npm run dev` e
  resposta HTTP 200.
- [x] Task 1.3 concluida: scripts `dev`, `build`, `preview`, `test`,
  `test:e2e`, `lint` e `format` adicionados ao `package.json`. `build`,
  `test`, `preview` e `dev` validados. `lint` e `test:e2e` documentados no
  `README.md` como dependentes de configuracao/conteudo futuro.
- [x] Task 1.4 concluida: estrutura inicial de pastas criada em `src/game`,
  `src/data`, `src/shared`, `tests` e `docs`, com marcadores `.gitkeep` para
  preservar diretorios vazios no commit.
- [x] Task 1.5 concluida: pipeline inicial de assets criado em `assets/`, com
  pastas por dominio, marcadores `.gitkeep` e regras de nome/origem/licenca em
  `assets/ASSETS.md`.
- [x] Task 1.6 concluida: `tsconfig.json` estrito criado e `npm run build`
  ajustado para executar `tsc --noEmit` antes de `vite build`. Alias de import
  avaliado e adiado por nao haver imports internos ainda. Build validado com
  sucesso.
- [x] Task 1.7 concluida: ESLint e Prettier configurados, ignores para
  artefatos gerados adicionados, comandos documentados no `README.md`, e
  `npm run lint` / `npm run format` validados.
- [x] Task 2.1 concluida: constantes centrais extraidas para
  `src/game/constants.ts` e configuracao Phaser criada em `src/game/config.ts`,
  com resolucao 480x270, tile de 16px, escala `FIT`/`CENTER_BOTH`,
  renderizacao para pixel art, FPS alvo 60, Arcade Physics e constantes
  iniciais de movimento/fisica.
- [x] Task 2.2 concluida: cenas `BootScene`, `PreloadScene`, `MenuScene`,
  `LevelScene`, `HudScene` e `PauseScene` criadas. `main.ts` agora inicia
  Phaser com fluxo boot -> preload -> menu -> level, HUD sobre a fase e pausa
  via `Esc`.
- [x] Task 2.3 concluida: fluxo de estado central criado em
  `src/game/systems/game-state.ts`, cobrindo status do jogo, fase atual,
  contador de mortes, checkpoint ativo, pausa e mute. Cenas passaram a usar o
  estado central para iniciar fase, pausar/retomar, alternar mute e atualizar
  HUD.
- [x] Task 2.4 concluida: tipos compartilhados criados em `src/shared`, com
  geometria (`Vector2Like`, `RectLike`), fase, input, audio e entidades.
  `game-state` passou a usar tipos compartilhados para level, checkpoint e
  posicao.
- [x] Task 2.5 concluida: sistema interno de eventos criado em
  `src/game/systems/game-events.ts`, com eventos tipados para morte, respawn,
  checkpoint, fim de fase e audio. `game-state` passou a emitir eventos para
  checkpoint, morte, respawn, fim de fase e mute.
- [x] Revisao da Fase 2 concluida: constantes puras separadas da configuracao
  Phaser para permitir testes Node sem `window`, e testes unitarios adicionados
  para eventos internos e fluxo de estado.
- [x] Task 3.1 concluida: conceito inicial do personagem registrado em
  `IDEIA.md`. Nome provisório definido como Pino, uma criatura original de corpo
  compacto em cápsula, visor frontal, antena curta, pés pequenos e humor visual
  desconfiado/desajeitado.
- [x] Task 3.2 concluida: escala inicial do personagem registrada em `IDEIA.md`
  e refletida em `src/game/constants.ts`. Pino usa sprite visual 12x24px, hitbox
  real 10x22px, margem visual de 1px em todos os lados, pivô no centro inferior
  e relação de 0,75x1,5 tile para o sprite.
- [x] Task 3.3 concluida: placeholder visual idle criado em
  `assets/sprites/player-pino-idle.png`, registrado em `assets/ASSETS.md`,
  carregado no `PreloadScene` e usado na `LevelScene` com o pivô definido para
  o personagem.
- [x] Task 3.4 concluida: dados declarativos de animacao criados em
  `src/data/characters/pino-animations.ts`, com placeholders para idle, run,
  jump, fall, death, respawn, acao principal e acao secundaria. `LevelScene`
  registra as animacoes no Phaser e escolhe a animacao inicial por estado.
- [x] Task 3.5 concluida: entidade `Player` criada em
  `src/game/entities/player.ts`, separando estado fisico e visual, aplicando a
  hitbox real 10x22px no corpo Arcade e expondo metodos para update de
  movimento, morte, respawn e leitura de estado. `LevelScene` passou a
  instanciar a entidade em vez de manter sprite solto.
- [x] Revisao da Fase 3 concluida: conceito, escala, placeholder visual, dados
  de animacao e entidade `Player` conferidos. Ajustado `Player` para tipar a
  chave de animacao e derivar `isGrounded` do corpo Arcade quando a cena nao
  informar estado explicito.
- [x] Task 4.1 concluida: mapa de input criado em `src/game/input`, com
  bindings para movimento, pulo, acao principal, acao secundaria, restart,
  pausa e mute. `ActionInput` expoe consulta por acao e `LevelScene` /
  `PauseScene` passaram a usar acoes em vez de eventos diretos de tecla para
  pausa e mute.
- [x] Task 4.2 concluida: movimento horizontal inicial criado em
  `src/game/physics/horizontal-movement.ts`, usando velocidade maxima de
  190 px/s, aceleracao de 1800 px/s², desaceleracao de 2200 px/s² no chao e
  900 px/s² no ar. `LevelScene` passou a consultar `ActionInput` para
  `move-left`/`move-right` e atualizar a velocidade horizontal do `Player`.
- [x] Task 4.3 concluida: pulo inicial criado em
  `src/game/physics/jump-movement.ts`, com velocidade inicial de -430 px/s,
  gravidade de 1200 px/s², corte de pulo para 45%, coyote time de 90 ms e jump
  buffer de 100 ms. `LevelScene` passou a consultar a acao `jump` e aplicar
  limite temporario de pouso no chao visual ate a colisao basica da Task 4.4.
- [x] Task 4.4 concluida: colisao basica criada em
  `src/game/physics/solid-collision.ts`, com resolvedor cinematico por eixo para
  retangulos solidos, hitbox real do Pino, bloqueio de chao, paredes, topo e
  parte inferior de plataformas solidas. `LevelScene` agora usa uma sala de
  teste com chao, paredes laterais e plataformas solidas curtas. Testes
  unitarios cobrem aterrissagem, paredes, quinas simples e passos grandes sem
  atravessar blocos finos.
- [x] Task 4.5 concluida: camera inicial configurada na `LevelScene`, com mapa
  temporario de 960x270px, limites de camera, `startFollow` no sprite do Pino,
  `roundPixels` e deadzone de 128x80px para reduzir tremor e manter obstaculos
  proximos legiveis.
- [x] Task 4.6 concluida: testes de movimento reforcados com casos de expiracao
  de coyote time e jump buffer, checklist manual criado em
  `docs/movement-checklist.md` e validacao automatica no navegador executada com
  Chromium headless via Playwright. Como o WebGL headless do ambiente gerou
  `Framebuffer Unsupported`, a validacao foi feita com WebGL desativado no
  caminho Canvas; canvas abriu, respondeu a movimento/pulo e nao registrou erros
  ou avisos. Nenhum valor de fisica foi ajustado nesta rodada.
- [x] Task 5.1 concluida: schema declarativo de fases consolidado em
  `src/shared/levels.ts` com interfaces para fase, terreno, hazards, traps,
  itens, checkpoints e saida. Helper `defineLevel` criado em
  `src/data/levels/schema.ts` para autoria com autocomplete e validacao
  TypeScript. Teste `tests/level-schema.test.ts` cobre uma fase completa de
  exemplo.
- [x] Task 5.2 concluida: validador puro criado em
  `src/data/levels/validation.ts`, com `validateLevel` para fase individual e
  `validateLevels` para lista de fases. Regras iniciais cobrem ids duplicados,
  spawn, saida, checkpoints, retangulos de terreno e assets referenciados.
  Testes unitarios criados em `tests/level-validation.test.ts`.
- [x] Task 5.3 concluida: terreno da `LevelScene` passou a vir dos dados da
  fase. Registry criado em `src/data/levels/registry.ts`, helper
  `src/game/systems/level-terrain.ts` extrai retangulos solidos para colisao e
  define cores placeholder por tipo de terreno. Testes cobrem registry valido e
  derivacao de terreno.
- [x] Task 5.4 concluida: `MenuScene` inicia a fase usando `level.spawn`,
  `LevelScene` renderiza marcador de spawn, saida e checkpoints, detecta contato
  com checkpoint/saida pela hitbox real do Pino e aciona
  `gameStateStore.setActiveCheckpoint` / `gameStateStore.completeLevel`.
  Helper puro criado em `src/game/systems/level-progress.ts` e testes adicionados
  em `tests/level-progress.test.ts`.
- [x] Task 5.5 concluida: fases iniciais criadas em
  `src/data/levels/level-01.ts`, `src/data/levels/level-02.ts` e
  `src/data/levels/level-03.ts`. `LEVEL_DEFINITIONS` agora exporta a campanha
  inicial na ordem 1, 2 e 3; todas as fases possuem `spawn` e `exit`, com
  `level-01` apontando para `level-02` e `level-02` apontando para `level-03`.
- [x] Task 6.1 concluida: estado de vida do jogador adicionado ao
  `gameStateStore` como `alive`/`dead`. `registerDeath` agora troca para
  `dead`, incrementa o contador uma unica vez por morte e emite
  `player:died`; `respawnAtCheckpoint` volta para `alive`. `LevelScene` trava
  movimento/progresso quando o jogador esta morto e dispara morte por queda ao
  passar do limite inferior da fase. Helper puro criado em
  `src/game/systems/player-death.ts` com testes em `tests/player-death.test.ts`.
- [x] Task 6.2 concluida: `LevelScene` agenda respawn automatico de 450 ms apos
  morte, chama `gameStateStore.respawnAtCheckpoint`, reposiciona/restaura o
  `Player` no checkpoint ativo, reinicia o estado de pulo e libera controle sem
  reiniciar a cena. Recuperacao visual curta configurada em
  `src/game/systems/player-respawn.ts`, com testes em
  `tests/player-respawn.test.ts`.
- [x] Task 6.3 concluida: `LevelScene` agora escuta a acao `restart` mapeada em
  `R`, cancela timers de respawn pendentes, reposiciona o `Player` no checkpoint
  ativo com `gameStateStore.respawnAtCheckpoint(true)` e reseta estado
  transitorio da sala atual. Decisao registrada: reinicio manual enquanto vivo
  nao conta como morte.
- [x] Task 6.4 concluida: infraestrutura de reset de sala criada em
  `src/game/systems/room-state.ts`. O estado runtime cobre armadilhas,
  projeteis, plataformas que caem, itens e objetos interativos. Respawn e
  reinicio manual agora chamam `resetRoomStateForRespawn`; projeteis sao
  limpos, traps/plataformas/objetos resetaveis voltam ao estado inicial, itens
  obrigatorios retornam e itens opcionais coletados com `persistsAfterDeath`
  continuam preservados. Testes adicionados em `tests/room-state.test.ts`.
- [x] Task 6.5 concluida: HUD de mortes reforcado na `HudScene`, com contador
  compacto no canto superior esquerdo, fundo escuro semitransparente e texto
  monospace legivel. O contador continua inscrito no `gameStateStore`, entao
  atualiza imediatamente quando `deathCount` muda. Helper testavel criado em
  `src/game/ui/death-counter.ts`, com testes em `tests/death-counter.test.ts`.
- [x] Task 7.1 concluida: sistema base de hazards criado em
  `src/game/systems/level-hazards.ts`, com deteccao de contato mortal,
  mapeamento de causa de morte e cores placeholder por tipo. `LevelScene` agora
  renderiza hazards declarados, desenha espinhos fixos e mata o jogador ao tocar
  hazards instantaneos ou areas de queda. `level-01` recebeu um espinho fixo
  inicial e testes foram adicionados em `tests/level-hazards.test.ts`.
- [x] Task 7.2 concluida: sistema base de traps criado em
  `src/game/systems/level-traps.ts`, com deteccao de gatilhos por posicao,
  feedback visual placeholder e metadados de audio futuro. `LevelScene` renderiza
  areas de gatilho/corpo de traps, marca traps como acionadas no `roomState` e
  atualiza o visual quando o jogador cruza a area. Reset por respawn continua via
  `resetRoomStateForRespawn`. Testes adicionados em `tests/level-traps.test.ts`.
- [x] Task 7.3 concluida: comportamento inicial das traps do MVP criado em
  `src/game/systems/mvp-traps.ts`. Bloco falso e chao quebravel removem colisao
  da sala, plataforma que cai desativa a plataforma runtime, espinho que surge
  vira ameaca mortal apos gatilho e projetil simples nasce com velocidade
  configuravel. `level-02` recebeu uma trap de projetil e `level-03` recebeu
  chao quebravel, deixando os cinco tipos do MVP declarados nos dados iniciais.
  Testes adicionados em `tests/mvp-traps.test.ts`.
- [x] Task 7.4 concluida: sistema inicial de itens criado em
  `src/game/systems/level-items.ts`, com deteccao de coleta por overlap,
  feedback visual de item coletado, suporte a item que ativa objeto interativo
  via `activatesObjectId` e preservacao/restauracao conforme
  `persistsAfterDeath`. `level-01` recebeu um item obrigatorio simples,
  `level-02` recebeu uma chave que ativa o mecanismo declarado e `level-03`
  manteve o coletavel opcional persistente. Testes adicionados em
  `tests/level-items.test.ts`.
- [x] Task 7.5 concluida: sistema inicial de objetos interativos criado em
  `src/game/systems/level-interactive-objects.ts`, com porta simples que bloqueia
  colisao enquanto fechada, alavanca acionavel por acao secundaria, ativacao de
  alvo via `targetObjectId`, feedback visual e reset via `roomState`.
  `level-02` recebeu uma porta de saida; a Fase 8 manteve a alavanca como
  abridor da porta e moveu a chave para um mecanismo visual separado. Testes
  adicionados em `tests/level-interactive-objects.test.ts`.
- [x] Task 7.6 concluida: revisao de justica das armadilhas registrada em
  `docs/trap-fairness-review.md`, cobrindo causa esperada de morte, risco de
  softlock, espera apos erro e riscos conhecidos por fase. Contratos de
  seguranca adicionados em `tests/trap-fairness.test.ts` para manter traps
  resetaveis, atrasos abaixo do respawn automatico e portas fechadas com pelo
  menos um abridor declarado.
- [x] Revisao da Fase 7 concluida: hazards, traps do MVP, itens e objetos
  interativos foram conferidos em conjunto na `LevelScene`, no `roomState`, nos
  dados das tres fases iniciais e nos testes. A fase ficou pronta para commit
  com contratos cobrindo morte por contato, reset, projetil, remocao de colisao,
  coleta, ativacao de porta/mecanismo e justica das armadilhas.
- [x] Task 8.1 concluida: `level-01` foi ajustada como fase jogavel
  introdutoria, com ponto A no spawn inicial, ponto B na saida para `level-02`,
  chao segmentado, tres buracos pequenos, espinho fixo, primeira surpresa
  `spike-pop`, checkpoint intermediario e metadados minimos de som para
  checkpoint/trap. Testes de conteudo adicionados em
  `tests/level-01-content.test.ts`.
- [x] Task 8.2 concluida: `level-02` foi ajustada como fase jogavel de timing e
  interacao, com ponto A no spawn inicial, ponto B na saida para `level-03`,
  chao segmentado, dois gaps de queda, plataforma que cai, checkpoint
  intermediario, porta de saida aberta por alavanca secundaria, chave como pista
  de mecanismo e projetil lateral como pegadinha visual na saida. Testes de
  conteudo adicionados em `tests/level-02-content.test.ts`.
- [x] Task 8.3 concluida: `level-03` foi ajustada como fechamento jogavel do
  MVP inicial, com ponto A no spawn inicial, ponto B na saida final, sequencia
  curta de tres plataformas precisas, plataforma quebravel com token opcional de
  risco e recompensa, checkpoint antes da secao cruel, piso falso na plataforma
  da saida e metadados minimos de som para token/piso falso. Testes de conteudo
  adicionados em `tests/level-03-content.test.ts`.
- [x] Task 8.4 concluida: curva inicial balanceada e documentada em
  `docs/initial-curve-balance.md`. Foram registrados os papeis das tres fases,
  limites contra caminhadas longas, variacao de traps sem repetir a mesma piada
  e contratos automatizados em `tests/initial-curve-balance.test.ts`.
- [x] Revisao da Fase 8 concluida: as tres fases iniciais foram conferidas como
  conteudo jogavel completo, com testes de conteudo por fase, contratos de
  balanceamento da curva inicial, documentacao atualizada e pacote pronto para
  commit.
- [x] Task 9.1 concluida: Audio Manager inicial criado em
  `src/game/systems/audio-manager.ts`, com controle de volume geral, musica,
  efeitos, mute e fila para autoplay bloqueado. `AudioScene` conecta eventos de
  audio ao Phaser sem exigir assets finais ainda, e os contratos unitarios ficam
  em `tests/audio-manager.test.ts`.
- [x] Task 9.2 concluida: sons placeholder originais do Pino criados em
  `assets/audio/sfx/`, metadados declarados em `src/data/audio/player-audio.ts`
  e preload integrado. Pulo, aterrissagem filtrada, tres variacoes de morte,
  respawn, acao primaria e acao secundaria agora emitem cues de audio, com
  contratos em `tests/player-audio.test.ts` e
  `tests/player-audio-feedback.test.ts`.
- [x] Task 9.3 concluida: sons placeholder originais de fase criados em
  `assets/audio/sfx/`, metadados declarados em `src/data/audio/level-audio.ts`
  e preload integrado. Checkpoint, fim de fase, coleta de item, armadilha
  ativada, plataforma caindo e projetil disparando agora emitem cues de audio,
  com contratos em `tests/level-audio.test.ts` e
  `tests/level-audio-feedback.test.ts`.
- [x] Task 9.4 concluida: tema inicial `Passos Tortos` definido em
  `src/data/audio/music-audio.ts`, com loop temporario original e vinheta curta
  de fim de fase em `assets/audio/music/`. O loop e iniciado apos o preload,
  continua durante mortes/respawns e o `AudioManager` evita reiniciar a mesma
  musica quando o mesmo id ja esta ativo.
- [x] Task 10.1 concluida: `MenuScene` agora renderiza uma tela inicial curta,
  com nome provisório, comando unico de inicio, visual simples de fase e entrada
  direta na Fase 1 via Enter, Espaco ou toque/click. A ordem de cenas foi
  consolidada para `BootScene` iniciar o fluxo e lancar audio/preload/menu. O
  contrato de copy/layout fica em `src/game/ui/start-screen.ts` e
  `tests/start-screen.test.ts`.
- [x] Task 10.2 concluida: HUD compacto redesenhado como faixa superior minima,
  com mortes a esquerda, fase atual centralizada pelo nome da fase e indicador
  `MUDO` apenas quando o audio esta mutado. O texto debug da fase foi removido
  para nao competir com o HUD, e os contratos ficam em `src/game/ui/hud.ts` e
  `tests/hud.test.ts`.
- [x] Task 10.3 concluida: comandos de sistema agora usam eventos diretos de
  teclado nas cenas ativas. `Esc` pausa e retoma via overlay, `M` alterna mute
  durante jogo ou pausa, a cena da fase fica pausada sem processar gameplay e o
  `AudioManager` zera/restaura volumes ativos ao receber mudancas de mute.
- [x] Task 10.4 concluida: tocar a saida agora inicia `LevelTransitionScene`,
  com feedback visual curto, audio de fim de fase, carregamento automatico da
  proxima fase quando existe `nextLevelId` e tela final simples apos a Fase 3.
  O contador de mortes foi preservado durante o run de 3 fases e resetado apenas
  quando o jogador reinicia a partir da tela final.
- [x] Task 11.1 concluida: direcao visual inicial definida como pixel art de
  baixa resolucao em laboratorio hostil, com tile 16x16px, Pino em
  aproximadamente 12x24px e paleta semantica registrada em
  `src/data/art/visual-direction.ts`, `docs/visual-direction.md` e `IDEIA.md`.
- [x] Task 11.2 concluida: tileset placeholder coerente criado em
  `assets/tilesets/`, com bloco solido, plataforma, perigo de espinhos e fundo
  simples registrados em `assets/ASSETS.md`. `LevelScene` agora renderiza fundo,
  terreno e hazards com texturas repetiveis sem alterar colisao ou dados de
  gameplay.
- [x] Task 11.3 concluida: Pino recebeu sprites 12x24px dedicados para idle,
  corrida em dois frames, pulo, queda, morte em dois frames e respawn em dois
  frames. `PINO_ANIMATIONS` agora usa esses frames nas animacoes centrais, o
  preload carrega todos os PNGs e a hitbox permaneceu 10x22px.
- [x] Task 11.4 concluida: sprites de traps, itens e marcadores criados em
  `assets/sprites/`, cobrindo espinhos, bloco falso, plataforma que cai,
  piso quebravel, projetil, chip, chave, token opcional, checkpoint ativo/
  inativo e saida. `LevelScene` renderiza esses assets mantendo as areas
  declarativas e os estados visuais de ativacao/coleta.
- [x] Task 12.1 concluida: testes unitarios reforcados para validacao de fase,
  input mapper, janelas de coyote time/jump buffer, estado de checkpoint e
  contador de mortes. `npm run test` cobre esses contratos sem depender do
  navegador.
- [x] Task 12.2 concluida: smoke test Playwright criado para abrir o jogo,
  iniciar a Fase 1, confirmar canvas visivel, validar existencia do Pino,
  simular movimento para a direita e falhar caso haja erro critico de console.
  `npm run test:e2e` gerencia o Vite local automaticamente.
- [x] Task 12.3 concluida: checklist manual de gameplay registrado em
  `docs/mvp-gameplay-checklist.md`, cobrindo as tres fases, mortes principais,
  respawn em cada checkpoint, `R`, pausa, mute e build/preview de producao.
- [x] Task 12.4 concluida: estabilidade inicial medida em
  `docs/performance-stability-check.md`, com FPS medio de ~60, 30 mortes
  seguidas sem drift de objetos, reset de traps/projeteis conferido e contrato
  unitario para audio repetido sem acumulo progressivo.
- [x] Task 13.1 concluida: `README.md` expandido com descricao do jogo, stack,
  instalacao, comandos de desenvolvimento/build/testes, controles, fluxo do MVP
  e documentos uteis para continuidade.
- [x] Task 13.2 concluida: checklist de release registrado em
  `docs/mvp-release-checklist.md`; lint, testes unitarios, smoke e build foram
  validados, e a definicao global de pronto do MVP foi marcada como cumprida.

### 2026-05-26

- [x] Task 14.1 concluida: expansao pos-MVP avaliada e decidida como campanha
  linear em blocos de 3 fases. Hub, mundos separados e editor ficam para depois
  de haver mais conteudo validado.
- [x] Fase 15 planejada: analise profunda do estado atual registrada em
  `docs/phase-15-improvement-plan.md`, com foco em dash controlado, feedback de
  morte, leitura visual de traps, resultados locais, selecao/continuacao de
  fases desbloqueadas, Bloco 2 de fases, ferramentas de QA e otimizacao de
  build.
- [x] Task 15.1 concluida: dash controlado implementado em
  `src/game/physics/dash-movement.ts`, integrado ao `LevelScene` com `J`/`Z`,
  velocidade previsivel, duracao/cooldown, colisao solida existente,
  audio/animacao somente no dash valido e reset em morte, respawn e reinicio
  manual. Testes unitarios adicionados em `tests/dash-movement.test.ts` e smoke
  Playwright atualizado para validar movimento de dash.
- [x] Task 15.2 concluida: eventos de morte agora carregam causa e `sourceId`
  quando a fonte tem id de hazard, trap ou projetil. `HudScene` mostra feedback
  curto de aprendizado por menos de 1 segundo usando
  `src/game/ui/death-feedback.ts`. Testes cobrem formatacao, duracao, fonte,
  eventos, estado, hazards e traps.
- [x] Task 15.3 concluida: traps agora expõem estado visual `armed`,
  `triggered` e `resolved` em `src/game/systems/level-traps.ts`. `LevelScene`
  renderiza tells, rachaduras e rastros de projeteis, com surgimento curto para
  `spike-pop`, rachadura reforcada para `breakable-floor` e rastro roxo para
  projeteis. A revisao de justica foi atualizada em
  `docs/trap-fairness-review.md`.
- [x] Task 15.4 concluida: resultados locais por fase implementados em
  `src/game/systems/level-results.ts`, medindo tempo e mortes da tentativa ao
  concluir cada fase, salvando melhor tempo e menor numero de mortes em
  `localStorage` e exibindo resumo compacto na `LevelTransitionScene`. Testes
  adicionados em `tests/level-results.test.ts` e transicao atualizada em
  `tests/level-transition.test.ts`.
