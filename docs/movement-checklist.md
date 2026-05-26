# Checklist Manual De Movimento

Ultima atualizacao: 2026-05-26

## Escopo

Validar a sensacao inicial de movimento antes de iniciar mapas declarativos.
Este checklist cobre a sala de teste atual da `LevelScene`, com movimento
horizontal, pulo, colisao solida e camera.

## Preparacao

1. Rodar `npm run dev`.
2. Abrir `http://127.0.0.1:5173/`.
3. Pressionar `Enter` ou `Espaco` para iniciar a fase.
4. Testar em janela 16:9 ou maximizada, sem zoom do navegador.

## Checklist

- [ ] Pino aparece no checkpoint inicial, sobre o chao, sem cair ou vibrar.
- [ ] `A` e seta esquerda movem para a esquerda.
- [ ] `D` e seta direita movem para a direita.
- [ ] Apertar esquerda e direita ao mesmo tempo neutraliza a direcao.
- [ ] Soltar movimento no chao para o personagem rapidamente.
- [ ] Trocar de direcao no chao responde quase imediatamente.
- [ ] No ar, o controle horizontal continua presente, mas menos freado que no chao.
- [ ] `Espaco`, `W` e seta cima iniciam pulo.
- [ ] Toque curto no pulo gera pulo menor.
- [ ] Segurar pulo gera pulo mais alto.
- [ ] Pular logo depois de sair de uma borda ainda funciona dentro da margem curta de coyote time.
- [ ] Apertar pulo pouco antes de tocar o chao dispara pulo no pouso dentro da margem curta de jump buffer.
- [ ] O jogador aterrissa sobre chao e plataformas solidas sem afundar.
- [ ] O jogador bate em paredes laterais e nao atravessa o limite do mapa.
- [ ] Bater na parte inferior de uma plataforma corta a subida.
- [ ] Quinas simples nao prendem o jogador em estado travado.
- [ ] A camera segue Pino quando ele avanca para a direita.
- [ ] A camera respeita os limites do mapa e nao mostra area fora da sala.
- [ ] A camera nao treme em movimento normal.
- [ ] Obstaculos proximos continuam legiveis enquanto a camera segue o jogador.
- [ ] `Esc` pausa e retoma pela tela de pausa.
- [ ] `M` alterna mute sem quebrar o movimento.

## Criterio Para Avancar

O movimento esta bom o suficiente para comecar mapas quando:

- Pino pode atravessar a sala de teste usando andar e pular.
- Nenhuma colisao basica permite atravessar terreno solido.
- Nenhuma quina simples cria travamento.
- A camera mantem o jogador enquadrado.
- Nao ha erro critico no console.

## Validacao Desta Rodada

- Testes unitarios: `npm run test` passou com 32 testes, cobrindo movimento
  horizontal, pulo variavel, coyote time, jump buffer e colisao solida.
- Validacao automatica no navegador: passou em Chromium headless via Playwright
  com fallback `PLAYWRIGHT_HOST_PLATFORM_OVERRIDE=ubuntu24.04-x64` e WebGL
  desativado. O canvas abriu em 960x540, mudou apos input de movimento/pulo e
  nao registrou erros ou avisos no console.
- Observacao: o WebGL headless do ambiente atual emitiu `Framebuffer Unsupported`.
  A validacao de gameplay foi feita no caminho Canvas para separar limitacao do
  ambiente de erro do jogo.
- Ajustes de valores: nenhum ajuste de movimento foi feito nesta rodada.
