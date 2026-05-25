# ROADMAP.md

Ultima atualizacao: 2026-05-25

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

- [ ] Definir altura visual.
- [ ] Definir largura visual.
- [ ] Definir hitbox real.
- [ ] Definir margem entre sprite e hitbox.
- [ ] Definir pivô.
- [ ] Registrar relacao com tamanho de tile.

Pronto quando:

- Movimento e colisao podem ser ajustados com base em medidas claras.

### Task 3.3 - Criar Placeholder Visual

- [ ] Criar sprite placeholder de idle.
- [ ] Criar indicacao visual de direcao.
- [ ] Criar contraste suficiente com fundo.
- [ ] Registrar asset em `assets/ASSETS.md`.

Pronto quando:

- O personagem aparece e e legivel em tamanho real de jogo.

### Task 3.4 - Criar Dados De Animacao

- [ ] Definir animacoes esperadas.
- [ ] Criar estrutura declarativa de animacoes.
- [ ] Criar animacao `idle` placeholder.
- [ ] Criar animacao `run` placeholder.
- [ ] Criar animacao `jump` placeholder.
- [ ] Criar animacao `fall` placeholder.
- [ ] Criar animacao `death` placeholder.
- [ ] Criar animacao `respawn` placeholder.
- [ ] Criar animacoes de acao principal e secundaria placeholder.

Pronto quando:

- A cena escolhe animacoes por estado do personagem.

### Task 3.5 - Criar Entidade Player

- [ ] Criar classe ou modulo `Player`.
- [ ] Separar estado visual de estado fisico.
- [ ] Aplicar hitbox definida.
- [ ] Expor metodos claros para morrer, respawnar e atualizar movimento.

Pronto quando:

- O jogador existe como entidade reutilizavel, nao como codigo solto na cena.

## Fase 4 - Input E Movimento

Objetivo: validar a sensacao de controle antes de construir fases complexas.

### Task 4.1 - Implementar Mapa De Input

- [ ] Mapear `A` e seta esquerda.
- [ ] Mapear `D` e seta direita.
- [ ] Mapear `Espaco`, `W` e seta cima.
- [ ] Mapear `J` e `Z`.
- [ ] Mapear `K` e `X`.
- [ ] Mapear `R`.
- [ ] Mapear `Esc`.
- [ ] Mapear `M`.
- [ ] Criar interface para consulta de input por acao.

Pronto quando:

- A gameplay usa acoes, nao teclas espalhadas no codigo.

### Task 4.2 - Implementar Movimento Horizontal

- [ ] Aplicar velocidade maxima inicial de 190 px/s.
- [ ] Aplicar aceleracao inicial de 1800 px/s².
- [ ] Aplicar desaceleracao no chao de 2200 px/s².
- [ ] Aplicar desaceleracao no ar de 900 px/s².
- [ ] Permitir troca rapida de direcao.

Pronto quando:

- O personagem responde rapido e para com precisao.

### Task 4.3 - Implementar Pulo

- [ ] Aplicar velocidade inicial de pulo de -430 px/s.
- [ ] Aplicar gravidade de 1200 px/s².
- [ ] Implementar pulo variavel.
- [ ] Implementar corte de pulo para 45%.
- [ ] Implementar `coyote time` de 90 ms.
- [ ] Implementar `jump buffer` de 100 ms.

Pronto quando:

- Pulo curto e pulo alto sao perceptiveis.
- Pulos perto da borda parecem justos.

### Task 4.4 - Implementar Colisao Basica

- [ ] Colidir com chao.
- [ ] Colidir com paredes.
- [ ] Impedir atravessar terreno solido.
- [ ] Evitar travar em cantos simples.
- [ ] Manter plataformas atravessaveis fora do MVP.

Pronto quando:

- O jogador pode andar e pular em uma sala de teste sem bugs obvios.

### Task 4.5 - Criar Camera Inicial

- [ ] Camera segue o jogador.
- [ ] Camera respeita limites do mapa.
- [ ] Camera nao treme em movimento normal.
- [ ] Camera permite ler obstaculos proximos.

Pronto quando:

- O jogador nao sai do enquadramento.

### Task 4.6 - Testar Movimento

- [ ] Criar testes de logica pura para buffer/coyote se viavel.
- [ ] Criar checklist manual de movimento.
- [ ] Validar no navegador.
- [ ] Ajustar valores se necessario e registrar mudanca.

Pronto quando:

- Movimento esta bom o suficiente para comecar mapas.

## Fase 5 - Sistema De Fases Declarativas

Objetivo: transformar fases em dados editaveis e renderizaveis.

### Task 5.1 - Criar Schema De Fase

- [ ] Criar interfaces para `LevelDefinition`.
- [ ] Criar interfaces para `TerrainDefinition`.
- [ ] Criar interfaces para `HazardDefinition`.
- [ ] Criar interfaces para `TrapDefinition`.
- [ ] Criar interfaces para `ItemDefinition`.
- [ ] Criar interfaces para `CheckpointDefinition`.
- [ ] Criar interfaces para `ExitDefinition`.

Pronto quando:

- Uma fase pode ser escrita com autocomplete e validacao TypeScript.

### Task 5.2 - Criar Validador De Fase

- [ ] Validar `id` unico.
- [ ] Validar spawn dentro dos limites.
- [ ] Validar saida dentro dos limites.
- [ ] Validar checkpoints dentro dos limites.
- [ ] Validar retangulos de terreno.
- [ ] Validar assets referenciados.
- [ ] Criar testes unitarios para validacoes.

Pronto quando:

- Erros simples de dados sao pegos antes do jogo rodar.

### Task 5.3 - Renderizar Terreno

- [ ] Renderizar blocos solidos temporarios.
- [ ] Aplicar colisao nos blocos.
- [ ] Usar dados da fase, nao codigo fixo.
- [ ] Permitir cores ou sprites placeholder por tipo.

Pronto quando:

- Trocar dados da fase altera o mapa sem mexer na cena.

### Task 5.4 - Renderizar Spawn, Exit E Checkpoints

- [ ] Posicionar jogador no spawn.
- [ ] Renderizar saida.
- [ ] Detectar contato com saida.
- [ ] Renderizar checkpoints.
- [ ] Ativar checkpoint ao contato.

Pronto quando:

- Uma fase pode comecar, salvar checkpoint e terminar.

### Task 5.5 - Criar As 3 Fases Iniciais Em Dados

- [ ] Criar `level-01.ts`.
- [ ] Criar `level-02.ts`.
- [ ] Criar `level-03.ts`.
- [ ] Exportar lista ordenada de fases.
- [ ] Garantir que todas usam ponto A e ponto B.

Pronto quando:

- As 3 fases existem como dados, mesmo com geometria simples.

## Fase 6 - Morte, Respawn E Checkpoints

Objetivo: implementar o ciclo mais importante do jogo dificil.

### Task 6.1 - Implementar Sistema De Morte

- [ ] Criar estado `alive`.
- [ ] Criar estado `dead`.
- [ ] Travar controle ao morrer.
- [ ] Emitir evento de morte.
- [ ] Incrementar contador.

Pronto quando:

- O personagem morre de forma controlada e previsivel.

### Task 6.2 - Implementar Respawn Automatico

- [ ] Aguardar entre 300 ms e 600 ms.
- [ ] Voltar ao checkpoint ativo.
- [ ] Restaurar estado do jogador.
- [ ] Retomar controle.
- [ ] Manter musica tocando.

Pronto quando:

- O jogador consegue tentar de novo quase imediatamente.

### Task 6.3 - Implementar Reinicio Manual Com `R`

- [ ] `R` reposiciona no checkpoint.
- [ ] `R` reseta sala.
- [ ] Decidir se `R` conta morte quando usado vivo.
- [ ] Registrar decisao em `IDEIA.md`.

Pronto quando:

- O jogador pode reiniciar sem esperar cair ou morrer.

### Task 6.4 - Resetar Sala

- [ ] Resetar armadilhas.
- [ ] Resetar projeteis.
- [ ] Resetar plataformas moveis ou que caem.
- [ ] Restaurar itens obrigatorios necessarios.
- [ ] Preservar itens opcionais coletados quando fizer sentido.

Pronto quando:

- Nenhuma morte cria estado quebrado ou softlock.

### Task 6.5 - HUD De Mortes

- [ ] Mostrar contador de mortes.
- [ ] Atualizar imediatamente apos morte.
- [ ] Garantir legibilidade.
- [ ] Nao ocupar area critica de gameplay.

Pronto quando:

- O contador funciona e reforca a identidade do jogo.

## Fase 7 - Obstaculos, Armadilhas E Itens

Objetivo: criar os elementos que tornam os 3 mapas divertidos e dificeis.

### Task 7.1 - Criar Sistema Base De Hazard

- [ ] Definir dano/morte por contato.
- [ ] Criar espinho fixo.
- [ ] Criar area de queda/morte.
- [ ] Integrar com sistema de morte.

Pronto quando:

- Perigos simples matam o jogador de forma clara.

### Task 7.2 - Criar Sistema Base De Trap

- [ ] Definir interface de trap.
- [ ] Definir gatilho por posicao.
- [ ] Definir reset por respawn.
- [ ] Definir feedback visual basico.
- [ ] Definir feedback sonoro futuro.

Pronto quando:

- Traps podem ser adicionadas por dados de fase.

### Task 7.3 - Implementar Traps Do MVP

- [ ] Bloco falso.
- [ ] Plataforma que cai.
- [ ] Espinho que surge.
- [ ] Projetil simples.
- [ ] Chao quebravel.

Pronto quando:

- Ha pelo menos 3 tipos de trap usaveis nas fases iniciais.

### Task 7.4 - Implementar Itens

- [ ] Coletavel opcional.
- [ ] Item obrigatorio simples, se usado nas fases.
- [ ] Item de ativacao de mecanismo.
- [ ] Feedback visual de coleta.
- [ ] Estado persistente ate respawn ou fim da fase conforme regra.

Pronto quando:

- Itens ajudam desafio, recompensa ou interacao.

### Task 7.5 - Implementar Objetos Interativos

- [ ] Porta simples.
- [ ] Botao ou alavanca.
- [ ] Mecanismo acionado por acao principal/secundaria.
- [ ] Estado resetavel.

Pronto quando:

- Acoes principal e secundaria podem ter utilidade real no mapa.

### Task 7.6 - Revisar Justica Das Armadilhas

- [ ] Cada trap deve ter causa compreensivel depois da morte.
- [ ] Nenhuma trap deve causar softlock.
- [ ] Nenhuma trap deve exigir espera longa apos erro.
- [ ] Registrar riscos conhecidos por fase.

Pronto quando:

- As armadilhas parecem cruéis, mas aprendiveis.

## Fase 8 - Conteudo Dos 3 Mapas Iniciais

Objetivo: criar as primeiras fases como conteudo jogavel.

### Task 8.1 - Fase 1: Entrada Cruel

- [ ] Definir layout inicial.
- [ ] Definir ponto A.
- [ ] Definir ponto B.
- [ ] Ensinar andar e pular.
- [ ] Adicionar buracos pequenos.
- [ ] Adicionar primeira armadilha surpresa.
- [ ] Adicionar checkpoint se necessario.
- [ ] Adicionar som minimo.
- [ ] Testar conclusao da fase.

Pronto quando:

- A fase ensina o ciclo basico e pode ser concluida.

### Task 8.2 - Fase 2: O Caminho Nao Confia Em Voce

- [ ] Definir layout inicial.
- [ ] Definir ponto A.
- [ ] Definir ponto B.
- [ ] Introduzir timing.
- [ ] Adicionar obstaculo ativo simples.
- [ ] Usar acao principal ou secundaria.
- [ ] Adicionar checkpoint no meio.
- [ ] Adicionar pegadinha visual na saida.
- [ ] Testar conclusao da fase.

Pronto quando:

- A fase aumenta desafio sem exigir perfeicao excessiva.

### Task 8.3 - Fase 3: Quase Seguro

- [ ] Definir layout inicial.
- [ ] Definir ponto A.
- [ ] Definir ponto B.
- [ ] Criar sequencia curta de pulos precisos.
- [ ] Adicionar bloco falso ou chao quebravel.
- [ ] Adicionar item opcional de risco e recompensa.
- [ ] Adicionar checkpoint antes da parte mais cruel.
- [ ] Criar saida que testa desconfiança do jogador.
- [ ] Testar conclusao da fase.

Pronto quando:

- A fase combina ideias das duas anteriores e fecha o MVP com desafio memoravel.

### Task 8.4 - Balancear Curva Inicial

- [ ] Fase 1 deve ser dificil, mas introdutoria.
- [ ] Fase 2 deve exigir timing e interacao.
- [ ] Fase 3 deve exigir leitura, memoria curta e precisao.
- [ ] Evitar repetir a mesma piada sem variacao.
- [ ] Evitar longas caminhadas antes da parte dificil.

Pronto quando:

- As 3 fases formam uma progressao clara.

## Fase 9 - Audio E Feedback

Objetivo: adicionar som sem cansar o jogador em repeticao.

### Task 9.1 - Criar Audio Manager

- [ ] Controlar volume geral.
- [ ] Controlar volume de musica.
- [ ] Controlar volume de efeitos.
- [ ] Implementar mute.
- [ ] Lidar com bloqueio de autoplay do navegador.

Pronto quando:

- O jogo funciona com audio e tambem mutado.

### Task 9.2 - Sons Do Personagem

- [ ] Som de pulo.
- [ ] Som de aterrissagem, se nao ficar excessivo.
- [ ] Som de morte.
- [ ] Variacoes de morte.
- [ ] Som de respawn.
- [ ] Som de acao principal.
- [ ] Som de acao secundaria.

Pronto quando:

- Acoes importantes tem feedback curto e legivel.

### Task 9.3 - Sons De Fase

- [ ] Checkpoint.
- [ ] Fim de fase.
- [ ] Coleta de item.
- [ ] Armadilha ativada.
- [ ] Plataforma caindo.
- [ ] Projetil disparando.

Pronto quando:

- O som ajuda o jogador a entender o que aconteceu.

### Task 9.4 - Musica Do MVP

- [ ] Definir tema musical inicial.
- [ ] Criar ou integrar loop temporario.
- [ ] Garantir que a musica nao reinicia a cada morte.
- [ ] Criar vinheta curta de fim de fase, se viavel.
- [ ] Registrar origem/licenca.

Pronto quando:

- O MVP tem identidade sonora minima sem irritar em repeticao.

## Fase 10 - UI, UX E Fluxo De Jogo

Objetivo: criar interface minima para jogar, reiniciar, pausar e concluir fases.

### Task 10.1 - Tela Inicial

- [ ] Mostrar nome provisório do jogo.
- [ ] Mostrar comando para iniciar.
- [ ] Evitar tela com excesso de texto.
- [ ] Iniciar Fase 1.

Pronto quando:

- O jogador consegue iniciar o jogo claramente.

### Task 10.2 - HUD

- [ ] Mostrar contador de mortes.
- [ ] Mostrar fase atual.
- [ ] Mostrar estado de mute se necessario.
- [ ] Evitar sobrepor gameplay.

Pronto quando:

- Informacao essencial e visivel sem atrapalhar.

### Task 10.3 - Pausa E Mute

- [ ] `Esc` pausa.
- [ ] `Esc` retoma.
- [ ] `M` muta.
- [ ] Estado de pause congela gameplay.
- [ ] Audio respeita mute.

Pronto quando:

- Comandos de sistema funcionam sem quebrar input.

### Task 10.4 - Transicao Entre Fases

- [ ] Detectar fim de fase.
- [ ] Mostrar feedback curto.
- [ ] Carregar proxima fase.
- [ ] Preservar ou resetar contador conforme decisao.
- [ ] Finalizar apos Fase 3 com tela simples.

Pronto quando:

- O jogador consegue jogar as 3 fases em sequencia.

## Fase 11 - Arte E Assets Visuais

Objetivo: sair de placeholders ruins para uma direcao visual consistente.

### Task 11.1 - Definir Direcao Visual Inicial

- [ ] Escolher pixel art, cartoon vetorial ou outro estilo.
- [ ] Definir paleta inicial.
- [ ] Definir tamanho de tile.
- [ ] Definir tamanho final aproximado do personagem.
- [ ] Registrar no `IDEIA.md`.

Pronto quando:

- Assets novos seguem uma direcao comum.

### Task 11.2 - Tileset Placeholder Coerente

- [ ] Criar bloco solido.
- [ ] Criar plataforma.
- [ ] Criar perigo visual.
- [ ] Criar fundo simples.
- [ ] Registrar origem/licenca.

Pronto quando:

- Mapas ficam legiveis sem arte final.

### Task 11.3 - Arte Do Personagem

- [ ] Melhorar sprite idle.
- [ ] Melhorar corrida.
- [ ] Melhorar pulo.
- [ ] Melhorar queda.
- [ ] Melhorar morte.
- [ ] Melhorar respawn.

Pronto quando:

- O personagem e reconhecivel e legivel em movimento.

### Task 11.4 - Arte De Traps E Itens

- [ ] Espinhos.
- [ ] Bloco falso.
- [ ] Plataforma que cai.
- [ ] Projetil.
- [ ] Checkpoint.
- [ ] Saida de fase.
- [ ] Coletavel opcional.

Pronto quando:

- Objetos importantes sao reconheciveis antes e depois da ativacao.

## Fase 12 - Testes, QA E Qualidade

Objetivo: garantir que o MVP funcione no navegador e seja jogavel.

### Task 12.1 - Testes Unitarios

- [ ] Testar validacao de fase.
- [ ] Testar input mapper, se isolavel.
- [ ] Testar calculos de coyote time/jump buffer, se isolaveis.
- [ ] Testar estado de checkpoint.
- [ ] Testar contador de mortes.

Pronto quando:

- `npm run test` passa.

### Task 12.2 - Smoke Tests Playwright

- [ ] Abrir jogo.
- [ ] Iniciar partida.
- [ ] Confirmar canvas visivel.
- [ ] Confirmar personagem existe.
- [ ] Simular movimento basico.
- [ ] Confirmar ausência de erro critico no console.

Pronto quando:

- `npm run test:e2e` passa.

### Task 12.3 - Checklist Manual De Gameplay

- [ ] Testar Fase 1 do inicio ao fim.
- [ ] Testar Fase 2 do inicio ao fim.
- [ ] Testar Fase 3 do inicio ao fim.
- [ ] Testar morte por cada tipo de perigo.
- [ ] Testar respawn em cada checkpoint.
- [ ] Testar `R`.
- [ ] Testar pause.
- [ ] Testar mute.
- [ ] Testar build de producao.

Pronto quando:

- O primeiro build cumpre os criterios definidos no `IDEIA.md`.

### Task 12.4 - Performance E Estabilidade

- [ ] Verificar FPS em desktop.
- [ ] Verificar que nao ha vazamento obvio ao morrer muitas vezes.
- [ ] Verificar que projeteis e traps sao limpos no reset.
- [ ] Verificar que audio nao acumula sobreposto.

Pronto quando:

- O jogo suporta muitas tentativas sem degradar perceptivelmente.

## Fase 13 - Documentacao De Uso E Primeiro Build

Objetivo: deixar qualquer IA ou pessoa capaz de rodar, testar e continuar.

### Task 13.1 - README Do Projeto

- [ ] Descrever o jogo.
- [ ] Documentar stack.
- [ ] Documentar instalacao.
- [ ] Documentar `npm run dev`.
- [ ] Documentar `npm run build`.
- [ ] Documentar `npm run test`.
- [ ] Documentar `npm run test:e2e`.
- [ ] Documentar controles.

Pronto quando:

- Um novo agente consegue rodar o projeto lendo apenas `README.md`.

### Task 13.2 - Checklist De Release MVP

- [ ] Rodar lint.
- [ ] Rodar testes unitarios.
- [ ] Rodar smoke tests.
- [ ] Rodar build.
- [ ] Validar 3 fases manualmente.
- [ ] Atualizar `ROADMAP.md`.
- [ ] Atualizar `IDEIA.md` se algo mudou.

Pronto quando:

- O MVP pode ser apresentado como primeiro build jogavel.

## Fase 14 - Pos-MVP E Expansao

Objetivo: listar ideias futuras sem contaminar o escopo inicial.

### Task 14.1 - Expansao De Fases

- [ ] Avaliar novas fases depois das 3 iniciais.
- [ ] Decidir se expansao sera linear, hub ou mundos separados.
- [ ] Planejar novas mecânicas uma por vez.
- [ ] Evitar aumentar dificuldade sem ensinar antes.

### Task 14.2 - Gamepad

- [ ] Mapear controle.
- [ ] Testar input analogico/digital.
- [ ] Criar tela de remapeamento se necessario.

### Task 14.3 - Sistemas Avancados

- [ ] Replay fantasma.
- [ ] Medalhas locais.
- [ ] Melhor tempo local.
- [ ] Menor numero de mortes por fase.
- [ ] Segredos.
- [ ] Conquistas internas.
- [ ] Assist mode opcional.

### Task 14.4 - Ferramentas De Mapa

- [ ] Avaliar Tiled.
- [ ] Avaliar editor proprio simples.
- [ ] Criar conversor para formato de fase se necessario.

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

Observacao: Fase 3 e Fase 4 podem andar juntas, mas o movimento deve ser
validado com placeholder antes de gastar tempo em arte final.

## Definicao Global De Pronto Do MVP

O MVP estara pronto quando:

- [ ] `npm run dev` abre o jogo.
- [ ] `npm run build` funciona.
- [ ] `npm run test` passa.
- [ ] `npm run test:e2e` passa ou tem bloqueio documentado.
- [ ] Nao ha erro critico no console.
- [ ] Tela inicial aparece.
- [ ] Personagem aparece no mapa.
- [ ] Controles respondem.
- [ ] Personagem anda, pula e colide.
- [ ] As 3 fases iniciais existem.
- [ ] As 3 fases iniciais podem ser concluidas.
- [ ] Cada fase tem ponto A e ponto B.
- [ ] Cada fase tem pelo menos uma armadilha ou obstaculo.
- [ ] Morte funciona.
- [ ] Respawn rapido funciona.
- [ ] Checkpoint funciona.
- [ ] `R` reinicia do checkpoint.
- [ ] Contador de mortes funciona.
- [ ] Audio basico funciona ou pode ser mutado.
- [ ] `README.md` explica como rodar.
- [ ] `IDEIA.md` reflete as decisoes finais do MVP.

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
