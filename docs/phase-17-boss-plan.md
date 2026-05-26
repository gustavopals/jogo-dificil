# Plano Da Fase 17 - Boss Sentinela Prisma

## Objetivo

Adicionar o primeiro boss do jogo: um inimigo original que se move na arena,
atira projéteis contra o Pino e funciona como fechamento de bloco depois que o
jogador já aprendeu dash, interação e `Rajada Ciano`.

Nome provisório: `Sentinela Prisma`.

O boss deve ser difícil, mas justo: padrões curtos, leitura clara, checkpoint
antes da arena e mortes que ensinam o jogador a responder melhor na próxima
tentativa.

## Escopo

Esta fase não deve criar um sistema completo de inimigos comuns. O objetivo é
um boss MVP, específico e testável, com arquitetura preparada para reaproveitar
partes depois.

Inclui:

- Uma arena curta, provavelmente `level-10`.
- Um boss com vida simples.
- Movimento horizontal ou por pontos.
- Projéteis disparados contra o Pino.
- Dano no boss pela `Rajada Ciano`.
- Vitória ao derrotar o boss e alcançar a saída.

Fora do escopo inicial:

- IA complexa.
- Combate corpo a corpo.
- Múltiplos bosses.
- Loot, upgrades permanentes ou cutscenes longas.
- Inimigos comuns espalhados por fases antigas.

## Tese De Gameplay

O boss testa domínio, não reflexo impossível.

- Dash ajuda a reposicionar.
- `Rajada Ciano` é a forma principal de causar dano.
- Pular evita alguns disparos.
- Ler o tell do boss importa mais do que decorar frame exato.
- A arena tem espaço suficiente para reagir, mas não para ficar parado.

## Boss MVP

`Sentinela Prisma`:

- Núcleo mecânico flutuante/andante do laboratório.
- Movimento em trilho horizontal com mudanças de direção previsíveis.
- Para antes de atacar.
- Mostra tell visual de carga.
- Dispara projétil em linha reta ou levemente mirado.
- Fica vulnerável por uma janela curta após disparar ou ao carregar demais.

Valores iniciais:

- Vida: 3 acertos de `Rajada Ciano`.
- Invulnerabilidade após acerto: 500 ms.
- Velocidade de patrulha: 70 px/s.
- Tempo de tell antes do disparo: 450 ms.
- Cooldown entre ataques: 900 ms.
- Velocidade do projétil do boss: 150-190 px/s.
- Máximo de projéteis ativos do boss: 3.

## Arena

Proposta: `level-10` como fase curta de boss.

Estrutura:

- Spawn perto de checkpoint obrigatório.
- Corredor pequeno de entrada sem armadilha nova.
- Arena com chão segmentado, duas plataformas baixas e teto livre.
- Porta/saída bloqueada enquanto o boss estiver vivo.
- Saída abre após derrotar o boss.

Regras:

- Respawn sempre volta ao checkpoint antes da arena.
- Boss e projéteis resetam no respawn e no `R`.
- Boss não pode atirar durante a janela de respawn.
- Não deve haver caminhada longa antes de tentar novamente.

## Estados Do Boss

Estados planejados:

- `idle`: boss aguardando ativação.
- `patrol`: movimento lateral ou entre pontos.
- `windup`: tell de ataque.
- `shoot`: cria projétil.
- `recover`: janela curta pós-ataque.
- `stunned`: feedback depois de tomar hit.
- `defeated`: abre saída e remove ameaça.

Transições iniciais:

1. Pino entra na arena.
2. Boss sai de `idle` para `patrol`.
3. Após intervalo, entra em `windup`.
4. Dispara e vai para `recover`.
5. Volta para `patrol`.
6. Ao receber `Rajada Ciano`, entra em `stunned`.
7. Com vida 0, entra em `defeated`.

## Projéteis Do Boss

Características:

- Retângulo ou losango pequeno, com cor distinta da `Rajada Ciano`.
- Rastro curto, sem cobrir hazards ou plataformas.
- Colisão com Pino causa morte `projectile` com `sourceId` do boss/projétil.
- Colisão com sólido remove o projétil.
- Projéteis são limpos no reset da sala.

Padrões iniciais:

- Disparo horizontal quando Pino está no mesmo nível.
- Disparo levemente mirado quando Pino está em plataforma.
- Depois de 2 hits, boss pode alternar dois disparos com intervalo curto.

## Como O Jogador Causa Dano

Proposta inicial:

- A `Rajada Ciano` causa 1 dano no boss.
- Boss só aceita dano se não estiver em invulnerabilidade pós-hit.
- Opcional de balanceamento: dano só conta durante `windup`/`recover`, se ficar
  fácil demais acertar sempre.

Regra de leitura:

- O boss deve piscar/tremer ao tomar hit.
- Vida restante deve ser legível por 3 segmentos visuais no corpo ou no HUD.
- Derrota deve tocar som curto, soltar burst e abrir a saída.

## Tasks Planejadas

### Task 17.1 - Definir Boss MVP

- Fechar nome, visual, vida, arena e condição de vitória.
- Definir se boss entra em `level-10` ou no final de `level-09`.
- Registrar o que o boss testa: dash, pulo, Rajada Ciano e leitura de projétil.
- Documentar limites de dificuldade e reset.

### Task 17.2 - Schema E Estado De Boss

- Criar tipos declarativos para boss em fase.
- Criar runtime state com vida, estado, timers, direção e projéteis.
- Integrar reset de sala, morte e reinício manual.
- Validar boss no schema de fase.

### Task 17.3 - Movimento Do Boss

- Implementar patrulha horizontal ou movimento entre pontos.
- Bloquear boss dentro da arena.
- Criar transições `idle`, `patrol`, `windup`, `shoot`, `recover` e `stunned`.
- Cobrir movimento e transições com testes unitários.

### Task 17.4 - Ataques E Projéteis Do Boss

- Criar projéteis do boss separados dos projéteis de trap.
- Implementar tell antes do disparo.
- Implementar limite de projéteis ativos.
- Matar Pino por contato com projétil, usando causa `projectile`.
- Limpar projéteis no reset.

### Task 17.5 - Dano, Vida E Vitória

- Permitir dano por `Rajada Ciano`.
- Implementar invulnerabilidade pós-hit.
- Mostrar feedback de hit e derrota.
- Abrir saída ou desativar bloqueio da arena ao derrotar o boss.
- Definir se a fase termina automaticamente ou exige tocar a saída.

### Task 17.6 - Criar Arena Do Boss

- Criar `level-10` ou sala final equivalente.
- Adicionar checkpoint antes da arena.
- Declarar boss e bloqueio de saída.
- Balancear espaço, plataformas e tempo de reação.
- Criar checklist manual da arena.

### Task 17.7 - Arte, Audio E HUD Do Boss

- Criar sprite placeholder do `Sentinela Prisma`.
- Criar sprite/efeito de projétil do boss.
- Criar som de windup, disparo, hit e derrota.
- Avaliar indicador de vida no HUD ou no corpo do boss.
- Garantir que boss e projéteis se destacam de traps comuns.

### Task 17.8 - Testes E QA Do Boss

- Testes unitários de estado do boss.
- Testes de projétil do boss.
- Testes de dano por `Rajada Ciano`.
- Teste de conteúdo da arena.
- Smoke Playwright para entrar na arena e validar boss/projétil sem erro.
- Build, lint e checklist manual.

## Riscos

- Boss virar combate lento em um jogo de plataforma rápido.
- Projéteis injustos demais em arena pequena.
- `Rajada Ciano` trivializar o boss se acertar sem risco.
- HUD ficar poluído com vida, cooldown e mortes ao mesmo tempo.
- Boss introduzir estado demais dentro da `LevelScene`.

Mitigações:

- Boss curto, 3 hits, checkpoint imediatamente antes.
- Tells visuais claros e velocidades moderadas.
- Reset simples e determinístico.
- Sistemas puros para boss/projéteis, com `LevelScene` só integrando render e
  eventos.
- Vida preferencialmente no corpo do boss antes de adicionar HUD novo.

## Pronto Quando

- O boss se move, atira, causa morte justa e reseta corretamente.
- A `Rajada Ciano` consegue causar dano com feedback claro.
- A arena tem checkpoint, saída bloqueada e vitória após derrotar o boss.
- A dificuldade é curta, aprendível e sem softlock.
- Testes, lint, build, smoke e checklist manual passam.
