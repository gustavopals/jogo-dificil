# Direcao Visual Inicial

## Estilo

O MVP usa pixel art de baixa resolucao, com leitura forte em 1x. A energia
visual e de laboratorio hostil: fundos escuros, blocos industriais, sinais de
perigo saturados e poucos detalhes por sprite.

## Escala

- Resolucao base: 480x270.
- Tile base: 16x16px.
- Pino: aproximadamente 12x24px.
- Hitbox do Pino: 10x22px.
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
| hero        | `#f4d35e` | Pino, itens e foco jogavel.           |
| hazard      | `#e35d6a` | Espinhos, dano e morte imediata.      |
| exit        | `#e76f51` | Saidas, truques e falsa seguranca.    |
| specialTrap | `#9b5de5` | Projeteis e mecanismos incomuns.      |

## Regras

- Desenhar silhueta em 1x antes de adicionar detalhe.
- Usar cores por significado, nao como decoracao.
- Manter perigos e objetivos mais claros que o fundo.
- Preferir contorno duro de 1px, areas chapadas e poucos tons.
- Evitar texturas que confundam plataforma, hazard, item ou saida.

## Tileset Placeholder

O primeiro tileset coerente fica em `assets/tilesets/` e usa tiles 16x16px:

- `lab-solid-block.png`: massa solida para paredes e blocos grossos.
- `lab-platform.png`: piso/plataforma fina para leitura imediata de salto.
- `lab-hazard-spikes.png`: perigo visual vermelho para espinhos e pits.
- `lab-background-panel.png`: painel escuro repetivel para fundo simples.

Todos foram gerados no projeto com `magick`, usam licenca original do projeto e
estao registrados em `assets/ASSETS.md`.
