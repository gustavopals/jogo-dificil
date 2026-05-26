# Direcao Visual Inicial

## Estilo

O MVP usa pixel art de baixa resolucao, com leitura forte em 1x. A energia
visual e de laboratorio hostil: fundos escuros, blocos industriais, sinais de
perigo saturados e poucos detalhes por sprite.

## Escala

- Resolucao base: 480x270.
- Tile base: 16x16px.
- Pino: aproximadamente 14x26px.
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

## Tileset Placeholder

O primeiro tileset coerente fica em `assets/tilesets/` e usa tiles 16x16px:

- `lab-solid-block.png`: massa solida para paredes e blocos grossos.
- `lab-platform.png`: piso/plataforma fina para leitura imediata de salto.
- `lab-hazard-spikes.png`: perigo visual vermelho para espinhos e pits.
- `lab-background-panel.png`: painel escuro repetivel para fundo simples.

Todos foram gerados no projeto com `magick`, usam licenca original do projeto e
estao registrados em `assets/ASSETS.md`.

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
- Projetil: `trap-projectile.png`, losango roxo 8x8px.
- Itens: chip obrigatorio amarelo, chave coral e token opcional ciano/amarelo.
- Checkpoint: versoes inativa e ativa para feedback imediato.
- Saida de fase: coluna coral repetivel dentro da area de saida.

Os sprites sao renderizados sobre as areas declarativas existentes. Colisao,
hitboxes, triggers e reset de sala continuam definidos pelos dados de fase.
