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
- `assets/temp/`: prototipos e assets temporarios.

## Registro

| Arquivo                                           | Origem                         | Licenca             | Observacoes                                                       |
| ------------------------------------------------- | ------------------------------ | ------------------- | ----------------------------------------------------------------- |
| `assets/sprites/player-pino-idle.png`             | Gerado no projeto com `magick` | Original do projeto | Sprite 12x24px de idle do Pino, olhando para a direita, com alfa. |
| `assets/sprites/player-pino-run-01.png`           | Gerado no projeto com `magick` | Original do projeto | Frame 1 de corrida do Pino, com corpo inclinado para frente.      |
| `assets/sprites/player-pino-run-02.png`           | Gerado no projeto com `magick` | Original do projeto | Frame 2 de corrida do Pino, com troca de apoio dos pés.           |
| `assets/sprites/player-pino-jump.png`             | Gerado no projeto com `magick` | Original do projeto | Pose de pulo do Pino, com silhueta vertical esticada.             |
| `assets/sprites/player-pino-fall.png`             | Gerado no projeto com `magick` | Original do projeto | Pose de queda do Pino, com visor baixo e pés soltos.              |
| `assets/sprites/player-pino-death-01.png`         | Gerado no projeto com `magick` | Original do projeto | Frame 1 de morte do Pino, usando cor de hazard no impacto.        |
| `assets/sprites/player-pino-death-02.png`         | Gerado no projeto com `magick` | Original do projeto | Frame 2 de morte do Pino, com corpo quebrado e baixo.             |
| `assets/sprites/player-pino-respawn-01.png`       | Gerado no projeto com `magick` | Original do projeto | Frame 1 de respawn do Pino, com varredura ciano.                  |
| `assets/sprites/player-pino-respawn-02.png`       | Gerado no projeto com `magick` | Original do projeto | Frame 2 de respawn do Pino, com corpo reconstruído.               |
| `assets/sprites/trap-spikes.png`                  | Gerado no projeto com `magick` | Original do projeto | Sprite 16x16px de espinhos e spike-pop.                           |
| `assets/sprites/trap-false-block.png`             | Gerado no projeto com `magick` | Original do projeto | Sprite 16x16px de bloco falso com indício roxo sutil.             |
| `assets/sprites/trap-falling-platform.png`        | Gerado no projeto com `magick` | Original do projeto | Sprite 16x16px de plataforma instável.                            |
| `assets/sprites/trap-breakable-floor.png`         | Gerado no projeto com `magick` | Original do projeto | Sprite 16x16px de piso quebrável com rachaduras.                  |
| `assets/sprites/trap-projectile.png`              | Gerado no projeto com `magick` | Original do projeto | Sprite 8x8px de projétil roxo.                                    |
| `assets/sprites/item-required-chip.png`           | Gerado no projeto com `magick` | Original do projeto | Sprite 16x16px de chip obrigatório.                               |
| `assets/sprites/item-mechanism-key.png`           | Gerado no projeto com `magick` | Original do projeto | Sprite 16x16px de chave de mecanismo.                             |
| `assets/sprites/item-optional-token.png`          | Gerado no projeto com `magick` | Original do projeto | Sprite 16x16px de coletável opcional.                             |
| `assets/sprites/marker-checkpoint-inactive.png`   | Gerado no projeto com `magick` | Original do projeto | Sprite 16x16px de checkpoint inativo.                             |
| `assets/sprites/marker-checkpoint-active.png`     | Gerado no projeto com `magick` | Original do projeto | Sprite 16x16px de checkpoint ativo.                               |
| `assets/sprites/marker-exit.png`                  | Gerado no projeto com `magick` | Original do projeto | Sprite 16x16px repetível de saída de fase.                        |
| `assets/tilesets/lab-solid-block.png`             | Gerado no projeto com `magick` | Original do projeto | Tile 16x16px de bloco solido industrial para paredes e massas.    |
| `assets/tilesets/lab-platform.png`                | Gerado no projeto com `magick` | Original do projeto | Tile 16x16px de plataforma metalica para pisos finos.             |
| `assets/tilesets/lab-hazard-spikes.png`           | Gerado no projeto com `magick` | Original do projeto | Tile 16x16px de perigo visual para espinhos e pits.               |
| `assets/tilesets/lab-background-panel.png`        | Gerado no projeto com `magick` | Original do projeto | Tile 16x16px de painel escuro repetivel para fundo simples.       |
| `assets/audio/sfx/player-jump.wav`                | Gerado no projeto por script   | Original do projeto | Placeholder curto de pulo do Pino.                                |
| `assets/audio/sfx/player-land.wav`                | Gerado no projeto por script   | Original do projeto | Placeholder curto de aterrissagem do Pino.                        |
| `assets/audio/sfx/player-death-01.wav`            | Gerado no projeto por script   | Original do projeto | Variação placeholder de morte do Pino.                            |
| `assets/audio/sfx/player-death-02.wav`            | Gerado no projeto por script   | Original do projeto | Variação placeholder de morte do Pino.                            |
| `assets/audio/sfx/player-death-03.wav`            | Gerado no projeto por script   | Original do projeto | Variação placeholder de morte do Pino.                            |
| `assets/audio/sfx/player-respawn.wav`             | Gerado no projeto por script   | Original do projeto | Placeholder curto de respawn do Pino.                             |
| `assets/audio/sfx/player-primary.wav`             | Gerado no projeto por script   | Original do projeto | Placeholder curto de ação primária.                               |
| `assets/audio/sfx/player-secondary.wav`           | Gerado no projeto por script   | Original do projeto | Placeholder curto de ação secundária.                             |
| `assets/audio/sfx/level-checkpoint.wav`           | Gerado no projeto por script   | Original do projeto | Placeholder curto de checkpoint.                                  |
| `assets/audio/sfx/level-complete.wav`             | Gerado no projeto por script   | Original do projeto | Placeholder curto de fim de fase.                                 |
| `assets/audio/sfx/level-item.wav`                 | Gerado no projeto por script   | Original do projeto | Placeholder curto de coleta de item.                              |
| `assets/audio/sfx/level-trap.wav`                 | Gerado no projeto por script   | Original do projeto | Placeholder curto de armadilha ativada.                           |
| `assets/audio/sfx/level-falling-platform.wav`     | Gerado no projeto por script   | Original do projeto | Placeholder curto de plataforma caindo.                           |
| `assets/audio/sfx/level-projectile.wav`           | Gerado no projeto por script   | Original do projeto | Placeholder curto de projétil disparando.                         |
| `assets/audio/music/menu-loop.wav`                | Gerado no projeto por script   | Original do projeto | Loop original simples do tema `Entrada Pulante`.                  |
| `assets/audio/music/mvp-loop.wav`                 | Gerado no projeto por script   | Original do projeto | Loop original simples do tema `Pulos de Azar`.                    |
| `assets/audio/music/mvp-level-complete-sting.wav` | Gerado no projeto por script   | Original do projeto | Vinheta musical curta de fim de fase.                             |
