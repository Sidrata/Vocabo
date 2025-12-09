document.addEventListener("DOMContentLoaded", () => {
  // Seleção de elementos
  const telaInicio = document.getElementById("tela-inicio");
  const telaJogo = document.getElementById("tela-jogo");
  const btnComecar = document.getElementById("btn-comecar");
  const gridJogo = document.getElementById("grid-jogo");
  const btnDica = document.getElementById("btn-dica");
  const btnVoltar = document.getElementById("btn-voltar");

  const tamanhoPalavra = 6;
  const tentativasMax = 6;

const banco = "AMIGOS,CASACO,LIVROS,PRONTO,MOTIVO,CIDADE,JANELA,PEDRAS,FRUTAS,CUIDAR,RAPIDO,NOITES,SORTES,CORRER,BRASIL,CAMISA,PLANOS,SABORO,TALHER,FORMAS".split(",");

function sortearPalavra() {
  const indice = Math.floor(Math.random() * banco.length);
  return banco[indice].toUpperCase();
}


  let palavraSecreta = sortearPalavra();

  let tentativaAtual = 0;
  let colunaAtual = 0;
  let gameOver = false;

  // Matriz que guarda as tentativas
  let grid = [];

  // Trocar telas
  btnComecar.addEventListener("click", () => {
    telaInicio.classList.add("escondida");
    telaJogo.classList.remove("escondida");
  });

  // Monta o grid 6x6
  function criarGrid() {
    gridJogo.innerHTML = "";
    grid = [];
    for (let i = 0; i < tentativasMax; i++) {
      let linha = [];
      for (let j = 0; j < tamanhoPalavra; j++) {
        const tile = document.createElement("div");
        tile.classList.add("tile");
        tile.id = `tile-${i}-${j}`;
        gridJogo.appendChild(tile);
        linha.push("");
      }
      grid.push(linha);
    }
  }
  criarGrid();

  // Bloqueia teclas se o jogo já acabou
  document.addEventListener("keydown", (event) => {
    if (gameOver) return;

    const key = event.key.toUpperCase();

    // aceita letras A-Z (se quiser acentos, expanda a regex)
    if (/^[A-Z]$/.test(key)) {
      inserirLetra(key);
    } else if (event.key === "Backspace") {
      apagarLetra();
    } else if (event.key === "Enter") {
      confirmarTentativa();
    }
  });

  // Inserir letra
  function inserirLetra(letra) {
    if (colunaAtual >= tamanhoPalavra) return;
    grid[tentativaAtual][colunaAtual] = letra;
    const tile = document.getElementById(`tile-${tentativaAtual}-${colunaAtual}`);
    if (tile) tile.textContent = letra;
    colunaAtual++;
  }

  // Apagar letra
  function apagarLetra() {
    if (colunaAtual === 0) return;
    colunaAtual--;
    grid[tentativaAtual][colunaAtual] = "";
    const tile = document.getElementById(`tile-${tentativaAtual}-${colunaAtual}`);
    if (tile) tile.textContent = "";
  }

  // Função utilitária para aplicar cor via variável CSS
  function aplicarCor(tileEl, varName) {
    // varName ex: "--certo"
    tileEl.style.backgroundColor = `var(${varName})`;
    // Se as cores forem escuras, deixar texto branco/ preto conforme preciso:
    tileEl.style.color = "#000"; // geralmente bom para tiles claros
  }

  // Confirmar tentativa com avaliação completa
  function confirmarTentativa() {
    if (colunaAtual < tamanhoPalavra) {
      alert("Digite todas as 6 letras!");
      return;
    }

    const tentativa = grid[tentativaAtual].join("");
    console.log("Tentativa:", tentativa);

    // Preparar para avaliação
    const secretaArr = palavraSecreta.split("");
    const tentativaArr = tentativa.split("");
    const marcado = new Array(tamanhoPalavra).fill(null); // "correct", "present", "absent"

    // 1ª passada: marcar verdes (correct)
    for (let i = 0; i < tamanhoPalavra; i++) {
      if (tentativaArr[i] === secretaArr[i]) {
        marcado[i] = "correct";
        // remover letra usada da secreta para não contá-la novamente
        secretaArr[i] = null;
      }
    }

    // 2ª passada: marcar presentes (present) e inexistentes (absent)
    for (let i = 0; i < tamanhoPalavra; i++) {
      if (marcado[i]) continue; // já foi marcado como correct

      const letra = tentativaArr[i];
      const idx = secretaArr.indexOf(letra);

      if (idx !== -1) {
        marcado[i] = "present";
        secretaArr[idx] = null; // marca essa ocorrência como usada
      } else {
        marcado[i] = "absent";
      }
    }

    // Aplicar cores nos tiles da linha atual
    for (let i = 0; i < tamanhoPalavra; i++) {
      const tile = document.getElementById(`tile-${tentativaAtual}-${i}`);
      if (!tile) continue;

      if (marcado[i] === "correct") {
        aplicarCor(tile, "--certo");
        tile.style.borderColor = "transparent";
      } else if (marcado[i] === "present") {
        aplicarCor(tile, "--presente");
        tile.style.borderColor = "transparent";
      } else {
        aplicarCor(tile, "--inexistente");
        tile.style.borderColor = "transparent";
      }
      // garantir que o texto fique legível
      tile.style.color = "#000";
    }

    // Vitória?
    if (tentativa === palavraSecreta) {
      gameOver = true;
      setTimeout(() => alert("Parabéns! Você acertou!"), 150);
      return;
    }

    // Próxima linha
    tentativaAtual++;
    colunaAtual = 0;

    if (tentativaAtual >= tentativasMax) {
      gameOver = true;
      setTimeout(() => alert("Fim de jogo! A palavra era: " + palavraSecreta), 150);
    }
  }
  btnVoltar.addEventListener("click", () => {
    document.getElementById("tela-jogo").classList.add("escondida");
    document.getElementById("tela-inicio").classList.remove("escondida");
    tentativaAtual = 0;
    colunaAtual = 0;
    gameOver = false;

    let palavraSecreta = sortearPalavra();

    criarGrid();
});


  // Dica simples
  btnDica.addEventListener("click", () => {
    if (gameOver) return;
    const indice = Math.floor(Math.random() * tamanhoPalavra);
    alert(`Dica: a letra na posição ${indice + 1} é "${palavraSecreta[indice]}"`);
  });
});
