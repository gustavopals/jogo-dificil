# jogo-dificil

Jogo de plataforma 2D de navegador, dificil, rapido de reiniciar e baseado em
surpresa, precisao e aprendizado por tentativa e erro.

## Desenvolvimento

Instale as dependencias:

```sh
npm install
```

Inicie o servidor local:

```sh
npm run dev
```

## Scripts

- `npm run dev`: inicia o servidor local do Vite.
- `npm run build`: valida TypeScript e gera o build de producao.
- `npm run preview`: serve o build de producao localmente.
- `npm run test`: roda testes unitarios com Vitest.
- `npm run test:e2e`: roda smoke tests com Playwright.
- `npm run lint`: roda ESLint com warnings tratados como erro.
- `npm run format`: formata arquivos com Prettier.

Observacao: `test:e2e` depende dos smoke tests que serao criados nas tasks de
Playwright.
