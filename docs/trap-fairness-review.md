# Revisao De Justica Das Armadilhas

Escopo: fases `level-01`, `level-02` e `level-03` no fim da Fase 7, com os
ajustes de layout registrados durante a Fase 8.

Objetivo: manter armadilhas crueis, mas compreensiveis depois da primeira
falha. A revisao abaixo registra causa esperada da morte, risco de softlock,
espera apos erro e pontos que precisam de acabamento visual/sonoro nas proximas
fases.

## Regras Da Revisao

- Toda trap destrutiva do MVP precisa resetar no respawn.
- Toda trap deve ter uma area de gatilho declarada e, quando tiver corpo fisico
  ou ameaca, uma area de corpo declarada.
- Tempos configurados de trap devem ficar abaixo do tempo de respawn automatico,
  para nao criar esperas longas alem da propria morte.
- Portas fechadas precisam ter pelo menos uma forma declarada de abertura.
- Riscos conhecidos devem ficar anotados antes da fase ganhar arte final.

## Level 01 - Entrada Cruel

### `level-01-fixed-spikes`

- Tipo: hazard fixo.
- Causa esperada: `hazard`.
- Leitura apos morte: espinho fixo fica sempre visivel no chao.
- Softlock: nao se aplica.
- Espera apos erro: apenas respawn automatico.
- Risco conhecido: placeholder triangular ainda nao tem sprite/animacao final;
  conferir hitbox visual quando a arte substituir o marcador.

### `level-01-pit-first`, `level-01-pit-after-surprise`, `level-01-pit-final`

- Tipo: hazards de queda.
- Causa esperada: `fall`.
- Leitura apos morte: os buracos ficam visiveis como cortes no chao segmentado.
- Softlock: nao se aplica; respawn volta ao checkpoint ativo.
- Espera apos erro: apenas respawn automatico.
- Risco conhecido: validar em playtest com teclado comum se os tres gaps
  continuam introdutorios depois da troca dos marcadores por arte final.

### `level-01-spike-pop`

- Tipo: trap `spike-pop`.
- Causa esperada: `trap`.
- Leitura apos morte: a area de corpo aparece como marcador da trap depois do
  acionamento e fica no local que matou o jogador.
- Softlock: baixo. A trap tem `resetOnRespawn: true`.
- Espera apos erro: `delayMs` esta abaixo do tempo de respawn automatico.
- Risco conhecido: o `delayMs` ainda e apenas dado declarativo; quando houver
  animacao, adicionar um frame de surgimento que deixe a morte mais clara sem
  virar aviso longo demais.

## Level 02 - O Caminho Nao Confia Em Voce

### `level-02-fall-gap` / `level-02-fall-exit-gap`

- Tipo: hazards de queda.
- Causa esperada: `fall`.
- Leitura apos morte: os buracos ficam visiveis como cortes no chao segmentado,
  um antes do checkpoint e outro antes da saida.
- Softlock: nao se aplica; respawn volta ao checkpoint ativo.
- Espera apos erro: apenas respawn automatico.
- Risco conhecido: validar, com playtest, se o segundo gap continua justo
  quando o projetil lateral tambem estiver ativo.

### `level-02-falling-platform`

- Tipo: trap `falling-platform`.
- Causa esperada: `fall` se o jogador cair apos a plataforma sumir.
- Leitura apos morte: a plataforma fica com visual de corpo desativado quando
  acionada.
- Softlock: baixo. A plataforma tem `resetOnRespawn: true` e volta no reinicio.
- Espera apos erro: `fallDelayMs` esta abaixo do tempo de respawn automatico.
- Risco conhecido: a queda ainda e instantanea no comportamento atual; quando o
  atraso for implementado de fato, preservar tempo curto e feedback claro.

### `level-02-side-projectile`

- Tipo: trap `projectile`.
- Causa esperada: `trap`.
- Leitura apos morte: o projetil usa marcador visual e vem da area declarada da
  trap.
- Softlock: baixo. A trap tem `resetOnRespawn: true` e projeteis sao limpos no
  reset da sala.
- Espera apos erro: sem espera adicional; projetil nasce no acionamento.
- Risco conhecido: falta animacao/som de disparo. Antes da arte final, manter
  velocidade legivel e evitar tiro saindo fora da camera sem pista visual.

### `level-02-exit-door` / `level-02-lever-exit`

- Tipo: objeto interativo, nao trap mortal.
- Causa esperada: nao mata.
- Leitura: porta fechada bloqueia colisao, alavanca abre a porta com acao
  secundaria, e a chave ativa um mecanismo visual separado.
- Softlock: baixo. Porta, alavanca, chave e mecanismo resetam no respawn; a
  alavanca fica declarada como abridor da porta.
- Espera apos erro: nao exige espera.
- Risco conhecido: ainda falta texto/icone diegetico para a acao secundaria; por
  enquanto o marcador visual so confirma estado.

## Level 03 - Quase Seguro

### `level-03-fall-sequence` / `level-03-fall-cruel-exit`

- Tipo: hazards de queda.
- Causa esperada: `fall`.
- Leitura apos morte: os vazios ficam abaixo da sequencia de plataformas e da
  plataforma final com piso falso.
- Softlock: nao se aplica; respawn volta ao checkpoint ativo.
- Espera apos erro: apenas respawn automatico.
- Risco conhecido: validar em playtest se a primeira sequencia continua curta o
  bastante para nao cansar antes do checkpoint.

### `level-03-breakable-platform`

- Tipo: trap `breakable-floor`.
- Causa esperada: `fall` se o jogador cair apos quebrar o chao.
- Leitura apos morte: o corpo da plataforma fica com alpha reduzido apos o
  gatilho; o token opcional fica acima dela para sinalizar risco/recompensa.
- Softlock: baixo. A trap tem `resetOnRespawn: true`.
- Espera apos erro: sem espera adicional.
- Risco conhecido: o corpo some logicamente de imediato; adicionar animacao de
  rachadura curta quando houver sprites e conferir se o token nao incentiva
  espera longa demais na plataforma.

### `level-03-false-floor`

- Tipo: trap `false-block`.
- Causa esperada: `fall` se o jogador cair no buraco revelado.
- Leitura apos morte: a area removida fica na plataforma da saida e e indicada
  pelo marcador reduzido da trap.
- Softlock: baixo. A trap tem `resetOnRespawn: true`; o reinicio manual com `R`
  recupera o chao.
- Espera apos erro: sem espera adicional.
- Risco conhecido: conferir, em playtest, se o salto sobre o trecho falso da
  plataforma final continua possivel em velocidade normal. Se ficar estreito
  demais, reduzir a largura removida.

## Decisao

A Fase 7 ficou aceitavel para seguir e a Fase 8 converteu os riscos principais
em ajustes de layout das tres fases iniciais. As armadilhas atuais sao
resetaveis, nao criam espera longa apos erro e tem causa compreensivel com os
marcadores placeholder. Arte, animacao e audio reais seguem para fases futuras.
