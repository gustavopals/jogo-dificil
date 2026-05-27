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

## Referências Visuais Locais

As imagens em `assets/boss/examples/` são referências de composição e silhueta,
não assets finais prontos.

- `boss-1.png` e `boss-1-examples.png`: base do `Hirolito Narguilito`, com
  corpo de narguilé, óculos escuros, fumaça, mangueira e cristais ciano.
- `boss-2-reference.jpeg` e `boss-2-examples.png`: base do `Dr. Imports`, com
  casaco escuro, óculos roxos, maleta, notebook, frascos e fumaça roxa.
- `boss-3-reference.png` e `boss-3-examples.png`: base do `Giga Fabio`, com
  corpo grande, postura de brute, preto/dourado, pancadas no chão e poses de
  queda.

Direção de uso:

- Usar as imagens como referência autorizada e caricatural.
- Evitar cópia fotográfica direta nos sprites finais.
- Padronizar tudo para pixel art com fundo transparente.
- Manter leitura de gameplay acima de fidelidade ao retrato.

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

- `Centelha Ciano`: causa 1 dano em bosses 1 e 2 durante janela vulnerável.
- `Rajada Ciano`: causa 1 dano em todos os bosses durante janela vulnerável.
- `Giga Fabio`: só toma dano real da `Rajada Ciano`; `Centelha Ciano` serve
  para cancelar projéteis fracos ou acender alvos de arena.
- Cada ataque da `Rajada Ciano` conta no máximo uma vez por boss.
- Boss em `stunned` ou invulnerável ignora dano extra.
- Energia de boss arena deve ter recarga suficiente para evitar softlock.

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
- Invulnerabilidade pós-hit: 600 ms.
- Patrulha: desliza entre dois pontos a 45 px/s.
- Windup: 550 ms.
- Recover vulnerável: 900 ms.

Ataques:

- `smoke-puff`: solta nuvem lenta horizontal. O jogador pula ou se posiciona.
- `hose-snap`: mangueira bate no chão com linha de tell antes. O jogador pula.

Condição de dano:

- Após `smoke-puff` ou `hose-snap`, o cristal no corpo acende.
- `Centelha Ciano` ou `Rajada Ciano` acertando o cristal causa 1 hit.

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

Pronto quando:

- A luta final parece maior, mas ainda usa regras simples e previsíveis.

## Layout De Assets

Arquivos finais sugeridos:

- `assets/sprites/bosses/hirolito-narguilito.png`
- `assets/sprites/bosses/dr-imports.png`
- `assets/sprites/bosses/giga-fabio.png`
- `assets/sprites/bosses/boss-projectiles.png`
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
type BossId = "hirolito-narguilito" | "dr-imports" | "giga-fabio";

type BossDefinition = {
  id: BossId;
  levelId: string;
  displayName: string;
  arena: RectLike;
  spawn: Vector2Like;
  health: number;
  weakPoint: RectLike;
  movement: BossMovementDefinition;
  attacks: readonly BossAttackDefinition[];
  defeatUnlocks: readonly string[];
};
```

## Tasks Planejadas

### Task 17.1 - Definir Trinca De Bosses

- Fechar distribuição em `level-03`, `level-06` e `level-10`.
- Registrar visual, papel e dificuldade de cada boss.
- Documentar uso das imagens em `assets/boss/examples/`.
- Atualizar `IDEIA.md`.

### Task 17.2 - Schema E Estado Compartilhado

- Criar `BossDefinition`.
- Validar arena, spawn, vida, weak point, ataques e desbloqueios.
- Criar estado puro com vida, estado, timers, direção e invulnerabilidade.
- Integrar reset por morte, respawn, `R` e troca de fase.

### Task 17.3 - Arena Lock E Fluxo De Boss

- Fechar porta ao entrar na arena.
- Bloquear saída enquanto boss estiver vivo.
- Abrir saída após derrota.
- Garantir checkpoint imediatamente antes.
- Impedir caminhada longa antes de repetir a luta.

### Task 17.4 - Ataques, Projéteis E Dano

- Criar projéteis de boss separados de traps.
- Implementar tells e recover.
- Integrar dano por `Centelha Ciano` e `Rajada Ciano`.
- Limitar múltiplos hits por ataque.
- Matar Pino por contato com projétil, corpo ou hitbox de ataque.

### Task 17.5 - Arte, Audio E HUD Base

- Criar sprites placeholder para os três bosses.
- Criar sprites de projéteis e impactos.
- Criar indicador de vida no corpo do boss.
- Criar sons base de windup, ataque, hit e derrota.
- Garantir contraste visual entre boss, energia do Pino e traps.

### Task 17.6 - Implementar Hirolito Narguilito

- Criar arena no fim de `level-03`.
- Implementar `smoke-puff` e `hose-snap`.
- Implementar weak point de cristal.
- Balancear vida 2 e recover generoso.
- Criar checklist manual do boss 1.

### Task 17.7 - Implementar Dr. Imports

- Criar arena no fim de `level-06`.
- Implementar `import-bottle`, `paper-wall` e `smoke-swap`.
- Implementar movimento por três âncoras.
- Balancear vida 3 e máximo de 2 projéteis.
- Criar checklist manual do boss 2.

### Task 17.8 - Implementar Giga Fabio

- Criar `level-10` como fase final.
- Implementar `floor-slam`, `boulder-toss` e `shoulder-charge`.
- Exigir `Rajada Ciano` para dano real.
- Adicionar recarga de energia na arena.
- Criar checklist manual do boss final.

### Task 17.9 - Integrar Progressão Das 10 Fases

- Encadear `level-03 -> level-04` após Hirolito.
- Encadear `level-06 -> level-07` após Dr. Imports.
- Encadear `level-09 -> level-10` para final.
- Garantir que resultados locais por fase registram mortes em boss.
- Garantir que QA consegue iniciar diretamente cada boss.

### Task 17.10 - Testes E QA Dos Bosses

- Testes unitários de estado compartilhado.
- Testes unitários de ataques e projéteis.
- Testes de validação de schema.
- Testes de conteúdo para `level-03`, `level-06` e `level-10`.
- Smoke Playwright abrindo cada arena.
- Checklist manual para hit, morte, respawn, reset e vitória.
- Rodar lint, testes, build e smoke.

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
