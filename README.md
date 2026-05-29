# Pals Adventure 1

Repositorio `jogo-dificil`: jogo de plataforma 2D de navegador, dificil, rapido
de reiniciar e baseado em surpresa, precisao, tentativa e erro. A versao atual roda em **960x540** (pixel
art HD), com 10 fases curtas, checkpoints, mortes rapidas, respawn automatico,
reinicio manual, dash, energia ciano, tres bosses, armadilhas, itens, audio
basico, resultados locais por fase e tela inicial.

## Stack

- TypeScript.
- Vite.
- Phaser 3.
- Vitest para testes unitarios de logica.
- Playwright para smoke tests no navegador.
- ESLint e Prettier para padrao de codigo.

## Baseline Visual HD

- Resolucao logica: **960x540**, tile **32x32**.
- Pino e bosses: spritesheets `512x512` com celulas `128x128`.
- Ambiente, traps e itens: pixel art nativa em `32x32` (projéteis pequenos em `16x16`).
- Documento oficial: [`docs/hd-visual-standard.md`](docs/hd-visual-standard.md).

## Instalacao

Requisitos: Node.js com `npm` instalado.

```sh
npm install
```

## Desenvolvimento

Inicie o servidor local:

```sh
npm run dev
```

Abra o endereco exibido pelo Vite. Por padrao, ele fica em
`http://localhost:5173/`.

## Build

Gere o build de producao:

```sh
npm run build
```

Sirva o build localmente:

```sh
npm run preview
```

## Testes

Rode os testes unitarios:

```sh
npm run test
```

Rode os smoke tests no navegador:

```sh
npm run test:e2e
```

Rode o lint:

```sh
npm run lint
```

Formate os arquivos:

```sh
npm run format
```

## Geracao De Assets HD

```sh
npm run assets:pino-sheets
npm run assets:boss-sheets
npm run assets:environment
npm run assets:audio
```

`assets:audio` regenera todos os SFX e loops de musica (44.1 kHz). Use apos
clonar o repo ou alterar `scripts/generate-sfx.mjs` / `scripts/generate-music.mjs`.
Atalho legado so para musica: `npm run assets:block-music`.

Registro de origem e licenca: [`assets/ASSETS.md`](assets/ASSETS.md).

## Controles

- `A` ou `Seta Esquerda`: andar para esquerda.
- `D` ou `Seta Direita`: andar para direita.
- `Espaco`, `W` ou `Seta Cima`: pular.
- `J` ou `Z`: dash.
- `K` ou `X`: acao secundaria/interagir, toque curto para `Centelha Ciano` e
  segurar/soltar para `Rajada Ciano`.
- `L` ou `C`: carregar `Energia Ciano` no chao.
- `R`: reiniciar do checkpoint ativo.
- `Esc`: pausar/retomar.
- `M`: mutar/desmutar audio.
- Botao `♪` na tela inicial e no HUD: mutar/desmutar apenas a musica.

## Fluxo Atual

1. Abra o jogo.
2. Na tela inicial, pressione `Enter`, `Espaco` ou clique/toque para iniciar.
3. Complete as 10 fases atuais em sequencia.
4. Ao morrer, o jogador respawna rapidamente no checkpoint ativo.
5. Use `R` para reiniciar manualmente do checkpoint sem contar morte.
6. Ao concluir uma fase, a transicao mostra tempo, mortes da fase e recorde local.

## QA Em Desenvolvimento

Em modo dev, o jogo expoe `window.__JOGO_DIFICIL_QA__` para iniciar fases,
bosses, checkpoints e ler escala/hitbox. Ver [`docs/dev-qa-tools.md`](docs/dev-qa-tools.md).

## Documentos Uteis

- `CLAUDE.md`: regras de engenharia, gameplay e workflow do projeto.
- `IDEIA.md`: visao, decisoes e registro de design.
- `ROADMAP.md`: fases, tasks e progresso.
- `docs/hd-visual-standard.md`: padrao visual HD oficial (escala, sheets, preload).
- `docs/hd-migration-qa-checklist.md`: checklist manual pos-migracao HD.
- `docs/hd-performance-stability-check.md`: performance e estabilidade HD.
- `docs/phase-18-hd-migration-plan.md`: plano historico da migracao HD.
- `assets/ASSETS.md`: origem/licenca dos assets.
- `docs/dev-qa-tools.md`: ferramentas dev para playtest rapido.
- `docs/build-optimization.md`: chunking e cache do build.
- `docs/phase-17-boss-plan.md`: plano dos tres chefes.
- `docs/phase-16-energy-shot-plan.md`: kit Energia Ciano e Bloco 3.
