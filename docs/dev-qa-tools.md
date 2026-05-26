# Ferramentas De QA Para Playtest

Data: 2026-05-26.

Escopo: Task 15.7 da Fase 15, criando atalhos de desenvolvimento para testar
fases novas sem repetir a campanha inteira.

## Disponibilidade

As ferramentas existem apenas em modo dev (`import.meta.env.DEV`). Em producao,
o jogo nao registra o objeto global de QA.

No navegador com `npm run dev`, use:

```js
window.__JOGO_DIFICIL_QA__;
```

## Comandos

Iniciar uma fase especifica:

```js
window.__JOGO_DIFICIL_QA__.startLevel("level-04");
```

Mover o jogador para o primeiro checkpoint da fase atual:

```js
window.__JOGO_DIFICIL_QA__.goToCheckpoint();
```

Mover para um checkpoint especifico:

```js
window.__JOGO_DIFICIL_QA__.goToCheckpoint("level-06-before-memory-lock");
```

Simular conclusao da fase atual:

```js
window.__JOGO_DIFICIL_QA__.completeLevel();
```

Ler snapshot de QA:

```js
window.__JOGO_DIFICIL_QA__.readSnapshot();
```

## Snapshot

O snapshot inclui:

- fase atual;
- cenas ativas;
- checkpoint ativo;
- mortes acumuladas;
- ultima morte conhecida, com causa e fonte quando existir;
- estado do jogador;
- estado de traps, projeteis, itens e objetos interativos da fase.

## Uso Recomendado

- Para testar o Bloco 2, iniciar direto com `startLevel("level-04")`.
- Para revisar um trecho pos-checkpoint, usar `goToCheckpoint()` e repetir a
  sala.
- Para validar transicoes, usar `completeLevel()` em vez de jogar a fase inteira.
- Para smoke tests, preferir os helpers de QA a cliques longos quando o objetivo
  for apenas posicionar o jogo em um estado conhecido.
