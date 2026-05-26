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

| Arquivo                                 | Origem                         | Licenca             | Observacoes                                                         |
| --------------------------------------- | ------------------------------ | ------------------- | ------------------------------------------------------------------- |
| `assets/sprites/player-pino-idle.png`   | Gerado no projeto com `magick` | Original do projeto | Placeholder idle 12x24px do Pino, olhando para a direita, com alfa. |
| `assets/audio/sfx/player-jump.wav`      | Gerado no projeto por script   | Original do projeto | Placeholder curto de pulo do Pino.                                  |
| `assets/audio/sfx/player-land.wav`      | Gerado no projeto por script   | Original do projeto | Placeholder curto de aterrissagem do Pino.                          |
| `assets/audio/sfx/player-death-01.wav`  | Gerado no projeto por script   | Original do projeto | Variação placeholder de morte do Pino.                              |
| `assets/audio/sfx/player-death-02.wav`  | Gerado no projeto por script   | Original do projeto | Variação placeholder de morte do Pino.                              |
| `assets/audio/sfx/player-death-03.wav`  | Gerado no projeto por script   | Original do projeto | Variação placeholder de morte do Pino.                              |
| `assets/audio/sfx/player-respawn.wav`   | Gerado no projeto por script   | Original do projeto | Placeholder curto de respawn do Pino.                               |
| `assets/audio/sfx/player-primary.wav`   | Gerado no projeto por script   | Original do projeto | Placeholder curto de ação primária.                                 |
| `assets/audio/sfx/player-secondary.wav` | Gerado no projeto por script   | Original do projeto | Placeholder curto de ação secundária.                               |
