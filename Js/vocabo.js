document.addEventListener("DOMContentLoaded", () => {
    // --- SELEÇÃO DE ELEMENTOS ---
    const telaInicio = document.getElementById("tela-inicio");
    const telaJogo = document.getElementById("tela-jogo");
    const btnComecar = document.getElementById("btn-comecar");
    const gridJogo = document.getElementById("grid-jogo");
    const btnDica = document.getElementById("btn-dica");
    const btnVoltar = document.getElementById("btn-voltar");
    const telaFinal = document.getElementById("tela-final");
    const finalTitulo = document.getElementById("final-titulo");
    const finalPalavra = document.getElementById("final-palavra");
    const finalTentativas = document.getElementById("final-tentativas");
    const finalDica = document.getElementById("final-dica");
    const btnReiniciar = document.getElementById("btn-reiniciar");
  
    // --- CONFIGURAÇÕES ---
    const tamanhoPalavra = 6;
    const tentativasMax = 6;
    let dicaUsada = false;
    let tentativaAtual = 0;
    let totalVitorias = parseInt(localStorage.getItem('vocabo_vitorias')) || 0;
    let colunaAtual = 0;
    let gameOver = false;
    let grid = [];
  
    // --- BANCO DE PALAVRAS ---
    const banco = "ABERTO,ACORDO,ADULTO,AGENDA,AGULHA,AJUDAR,ALDEIA,ALEGRE,ALMOCO,ALUNOS,AMIGOS,AMPLO,ANIMAL,ANTIGO,APAGAR,APENAS,APERTO,AQUELE,ARANHA,ARVORE,ASSADO,ATENTO,ATLETA,ATRASO,AVANCO,BACANA,BANANA,BARATO,BARCOS,BATATA,BEBIDA,BEIJOS,BELEZA,BIGODE,BONECA,BONITO,BOSQUE,BRANCO,BRASIL,BRILHO,BRINCO,BURACO,CABELO,CABINE,CACHOS,CADEIA,CAIXAS,CALADO,CAMISA,CANECA,CANETA,CANTAR,CARTAS,CARTAZ,CASACO,CASADO,CAVALO,CEBOLA,CENTRO,CEREJA,CHEIRO,CICLO,CIDADE,CINEMA,CLASSE,COELHO,COLEGA,COLETE,COLHER,COLINA,COMIDA,COMPRA,CONTOS,CORRER,CORTAR,COZIDO,CUIDAR,CURVAS,CUSTOS,DENTRO,DEPOIS,DESEJO,DIARIO,DIRETO,DIVIDA,DOENTE,DORMIR,DOUTOR,DRAGAO,DUVIDA,EDICAO,EFEITO,ESCADA,ESCOLA,ESPACO,ESPADA,ESPELHO,ESTADO,ESTILO,ETERNO,EVENTO,FABULA,FALCAO,FAVELA,FECHAR,FERIDA,FERIAS,FESTAS,FEIJAO,FIGURA,FILHOS,FILMES,FLORES,FOLHAS,FONTES,FORCAS,FORMAS,FORNOS,FORTES,FRASCO,FRENTE,FRUTAS,FUNDOS,FUTURO,GAIOLA,GANHAR,GAROTO,GELADO,GIRAFA,GLORIA,GOSTAR,GRANDE,GRATIS,GRITOS,GUARDA,GUERRA,HABITO,HUMANO,IDIOMA,IGREJA,IMAGEM,INICIO,ISENTO,JANTAR,JARDIM,JOELHO,JORNAL,JOVENS,JULGAR,LADRAO,LANCHE,LEGADO,LENTOS,LETRAS,LIMITE,LINHAS,LIVROS,LOGICO,MACACO,MAGICO,MANTER,MARCAS,MARGEM,MARIDO,MEDIDA,MELHOR,MENINA,MENINO,MENTAL,MESTRE,METADE,METAIS,METODO,MINUTO,MISSAO,MODELO,MORDER,MOTIVO,MULHER,MUSICA,NASCER,NOITES,NOVELA,NUVENS,OCULOS,OFERTA,ORIGEM,OVELHA,PADRAO,PAINEL,PAIXAO,PAPEIS,PARADA,PAREDE,PARQUE,PARTES,PASSOS,PASTEL,PATRAO,PEDRAS,PENSAR,PESSOA,PILOTO,PINTOR,PLANOS,PLANTA,PONTES,PONTOS,PORCOS,PORTAS,PORTOS,POSSES,POSTOS,POUCOS,PRATOS,PRAIAS,PRAZOS,PRECOS,PRETOS,PRIMOS,PROVAS,PULSOS,PUNHOS,QUARTO,QUATRO,QUEIJO,QUENTE,QUERER,QUILOS,QUINTA,RADIOS,RAIVAS,RAPIDO,RAZOES,RECEIO,RECIFE,REGRAS,REINOS,RITMOS,ROCHAS,ROUPAS,RUIDOS,SABIOS,SAIDAS,SANGUE,SANTOS,SAPATO,SEMANA,SEMPRE,SENHAS,SENSOS,SEREIA,SERIOS,SERRAS,SERVIR,SINAIS,SITIOS,SKATES,SOMBRA,SONHOS,SORRIR,TABELA,TANQUE,TAPETE,TARDES,TAREFA,TEATRO,TECIDO,TEMPLO,TEMPOS,TENDAS,TENTAR,TERNOS,TERRAS,TESTES,TEXTOS,TIGRES,TIJOLO,TINTAS,TITULO,TOMATE,TORRES,TORTAS,TOSSES,TOTAIS,TRACOS,TRAJES,TRAMAS,TRATOS,TRENOS,TREVOS,TRIBOS,TRIGOS,TRISTE,TROCAS,TRONOS,TROPAS,TUMULO,TURMAS,TURNOS,UMBIGO,URBANO,USADOS,USINAS,VAZIOS,VELHOS,VENTOS,VERBAS,VERDES,VERMES,VERSOS,VIAGEM,VIBRAR,VIDEOS,VIDROS,VINHOS,VIOLAO,VISTOS,VOLTAR,VOLUME,XADREZ,XAROPE,ZEBRAS,ZINCOS".split(",");
  
    // Configura os cliques no teclado virtual
    document.querySelectorAll(".tecla").forEach(btn => {
      btn.addEventListener("click", () => {
        const valor = btn.textContent;
        if (valor === "ENTER") {
          confirmarTentativa();
        } else if (valor === "APAGAR") {
          apagarLetra();
        } else {
          inserirLetra(valor);
        }
      });
    });
  
    function sortearPalavra() {
      const indice = Math.floor(Math.random() * banco.length);
      return banco[indice].toUpperCase();
    }
  
    let palavraSecreta = sortearPalavra();
  
    // ---------------------- GRID ----------------------
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
      // Limpa as cores do teclado visual ao criar novo grid
      document.querySelectorAll(".tecla").forEach(t => {
          t.classList.remove("correct", "present", "absent");
          t.removeAttribute("data-status");
      });
    }
  
    function pintarTecla(letra, status) {
      const tecla = [...document.querySelectorAll(".tecla")]
        .find(t => t.textContent === letra);
  
      if (!tecla) return;
  
      const prioridade = { absent: 1, present: 2, correct: 3 };
      const atual = tecla.dataset.status || "";
      
      // Só muda a cor se a nova cor for "mais importante" que a atual
      // Ex: Se já está verde (3), não vira amarelo (2)
      if (atual && prioridade[status] <= prioridade[atual]) return;
  
      tecla.classList.remove("absent", "present", "correct");
      tecla.classList.add(status);
      tecla.dataset.status = status;
    }
  
    criarGrid();
  
    // VISUAL 
    function aplicarCor(tileEl, varName) {
      tileEl.style.backgroundColor = `var(${varName})`;
      tileEl.style.color = "#fff";
      tileEl.style.borderColor = `var(${varName})`;
    }
  
    // COMEÇAR
    btnComecar.addEventListener("click", () => {
      telaInicio.classList.add("escondida");
      telaJogo.classList.remove("escondida");
  
      tentativaAtual = 0;
      colunaAtual = 0;
      gameOver = false;
      dicaUsada = false;
  
      btnDica.disabled = false;
      btnDica.innerText = "Dica 💡";
  
      palavraSecreta = sortearPalavra();
      criarGrid();
    });
  
    // VOLTAR
    btnVoltar.addEventListener("click", () => {
      telaJogo.classList.add("escondida");
      telaInicio.classList.remove("escondida");
      tentativaAtual = 0;
      colunaAtual = 0;
      gameOver = false;
      dicaUsada = false;
      btnDica.disabled = false;
      btnDica.innerText = "Dica 💡";
      palavraSecreta = sortearPalavra();
      criarGrid();
    });
  
    // TECLADO FÍSICO
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
  
    //LETRAS 
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
      if (tile) tile.classList.remove("dica-revealed");
    }
  
    // DICA 
    btnDica.addEventListener("click", () => {
      if (gameOver) return;
      if (dicaUsada) return alert("Você já usou sua dica!");
      if (colunaAtual >= tamanhoPalavra) return alert("Apague uma letra primeiro!");
  
      const letraCorreta = palavraSecreta[colunaAtual];
      inserirLetra(letraCorreta);
  
      const tile = document.getElementById(`tile-${tentativaAtual}-${colunaAtual - 1}`);
      if (tile) {
        tile.classList.add("dica-revealed");
        tile.style.borderColor = "var(--accent-color)";
        tile.style.color = "var(--accent-color)";
      }
  
      dicaUsada = true;
      btnDica.disabled = true;
      btnDica.innerText = "Já usado";
    });
  
    // ---------------------- CONFIRMAR (CORRIGIDO) ----------------------
  function confirmarTentativa() {
    if (colunaAtual < tamanhoPalavra) {
      alert("Digite todas as 6 letras!");
      return;
    }

    const tentativa = grid[tentativaAtual].join("");
    const secretaArr = palavraSecreta.split("");
    const tentativaArr = tentativa.split("");
    const marcado = new Array(tamanhoPalavra).fill(null);

    // 1. Lógica dos Verdes (Correct)
    for (let i = 0; i < tamanhoPalavra; i++) {
      if (tentativaArr[i] === secretaArr[i]) {
        marcado[i] = "correct";
        secretaArr[i] = null;
      }
    }

    // 2. Lógica dos Amarelos (Present)
    for (let i = 0; i < tamanhoPalavra; i++) {
      if (marcado[i]) continue;
      const letra = tentativaArr[i];
      const idx = secretaArr.indexOf(letra);
      if (idx !== -1) {
        marcado[i] = "present";
        secretaArr[idx] = null;
      } else {
        marcado[i] = "absent";
      }
    }

    // 3. PINTAR GRID E TECLADO (Tudo no mesmo loop)
    for (let i = 0; i < tamanhoPalavra; i++) {
      const tile = document.getElementById(`tile-${tentativaAtual}-${i}`);
      const letra = tentativaArr[i];
      const status = marcado[i];

      // Pinta o quadrado do grid
      if (status === "correct") aplicarCor(tile, "--certo");
      else if (status === "present") aplicarCor(tile, "--presente");
      else aplicarCor(tile, "--inexistente");

      // PINTA A TECLA (Aqui estava o erro antes)
      pintarTecla(letra, status);
    }

    // Vitória
    if (tentativa === palavraSecreta) {
      gameOver = true;
      abrirTelaFinal(true);
      return;
    }

    tentativaAtual++;
    colunaAtual = 0;

    // Derrota
    if (tentativaAtual >= tentativasMax) {
      gameOver = true;
      setTimeout(() => abrirTelaFinal(false), 500);
    }
  }
  
    btnReiniciar.addEventListener("click", () => {
      telaFinal.classList.add("escondida");
      telaInicio.classList.remove("escondida");
      tentativaAtual = 0;
      colunaAtual = 0;
      gameOver = false;
      dicaUsada = false;
      palavraSecreta = sortearPalavra();
      criarGrid();
    });
  
    function abrirTelaFinal(vitoria) {
      telaJogo.classList.add("escondida");
      telaFinal.classList.remove("escondida");
  
      if (vitoria) {
          finalTitulo.textContent = "Você venceu! 🎉";
          totalVitorias++; 
          localStorage.setItem('vocabo_vitorias', totalVitorias);
      } else {
          finalTitulo.textContent = "Você perdeu!";
      }
  
      finalPalavra.textContent = "Palavra correta: " + palavraSecreta;
      finalTentativas.textContent = "Tentativas usadas: " + (tentativaAtual + 1);
      finalDica.innerText = `Dica usada: ${dicaUsada ? "Sim" : "Não"} \n Vitórias Totais: ${totalVitorias}`;
    }
  
  });