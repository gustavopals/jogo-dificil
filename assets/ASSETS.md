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
- Audio final deve usar `.ogg`; placeholders gerados localmente podem usar
  `.wav` ate a etapa de mixagem/exportacao final.
- Assets temporarios ficam em `assets/temp/`.
- Assets finais ficam nas pastas de dominio correspondentes.

## Pastas

- `assets/sprites/`: personagens, armadilhas, itens, inimigos e objetos
  visuais.
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
| `assets/sprites/player-pino-idle.png`                     | Gerado no projeto por script   | Original do projeto | Sprite 14x26px de idle do Pino, lutador original com aura baixa. |
| `assets/sprites/player-pino-run-01.png`                   | Gerado no projeto por script   | Original do projeto | Frame 1 de corrida do Pino, corpo inclinado e braço armado.      |
| `assets/sprites/player-pino-run-02.png`                   | Gerado no projeto por script   | Original do projeto | Frame 2 de corrida do Pino, troca de apoio e faixa em atraso.    |
| `assets/sprites/player-pino-run-03.png`                   | Gerado no projeto por script   | Original do projeto | Frame 3 de corrida do Pino, passada baixa com energia no pé.     |
| `assets/sprites/player-pino-jump.png`                     | Gerado no projeto por script   | Original do projeto | Pose de pulo do Pino, cabelo vertical e energia nos pés.         |
| `assets/sprites/player-pino-jump-peak.png`                | Gerado no projeto por script   | Original do projeto | Frame de ápice do pulo do Pino, pose compacta com aura.          |
| `assets/sprites/player-pino-fall.png`                     | Gerado no projeto por script   | Original do projeto | Pose de queda do Pino, braços abertos e cabelo puxado para cima. |
| `assets/sprites/player-pino-dash.png`                     | Gerado no projeto por script   | Original do projeto | Pose de dash do Pino, corpo horizontal com rastro de aura.       |
| `assets/sprites/player-pino-charge-01.png`                | Gerado no projeto por script   | Original do projeto | Frame 1 da Carga Ciano do Pino, aura baixa e mão energizada.     |
| `assets/sprites/player-pino-charge-02.png`                | Gerado no projeto por script   | Original do projeto | Frame 2 da Carga Ciano do Pino, postura comprimida e faíscas.    |
| `assets/sprites/player-pino-cyan-spark-01.png`            | Gerado no projeto por script   | Original do projeto | Frame 1 do disparo da Centelha Ciano, braço estendido.           |
| `assets/sprites/player-pino-cyan-spark-02.png`            | Gerado no projeto por script   | Original do projeto | Frame 2 do disparo da Centelha Ciano, pulso ciano no punho.      |
| `assets/sprites/player-pino-cyan-burst-prepare-01.png`    | Gerado no projeto por script   | Original do projeto | Frame 1 da preparação da Rajada Ciano, energia no punho.         |
| `assets/sprites/player-pino-cyan-burst-prepare-02.png`    | Gerado no projeto por script   | Original do projeto | Frame 2 da preparação da Rajada Ciano, núcleo ciano maior.       |
| `assets/sprites/player-pino-cyan-burst-fire-01.png`       | Gerado no projeto por script   | Original do projeto | Frame 1 da soltura da Rajada Ciano, início curto do feixe.       |
| `assets/sprites/player-pino-cyan-burst-fire-02.png`       | Gerado no projeto por script   | Original do projeto | Frame 2 da soltura da Rajada Ciano, recuo e feixe segmentado.    |
| `assets/sprites/player-pino-death-01.png`                 | Gerado no projeto por script   | Original do projeto | Frame 1 de morte do Pino, impacto vermelho quebrando a aura.     |
| `assets/sprites/player-pino-death-02.png`                 | Gerado no projeto por script   | Original do projeto | Frame 2 de morte do Pino, silhueta baixa com faixa desfeita.     |
| `assets/sprites/player-pino-respawn-01.png`               | Gerado no projeto por script   | Original do projeto | Frame 1 de respawn do Pino, varredura ciano da silhueta.         |
| `assets/sprites/player-pino-respawn-02.png`               | Gerado no projeto por script   | Original do projeto | Frame 2 de respawn do Pino, pose firme com aura reconstruída.    |
| `assets/sprites/trap-spikes.png`                          | Gerado no projeto com `magick` | Original do projeto | Sprite 16x16px de espinhos e spike-pop.                          |
| `assets/sprites/trap-false-block.png`                     | Gerado no projeto com `magick` | Original do projeto | Sprite 16x16px de bloco falso com indício roxo sutil.            |
| `assets/sprites/trap-falling-platform.png`                | Gerado no projeto com `magick` | Original do projeto | Sprite 16x16px de plataforma instável.                           |
| `assets/sprites/trap-breakable-floor.png`                 | Gerado no projeto com `magick` | Original do projeto | Sprite 16x16px de piso quebrável com rachaduras.                 |
| `assets/sprites/trap-projectile.png`                      | Gerado no projeto com `magick` | Original do projeto | Sprite 8x8px de projétil roxo.                                   |
| `assets/sprites/energy-cyan-spark-projectile.png`         | Gerado no projeto com `magick` | Original do projeto | Sprite 8x8px do projétil da Centelha Ciano.                      |
| `assets/sprites/energy-cyan-burst-beam.png`               | Gerado no projeto com `magick` | Original do projeto | Segmento 16x16px tileável do feixe da Rajada Ciano.              |
| `assets/sprites/energy-impact.png`                        | Gerado no projeto com `magick` | Original do projeto | Impacto ciano 16x16px para acertos em alvos.                     |
| `assets/sprites/energy-target-active.png`                 | Gerado no projeto com `magick` | Original do projeto | Alvo ativo 16x16px com aro ciano e núcleo amarelo.               |
| `assets/sprites/energy-cracked-block-broken.png`          | Gerado no projeto com `magick` | Original do projeto | Bloco rachado quebrado 16x16px com fragmentos separados.         |
| `assets/sprites/item-required-chip.png`                   | Gerado no projeto com `magick` | Original do projeto | Sprite 16x16px de chip obrigatório.                              |
| `assets/sprites/item-mechanism-key.png`                   | Gerado no projeto com `magick` | Original do projeto | Sprite 16x16px de chave de mecanismo.                            |
| `assets/sprites/item-optional-token.png`                  | Gerado no projeto com `magick` | Original do projeto | Sprite 16x16px de coletável opcional.                            |
| `assets/sprites/marker-checkpoint-inactive.png`           | Gerado no projeto com `magick` | Original do projeto | Sprite 16x16px de checkpoint inativo.                            |
| `assets/sprites/marker-checkpoint-active.png`             | Gerado no projeto com `magick` | Original do projeto | Sprite 16x16px de checkpoint ativo.                              |
| `assets/sprites/marker-exit.png`                          | Gerado no projeto com `magick` | Original do projeto | Sprite 16x16px repetível de saída de fase.                       |
| `assets/sprites/bosses/hirolito-narguilito.png`           | Gerado no projeto com `magick` | Original do projeto | Placeholder 48x56px do Hirolito, narguile e cristal ciano.       |
| `assets/sprites/bosses/dr-imports.png`                    | Gerado no projeto com `magick` | Original do projeto | Placeholder 48x64px do Dr. Imports, casaco, maleta e fumaça.     |
| `assets/sprites/bosses/giga-fabio.png`                    | Gerado no projeto com `magick` | Original do projeto | Placeholder 64x80px do Giga Fabio, punhos e núcleo ciano.        |
| `assets/sprites/bosses/boss-projectile-smoke-puff.png`    | Gerado no projeto com `magick` | Original do projeto | Sprite 16x16px de projétil de fumaça roxa de boss.               |
| `assets/sprites/bosses/boss-projectile-import-bottle.png` | Gerado no projeto com `magick` | Original do projeto | Sprite 16x16px de garrafa/projétil do Dr. Imports.               |
| `assets/sprites/bosses/boss-projectile-boulder.png`       | Gerado no projeto com `magick` | Original do projeto | Sprite 24x24px de pedra pesada do Giga Fabio.                    |
| `assets/sprites/bosses/boss-impact-burst.png`             | Gerado no projeto com `magick` | Original do projeto | Sprite 24x24px de impacto coral e amarelo para bosses.           |
| `assets/tilesets/lab-solid-block.png`                     | Gerado no projeto com `magick` | Original do projeto | Tile 16x16px de bloco solido industrial para paredes e massas.   |
| `assets/tilesets/lab-platform.png`                        | Gerado no projeto com `magick` | Original do projeto | Tile 16x16px de plataforma metalica para pisos finos.            |
| `assets/tilesets/lab-hazard-spikes.png`                   | Gerado no projeto com `magick` | Original do projeto | Tile 16x16px de perigo visual para espinhos e pits.              |
| `assets/tilesets/lab-background-panel.png`                | Gerado no projeto com `magick` | Original do projeto | Tile 16x16px de painel escuro repetivel para fundo simples.      |
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
| `assets/audio/music/mvp-loop.wav`                         | Gerado no projeto por script   | Original do projeto | Loop original simples do tema `Pulos de Azar`.                   |
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
