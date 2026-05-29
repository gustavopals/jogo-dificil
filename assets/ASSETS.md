# Registro de Assets

Este arquivo registra a origem, licenca e observacoes dos assets usados no
jogo.

## Regras

- Todos os assets devem ser originais, gerados para o projeto ou usados com
  licenca compativel.
- Nao usar sprites, mapas, musicas, sons, UI ou qualquer asset copiado de Trap
  Adventure 2 ou de outros jogos.
- Usar nomes em `kebab-case`.
- Sprites devem usar `.png`.
- Tilesets e sprites de cenario/gameplay HD (tile `32x32`) sao gerados por
  `scripts/generate-environment-sprites.mjs` (`npm run assets:environment`),
  desenhando pixel art nativa pela paleta semantica. Projeteis pequenos usam
  `16x16`. O campo `origin` no registro de dados marca arte procedural do
  projeto; o tile size acompanha `TILE_SIZE_PX` (Fase 18, Task 18.9).
- Spritesheets devem usar `.png` com celulas de `128x128`.
- Formatos oficiais de sheet para personagens e bosses:
  - `512x512` (grade 4x4, ate 16 frames);
  - `1024x1024` (grade 8x8, ate 64 frames).
- Novos personagens e bosses devem preferir spritesheet; PNG por frame legado
  permanece apenas em `assets/legacy/` para pipeline de geracao.
- Regra anti-duplicacao HD (Task 18.11 / 19.1): runtime oficial usa sheets HD;
  PNGs legados ficam em `assets/legacy/` e fora do bundle de producao
  (`src/game/legacy-character-image-assets.ts`).
- Export de sheets: PNG sem compressao lossy, dimensoes oficiais `512x512` ou
  `1024x1024`, celulas `128x128`, pixel art sem antialias.
- Audio final deve usar `.ogg`; placeholders gerados localmente podem usar
  `.wav` ate a etapa de mixagem/exportacao final.
- Assets temporarios ficam em `assets/temp/`.
- Assets finais ficam nas pastas de dominio correspondentes.

## Pastas

- `assets/sprites/`: armadilhas, itens, projeteis de boss e objetos visuais
  de gameplay em runtime.
- `assets/legacy/`: PNGs legados arquivados (frames de Pino e corpos de boss
  pre-HD); usados por scripts de geracao, nao pelo bundle de producao.
- `assets/spritesheets/`: sheets de personagem, boss e efeitos grandes.
- `assets/tilesets/`: tiles de cenario.
- `assets/audio/music/`: musicas.
- `assets/audio/sfx/`: efeitos sonoros.
- `assets/fonts/`: fontes.
- `assets/boss/examples/`: imagens locais de referencia para desenho dos
  chefes; nao entram no runtime e nao sao sprites finais.
- `assets/temp/`: prototipos e assets temporarios.

## Registro

| Arquivo                                                   | Origem                         | Licenca             | Observacoes                                                      |
| --------------------------------------------------------- | ------------------------------ | ------------------- | ---------------------------------------------------------------- |
| `assets/legacy/pino/player-pino-idle.png`                 | Gerado no projeto por script   | Original do projeto | Frame legado 14x26px de idle; fonte para sheet HD.               |
| `assets/legacy/pino/player-pino-run-01.png`               | Gerado no projeto por script   | Original do projeto | Frame legado 1 de corrida do Pino.                              |
| `assets/legacy/pino/player-pino-run-02.png`               | Gerado no projeto por script   | Original do projeto | Frame legado 2 de corrida do Pino.                              |
| `assets/legacy/pino/player-pino-run-03.png`               | Gerado no projeto por script   | Original do projeto | Frame legado 3 de corrida do Pino.                              |
| `assets/legacy/pino/player-pino-jump.png`                 | Gerado no projeto por script   | Original do projeto | Pose legada de pulo do Pino.                                     |
| `assets/legacy/pino/player-pino-jump-peak.png`            | Gerado no projeto por script   | Original do projeto | Frame legado de apice do pulo do Pino.                           |
| `assets/legacy/pino/player-pino-fall.png`                 | Gerado no projeto por script   | Original do projeto | Pose legada de queda do Pino.                                    |
| `assets/legacy/pino/player-pino-dash.png`                 | Gerado no projeto por script   | Original do projeto | Pose legada de dash do Pino.                                     |
| `assets/legacy/pino/player-pino-charge-01.png`            | Gerado no projeto por script   | Original do projeto | Frame legado 1 da Carga Ciano.                                   |
| `assets/legacy/pino/player-pino-charge-02.png`            | Gerado no projeto por script   | Original do projeto | Frame legado 2 da Carga Ciano.                                   |
| `assets/legacy/pino/player-pino-cyan-spark-01.png`        | Gerado no projeto por script   | Original do projeto | Frame legado 1 da Centelha Ciano.                                |
| `assets/legacy/pino/player-pino-cyan-spark-02.png`        | Gerado no projeto por script   | Original do projeto | Frame legado 2 da Centelha Ciano.                                |
| `assets/legacy/pino/player-pino-cyan-burst-prepare-01.png`| Gerado no projeto por script   | Original do projeto | Frame legado 1 da preparacao da Rajada Ciano.                    |
| `assets/legacy/pino/player-pino-cyan-burst-prepare-02.png`| Gerado no projeto por script   | Original do projeto | Frame legado 2 da preparacao da Rajada Ciano.                    |
| `assets/legacy/pino/player-pino-cyan-burst-fire-01.png`   | Gerado no projeto por script   | Original do projeto | Frame legado 1 da soltura da Rajada Ciano.                       |
| `assets/legacy/pino/player-pino-cyan-burst-fire-02.png`   | Gerado no projeto por script   | Original do projeto | Frame legado 2 da soltura da Rajada Ciano.                       |
| `assets/legacy/pino/player-pino-death-01.png`             | Gerado no projeto por script   | Original do projeto | Frame legado 1 de morte do Pino.                                 |
| `assets/legacy/pino/player-pino-death-02.png`             | Gerado no projeto por script   | Original do projeto | Frame legado 2 de morte do Pino.                                 |
| `assets/legacy/pino/player-pino-respawn-01.png`           | Gerado no projeto por script   | Original do projeto | Frame legado 1 de respawn do Pino.                               |
| `assets/legacy/pino/player-pino-respawn-02.png`           | Gerado no projeto por script   | Original do projeto | Frame legado 2 de respawn do Pino.                               |
| `assets/legacy/bosses/hirolito-narguilito.png`            | Gerado no projeto com `magick` | Original do projeto | Placeholder legado do Hirolito; substituido por sheet HD.        |
| `assets/legacy/bosses/dr-imports.png`                     | Gerado no projeto com `magick` | Original do projeto | Placeholder legado do Dr. Imports; substituido por sheet HD.     |
| `assets/legacy/bosses/giga-fabio.png`                     | Gerado no projeto com `magick` | Original do projeto | Placeholder legado do Giga Fabio; substituido por sheet HD.      |
| `assets/sprites/trap-spikes.png`                          | Gerado no projeto por script   | Original do projeto | Sprite 32x32px HD de espinhos e spike-pop, contorno duro.        |
| `assets/sprites/trap-false-block.png`                     | Gerado no projeto por script   | Original do projeto | Sprite 32x32px HD de bloco falso com indício roxo sutil.         |
| `assets/sprites/trap-falling-platform.png`                | Gerado no projeto por script   | Original do projeto | Sprite 32x32px HD de plataforma instável com alerta inferior.    |
| `assets/sprites/trap-breakable-floor.png`                 | Gerado no projeto por script   | Original do projeto | Sprite 32x32px HD de piso quebrável com rachaduras vermelhas.    |
| `assets/sprites/trap-projectile.png`                      | Gerado no projeto por script   | Original do projeto | Sprite 16x16px HD de projétil roxo em losango.                   |
| `assets/sprites/energy-cyan-spark-projectile.png`         | Gerado no projeto por script   | Original do projeto | Sprite 16x16px HD do projétil da Centelha Ciano.                 |
| `assets/sprites/energy-cyan-burst-beam.png`               | Gerado no projeto por script   | Original do projeto | Segmento 32x32px HD tileável do feixe da Rajada Ciano.           |
| `assets/sprites/energy-impact.png`                        | Gerado no projeto por script   | Original do projeto | Impacto ciano 32x32px HD para acertos em alvos.                  |
| `assets/sprites/energy-target-active.png`                 | Gerado no projeto por script   | Original do projeto | Alvo ativo 32x32px HD com aro ciano e núcleo amarelo.            |
| `assets/sprites/energy-cracked-block-broken.png`          | Gerado no projeto por script   | Original do projeto | Bloco rachado quebrado 32x32px HD com fendas claras.             |
| `assets/sprites/item-required-chip.png`                   | Gerado no projeto por script   | Original do projeto | Sprite 32x32px HD de chip obrigatório amarelo com núcleo ciano.  |
| `assets/sprites/item-mechanism-key.png`                   | Gerado no projeto por script   | Original do projeto | Sprite 32x32px HD de chave de mecanismo coral.                   |
| `assets/sprites/item-optional-token.png`                  | Gerado no projeto por script   | Original do projeto | Sprite 32x32px HD de coletável opcional em losango.              |
| `assets/sprites/marker-checkpoint-inactive.png`           | Gerado no projeto por script   | Original do projeto | Sprite 32x32px HD de checkpoint inativo (faixa amarela).         |
| `assets/sprites/marker-checkpoint-active.png`             | Gerado no projeto por script   | Original do projeto | Sprite 32x32px HD de checkpoint ativo (poste ciano com brilho).  |
| `assets/sprites/marker-exit.png`                          | Gerado no projeto por script   | Original do projeto | Sprite 32x32px HD de saída de fase coral com painel claro.       |
| `assets/spritesheets/player-pino-core-512.png`            | Gerado no projeto por script   | Original do projeto | Sheet 512x512 (128x128 por celula) do Pino para movimento base. |
| `assets/spritesheets/player-pino-energy-512.png`          | Gerado no projeto por script   | Original do projeto | Sheet 512x512 (128x128 por celula) do Pino para Energia Ciano.  |
| `assets/spritesheets/boss-hirolito-sheet-512.png`         | Gerado no projeto por script   | Original do projeto | Sheet 512x512 (128x128 por célula) do Hirolito para estados de combate. |
| `assets/spritesheets/boss-dr-imports-sheet-512.png`       | Gerado no projeto por script   | Original do projeto | Sheet 512x512 (128x128 por célula) do Dr. Imports para estados de combate. |
| `assets/spritesheets/boss-giga-fabio-sheet-512.png`       | Gerado no projeto por script   | Original do projeto | Sheet 512x512 (128x128 por célula) do Giga Fabio para estados de combate. |
| `assets/sprites/bosses/boss-projectile-smoke-puff.png`    | Gerado no projeto com `magick` | Original do projeto | Sprite 16x16px de projétil de fumaça roxa de boss.               |
| `assets/sprites/bosses/boss-projectile-import-bottle.png` | Gerado no projeto com `magick` | Original do projeto | Sprite 16x16px de garrafa/projétil do Dr. Imports.               |
| `assets/sprites/bosses/boss-projectile-boulder.png`       | Gerado no projeto com `magick` | Original do projeto | Sprite 24x24px de pedra pesada do Giga Fabio.                    |
| `assets/sprites/bosses/boss-impact-burst.png`             | Gerado no projeto com `magick` | Original do projeto | Sprite 24x24px de impacto coral e amarelo para bosses.           |
| `assets/tilesets/lab-solid-block.png`                     | Gerado no projeto por script   | Original do projeto | Tile 32x32px HD de bloco solido industrial (bisel e rebites).    |
| `assets/tilesets/lab-platform.png`                        | Gerado no projeto por script   | Original do projeto | Tile 32x32px HD de plataforma metalica com borda ciano de ledge. |
| `assets/tilesets/lab-hazard-spikes.png`                   | Gerado no projeto por script   | Original do projeto | Tile 32x32px HD de perigo de espinhos vermelhos com base escura. |
| `assets/tilesets/lab-background-panel.png`                | Gerado no projeto por script   | Original do projeto | Tile 32x32px HD de painel escuro repetivel, mais escuro que gameplay. |
| `assets/audio/sfx/player-jump.wav`                        | Gerado no projeto por script   | Original do projeto | Placeholder curto de pulo do Pino.                               |
| `assets/audio/sfx/player-land.wav`                        | Gerado no projeto por script   | Original do projeto | Placeholder curto de aterrissagem do Pino.                       |
| `assets/audio/sfx/player-death-01.wav`                    | Gerado no projeto por script   | Original do projeto | Variação placeholder de morte do Pino.                           |
| `assets/audio/sfx/player-death-02.wav`                    | Gerado no projeto por script   | Original do projeto | Variação placeholder de morte do Pino.                           |
| `assets/audio/sfx/player-death-03.wav`                    | Gerado no projeto por script   | Original do projeto | Variação placeholder de morte do Pino.                           |
| `assets/audio/sfx/player-respawn.wav`                     | Gerado no projeto por script   | Original do projeto | Placeholder curto de respawn do Pino.                            |
| `assets/audio/sfx/player-primary.wav`                     | Gerado no projeto por script   | Original do projeto | Placeholder curto de ação primária.                              |
| `assets/audio/sfx/player-secondary.wav`                   | Gerado no projeto por script   | Original do projeto | Placeholder curto de ação secundária.                            |
| `assets/audio/sfx/level-checkpoint.wav`                   | Gerado no projeto por script   | Original do projeto | Placeholder curto de checkpoint.                                 |
| `assets/audio/sfx/level-complete.wav`                     | Gerado no projeto por script   | Original do projeto | Placeholder curto de fim de fase.                                |
| `assets/audio/sfx/level-item.wav`                         | Gerado no projeto por script   | Original do projeto | Placeholder curto de coleta de item.                             |
| `assets/audio/sfx/level-trap.wav`                         | Gerado no projeto por script   | Original do projeto | Placeholder curto de armadilha ativada.                          |
| `assets/audio/sfx/level-falling-platform.wav`             | Gerado no projeto por script   | Original do projeto | Placeholder curto de plataforma caindo.                          |
| `assets/audio/sfx/level-projectile.wav`                   | Gerado no projeto por script   | Original do projeto | Placeholder curto de projétil disparando.                        |
| `assets/audio/sfx/energy-charge-loop.wav`                 | Gerado no projeto por script   | Original do projeto | Loop baixo da Carga Ciano enquanto segura energia.               |
| `assets/audio/sfx/energy-charge-full.wav`                 | Gerado no projeto por script   | Original do projeto | Ping curto de Energia Ciano cheia.                               |
| `assets/audio/sfx/energy-shot.wav`                        | Gerado no projeto por script   | Original do projeto | Disparo seco e curto da Centelha Ciano.                          |
| `assets/audio/sfx/energy-shot-empty.wav`                  | Gerado no projeto por script   | Original do projeto | Falha curta ao tentar usar energia insuficiente.                 |
| `assets/audio/sfx/energy-special-windup.wav`              | Gerado no projeto por script   | Original do projeto | Subida curta da preparação da Rajada Ciano.                      |
| `assets/audio/sfx/energy-special-fire.wav`                | Gerado no projeto por script   | Original do projeto | Disparo curto e forte da Rajada Ciano.                           |
| `assets/audio/sfx/energy-impact-small.wav`                | Gerado no projeto por script   | Original do projeto | Impacto pequeno da Centelha Ciano.                               |
| `assets/audio/sfx/energy-impact-heavy.wav`                | Gerado no projeto por script   | Original do projeto | Impacto pesado da Rajada Ciano em bloco ou alvo.                 |
| `assets/audio/sfx/boss-entry.wav`                         | Gerado no projeto por script   | Original do projeto | Entrada curta de boss com subida grave e ruído leve.             |
| `assets/audio/sfx/boss-windup.wav`                        | Gerado no projeto por script   | Original do projeto | Tell sonoro de windup com subida tensa.                          |
| `assets/audio/sfx/boss-attack.wav`                        | Gerado no projeto por script   | Original do projeto | Ataque seco de boss com impacto grave curto.                     |
| `assets/audio/sfx/boss-hit.wav`                           | Gerado no projeto por script   | Original do projeto | Hit metálico curto quando boss perde vida.                       |
| `assets/audio/sfx/boss-defeat.wav`                        | Gerado no projeto por script   | Original do projeto | Queda musical curta para derrota de boss.                        |
| `assets/audio/music/menu-loop.wav`                        | Gerado no projeto por script   | Original do projeto | Loop original simples do tema `Entrada Pulante`.                 |
| `assets/audio/music/mvp-loop.wav`                         | Gerado no projeto por script   | Original do projeto | Loop do bloco 1 (fases 01-03), tema `Pulos de Azar`.             |
| `assets/audio/music/block-2-dash-loop.wav`                | Gerado no projeto por script   | Original do projeto | Loop do bloco 2 (fases 04-06), tema `Dash Sob Suspeita`.       |
| `assets/audio/music/block-3-energy-loop.wav`              | Gerado no projeto por script   | Original do projeto | Loop do bloco 3 (fases 07-10), tema `Nucleo Ciano`.            |
| `assets/audio/music/mvp-level-complete-sting.wav`         | Gerado no projeto por script   | Original do projeto | Vinheta musical curta de fim de fase.                            |

## Referencias De Boss

As imagens em `assets/boss/examples/` sao referencias locais para a Fase 17.
Elas nao devem ser importadas pelo jogo nem usadas como sprites finais. Os
sprites finais dos chefes precisam ser redesenhados em pixel art original,
registrados separadamente e com hitboxes de gameplay independentes.

| Arquivo                                      | Uso                  | Observacoes                                                               |
| -------------------------------------------- | -------------------- | ------------------------------------------------------------------------- |
| `assets/boss/examples/boss-1.png`            | Referencia de design | Base visual do `Hirolito Narguilito`: narguile, oculos, fumaca e cristal. |
| `assets/boss/examples/boss-1-examples.png`   | Variacoes de design  | Estudos de silhueta, mangueira, poses e leitura do cristal do boss 1.     |
| `assets/boss/examples/boss-2-reference.jpeg` | Referencia de design | Base visual do `Dr. Imports`: pessoa/tema, casaco escuro e leitura roxa.  |
| `assets/boss/examples/boss-2-examples.png`   | Variacoes de design  | Estudos de maleta, notebook, frascos, fumaca roxa e poses do boss 2.      |
| `assets/boss/examples/boss-3-reference.png`  | Referencia de design | Base visual do `Giga Fabio`: proporcao compacta e postura de brute final. |
| `assets/boss/examples/boss-3-examples.png`   | Variacoes de design  | Estudos de preto/dourado, punhos grandes, pancadas e poses do boss final. |
