const app = document.querySelector<HTMLElement>("#app");

if (!app) {
  throw new Error("Elemento #app nao encontrado.");
}

app.innerHTML = `
  <section class="scaffold-screen">
    <div>
      <p class="eyebrow">Scaffold tecnico</p>
      <h1>Jogo Difícil</h1>
      <p>
        Base Vite + TypeScript pronta para receber Phaser, cenas e o loop
        jogavel do MVP.
      </p>
    </div>
  </section>
`;

const style = document.createElement("style");

style.textContent = `
  .scaffold-screen {
    display: grid;
    min-height: 100vh;
    place-items: center;
    padding: 32px;
    background:
      linear-gradient(135deg, rgba(242, 91, 91, 0.18), transparent 32%),
      linear-gradient(315deg, rgba(78, 176, 154, 0.16), transparent 30%),
      #111217;
    box-sizing: border-box;
  }

  .scaffold-screen > div {
    max-width: 640px;
  }

  .eyebrow {
    margin: 0 0 12px;
    color: #80d7c2;
    font-size: 0.875rem;
    font-weight: 700;
    letter-spacing: 0;
    text-transform: uppercase;
  }

  h1 {
    margin: 0;
    font-size: clamp(2.25rem, 7vw, 5.5rem);
    line-height: 0.95;
    letter-spacing: 0;
  }

  p {
    margin: 20px 0 0;
    color: #d5dae6;
    font-size: clamp(1rem, 2vw, 1.25rem);
    line-height: 1.6;
  }
`;

document.head.append(style);
