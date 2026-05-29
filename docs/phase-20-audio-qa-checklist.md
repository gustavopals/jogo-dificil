# Fase 20 — Checklist de QA de Áudio

Data: 2026-05-29

## Preparação

- [ ] `npm run assets:audio` executado (WAV atualizados).  
- [ ] `npm run dev` — console sem `missing-audio`.  

## Menu

- [ ] Loop **Entrada Pulante** confortável após 2 min.  
- [ ] Sliders música/efeitos respondem e persistem após F5.  
- [ ] Botão ♪ / OFF (música) e `M` (mute global) coerentes.  

## Bloco 1 (fases 01–03)

- [ ] **Pulos de Azar** não esconde pulo/morte.  
- [ ] 3 mortes seguidas: variações distintas, sem saturação irritante.  
- [ ] Checkpoint e fim de fase: sting com ducking leve da música.  

## Bloco 2 (04–06)

- [ ] **Dash Sob Suspeita** mais tenso que bloco 1.  
- [ ] Dash whoosh alinhado ao movimento (~150 ms).  
- [ ] Boss Hirolito / Dr. Imports: entry + windup audíveis.  

## Bloco 3 (07–10 + desafio 11)

- [ ] **Núcleo Ciano** deixa espaço para energia ciano.  
- [ ] Loop de carga para ao soltar; carga cheia distinta.  
- [ ] Rajada: windup + fire + impact heavy separados.  
- [ ] Fase 11 reutiliza música bloco 3 (sem troca de faixa).  

## Boss Giga Fabio (10)

- [ ] Entry ducka música; combate com energia + boss hit sem clip.  
- [ ] Defeat resolve antes da música de fase voltar.  

## Volumes extremos

- [ ] Campanha mutada (`M`): sem erros, gameplay intacto.  
- [ ] Música 0% / SFX 100% e inverso: hierarquia ainda legível.  

## Regressão

- [ ] Respawn ~450 ms sem atraso por áudio.  
- [ ] Juice Fase 21 (shake/partículas) intacto.  
- [ ] `npm run lint && npm test && npm run build`  

## Ajustes finos (playtest humano)

1. Volume música menu vs gameplay — anotar se menu deve ser −2 dB.  
2. Ducking no sting — 800 ms / 55% OK ou reduzir para 700 ms.  
3. Boss hit cooldown — aumentar se spam ainda incomodar.  
