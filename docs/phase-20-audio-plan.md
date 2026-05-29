# Fase 20 — Plano de Áudio Profissional

Última atualização: 2026-05-29

## Direção sonora

Identidade: **cozy Stardew** (tons quentes, melodias simples, mix confortável) + **humor cruel** do jogo (mortes secas, traps ásperas, bosses caricatos). Nada ansioso em sessões longas; tells audíveis sem gritar sobre a música.

## Paleta por domínio

| Domínio | Caráter | Timbre / gesto |
| ------- | ------- | -------------- |
| Pino | Orgânico, leve | Pulos suaves, aterrissagem seca, mortes com queda + ruído curto |
| Fase / traps | Seco, perigoso | Checkpoints positivos; traps com snap; plataforma com rumble |
| Energia ciano | Elétrico, brilhante | Hum modulado, pings agudos, rajada com subgrave |
| Bosses | Caricato, grave | Fanfarra curta de entrada, windup ascendente, hit metálico |
| UI | Click suave | Slider sem beep agressivo; mute global com `M` |

## BPM alvo (blocos)

| Tema | Arquivo | BPM | Bloco |
| ---- | ------- | --- | ----- |
| Entrada Pulante | `menu-loop.wav` | 120 | Menu |
| Pulos de Azar | `mvp-loop.wav` | 96 | 1 (fases 01–03) |
| Dash Sob Suspeita | `block-2-dash-loop.wav` | 108 | 2 (04–06) |
| Núcleo Ciano | `block-3-energy-loop.wav` | 88 | 3 (07–10 + arena) |

## Prioridade de substituição (implementada)

1. Morte (3 variações) e respawn  
2. Pulo / dash / checkpoint  
3. Loops de bloco + menu  
4. Boss tells (entry, windup, hit)  
5. Kit energia ciano  

## Origem dos arquivos

**Procedural original** via `npm run assets:audio` (`scripts/generate-sfx.mjs`, `scripts/generate-music.mjs`). Formato: WAV 44.1 kHz, 16-bit mono (SFX); música mono com pico ~−3 dBFS. Licença: original do projeto. Substituição futura por composição exportada: manter paths e `audioId`.

## Level 11 (desafio)

Reutiliza **Núcleo Ciano** (`block-3-energy-loop`) — mesmo bloco musical (ordem 7–11 em `level-music-routing.ts`). Sem `challenge-loop.wav` extra para evitar duplicar preload.

## Mix e ducking

- Hierarquia perceptiva: morte > boss hit > trap > pulo > música.  
- Ducking de música: **~45%** do volume (`multiplier 0.55`) por **800 ms** em sting de fase e `boss-entry`.  
- Anti-spam: cooldown em mortes (140 ms), boss hit (120 ms), pulo (70 ms).  
- Volumes calibrados em `*_AUDIO_DEFINITIONS`; sliders persistem em `localStorage` (`jogo-dificil-audio-settings`).

## Critérios de aceite

- [x] Mesmos `audioId` e paths; só conteúdo WAV trocado.  
- [x] SFX < 600 ms (exceto loop de carga ~0,9 s e loops musicais).  
- [x] Loops sem click evidente (blend de seam no gerador).  
- [x] Jogo jogável mutado; autoplay bloqueado inalterado.  
- [x] `npm run lint`, `npm test`, `npm run build` passam.  
- [x] Sliders música/SFX no menu e pausa; `M` mute global.

## Comandos

```bash
npm run assets:audio      # SFX + música
npm run assets:block-music  # alias música (todos os loops)
```
