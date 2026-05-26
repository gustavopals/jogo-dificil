# Plano Da Fase 16 - Rajada Ciano

## Objetivo

Adicionar um poder de energia original para o Pino, inspirado no arquétipo de
golpe shonen carregado, sem copiar nomes, poses, efeitos ou identidade visual de
obras existentes.

O poder deve aumentar profundidade de gameplay sem transformar o jogo em combate
livre. A função principal é abrir caminhos, ativar mecanismos e criar timing em
plataformas difíceis.

Nome provisório: `Rajada Ciano`.

## Tese De Gameplay

A `Rajada Ciano` é uma ferramenta de precisão, não uma arma universal.

- Curta o bastante para não resolver a fase inteira de longe.
- Forte o bastante para ativar alvos e quebrar obstáculos específicos.
- Limitada por carga, cooldown e máximo de um disparo ativo.
- Legível visualmente, com preparação clara e impacto curto.
- Resetável em morte, respawn e reinício manual.

## Controles

Manter o mapa atual de input:

- `J`/`Z`: dash, continua como ação principal.
- `K`/`X`: ação secundária contextual.

Proposta para a ação secundária:

- Toque curto perto de objeto interativo: interagir como hoje.
- Segurar `K`/`X` por uma janela mínima: carregar `Rajada Ciano`.
- Soltar após carga mínima: disparar na direção atual do Pino.
- Soltar cedo demais: cancelar com feedback curto, sem criar projétil.

Essa escolha evita adicionar uma tecla nova e mantém o poder como evolução da
ação secundária.

## Regras Iniciais Da Rajada

Valores iniciais para implementação e balanceamento:

- Carga mínima: 280 ms.
- Carga máxima visual: 650 ms.
- Cooldown após disparo: 700 ms.
- Velocidade do disparo: 360 px/s.
- Alcance máximo: 160 px.
- Hitbox do disparo: aproximadamente 14x6 px.
- Máximo de disparos ativos: 1.
- Direção: horizontal, usando a direção atual do Pino.
- Movimento durante carga: reduz velocidade horizontal, mas não cancela queda ou
  gravidade.
- Colisão: some ao tocar sólido, alvo válido ou limite de alcance.

## Alvos E Interações

Tipos de objeto planejados para a fase:

- `energy-switch`: alvo simples que abre porta, ativa ponte ou libera saída.
- `energy-cracked-block`: bloco quebrável apenas pela rajada.
- `energy-relay`: receptor que precisa ser atingido em sequência curta.
- `energy-absorber`: alvo falso que consome disparo sem benefício.

Fora do escopo inicial:

- Combate contra inimigos vivos.
- Dano variável.
- Mira diagonal ou livre.
- Várias cargas, upgrades permanentes ou árvore de habilidades.

## Arquitetura

Implementação recomendada:

- Criar lógica pura em `src/game/physics/energy-shot.ts`.
- Criar estado runtime de disparos/impactos em sistema separado, sem misturar
  diretamente com traps existentes.
- Estender tipos declarativos de fase para alvos de energia.
- Integrar input na `LevelScene`, preservando prioridade de interação perto de
  objetos.
- Reusar o reset de sala para limpar disparos e estados temporários.
- Adicionar feedback visual em sistema próprio para carga, disparo e impacto.

## Visual E Audio

Direção visual:

- Carga com aura ciano concentrando ao redor das mãos/faixa do Pino.
- Disparo como feixe curto, pixelado, com núcleo claro e borda ciano.
- Impacto com burst pequeno e partículas horizontais.
- Sem pose idêntica de mãos em concha; Pino deve usar postura própria, compacta
  e lateral.

Audio:

- Som de carga curto em loop/variação leve.
- Som de disparo seco e divertido.
- Som de impacto em alvo.
- Tudo respeitando mute global e mute de música.

## Bloco 3 De Fases

Usar a regra já definida para expansão: ensinar, distorcer, combinar.

### `level-07` - Faísca De Treino

Função: ensinar disparo de energia com alvo parado.

- Um `energy-switch` abre uma porta simples.
- Primeiro alvo fica visível e seguro.
- Um segundo alvo exige disparar após pulo pequeno ou reposicionamento.
- Sem armadilha nova junto do primeiro disparo.

### `level-08` - O Alvo Mente

Função: distorcer a confiança do jogador.

- Introduz `energy-absorber` como alvo falso.
- Um alvo correto fica depois de uma armadilha conhecida.
- A rajada pode ativar algo que ajuda, mas também pode acionar uma surpresa se
  usada sem leitura.

### `level-09` - Carga Em Movimento

Função: combinar dash, rajada e interação.

- O jogador precisa alternar dash e disparo.
- Um alvo de energia abre passagem temporária.
- Uma seção curta exige carregar enquanto posiciona o Pino sem perder leitura de
  queda.
- Fechamento com checkpoint justo antes da combinação final.

## Tasks Planejadas

### Task 16.1 - Definir Rajada Ciano

- Fechar nome, regras, custos e papel de gameplay.
- Documentar o que a rajada pode e não pode resolver.
- Definir conflito com ação secundária/interação.

### Task 16.2 - Sistema Base De Energia

- Criar estado puro de carga, disparo, cooldown e reset.
- Cobrir carga mínima, cancelamento, direção, cooldown e máximo de um disparo.
- Garantir que morte, respawn e `R` limpam carga/disparo.

### Task 16.3 - Projetil Do Jogador

- Renderizar disparo da `Rajada Ciano`.
- Mover projétil com alcance máximo.
- Colidir com sólidos e desaparecer corretamente.
- Não atravessar paredes nem criar múltiplos disparos ativos.

### Task 16.4 - Alvos De Energia

- Criar schema declarativo para alvos de energia.
- Implementar `energy-switch`, `energy-cracked-block` e `energy-absorber`.
- Integrar alvos ao reset de sala.
- Adicionar feedback visual de alvo carregado/ativado.

### Task 16.5 - Feedback Visual E Audio

- Criar animação/efeito de carga.
- Criar efeito de disparo e impacto.
- Adicionar sons originais de carga, disparo e impacto.
- Atualizar HUD apenas se o cooldown precisar ficar explícito.

### Task 16.6 - Criar Bloco 3 De Fases

- Criar `level-07`, `level-08` e `level-09`.
- Ensinar a rajada em ambiente seguro.
- Distorcer com alvo falso e trap conhecida.
- Combinar rajada, dash e interação em desafio curto.

### Task 16.7 - Testes E QA Da Rajada

- Testes unitários do estado de energia.
- Testes de colisão do projétil.
- Testes de schema/validação dos alvos.
- Testes de conteúdo do Bloco 3.
- Smoke Playwright cobrindo disparo e alvo ativado.
- Checklist manual do Bloco 3.

## Riscos

- A rajada trivializar gaps e traps.
- O input secundário ficar ambíguo perto de alavancas.
- O efeito visual esconder hazard pequeno.
- Disparo virar spam e reduzir tensão.
- Semelhança excessiva com referências famosas.

Mitigações:

- Alcance curto, cooldown e um disparo ativo.
- Prioridade clara: interação próxima vence toque curto; carga exige segurar.
- Efeitos pequenos, com alpha controlado e sem ocupar área crítica.
- Revisão visual explícita para manter identidade própria.

## Pronto Quando

- A `Rajada Ciano` funciona como poder original, testável e limitado.
- O jogador entende carga, disparo, cooldown e impacto sem tutorial textual
  longo.
- O poder interage com alvos declarativos e reseta corretamente.
- O Bloco 3 ensina, distorce e combina a mecânica em 3 fases curtas.
- Lint, testes, build e smoke passam.
