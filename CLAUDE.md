# CLAUDE.md

## Projeto

Este repositório contém um jogo de navegador 2D de plataforma, difícil, preciso e cheio de armadilhas inesperadas. A referência principal de sensação é Trap Adventure 2: mortes rápidas, humor cruel, aprendizado por tentativa e erro e fases que surpreendem o jogador.

O projeto deve ter identidade própria. Não copiar personagens, nomes, mapas, músicas, sprites, efeitos sonoros, UI, layout de fases ou assets de Trap Adventure 2. Use a referência para entender ritmo, dificuldade e intenção, mas crie uma obra original.

## Objetivo de Qualidade

Construir uma aplicação de primeiro nível, não um protótipo descartável. O jogo deve ser planejado em camadas: personagens, controles, animações, mapas, armadilhas, música, efeitos, progressão, UX, performance, testes e pipeline de assets.

Todo desenvolvimento deve favorecer:

- Código simples, legível e modular.
- Pequenas entregas funcionais.
- Decisões documentadas.
- Assets e dados organizados.
- Comportamento previsível e testável.
- Performance estável no navegador.
- Experiência de jogo difícil, mas aprendível.

## Direção Técnica

A stack deve ser escolhida com cuidado antes da primeira implementação grande. Para um jogo 2D de navegador, a direção preferida é:

- TypeScript.
- Vite para desenvolvimento e build.
- Phaser 3 para cenas, sprites, tilemaps, física, áudio e input.
- Vitest para testes de lógica pura.
- Playwright para smoke tests no navegador.
- ESLint e Prettier para padrão de código.

Se a stack mudar, atualizar este arquivo e registrar o motivo em `IDEIA.md`.

## Estrutura Esperada

Quando o projeto sair do estado inicial, preferir uma estrutura próxima desta:

```text
src/
  main.ts
  game/
    config.ts
    scenes/
    systems/
    entities/
    traps/
    input/
    physics/
    ui/
  data/
    levels/
    characters/
    audio/
  shared/
assets/
  sprites/
  tilesets/
  maps/
  audio/
  fonts/
tests/
docs/
```

Regras:

- `src/game/scenes`: fluxo do jogo, carregamento, menus, fase, game over.
- `src/game/entities`: jogador, inimigos, objetos interativos.
- `src/game/systems`: sistemas reutilizáveis, como câmera, checkpoints, colisões especiais e triggers.
- `src/game/traps`: comportamento de armadilhas, separado da cena sempre que possível.
- `src/data`: configuração declarativa de fases, personagens, animações e áudio.
- `assets`: arquivos finais usados pelo jogo.
- `docs`: decisões técnicas e design mais detalhado, se necessário.

## Princípios de Gameplay

O jogo deve ser difícil, mas não aleatório. Uma morte pode ser inesperada na primeira vez, mas precisa parecer compreensível depois.

Princípios:

- Restart rápido.
- Controles responsivos.
- Checkpoints pensados para reduzir frustração inútil.
- Traps com lógica consistente.
- Humor e surpresa, sem depender de bugs.
- Fases curtas ou bem segmentadas.
- Falhas visíveis: o jogador deve entender por que morreu.
- Progressão de ideias: cada fase ensina algo que será distorcido depois.

Evitar:

- Hitboxes injustas demais.
- Armadilhas sem leitura possível por muito tempo.
- Longas caminhadas antes de tentar de novo.
- Física inconsistente.
- Dependência de timing impossível em telas comuns.
- Softlocks.

## Práticas de Código

- Usar TypeScript em modo estrito.
- Evitar `any`; quando inevitável, justificar em comentário curto.
- Separar lógica pura de integração com engine.
- Preferir dados declarativos para fases, traps e animações.
- Evitar números mágicos; nomear constantes de gameplay.
- Não misturar lógica de UI, física, áudio e estado em uma única classe grande.
- Cada sistema deve ter uma responsabilidade clara.
- Funções devem ser pequenas o suficiente para serem lidas sem contexto excessivo.
- Código morto, logs temporários e hacks devem ser removidos antes de finalizar uma tarefa.
- Comentários devem explicar intenção ou regra de jogo, não repetir o código.

## Padrões de Assets

Todos os assets devem ser originais, gerados para o projeto ou usados com licença compatível.

Naming:

- Usar nomes em kebab-case.
- Separar arquivos por domínio: `player-idle.png`, `trap-spike-pop.wav`, `tileset-factory.png`.
- Evitar nomes vagos como `new.png`, `sprite2.png` ou `sound-final-final.wav`.

Sprites e animações:

- Documentar dimensões base do personagem.
- Manter pivôs e hitboxes consistentes.
- Separar hitbox de sprite visual quando necessário.
- Registrar animações em dados, não espalhadas por cenas.

Áudio:

- Música e efeitos devem ter volume controlável.
- O jogo deve funcionar mutado.
- Evitar áudio sem interação inicial quando o navegador bloquear autoplay.

## Mapas e Fases

Fases devem ser tratadas como conteúdo, não como código improvisado.

Preferir:

- Tilemaps exportados de uma ferramenta como Tiled, quando a stack estiver definida.
- Camadas claras: terreno, colisão, decoração, traps, spawn, checkpoints, saída.
- IDs ou nomes estáveis para triggers.
- Pequenos testes manuais para cada fase nova.

Cada fase deve ter:

- Objetivo.
- Ideia central.
- Novas armadilhas ou variações.
- Checkpoints.
- Condição de vitória.
- Lista de riscos conhecidos.

## Workflow de Desenvolvimento

Antes de editar:

- Verificar `git status`.
- Ler arquivos próximos da mudança.
- Preservar alterações que não foram feitas por você.

Ao implementar:

- Fazer mudanças pequenas e coesas.
- Atualizar `IDEIA.md` quando uma decisão de design for tomada.
- Atualizar este arquivo quando uma regra de engenharia mudar.
- Não transformar uma tarefa pequena em refatoração ampla sem motivo.

Antes de concluir:

- Rodar lint, testes e build quando existirem.
- Para mudanças visuais ou de jogo, abrir no navegador e validar tela, input e canvas.
- Verificar se não há assets quebrados, textos sobrepostos ou erro no console.
- Resumir o que mudou e o que ainda falta.

## Critérios de Pronto

Uma tarefa só está pronta quando:

- O comportamento pedido está implementado.
- O código segue os padrões do projeto.
- O jogo ainda inicia.
- O resultado foi verificado localmente quando possível.
- Documentação relevante foi atualizada.
- Não há arquivos temporários ou outputs acidentais versionados.

## Registro de Ideias

Todas as ideias de design, personagens, mapas, ações, músicas, sistemas, armadilhas e progressão devem ser registradas em `IDEIA.md`.

Regra prática:

- `CLAUDE.md` define como trabalhar.
- `IDEIA.md` define o que estamos criando.

## Conteúdo Migrado de AGENTS.md

# AGENTS.md

## Projeto

Este repositório contém um jogo de navegador 2D de plataforma: difícil,
preciso, rápido de reiniciar e baseado em surpresa, tentativa e erro e
aprendizado.

A referência de sensação é Trap Adventure 2, mas o jogo deve ter identidade
própria. Não copiar personagens, nomes, mapas, músicas, sprites, efeitos
sonoros, UI, layout de fases ou assets dessa referência.

## Fontes de Verdade

- `IDEIA.md`: visão, backlog, perguntas abertas e decisões de design.
- `CLAUDE.md`: regras detalhadas de engenharia, gameplay, assets e workflow.
- `README.md`: visão pública do projeto quando for expandido.

Ao tomar uma decisão de design, registre em `IDEIA.md`. Ao mudar uma regra de
engenharia ou workflow, atualize este arquivo e `CLAUDE.md` se a regra também
valer para outros agentes.

## Direção Técnica Preferida

Antes da primeira implementação grande, preferir:

- TypeScript.
- Vite.
- Phaser 3.
- Vitest para lógica pura.
- Playwright para smoke tests no navegador.
- ESLint e Prettier.

Se a stack mudar, registre o motivo em `IDEIA.md`.

## Estrutura Esperada

Quando o projeto for scaffoldado, preferir algo próximo de:

```text
src/
  main.ts
  game/
    config.ts
    scenes/
    systems/
    entities/
    traps/
    input/
    physics/
    ui/
  data/
    levels/
    characters/
    audio/
  shared/
assets/
  sprites/
  tilesets/
  maps/
  audio/
  fonts/
tests/
docs/
```

## Princípios de Implementação

- Código simples, legível e modular.
- TypeScript em modo estrito quando a stack existir.
- Separar lógica pura de integração com engine.
- Preferir dados declarativos para fases, traps, animações e áudio.
- Evitar `any`; se inevitável, justificar com comentário curto.
- Evitar números mágicos; nomear constantes de gameplay.
- Não misturar UI, física, áudio, input e estado em uma classe grande.
- Remover logs temporários, código morto e hacks antes de finalizar tarefas.

## Princípios de Gameplay

- Difícil, mas aprendível.
- Restart imediato.
- Controles responsivos e previsíveis.
- Armadilhas surpreendentes, mas compreensíveis depois da morte.
- Checkpoints pensados para reduzir frustração inútil.
- Fases planejadas como conteúdo, não improvisadas no código.
- Evitar softlocks, hitboxes injustas demais e longas caminhadas antes de
  tentar de novo.

## Assets

- Todos os assets devem ser originais, gerados para o projeto ou usados com
  licença compatível.
- Usar nomes em kebab-case.
- Separar assets por domínio: sprites, tilesets, mapas, áudio e fontes.
- Manter pivôs, dimensões e hitboxes consistentes.
- O jogo deve funcionar mutado e ter controle de volume.

## Workflow

Antes de editar:

- Verificar `git status`.
- Ler arquivos próximos da mudança.
- Preservar alterações de usuário e não reverter mudanças não relacionadas.

Durante a implementação:

- Fazer mudanças pequenas e coesas.
- Atualizar documentação relevante junto com decisões novas.
- Não transformar tarefas pequenas em refatorações amplas sem necessidade.

Antes de concluir:

- Rodar lint, testes e build quando existirem.
- Para mudanças visuais ou de jogo, validar no navegador.
- Conferir console, input, canvas, assets e textos sobrepostos.
- Resumir o que mudou e qualquer verificação que não foi possível executar.

## Estado Atual

O repositório ainda está em fase inicial de planejamento. Não há scaffold,
`package.json`, comandos de build/teste ou código de jogo neste momento.

