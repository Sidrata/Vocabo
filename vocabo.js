document.addEventListener("DOMContentLoaded", () => {
  // --- SELEÇÃO DE ELEMENTOS ---
  const telaInicio = document.getElementById("tela-inicio");
  const telaJogo = document.getElementById("tela-jogo");
  const btnComecar = document.getElementById("btn-comecar");
  const gridJogo = document.getElementById("grid-jogo");
  const btnDica = document.getElementById("btn-dica");
  const btnVoltar = document.getElementById("btn-voltar");

  // --- CONFIGURAÇÕES DO JOGO ---
  const tamanhoPalavra = 6;
  const tentativasMax = 6;
  let dicaUsada = false; // Controle da dica
  let tentativaAtual = 0;
  let colunaAtual = 0;
  let gameOver = false;
  let grid = []; // Matriz de dados

  // --- BANCO DE PALAVRAS ---
  const banco = "ABERTO,ACORDO,ADULTO,AGENDA,AGULHA,AJUDAR,ALDEIA,ALEGRE,ALMOCO,ALUNOS,AMIGOS,AMPLO,ANIMAL,ANTIGO,APAGAR,APENAS,APERTO,AQUELE,ARANHA,ARVORE,ASSADO,ATENTO,ATLETA,ATRASO,AVANCO,BACANA,BANANA,BARATO,BARCOS,BATATA,BEBIDA,BEIJOS,BELEZA,BIGODE,BONECA,BONITO,BOSQUE,BRANCO,BRASIL,BRILHO,BRINCO,BURACO,CABELO,CABINE,CACHOS,CADEIA,CAIXAS,CALADO,CAMISA,CANECA,CANETA,CANTAR,CARTAS,CARTAZ,CASACO,CASADO,CAVALO,CEBOLA,CENTRO,CEREJA,CHEIRO,CICLO,CIDADE,CINEMA,CLASSE,COELHO,COLEGA,COLETE,COLHER,COLINA,COMIDA,COMPRA,CONTOS,CORRER,CORTAR,COZIDO,CUIDAR,CURVAS,CUSTOS,DENTRO,DEPOIS,DESEJO,DIARIO,DIRETO,DIVIDA,DOENTE,DORMIR,DOUTOR,DRAGAO,DUVIDA,EDICAO,EFEITO,ESCADA,ESCOLA,ESPACO,ESPADA,ESPELHO,ESTADO,ESTILO,ETERNO,EVENTO,FABULA,FALCAO,FAVELA,FECHAR,FERIDA,FERIAS,FESTAS,FEIJAO,FIGURA,FILHOS,FILMES,FLORES,FOLHAS,FONTES,FORCAS,FORMAS,FORNOS,FORTES,FRASCO,FRENTE,FRUTAS,FUNDOS,FUTURO,GAIOLA,GANHAR,GAROTO,GELADO,GIRAFA,GLORIA,GOSTAR,GRANDE,GRATIS,GRITOS,GUARDA,GUERRA,HABITO,HUMANO,IDIOMA,IGREJA,IMAGEM,INICIO,ISENTO,JANTAR,JARDIM,JOELHO,JORNAL,JOVENS,JULGAR,LADRAO,LANCHE,LEGADO,LENTOS,LETRAS,LIMITE,LINHAS,LIVROS,LOGICO,MACACO,MAGICO,MANTER,MARCAS,MARGEM,MARIDO,MEDIDA,MELHOR,MENINA,MENINO,MENTAL,MESTRE,METADE,METAIS,METODO,MINUTO,MISSAO,MODELO,MORDER,MOTIVO,MULHER,MUSICA,NASCER,NOITES,NOVELA,NUVENS,OCULOS,OFERTA,ORIGEM,OVELHA,PADRAO,PAINEL,PAIXAO,PAPEIS,PARADA,PAREDE,PARQUE,PARTES,PASSOS,PASTEL,PATRAO,PEDRAS,PENSAR,PESSOA,PILOTO,PINTOR,PLANOS,PLANTA,PONTES,PONTOS,PORCOS,PORTAS,PORTOS,POSSES,POSTOS,POUCOS,PRATOS,PRAIAS,PRAZOS,PRECOS,PRETOS,PRIMOS,PROVAS,PULSOS,PUNHOS,QUARTO,QUATRO,QUEIJO,QUENTE,QUERER,QUILOS,QUINTA,RADIOS,RAIVAS,RAPIDO,RAZOES,RECEIO,RECIFE,REGRAS,REINOS,RITMOS,ROCHAS,ROUPAS,RUIDOS,SABIOS,SAIDAS,SANGUE,SANTOS,SAPATO,SEMANA,SEMPRE,SENHAS,SENSOS,SEREIA,SERIOS,SERRAS,SERVIR,SINAIS,SITIOS,SKATES,SOMBRA,SONHOS,SORRIR,TABELA,TANQUE,TAPETE,TARDES,TAREFA,TEATRO,TECIDO,TEMPLO,TEMPOS,TENDAS,TENTAR,TERNOS,TERRAS,TESTES,TEXTOS,TIGRES,TIJOLO,TINTAS,TITULO,TOMATE,TORRES,TORTAS,TOSSES,TOTAIS,TRACOS,TRAJES,TRAMAS,TRATOS,TRENOS,TREVOS,TRIBOS,TRIGOS,TRISTE,TROCAS,TRONOS,TROPAS,TUMULO,TURMAS,TURNOS,UMBIGO,URBANO,USADOS,USINAS,VAZIOS,VELHOS,VENTOS,VERBAS,VERDES,VERMES,VERSOS,VIAGEM,VIBRAR,VIDEOS,VIDROS,VINHOS,VIOLAO,VISTOS,VOLTAR,VOLUME,XADREZ,XAROPE,ZEBRAS,ZINCOS".split(",");

  function sortearPalavra() {
    const indice = Math.floor(Math.random() * banco.length);
    return banco[indice].toUpperCase();
  }

  let palavraSecreta = sortearPalavra();

  // --- FUNÇÕES VISUAIS ---
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
  
  // Inicializa o grid na primeira vez
  criarGrid();

  function aplicarCor(tileEl, varName) {
    tileEl.style.backgroundColor = `var(${varName})`;
    tileEl.style.color = "#fff"; // Texto branco para melhor contraste
    tileEl.style.borderColor = `var(${varName})`; // Borda da mesma cor
  }

  // --- LOGICA PRINCIPAL ---
  btnComecar.addEventListener("click", () => {
    telaInicio.classList.add("escondida");
    telaJogo.classList.remove("escondida");
  });

  // Botão Voltar (CORRIGIDO)
  btnVoltar.addEventListener("click", () => {
    telaJogo.classList.add("escondida");
    telaInicio.classList.remove("escondida");
    
    // Resetar variáveis
    tentativaAtual = 0;
    colunaAtual = 0;
    gameOver = false;
    dicaUsada = false; // Reseta a dica
    btnDica.disabled = false;
    btnDica.innerText = "DICA 💡";

    // Resetar palavra (SEM 'let' ANTES)
    palavraSecreta = sortearPalavra();
    console.log("Nova palavra:", palavraSecreta); // Para você testar

    criarGrid();
  });

  // Teclado
  document.addEventListener("keydown", (event) => {
    if (gameOver) return;

    const key = event.key.toUpperCase();

    if (/^[A-Z]$/.test(key)) {
      inserirLetra(key);
    } else if (event.key === "Backspace") {
      apagarLetra();
    } else if (event.key === "Enter") {
      confirmarTentativa();
    }
  });

  function inserirLetra(letra) {
    if (colunaAtual >= tamanhoPalavra) return;
    grid[tentativaAtual][colunaAtual] = letra;
    const tile = document.getElementById(`tile-${tentativaAtual}-${colunaAtual}`);
    if (tile) tile.textContent = letra;
    colunaAtual++;
  }

  function apagarLetra() {
    if (colunaAtual === 0) return;
    colunaAtual--;
    grid[tentativaAtual][colunaAtual] = "";
    const tile = document.getElementById(`tile-${tentativaAtual}-${colunaAtual}`);
    if (tile) tile.textContent = "";
    
    // Remove estilo de dica se o usuário apagar a letra da dica (opcional)
    if (tile) tile.classList.remove("dica-revealed");
  }

  // --- SISTEMA DE DICA INTELIGENTE ---
  btnDica.addEventListener("click", () => {
    if (gameOver) return;
    
    // 1. Validações
    if (dicaUsada) {
      alert("Você já usou sua dica!");
      return;
    }
    if (colunaAtual >= tamanhoPalavra) {
      alert("Apague uma letra antes de pedir dica!");
      return;
    }

    // 2. Descobre a letra correta
    const letraCorreta = palavraSecreta[colunaAtual];

    // 3. Atualiza Dados e Visual
    inserirLetra(letraCorreta);

    // 4. Estilo especial para saber que foi dica
    const tile = document.getElementById(`tile-${tentativaAtual}-${colunaAtual - 1}`);
    if (tile) {
        tile.classList.add("dica-revealed");
        tile.style.borderColor = "var(--accent-color)";
        tile.style.color = "var(--accent-color)";
    }

    // 5. Bloqueia botão
    dicaUsada = true;
    btnDica.disabled = true;
    btnDica.innerText = "Já usado";
  });

  // --- VERIFICAÇÃO DE VITÓRIA/DERROTA ---
  function confirmarTentativa() {
    if (colunaAtual < tamanhoPalavra) {
      alert("Digite todas as 6 letras!");
      return;
    }

    const tentativa = grid[tentativaAtual].join("");
    
    // Arrays para controle
    const secretaArr = palavraSecreta.split("");
    const tentativaArr = tentativa.split("");
    const marcado = new Array(tamanhoPalavra).fill(null);

    // 1. Verdes (Correto)
    for (let i = 0; i < tamanhoPalavra; i++) {
      if (tentativaArr[i] === secretaArr[i]) {
        marcado[i] = "correct";
        secretaArr[i] = null; // Remove para não contar de novo
      }
    }

    // 2. Amarelos (Presente)
    for (let i = 0; i < tamanhoPalavra; i++) {
      if (marcado[i]) continue; // Se já é verde, pula

      const letra = tentativaArr[i];
      const idx = secretaArr.indexOf(letra);

      if (idx !== -1) {
        marcado[i] = "present";
        secretaArr[idx] = null;
      } else {
        marcado[i] = "absent";
      }
    }

    // 3. Aplica cores
    for (let i = 0; i < tamanhoPalavra; i++) {
      const tile = document.getElementById(`tile-${tentativaAtual}-${i}`);
      if (marcado[i] === "correct") aplicarCor(tile, "--certo");
      else if (marcado[i] === "present") aplicarCor(tile, "--presente");
      else aplicarCor(tile, "--inexistente");
    }

    // 4. Checa Fim de Jogo
    if (tentativa === palavraSecreta) {
      gameOver = true;
      setTimeout(() => alert("Parabéns! Você acertou! 🎉"), 150);
      return;
    }

    tentativaAtual++;
    colunaAtual = 0;

    if (tentativaAtual >= tentativasMax) {
      gameOver = true;
      setTimeout(() => alert("Fim de jogo! A palavra era: " + palavraSecreta), 150);
    }
  }
});