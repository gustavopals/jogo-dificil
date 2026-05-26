# jogo-dificil

Jogo de plataforma 2D de navegador, dificil, rapido de reiniciar e baseado em
surpresa, precisao, tentativa e erro. O MVP tem 3 fases curtas, checkpoints,
mortes rapidas, respawn automatico, reinicio manual, armadilhas, itens, audio
basico e tela inicial.

## Stack

- TypeScript.
- Vite.
- Phaser 3.
- Vitest para testes unitarios de logica.
- Playwright para smoke tests no navegador.
- ESLint e Prettier para padrao de codigo.

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

## Controles

- `A` ou `Seta Esquerda`: andar para esquerda.
- `D` ou `Seta Direita`: andar para direita.
- `Espaco`, `W` ou `Seta Cima`: pular.
- `J` ou `Z`: acao principal.
- `K` ou `X`: acao secundaria/interagir.
- `R`: reiniciar do checkpoint ativo.
- `Esc`: pausar/retomar.
- `M`: mutar/desmutar audio.

## Fluxo Do MVP

1. Abra o jogo.
2. Na tela inicial, pressione `Enter`, `Espaco` ou clique/toque para iniciar.
3. Complete as 3 fases iniciais em sequencia.
4. Ao morrer, o jogador respawna rapidamente no checkpoint ativo.
5. Use `R` para reiniciar manualmente do checkpoint sem contar morte.

## Documentos Uteis

- `CLAUDE.md`: regras de engenharia, gameplay e workflow do projeto.
- `IDEIA.md`: visao, decisoes e registro de design.
- `ROADMAP.md`: fases, tasks e progresso.
- `assets/ASSETS.md`: origem/licenca dos assets.
- `docs/mvp-gameplay-checklist.md`: checklist manual do MVP.
- `docs/performance-stability-check.md`: medicao inicial de estabilidade.
- `docs/mvp-release-checklist.md`: checklist do primeiro build jogavel.
