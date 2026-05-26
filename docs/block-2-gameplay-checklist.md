# Checklist Manual Do Bloco 2

Data: 2026-05-26.

Escopo: fases `level-04`, `level-05` e `level-06`, criadas na Task 15.6 para
expandir a campanha linear depois do MVP inicial.

## Plano Das Fases

| Fase       | Nome                   | Ideia central                                  | Risco principal                                    |
| ---------- | ---------------------- | ---------------------------------------------- | -------------------------------------------------- |
| `level-04` | `Impulso Medido`       | ensinar dash em gaps largos sem traps novas    | queda por dash curto ou atrasado                   |
| `level-05` | `O Impulso Mente`      | distorcer dash com traps conhecidas            | plataforma que cai, projetil e pouso com spike-pop |
| `level-06` | `Memoria Em Movimento` | combinar dash, chave, alavanca e memoria curta | projetil antes da porta e falso piso final         |

## Validacao Automatizada

- [x] `level-03` aponta para `level-04`.
- [x] `level-04` aponta para `level-05`.
- [x] `level-05` aponta para `level-06`.
- [x] `level-06` encerra a campanha atual.
- [x] As 3 fases novas passam no validador de fase.
- [x] Cada fase nova tem checkpoint, saida e contato de conclusao.
- [x] Testes de conteudo cobrem a curva do Bloco 2.

## Checklist De Playtest Manual

- [ ] `level-04`: completar usando dash no primeiro gap sem depender de trap.
- [ ] `level-04`: morrer no gap de treino e voltar ao checkpoint correto depois
      de ativa-lo.
- [ ] `level-05`: identificar a plataforma que cai antes de tentar acelerar com
      dash.
- [ ] `level-05`: sobreviver ao projetil usando timing, pulo ou dash sem espera
      longa.
- [ ] `level-05`: perceber que o spike-pop pune pouso automatico perto da saida.
- [ ] `level-06`: coletar a chave, acionar a alavanca com `K`/`X` e abrir a porta.
- [ ] `level-06`: atravessar o gap da porta com o projetil ativo sem softlock.
- [ ] `level-06`: reconhecer o falso piso final em segunda tentativa e concluir.
- [ ] Concluir `level-04 -> level-05 -> level-06` sem voltar manualmente para o
      menu.
- [ ] Conferir que a transicao final aparece apenas depois de `level-06`.

## Criterio De Ajuste

- Se uma fase exigir mais de uma morte para entender a regra, a morte precisa
  apontar claramente para a causa.
- Se o jogador ficar parado esperando armadilha, reduzir distancia entre
  checkpoint e desafio ou simplificar o trecho.
- Se o dash parecer obrigatorio sem leitura, adicionar mais pista visual pelo
  layout antes de mexer na fisica.
