# Revisao De Justica Das Armadilhas

Escopo: fases `level-01`, `level-02` e `level-03` no fim da Fase 7, com os
ajustes de layout registrados durante a Fase 8.

Objetivo: manter armadilhas crueis, mas compreensiveis depois da primeira
falha. A revisao abaixo registra causa esperada da morte, risco de softlock,
espera apos erro e pontos que precisam de acabamento visual/sonoro nas proximas
fases.

Atualizacao pos-MVP: na Fase 15.3, as traps ganharam estados visuais de
`armed`, `triggered` e `resolved`, alem de feedback curto de ativacao para
`spike-pop`, rachadura reforcada para `breakable-floor` e rastro visual para
projeteis.

## Regras Da Revisao

- Toda trap destrutiva do MVP precisa resetar no respawn.
- Toda trap deve ter uma area de gatilho declarada e, quando tiver corpo fisico
  ou ameaca, uma area de corpo declarada.
- Tempos configurados de trap devem ficar abaixo do tempo de respawn automatico,
  para nao criar esperas longas alem da propria morte.
- Portas fechadas precisam ter pelo menos uma forma declarada de abertura.
- O estado visual `armed` pode sugerir risco de forma discreta, mas nao deve
  entregar a solucao antes da primeira falha.
- O estado visual `triggered` deve explicar rapidamente o que matou o jogador.
- O estado visual `resolved` deve deixar claro que a sala mudou ate o proximo
  respawn/reset.
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
  acionamento e fica no local que matou o jogador. Na Fase 15.3, o corpo fica
  quase invisivel enquanto armado e pisca rapidamente para alpha cheio ao ser
  acionado, deixando a origem da morte mais clara sem virar aviso longo.
- Softlock: baixo. A trap tem `resetOnRespawn: true`.
- Espera apos erro: `delayMs` esta abaixo do tempo de respawn automatico.
- Risco conhecido: o `delayMs` ainda e apenas dado declarativo; se a animacao
  futura ficar lenta demais, preservar a duracao curta atual de feedback.

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
- Causa esperada: `projectile`.
- Leitura apos morte: o projetil usa marcador visual, vem da area declarada da
  trap e agora carrega rastro roxo curto enquanto se move. O emissor tambem fica
  com tell visual mais forte ao disparar.
- Softlock: baixo. A trap tem `resetOnRespawn: true` e projeteis sao limpos no
  reset da sala.
- Espera apos erro: sem espera adicional; projetil nasce no acionamento.
- Risco conhecido: quando houver animacao/som de disparo final, manter
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
  gatilho; o token opcional fica acima dela para sinalizar risco/recompensa. Na
  Fase 15.3, a rachadura fica discreta quando armada e mais forte quando o piso
  resolve, comunicando que o chao mudou.
- Softlock: baixo. A trap tem `resetOnRespawn: true`.
- Espera apos erro: sem espera adicional.
- Risco conhecido: o corpo ainda some logicamente de imediato; se o token
  incentivar espera longa demais na plataforma, reduzir a janela visual ou
  reposicionar o token.

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
marcadores placeholder.

Na Fase 15.3, a leitura visual melhorou sem alterar hitboxes ou dificuldade:
traps armadas, acionadas e resolvidas agora usam feedback visual distinto,
`spike-pop` tem surgimento curto, `breakable-floor` reforca rachadura e
projeteis deixam rastro. Arte, animacao e audio finais ainda podem evoluir em
fases futuras, mas a causa da morte ficou mais clara apos a primeira falha.
