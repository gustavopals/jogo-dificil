# Plano Da Fase 17 - Trinca De Chefões

## Objetivo

Redesenhar a fase 17 para criar três chefões simples, memoráveis e viáveis de
implementar dentro da campanha de 10 fases:

- `Hirolito Narguilito`
- `Dr. Imports`
- `Giga Fabio`, o boss final

A proposta usa um sistema de chefões reaproveitável, com regras simples,
arenas curtas, tells claros, poucas ações por boss e reset determinístico.

## Distribuição Nas 10 Fases

Os chefões fecham blocos de aprendizado, sem criar fases extras além das 10.

| Fase       | Função                                     | Boss                |
| ---------- | ------------------------------------------ | ------------------- |
| `level-01` | Ensinar controle, leitura e primeira morte | Nenhum              |
| `level-02` | Distorcer confiança inicial                | Nenhum              |
| `level-03` | Fechar Bloco 1 com arena curta             | Hirolito Narguilito |
| `level-04` | Abrir Bloco 2 com dash/traps               | Nenhum              |
| `level-05` | Distorcer dash e interação                 | Nenhum              |
| `level-06` | Fechar Bloco 2 com arena de projéteis      | Dr. Imports         |
| `level-07` | Ensinar energia do Pino                    | Nenhum              |
| `level-08` | Distorcer energia com alvo falso           | Nenhum              |
| `level-09` | Combinar dash, energia e leitura           | Nenhum              |
| `level-10` | Fechar campanha com luta final             | Giga Fabio          |

Regra de progressão:

- Boss 1 testa leitura básica, pulo e primeiro uso ofensivo simples.
- Boss 2 testa dash, posicionamento e projéteis.
- Boss 3 testa o kit completo: pulo, dash, `Centelha Ciano`, `Carga Ciano` e
  `Rajada Ciano`.

Decisão de distribuição fechada na Task 17.1:

- `Hirolito Narguilito` fica definitivamente no fim de `level-03`, fechando o
  Bloco 1. Ele deve ser a primeira leitura de arena: checkpoint próximo, chão
  simples, ataque único por vez e janela vulnerável clara antes da transição
  para `level-04`.
- `Dr. Imports` fica definitivamente no fim de `level-06`, fechando o Bloco 2.
  Ele deve testar o que o jogador aprendeu em dash, posicionamento, projéteis e
  interação antes de liberar o Bloco 3 de energia em `level-07`.
- `Giga Fabio` fica definitivamente em `level-10`, como fase dedicada de
  encerramento. Ele não deve ser comprimido em `level-09`, porque precisa testar
  o kit completo de energia depois que `level-07`, `level-08` e `level-09` já
  ensinaram e combinaram `Centelha Ciano`, `Carga Ciano` e `Rajada Ciano`.
- Esta decisão não altera o encadeamento dos dados nesta subtask. A integração
  de progressão fica reservada para a Task 17.9, quando as arenas já existirem.

## Visual, Papel E Dificuldade Fechados

Este registro fecha a intenção de cada boss antes de implementar schema, IA ou
arena. A prioridade é leitura de gameplay; qualquer asset futuro deve obedecer a
estes papéis.

| Boss                  | Visual de leitura                                                                                                                                                        | Papel na campanha                                                                                                                                       | Dificuldade alvo                                                                                                                                                     |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Hirolito Narguilito` | Corpo baixo de narguilé, óculos escuros, cristal ciano central, fumaça clara e mangueira como ameaça lateral. Silhueta compacta e cômica, sem ocupar demais a arena.     | Primeiro chefe e fechamento do Bloco 1. Ensina arena, tell, ataque, recover vulnerável e vida visível com punição baixa.                                | Baixa-média: 2 hits, chão simples, uma plataforma baixa, windup generoso e recover longo. O jogador pode morrer aprendendo a regra, mas a repetição deve ser curta.  |
| `Dr. Imports`         | Figura média de casaco escuro, roxo como cor de perigo, óculos/props de importação, maleta ou frasco como weak point e fumaça roxa para troca de posição.                | Chefe intermediário e fechamento do Bloco 2. Cobra dash, reposicionamento, leitura de projéteis e ataque pela abertura certa.                           | Média: 3 hits, até 2 projéteis ativos, três âncoras de movimento e recover menor que o boss 1. A luta deve exigir deslocamento, não memorização longa.               |
| `Giga Fabio`          | Brute grande preto/dourado, punhos exagerados, núcleo no peito/cinto, impactos de chão e poeira curta. Silhueta dominante, mas com weak point e ataques sempre legíveis. | Boss final em `level-10`. Testa a campanha inteira: pulo, dash, `Centelha Ciano`, `Carga Ciano`, `Rajada Ciano`, espera de recover e gestão de energia. | Média-alta: 4 hits obrigatórios de `Rajada Ciano`, recarga dentro da arena, windups claros e ataques fortes porém isolados. Deve parecer final sem virar luta longa. |

Regras de dificuldade:

- Nenhum boss do MVP usa padrões aleatórios ou dois ataques simultâneos.
- A dificuldade cresce por composição de leitura, não por vida alta.
- Cada boss deve ter checkpoint imediatamente antes da arena.
- A primeira repetição após morte deve levar poucos segundos até a próxima
  tentativa real.
- Visual grande nunca pode esconder Pino, hazards, projéteis ou a leitura da
  energia ciano.

## Referências Visuais Locais

As imagens em `assets/boss/examples/` são referências de composição e silhueta,
não assets finais prontos.

| Arquivo                                      | Boss                  | Uso permitido                                                                                              | Não usar como                                                    |
| -------------------------------------------- | --------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `assets/boss/examples/boss-1.png`            | `Hirolito Narguilito` | Referência principal de composição vertical, corpo de narguilé, óculos, fumaça, mangueira e cristal ciano. | Sprite final, retrato literal ou textura importada para runtime. |
| `assets/boss/examples/boss-1-examples.png`   | `Hirolito Narguilito` | Variações para escolher silhueta compacta, leitura do cristal e poses de mangueira.                        | Sheet final ou base para copiar traço/quadro diretamente.        |
| `assets/boss/examples/boss-2-reference.jpeg` | `Dr. Imports`         | Referência principal de pessoa/tema, casaco escuro, óculos, pose e leitura de "importações".               | Retrato direto, asset distribuível final ou textura do jogo.     |
| `assets/boss/examples/boss-2-examples.png`   | `Dr. Imports`         | Variações para props como maleta, notebook, frascos, fumaça roxa e poses de ataque.                        | Sprite final ou colagem em pixel art.                            |
| `assets/boss/examples/boss-3-reference.png`  | `Giga Fabio`          | Referência de proporção compacta, postura grande e leitura de brute final.                                 | Sprite final, retrato literal ou base sem redesenho.             |
| `assets/boss/examples/boss-3-examples.png`   | `Giga Fabio`          | Variações para preto/dourado, punhos grandes, pancadas no chão e poses de queda.                           | Sheet final ou cópia de silhueta sem adaptação.                  |

Direção de uso fechada na Task 17.1:

- As imagens são material de referência local para design, não assets finais do
  jogo.
- Os sprites finais devem ser redesenhados como pixel art original com fundo
  transparente, dimensões planejadas e hitboxes separadas.
- É permitido aproveitar tema, paleta geral, props, proporção e intenção de
  caricatura.
- É proibido copiar rosto, fotografia, traço, pose exata ou colar partes das
  imagens nos sprites finais.
- A leitura de gameplay vem antes da fidelidade ao retrato: weak point, tell,
  projétil, hitbox e estado vulnerável precisam ser mais claros que qualquer
  semelhança visual.
- A pasta `assets/boss/examples/` não deve ser importada por `src/game/assets.ts`
  nem entrar no runtime; os arquivos finais devem ficar em `assets/sprites/`
  ou subpasta de sprites de boss definida na Task 17.5.
- Ao criar sprites finais, registrar cada novo arquivo em `assets/ASSETS.md` e
  manter estes exemplos descritos como referência local.

## Sistema Base De Boss

Todos os chefões devem usar o mesmo sistema base.

Estados:

- `inactive`: boss ainda não começou.
- `intro`: entrada curta, sem controle longo ou cutscene demorada.
- `patrol`: movimento simples na arena.
- `windup`: tell visual antes do ataque.
- `attack`: cria hitbox/projétil/choque.
- `recover`: janela vulnerável.
- `stunned`: feedback após tomar dano.
- `defeated`: abre saída, toca feedback e remove perigo.

Regras compartilhadas:

- Uma arena por boss.
- Checkpoint imediatamente antes da arena.
- Porta de entrada fecha ao começar a luta.
- Saída fica bloqueada até a derrota.
- Boss, projéteis, timers e portas resetam no respawn e no `R`.
- Um ataque ativo por vez no MVP.
- Vida visível no corpo do boss, sem poluir o HUD.
- Derrota exige tocar a saída depois da luta, não transição automática.

## Dano E Energia

Para simplificar a implementação, todos os bosses usam uma regra de dano
compatível com o sistema de energia planejado na fase 16.

- Boss só perde vida quando o weak point declarado estiver aceso e o estado
  atual aceitar dano, normalmente em `recover`.
- `Centelha Ciano`: causa 1 dano em bosses 1 e 2 durante janela vulnerável.
  Cada projétil causa no máximo 1 hit e some ao acertar weak point, sólido,
  escudo ou limite de alcance.
- `Rajada Ciano`: causa 1 dano em qualquer boss durante janela vulnerável. Mesmo
  sendo o ataque forte, ela remove apenas 1 ponto de vida para manter as lutas
  curtas, previsíveis e fáceis de balancear.
- `Giga Fabio`: só toma dano real da `Rajada Ciano`; `Centelha Ciano` serve
  para cancelar projéteis fracos, acender alvos de arena ou dar feedback de
  bloqueio, sem remover vida.
- Cada ataque da `Rajada Ciano` conta no máximo uma vez por boss, usando o mesmo
  conceito de `hitGroupId` já definido para impedir múltiplos hits no mesmo
  alvo pela mesma rajada.
- Boss em `intro`, `patrol`, `windup`, `attack`, `stunned`, `defeated` ou com
  invulnerabilidade pós-hit ativa ignora dano extra.
- Ataque sem janela válida gera feedback de impacto/bloqueio, mas nunca reduz
  vida. O jogador deve entender que errou o timing, não que o jogo falhou.
- Energia de boss arena deve ter recarga suficiente para evitar softlock.

Tabela fechada de dano:

| Boss                  | Vida | `Centelha Ciano`                                       | `Rajada Ciano`                                            | Janela válida                                     |
| --------------------- | ---- | ------------------------------------------------------ | --------------------------------------------------------- | ------------------------------------------------- |
| `Hirolito Narguilito` | 2    | 1 dano no cristal aceso.                               | 1 dano no cristal aceso.                                  | `recover` após `smoke-puff` ou `hose-snap`.       |
| `Dr. Imports`         | 3    | 1 dano no weak point se houver linha limpa de ataque.  | 1 dano no weak point se houver linha limpa de ataque.     | `recover` após ataque ou troca por `smoke-swap`.  |
| `Giga Fabio`          | 4    | 0 dano; cancela projétil fraco ou ativa alvo de arena. | 1 dano no núcleo aceso, uma vez por `Rajada Ciano` ativa. | `recover` após `floor-slam` ou `shoulder-charge`. |

Regra para schema futuro:

- Cada `BossDefinition` deve declarar `health`, `weakPoint`, `damageRules` e
  `vulnerabilityWindows`.
- `damageRules` deve listar poderes aceitos, dano por poder, se weak point é
  obrigatório, feedback de bloqueio e se o hit consome projétil/rajada.
- O sistema de dano deve ser puro e determinístico: dado estado do boss, ataque
  de energia e colisão, retorna vida nova, feedback e flags de consumo sem ler
  renderização.

Se a energia ainda não tiver sido ensinada quando o boss 1 entrar em
`level-03`, a arena do `Hirolito Narguilito` deve ter um pedestal simples de
energia e uma primeira troca extremamente segura. O tutorial profundo continua
no Bloco 3.

## Boss 1 - Hirolito Narguilito

Papel: primeiro chefe, curto e cômico.

Fase: `level-03`, sala final após checkpoint.

Visual:

- Cabeça pequena com óculos escuros sobre corpo de narguilé.
- Cristal ciano no corpo como ponto fraco.
- Mangueira animada como ameaça lateral.
- Fumaça clara para tell e projéteis.

Tamanho planejado:

- Sprite sheet final: célula de 64x64 px.
- Sprite visual em jogo: cerca de 48x56 px.
- Hitbox principal: cerca de 34x42 px.
- Weak point: cristal central de 14x14 px.

Arena:

- Largura: 20 tiles.
- Altura útil: 10 tiles.
- Chão reto, sem buracos.
- Uma plataforma baixa no meio para o jogador pular a fumaça.
- Checkpoint a 4-6 tiles da porta da arena.

Vida e valores:

- Vida: 2 hits.
- Invulnerabilidade pós-hit: 650 ms.
- Patrulha: desliza entre dois pontos a 28 px/s.
- Windup: 550 ms.
- Recover vulnerável: 1200 ms.
- Cooldown após ataque: 1500 ms.

Ataques:

- `smoke-puff`: solta nuvem lenta horizontal. O jogador pula ou se posiciona.
- `hose-snap`: mangueira bate no chão com linha de tell antes. O jogador pula.

Condição de dano:

- Após `smoke-puff` ou `hose-snap`, o cristal no corpo acende.
- `Centelha Ciano` ou `Rajada Ciano` acertando o cristal durante `recover`
  causa 1 hit.
- Fora do `recover`, o cristal apaga ou rebate o ataque sem reduzir vida.

Pronto quando:

- O jogador entende que chefes têm tell, ataque, janela vulnerável e vida.

## Boss 2 - Dr. Imports

Papel: chefe intermediário, testa dash e leitura de projéteis.

Fase: `level-06`, sala final após checkpoint.

Visual:

- Casaco escuro, roxo como cor principal de ataque.
- Óculos roxos, maleta, notebook ou frasco como props.
- Fumaça roxa para teleporte/entrada.
- Símbolos de importação/documentos como partículas.

Tamanho planejado:

- Sprite sheet final: célula de 64x64 px.
- Sprite visual em jogo: cerca de 42x58 px.
- Hitbox principal: cerca de 28x48 px.
- Weak point: peito/maleta/frasco, 18x24 px.

Arena:

- Largura: 22 tiles.
- Altura útil: 11 tiles.
- Chão reto com duas plataformas laterais baixas.
- Espaço central limpo para dash.
- Sem hazards permanentes no primeiro MVP.

Vida e valores:

- Vida: 3 hits.
- Invulnerabilidade pós-hit: 650 ms.
- Movimento: troca entre três âncoras.
- Windup: 500 ms.
- Recover vulnerável: 800 ms.
- Máximo de projéteis ativos: 2.

Ataques:

- `import-bottle`: arremessa frasco roxo em linha baixa. Some ao bater em sólido.
- `paper-wall`: cria três papéis/selos roxos que bloqueiam tiros por pouco
  tempo e deixam uma abertura.
- `smoke-swap`: teleporte curto para outra âncora depois de tomar dano.

Condição de dano:

- Durante `recover`, o frasco ou maleta brilha.
- `Centelha Ciano` ou `Rajada Ciano` causa 1 hit se passar pela abertura do
  `paper-wall`.
- `paper-wall` bloqueia dano quando fecha a linha limpa de ataque; destruir ou
  contornar o bloqueio faz parte do teste de posicionamento.

Pronto quando:

- O jogador precisa se reposicionar com dash antes de atacar, sem decorar uma
  sequência longa.

## Boss 3 - Giga Fabio

Papel: boss final simples, pesado e mais dramático.

Fase: `level-10`, fase dedicada de encerramento.

Visual:

- Brute grande, tronco largo, preto/dourado.
- Punhos grandes e silhueta dominante.
- Impactos no chão, poeira e aura curta em ataques fortes.
- O ponto fraco deve ficar no peito/cinto, não na cabeça.

Tamanho planejado:

- Sprite sheet final: célula de 96x80 px.
- Sprite visual em jogo: cerca de 64x72 px.
- Hitbox principal: cerca de 46x62 px.
- Weak point: núcleo no peito/cinto, 22x20 px.

Arena:

- Largura: 26 tiles.
- Altura útil: 12 tiles.
- Chão principal largo.
- Duas plataformas baixas para escapar de choque no chão.
- Dois pontos de recarga de energia, um em cada lado.
- Saída final trancada atrás do boss.

Vida e valores:

- Vida: 4 hits de `Rajada Ciano`.
- Invulnerabilidade pós-hit: 750 ms.
- Velocidade andando: 38 px/s.
- Windup ataque leve: 550 ms.
- Windup ataque forte: 800 ms.
- Recover vulnerável: 950 ms.

Fases internas simples:

- Vida 4-3: usa `floor-slam` e `boulder-toss`.
- Vida 2-1: adiciona `shoulder-charge`, mas mantém um ataque por vez.

Ataques:

- `floor-slam`: bate no chão e cria onda horizontal baixa. O jogador pula.
- `boulder-toss`: joga projétil grande e lento. Pode ser destruído por
  `Centelha Ciano`.
- `shoulder-charge`: marca uma linha, corre até a parede e fica vulnerável no
  fim.

Condição de dano:

- Apenas `Rajada Ciano` causa dano real.
- O jogador precisa carregar energia em um dos lados, esperar o recover e soltar
  a rajada no ponto fraco.
- `Centelha Ciano` não reduz vida do `Giga Fabio`; ela só cancela
  `boulder-toss` fraco, ativa alvo de arena ou mostra feedback de bloqueio.
- A mesma `Rajada Ciano` não pode aplicar mais de 1 hit no `Giga Fabio`, mesmo
  se o feixe continuar sobre o núcleo.

Pronto quando:

- A luta final parece maior, mas ainda usa regras simples e previsíveis.

## Layout De Assets

Arquivos finais sugeridos:

- `assets/sprites/bosses/hirolito-narguilito.png`
- `assets/sprites/bosses/dr-imports.png`
- `assets/sprites/bosses/giga-fabio.png`
- `assets/sprites/bosses/boss-projectile-smoke-puff.png`
- `assets/sprites/bosses/boss-projectile-import-bottle.png`
- `assets/sprites/bosses/boss-projectile-boulder.png`
- `assets/sprites/bosses/boss-impact-burst.png`
- `assets/audio/boss/hirolito-*.wav`
- `assets/audio/boss/dr-imports-*.wav`
- `assets/audio/boss/giga-fabio-*.wav`

Animações mínimas por boss:

- `idle`: 2 frames.
- `move`: 2-3 frames.
- `windup`: 2-3 frames.
- `attack`: 2-3 frames.
- `hit`: 2 frames.
- `defeated`: 3-4 frames.

Audio mínimo por boss:

- Entrada curta.
- Windup.
- Ataque.
- Hit recebido.
- Derrota.

## Arquitetura

Implementação recomendada:

- Criar tipos em `src/shared/levels.ts` para `BossDefinition`.
- Criar validação em `src/data/levels/validation.ts`.
- Criar lógica pura em `src/game/physics/boss-state.ts`.
- Criar lógica pura de ataques/projéteis em `src/game/physics/boss-attacks.ts`.
- Criar render/runtime em `src/game/systems/level-bosses.ts`.
- Integrar arena lock ao `room-state`.
- Integrar dano recebido com `player-energy-system`.
- Expor ferramentas de QA para iniciar boss, matar boss, ler vida e resetar
  arena.

Schema conceitual:

```ts
type BossDefinition = {
  id: BossId;
  levelId: string;
  displayName: string;
  arena: RectLike;
  spawn: Vector2Like;
  initialFacing: FacingDirection;
  health: number;
  hitbox: RectLike;
  weakPoint: RectLike;
  resetOnRespawn: boolean;
  movement: BossMovementDefinition;
  attacks: readonly BossAttackDefinition[];
  damageRules: readonly BossDamageRuleDefinition[];
  vulnerabilityWindows: readonly BossVulnerabilityWindowDefinition[];
  entryCheckpointId: CheckpointId;
  entryDoorId?: InteractiveObjectId;
  defeatUnlocks: readonly InteractiveObjectId[];
  assetId?: LevelAssetId;
};
```

Implementação inicial fechada na Task 17.2:

- `BossDefinition` e seus subtipos declarativos foram criados em
  `src/shared/levels.ts`.
- `LevelDefinition` agora aceita `bosses?: readonly BossDefinition[]`, mantendo
  as fases existentes compatíveis enquanto as arenas ainda não foram criadas.
- O schema cobre identidade, fase, nome exibido, arena, spawn, direção inicial,
  vida, hitbox, weak point, reset, movimento, ataques, regras de dano, janelas
  de vulnerabilidade, checkpoint de entrada, porta de entrada, desbloqueios por
  derrota e sprite opcional.
- Os tipos são reexportados por `src/shared/index.ts` e
  `src/data/levels/schema.ts`.
- O contrato declarativo está coberto em `tests/level-schema.test.ts`.
- A validação declarativa de boss foi integrada em
  `src/data/levels/validation.ts`. O validador aceita `bosses` opcional, inclui
  boss no controle de ids duplicados, valida `levelId`, arena dentro dos bounds,
  spawn dentro da arena, vida positiva, hitbox/weak point dentro da arena,
  movimento, ataques, projéteis, regras de dano, janelas vulneráveis,
  checkpoint de entrada, desbloqueios por derrota e `assetId` em
  `assets.sprites`.
- Erros de regra usam `invalid-boss`; referências ausentes continuam usando
  `missing-reference`, e assets ausentes continuam usando `missing-asset`.
- O runtime puro de boss foi criado em `src/game/physics/boss-state.ts`, sem
  ainda integrar ao `room-state`. Ele guarda `id`, vida total, vida restante,
  estado atual, posição, direção, timers de estado/cooldown/invulnerabilidade,
  ataque ativo, janela vulnerável ativa e regra de reset por respawn.
- O runtime já possui helpers puros para criar estado inicial, trocar estado com
  timers, avançar timers, aplicar dano com invulnerabilidade, entrar em
  `stunned`/`defeated` e resetar a partir da definição declarativa.
- `RoomRuntimeState` agora possui `bosses`, inicializado a partir de
  `LevelDefinition.bosses`. `resetRoomStateForRespawn` também reseta bosses,
  limpando vida, estado, timers, ataque ativo, janela vulnerável e
  invulnerabilidade quando `resetOnRespawn` é `true`.
- A integração cobre respawn automático e reinício manual com `R`, porque ambos
  passam por `LevelScene.resetRoomTransientState`, que chama
  `resetRoomStateForRespawn`. Bosses com `resetOnRespawn: false` preservam o
  estado atual, seguindo o mesmo padrão de objetos persistentes da sala.
- O primeiro corte de arena lock foi implementado com `entryDoorId` opcional em
  `BossDefinition`. Ao detectar o jogador dentro da arena de um boss `inactive`,
  `LevelScene.updateBossArenaLocks` chama `lockEnteredBossArenas`, troca o boss
  para `intro` e fecha a porta de entrada marcando o objeto interativo da porta
  como inativo/solido.
- `entryDoorId` é validado em `src/data/levels/validation.ts`: se declarado,
  precisa apontar para um `interactiveObject` existente do tipo `door`.
- A saída da fase agora consulta `isLevelExitBlockedByLivingBosses` antes de
  completar. Se qualquer boss declarado ainda existir no `RoomRuntimeState` e
  não estiver `defeated` com vida zerada, tocar a saída não completa a fase.
  Isso também impede contornar um boss que ainda está `inactive`.
- A saída física da arena abre após a derrota: `defeatUnlocks` lista os objetos
  liberados pelo boss, `unlockDefeatedBossObjects` ativa esses objetos quando o
  boss fica `defeated` ou sem vida, e `LevelScene.updateBossDefeatUnlocks`
  recalcula colisões e marcadores para remover portas/travas da sala.
- O checkpoint antes da arena virou contrato de dados: cada boss declara
  `entryCheckpointId`. O validador exige que o checkpoint exista, esteja antes
  da entrada horizontal da arena, tenha overlap vertical com a arena e fique no
  máximo a 8 tiles da borda esquerda da arena.
- A repetição da luta não depende do jogador tocar perfeitamente o marcador:
  quando a arena começa, `LevelScene.updateBossArenaLocks` ativa
  automaticamente o `entryCheckpointId` do boss se ele ainda não for o
  checkpoint atual. Depois de morte, respawn automático ou `R`, o jogador volta
  direto para a entrada da arena.
- A Task 17.4 começou com projéteis de boss separados dos projéteis de trap:
  `RoomRuntimeState` possui `bossProjectiles`, resetado junto com a sala, e
  `src/game/physics/boss-projectiles.ts` cuida de criação a partir do ataque,
  limite `maxActive`, movimento, hitbox e remoção por alcance/bounds.
- O ciclo básico de ataque também foi implementado: `boss-attacks.ts` avança
  boss de `patrol` para `windup`, expõe `tellArea`, entra em `attack`, expõe
  hitbox ativa, abre `recover` com janela vulnerável/cooldown e volta para
  `patrol`. `LevelScene` chama `updateBossAttackRuntime` para avançar esse
  ciclo e criar projéteis de boss quando o ataque começa.
- Dano de energia já passa pelo runtime de boss: `applyBossEnergyHit` lê
  `damageRules`, exige estado válido e weak point quando configurado, respeita
  invulnerabilidade, aplica stun/derrota e deixa `LevelScene` mapear
  `boss-hurtbox` ou `hitGroupId` para o boss correto.
- Múltiplos hits por ataque agora são limitados no runtime de boss:
  `BossRuntimeState.damageHitLockKeys` guarda os ataques de energia já aceitos e
  regras com `oncePerAttack` exigem `sourceAttackId` para bloquear repetição do
  mesmo disparo sem impedir uma nova `Rajada Ciano`.
- Contato letal de boss entrou no fluxo normal de morte: projéteis de boss usam
  causa `projectile`, enquanto corpo e hitbox ativa de ataque usam causa `boss`.
  Boss `inactive` ou `defeated` não mata por contato.

## Tasks Planejadas

### Task 17.1 - Definir Trinca De Bosses

- Fechar distribuição em `level-03`, `level-06` e `level-10`. Fechado:
  `Hirolito Narguilito` em `level-03`, `Dr. Imports` em `level-06` e
  `Giga Fabio` em `level-10`. O encadeamento `level-09 -> level-10` foi fechado
  depois, na abertura da Task 17.8.
- Registrar visual, papel e dificuldade de cada boss. Fechado na seção
  "Visual, Papel E Dificuldade Fechados".
- Documentar uso das imagens em `assets/boss/examples/`. Fechado na seção
  "Referências Visuais Locais", com uso permitido e limites por arquivo.
- Definir regra de dano por `Centelha Ciano` e `Rajada Ciano`. Fechado na seção
  "Dano E Energia", com tabela por boss, janela válida, feedback de bloqueio e
  regra para schema futuro.
- Atualizar `IDEIA.md`.

### Task 17.2 - Schema E Estado Compartilhado

- Criar `BossDefinition`. Fechado em `src/shared/levels.ts`, com
  `LevelDefinition.bosses` opcional e teste de schema.
- Validar arena, spawn, vida, weak point, ataques e desbloqueios. Fechado em
  `src/data/levels/validation.ts`, com testes positivos e negativos em
  `tests/level-validation.test.ts`.
- Criar estado puro com vida, estado, timers, direção e invulnerabilidade.
  Fechado em `src/game/physics/boss-state.ts`, com testes em
  `tests/boss-state.test.ts`.
- Integrar reset por morte, respawn, `R` e troca de fase. Fechado em
  `src/game/systems/room-state.ts`: bosses entram no estado de sala e no reset
  compartilhado usado por respawn automático e reinício manual.
- Cobrir estado inicial e reset com testes. Fechado em
  `tests/boss-state.test.ts` e `tests/room-state.test.ts`.

### Task 17.3 - Arena Lock E Fluxo De Boss

- Fechar porta ao entrar na arena. Fechado com `entryDoorId`,
  `src/game/systems/level-bosses.ts` e chamada em `LevelScene` após o movimento
  do jogador.
- Bloquear saída enquanto boss estiver vivo. Fechado com
  `isLevelExitBlockedByLivingBosses` em `src/game/systems/level-bosses.ts` e
  checagem em `LevelScene.updateLevelProgress`.
- Abrir saída após derrota. Fechado com `defeatUnlocks`,
  `unlockDefeatedBossObjects` e atualização de sólidos/marcadores pela
  `LevelScene`.
- Garantir checkpoint imediatamente antes. Fechado com `entryCheckpointId`
  obrigatório em `BossDefinition` e validação geométrica em
  `src/data/levels/validation.ts`.
- Impedir caminhada longa antes de repetir a luta. Fechado com ativação
  automática do `entryCheckpointId` ao iniciar a arena em `LevelScene`.

### Task 17.4 - Ataques, Projéteis E Dano

- Criar projéteis de boss separados de traps. Fechado com `bossProjectiles` em
  `RoomRuntimeState`, helpers de sala e lógica pura em
  `src/game/physics/boss-projectiles.ts`.
- Implementar tells e recover. Fechado com ciclo `windup -> attack -> recover`
  em `src/game/physics/boss-attacks.ts` e integração em `LevelScene`.
- Integrar dano por `Centelha Ciano` e `Rajada Ciano`. Fechado com
  `applyBossEnergyHit` em `level-bosses.ts` e conexão dos impactos de
  `Centelha Ciano`/`Rajada Ciano` em `LevelScene`.
- Limitar múltiplos hits por ataque. Fechado com `damageHitLockKeys` no estado
  de boss e `sourceAttackId` passado pela `LevelScene`.
- Matar Pino por contato com projétil, corpo ou hitbox de ataque. Fechado com
  `findTouchedBossThreat` e integração em `LevelScene.updatePlayerDeath`.
- Remover projéteis ao bater em sólido, sair da arena ou resetar a sala.
  Fechado com colisão contra `solids`, limite por arena do boss e limpeza de
  `bossProjectiles` no reset compartilhado de sala.

### Task 17.5 - Arte, Audio E HUD Base

- Criar sprites placeholder para os três bosses. Fechado com PNGs originais em
  `assets/sprites/bosses/`, registro em `GAMEPLAY_SPRITE_ASSETS` e preload via
  `IMAGE_ASSETS`.
- Criar sprites de projéteis e impactos. Fechado com placeholders originais de
  fumaça roxa, garrafa/importação, pedra pesada e impacto coral/amarelo em
  `assets/sprites/bosses/`.
- Criar indicador de vida no corpo do boss. Fechado com pips pequenos ancorados
  no hitbox do boss, visíveis durante luta ativa e sem ocupar HUD fixo.
- Criar sons base de entrada, windup, ataque, hit e derrota. Fechado com WAVs
  originais `boss-entry`, `boss-windup`, `boss-attack`, `boss-hit` e
  `boss-defeat`, conectados ao audio manager e aos eventos da luta.
- Garantir contraste visual entre boss, energia do Pino e traps. Fechado com
  paleta semântica em `visual-readability`: energia do Pino usa ciano/amarelo,
  traps usam roxo/vermelho e bosses usam coral/dourado escuro. Testes garantem
  distância mínima entre cores primárias e depths que mantêm hazards acima de
  efeitos/vida de boss.

### Task 17.6 - Implementar Hirolito Narguilito

- Criar arena no fim de `level-03`. Fechado com uma sala final de 20 tiles,
  chão reto, plataforma baixa central, checkpoint a 4 tiles da entrada,
  aproximação após o truque da saída e portas de entrada/saída já declaradas
  para o fluxo de boss.
- Implementar `smoke-puff` e `hose-snap`. Fechado em `level-03`: `smoke-puff`
  solta projétil lento de fumaça destrutível por `Centelha Ciano`, enquanto
  `hose-snap` usa tell/hitbox de chão com windup claro. O runtime alterna os
  ataques declarados em sequência determinística.
- Implementar weak point de cristal. Fechado com feedback visual no corpo do
  boss: cristal apagado fora da janela vulnerável, cristal ciano/amarelo aceso
  durante `recover` e colisão mantida pelo `boss-hurtbox` alinhado ao
  `weakPoint` declarativo.
- Balancear vida 2, patrulha lenta e recover generoso. Fechado com 2 de vida,
  patrulha em `28px/s`, `recover` de `1200ms` e cooldown de `1500ms`, criando
  uma janela confortável para o jogador acertar o cristal sem transformar a
  primeira luta em um teste longo.
- Criar checklist manual do boss 1. Fechado em
  `docs/boss-1-gameplay-checklist.md`, cobrindo entrada da arena, portas,
  ataques, cristal, dano, morte, respawn, reinício com `R`, pausa, mute e
  transição para `level-04`.

### Task 17.7 - Implementar Dr. Imports

- Criar arena no fim de `level-06`. Fechado com a terceira tela do `level-06`,
  arena de 22 tiles em `x=66 tiles`, duas plataformas laterais baixas, centro
  limpo para dash, checkpoint `level-06-before-dr-imports` com 80 de energia e
  portas de entrada/saída declaradas para o fluxo do boss.
- Implementar `import-bottle`, `paper-wall` e `smoke-swap`. Fechado em
  `level-06`: `import-bottle` arremessa frasco roxo destrutível por
  `Centelha Ciano`, `paper-wall` cria bloqueio temporário para energia durante
  o ataque e `smoke-swap` troca a posição do boss para a próxima âncora antes
  do `recover` vulnerável.
- Implementar movimento por três âncoras. Fechado no runtime de boss:
  `anchor-swap` percorre as três âncoras declaradas em sequência enquanto o
  boss está em `patrol`, usando `speedPxPerSecond`, atualizando `facing` e
  mantendo windup/ataque/recover parados para preservar leitura.
- Balancear vida 3 e máximo de 2 projéteis. Fechado com constantes declarativas
  em `level-06`: `Dr. Imports` tem 3 hits e apenas `import-bottle` cria
  projéteis, limitado a 2 ativos. A intenção é manter a luta intermediária
  focada em dash/reposicionamento, sem encher a arena.
- Criar checklist manual do boss 2. Fechado em
  `docs/boss-2-gameplay-checklist.md`, cobrindo entrada da arena, portas,
  movimento por tres ancoras, limite de frascos ativos, leitura de
  `paper-wall`, `smoke-swap`, dano por energia, morte, respawn, reset, pausa,
  mute e transicao para `level-07`.

### Task 17.8 - Implementar Giga Fabio

- Criar `level-10` como fase final. Fechado em `src/data/levels/level-10.ts`:
  `O Ultimo Nucleo` entra no registry como ordem/dificuldade 10, com
  checkpoint `level-10-before-giga-fabio`, arena final de 26 tiles, duas
  plataformas laterais, energia cheia inicial e assets placeholder do boss
  final.
- Implementar `floor-slam`, `boulder-toss` e `shoulder-charge`. Fechado em
  `level-10`: `floor-slam` usa tell/hitbox baixo de impacto no chao,
  `boulder-toss` cria projetil separado de boss com pedra de 24x24 px, limite
  de 1 ativo e destruição por energia, e `shoulder-charge` usa uma faixa
  horizontal telegrafada para cobrar pulo, dash ou plataforma lateral.
- Exigir `Rajada Ciano` para dano real. Fechado em `level-10`: o weak point do
  `Giga Fabio` aceita apenas `cyan-burst`, as regras de dano nao incluem
  `cyan-spark`, e o teste de runtime confirma que `Centelha Ciano` nao remove
  vida mesmo durante `recover`, enquanto `Rajada Ciano` remove 1 hit.
- Adicionar recarga de energia na arena. Fechado com duas plataformas laterais
  declaradas em `level-10`, `level-10-left-recharge-platform` e
  `level-10-right-recharge-platform`. Elas ficam dentro da arena, uma de cada
  lado do boss, e servem como pontos seguros para segurar `L`/`C` e recuperar
  energia entre janelas de `Rajada Ciano`.
- Criar checklist manual do boss final. Fechado em
  `docs/boss-3-gameplay-checklist.md`, cobrindo arena lock, recarga lateral,
  leitura de `floor-slam`, `boulder-toss` e `shoulder-charge`, dano apenas por
  `Rajada Ciano`, hit unico por especial, reset com `R`, pausa, mute e saida
  final da campanha.

### Task 17.9 - Integrar Progressão Das 10 Fases

- Encadear `level-03 -> level-04` após Hirolito. Fechado em `level-03`:
  `exit.nextLevelId` aponta para `level-04`, a saída continua bloqueada por
  boss vivo e a porta final `level-03-hirolito-exit-door` abre por
  `defeatUnlocks` após a derrota. Cobertura adicionada em
  `tests/level-03-content.test.ts`.
- Encadear `level-06 -> level-07` após Dr. Imports. Fechado em `level-06`:
  `exit.nextLevelId` aponta para `level-07`, a saída continua bloqueada por
  boss vivo e a porta final `level-06-dr-imports-exit-door` abre por
  `defeatUnlocks` após a derrota. Cobertura adicionada em
  `tests/block-2-content.test.ts`.
- Encadear `level-09 -> level-10` para final. Fechado junto com a criação de
  `level-10`, porque a nova fase só vira final jogável quando substitui a tela
  final anterior de `level-09`. Cobertura em `tests/block-3-content.test.ts` e
  `tests/level-10-content.test.ts` garante `level-09 -> level-10` e
  `level-10` como última fase sem `nextLevelId`.
- Garantir que resultados locais por fase registram mortes em boss. Fechado com
  `createLevelCompletionAttemptFromRunCounters` em
  `src/game/systems/level-results.ts`: a `LevelScene` grava o delta entre o
  contador global no início e no fim da fase, então mortes de boss registradas
  por `gameStateStore.registerDeath` entram no `deathCount` local. Cobertura em
  `tests/level-results.test.ts`.
- Garantir que QA consegue iniciar diretamente cada boss. Fechado em
  `src/game/systems/dev-qa-tools.ts`: a API dev expõe `bosses` e
  `startBoss(bossId)`, usando o `entryCheckpointId` do boss para iniciar a fase
  correta no checkpoint da arena. Cobertura em `tests/dev-qa-tools.test.ts` e
  documentação em `docs/dev-qa-tools.md`.

### Task 17.10 - Testes E QA Dos Bosses

- Testes unitários de estado compartilhado. Fechado em
  `tests/room-state.test.ts`, cobrindo múltiplos bosses no mesmo
  `RoomRuntimeState`, reset independente entre boss resetável e persistente, e
  isolamento entre projéteis de trap e `bossProjectiles`.
- Testes unitários de ataques e projéteis. Fechado em
  `tests/boss-attacks.test.ts` e `tests/boss-projectiles.test.ts`, cobrindo
  seletor de ataque, avanço por `intro`, `windup`, `attack`, `recover` e
  `stunned`, origem/default de projétil, limite por boss/ataque e remoção
  isolada de projéteis expirados.
- Testes de validação de schema. Fechado em `tests/level-validation.test.ts`,
  cobrindo coleções obrigatórias de boss, ids duplicados de ataques/janelas,
  `maxRangePx`, `isDestructibleBy`, regras de dano e `entryDoorId` ausente.
- Testes de conteúdo para `level-03`, `level-06` e `level-10`. Fechado em
  `tests/level-03-content.test.ts`, `tests/block-2-content.test.ts` e
  `tests/level-10-content.test.ts`, cobrindo ligações de boss, `boss-hurtbox`,
  portas, assets, alcance de projétil e fluxo de vitória do boss final.
- Smoke Playwright abrindo cada arena. Fechado em `e2e/game-smoke.e2e.ts`,
  usando `window.__JOGO_DIFICIL_QA__.bosses` e `startBoss(...)` para abrir
  Hirolito, Dr. Imports e Giga Fabio no checkpoint da arena, validar
  `boss-hurtbox`/portas e caminhar até a porta de entrada fechar.
- Checklist manual para hit, morte, respawn, reset e vitória. Fechado em
  `docs/bosses-qa-checklist.md`, com roteiro transversal para os cinco fluxos
  nos três bosses, incluindo pausa, mute e estabilidade.
- Rodar lint, testes, build e smoke. Fechado com `npm run lint`,
  `npm run test`, `npm run build` e
  `npm run test:e2e -- e2e/game-smoke.e2e.ts`: lint limpo, 63 arquivos de teste
  e 414 testes unitários passando, build gerado e smoke Playwright com 4
  cenários passando.

## Riscos

- Três bosses inflarem demais a implementação.
- Boss 1 introduzir energia antes da hora e confundir o jogador.
- Arena virar combate lento em um jogo de plataforma rápido.
- Sprites grandes cobrirem hazards, projéteis ou o Pino.
- Boss final exigir carga de energia longa demais após cada morte.

Mitigações:

- Um sistema compartilhado para todos os bosses.
- Um ataque ativo por vez.
- Vida baixa: 2, 3 e 4 hits.
- Checkpoint antes de cada arena.
- Recarga de energia dentro das arenas.
- Indicador de vida no corpo do boss, não no HUD principal.
- Cutscenes curtas ou inexistentes.

## Pronto Quando

- Os três bosses têm plano de gameplay, arena, arte, áudio e QA.
- A distribuição nas 10 fases está clara.
- O sistema base reaproveita estado, ataques, dano e reset.
- Cada luta é curta, aprendível e sem softlock.
- A fase 17 está pronta para virar implementação por tasks.
