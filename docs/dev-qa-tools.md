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

Listar bosses com atalho direto:

```js
window.__JOGO_DIFICIL_QA__.bosses;
```

Iniciar direto no checkpoint de entrada de um boss:

```js
window.__JOGO_DIFICIL_QA__.startBoss("boss-hirolito-narguilito");
window.__JOGO_DIFICIL_QA__.startBoss("boss-dr-imports");
window.__JOGO_DIFICIL_QA__.startBoss("boss-giga-fabio");
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

Preencher energia do Pino:

```js
window.__JOGO_DIFICIL_QA__.fillEnergy();
```

Zerar cooldowns e estados temporarios de energia:

```js
window.__JOGO_DIFICIL_QA__.clearEnergyCooldowns();
```

Ler apenas o estado de energia:

```js
window.__JOGO_DIFICIL_QA__.readEnergyState();
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
- estado de traps, projeteis, itens, objetos interativos e alvos de energia da
  fase.

## Uso Recomendado

- Para testar o Bloco 2, iniciar direto com `startLevel("level-04")`.
- Para revisar bosses, usar `startBoss(...)` em vez de iniciar a fase e mover
  manualmente para o checkpoint da arena.
- Para revisar um trecho pos-checkpoint, usar `goToCheckpoint()` e repetir a
  sala.
- Para validar transicoes, usar `completeLevel()` em vez de jogar a fase inteira.
- Para testar `Rajada Ciano` sem esperar recarga, usar `fillEnergy()` e
  `clearEnergyCooldowns()` antes do trecho alvo.
- Para smoke tests, preferir os helpers de QA a cliques longos quando o objetivo
  for apenas posicionar o jogo em um estado conhecido.
