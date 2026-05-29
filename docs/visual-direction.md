# Direcao Visual Inicial

## Estilo

O MVP usa pixel art de baixa resolucao, com leitura forte em 1x. A energia
visual e de laboratorio hostil: fundos escuros, blocos industriais, sinais de
perigo saturados e poucos detalhes por sprite.

## Escala

- Resolucao base historica: 480x270, tile 16x16px (origem do projeto).
- Escala HD atual (Fase 18): 960x540, tile `32x32px` (`TILE_SIZE_PX`), fator
  espacial 2x. Pino ~56x104px, hitbox 36x80px.
- A fisica acompanha a escala em unidades de tile (Task 18.8); a arte de
  ambiente e efeitos foi redesenhada em pixel art nativa de 32px (Task 18.9).
- Regra pratica: assets importantes precisam funcionar antes de qualquer escala
  de janela.

## Paleta

| Papel       | Cor       | Uso                                   |
| ----------- | --------- | ------------------------------------- |
| void        | `#111217` | Fundo e espaco negativo.              |
| panel       | `#242630` | HUD, overlays e estruturas distantes. |
| metal       | `#3f4958` | Blocos solidos e plataformas.         |
| text        | `#f5f7fb` | Texto e pequenos brilhos.             |
| shadow      | `#050608` | Contorno e separacao dura.            |
| safe        | `#80d7c2` | Checkpoints, UI e bordas interativas. |
| hero        | `#f4d35e` | Cabelo/energia do Pino, itens e foco. |
| hazard      | `#e35d6a` | Espinhos, dano e morte imediata.      |
| exit        | `#e76f51` | Saidas, truques e falsa seguranca.    |
| specialTrap | `#9b5de5` | Projeteis e mecanismos incomuns.      |

## Regras

- Desenhar silhueta em 1x antes de adicionar detalhe.
- Usar cores por significado, nao como decoracao.
- Manter perigos e objetivos mais claros que o fundo.
- Preferir contorno duro de 1px, areas chapadas e poucos tons.
- Evitar texturas que confundam plataforma, hazard, item ou saida.

## Tileset HD

O tileset coerente fica em `assets/tilesets/` e usa tiles `32x32px` (HD):

- `lab-solid-block.png`: massa solida com bisel e rebites, tileavel em grade.
- `lab-platform.png`: plataforma metalica com borda ciano de leitura de ledge.
- `lab-hazard-spikes.png`: perigo de espinhos vermelhos sobre base escura.
- `lab-background-panel.png`: painel escuro repetivel, mais escuro que gameplay.

Todos sao gerados por `scripts/generate-environment-sprites.mjs`
(`npm run assets:environment`), usam licenca original do projeto e estao
registrados em `assets/ASSETS.md`. A geracao desenha pixel art nativa pela
paleta semantica, sem upscale.

## Camadas De Profundidade (Depth) E Leitura HD

`DEPTH_LAYERS` em `src/game/systems/visual-readability.ts` e a fonte unica da
ordem de desenho de todos os elementos. Da mais ao fundo para mais a frente:
fundo, terreno, corpo de trap, alvos de energia, aura do jogador, itens e
marcadores, rastro do jogador, corpo de boss/burst, jogador, efeitos de
energia, vida de boss, hazards diretos e, por fim, projeteis.

Regras de leitura que essa ordem garante:

- Hazards e projeteis ficam ACIMA do jogador: ameacas nunca somem atras do
  personagem.
- Efeitos de energia ficam ABAIXO dos hazards e, combinados ao teto de alpha
  (`clampWideEffectAlpha`), nao escondem perigos pequenos. Em HD, "hazard
  pequeno" e qualquer ameaca com lado <= 1 tile (`smallHazardMaxSizePx = 32`).
- O fundo permanece mais escuro que objetos de gameplay para preservar
  contraste; cores semanticas mantem distancia minima entre papeis primarios
  (`minPrimaryColorDistance`).

## Sprite Do Pino

Pino agora usa sprite 14x26px e pivô no centro inferior. A hitbox continua
10x22px; os pixels extras ficam para cabelo, aura e deformações de animação sem
mudar colisão. A revisão visual evita a leitura de cápsula amarela e move o
personagem para um lutador shonen original de laboratório, sem copiar
personagens existentes.

- `idle`: lutador compacto com cabelo espetado, roupa azul e aura baixa.
- `run`: tres frames com inclinacao, troca de apoio, faixa em atraso e energia
  no calcanhar.
- `jump`: dois frames, com joelho alto, cabelo vertical e aura ciano.
- `fall`: braços abertos e cabelo puxado para cima para leitura de queda.
- `dash`: pose horizontal dedicada com rastro de aura.
- `death`: dois frames vermelhos, comprimidos, usando a cor de hazard.
- `respawn`: dois frames ciano/hero, com varredura e reconstrucao do corpo.

Além dos sprites, `LevelScene` adiciona aura, ghost de dash, faíscas de corrida
e bursts de pulo/aterrissagem. Esses efeitos são puramente visuais e não entram
na hitbox.

## Traps, Itens E Marcadores

Os objetos de gameplay do MVP agora usam sprites dedicados:

- Espinhos e `spike-pop`: `trap-spikes.png`, vermelho de hazard.
- Bloco falso: `trap-false-block.png`, metal escuro com pista roxa discreta.
- Plataforma que cai: `trap-falling-platform.png`, metal com borda ciano.
- Piso quebravel: `trap-breakable-floor.png`, metal com rachaduras vermelhas.
- Projetil: `trap-projectile.png`, losango roxo 16x16px (HD).
- Itens: chip obrigatorio amarelo, chave coral e token opcional ciano/amarelo.
- Checkpoint: versoes inativa e ativa para feedback imediato.
- Saida de fase: coluna coral repetivel dentro da area de saida.

Os sprites sao renderizados sobre as areas declarativas existentes. Colisao,
hitboxes, triggers e reset de sala continuam definidos pelos dados de fase.
