# Balanceamento Da Curva Inicial

Escopo: `level-01`, `level-02` e `level-03` no fechamento da Fase 8.

Objetivo: garantir que as tres primeiras fases formem uma progressao clara:
introducao cruel, timing com interacao e fechamento com leitura, memoria curta e
precisao.

## Criterios

- A dificuldade declarada deve subir em ordem: 1, 2, 3.
- A Fase 1 deve ter perigos pequenos, uma surpresa simples e nenhuma interacao
  obrigatoria.
- A Fase 2 deve combinar timing ativo com interacao secundaria obrigatoria para
  abrir a saida.
- A Fase 3 deve combinar leitura, memoria curta, plataformas estreitas e risco
  opcional.
- A mesma piada de trap nao deve ser repetida no trio inicial.
- O jogador deve chegar ao primeiro desafio e ao desafio depois do checkpoint sem
  caminhada longa.

## Decisao Por Fase

| Fase       | Funcao na curva                   | Elementos principais                                                                   |
| ---------- | --------------------------------- | -------------------------------------------------------------------------------------- |
| `level-01` | Dificil, mas introdutoria         | buracos pequenos, espinho fixo, `spike-pop`, chip obrigatorio simples                  |
| `level-02` | Timing e interacao                | `falling-platform`, alavanca secundaria, porta, chave como pista e projetil de saida   |
| `level-03` | Leitura, memoria curta e precisao | tres plataformas estreitas, token opcional, `breakable-floor` e `false-block` na saida |

## Guard Rails

- Primeiro desafio relevante: no maximo 14 tiles depois do spawn.
- Primeiro desafio depois do checkpoint: no maximo 12 tiles depois do checkpoint.
- Trap kinds no trio inicial: `spike-pop`, `falling-platform`, `projectile`,
  `false-block` e `breakable-floor`, sem repeticao.

Essas regras estao cobertas em `tests/initial-curve-balance.test.ts`.
