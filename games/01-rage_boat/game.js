const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// --- IMAGENS ---
const imagemBarco = new Image();
imagemBarco.src = "assets/barco.png";

// --- GESTÃO DE ESTADO DO JOGO ---
let contadorMortes = 0;
let nivelAtual = 1;
let cenario = dadosNivel1; // Começa com as configurações do Nível 1

// Configurações Físicas do Barco
const barco = {
    x: 50,
    y: 300,
    largura: 40,
    altura: 30,
    vX: 0,
    vY: 0,
    aceleracao: 0.2,
    atrito: 0.95,
    angulo: 0
};

// Objeto da Meta (Porto) - Será preenchido dinamicamente por cada nível
let meta = { x: 0, y: 0, largura: 0, altura: 0 };

// Sistema de Teclado
const teclas = {};
window.addEventListener("keydown", (e) => teclas[e.key] = true);
window.addEventListener("keyup", (e) => teclas[e.key] = false);

// --- FUNÇÕES DE LÓGICA E CONTROLO ---

// Sincroniza o tamanho e a posição do porto com o nível atual
function configurarMeta() {
    meta.x = cenario.porto.x;
    meta.y = cenario.porto.y;
    meta.largura = cenario.porto.largura;
    meta.altura = cenario.porto.altura;
}

// Deteta colisão retangular entre dois objetos (AABB)
function verificarColisao(rect1, rect2) {
    return rect1.x < rect2.x + rect2.largura &&
           rect1.x + rect1.largura > rect2.x &&
           rect1.y < rect2.y + rect2.altura &&
           rect1.y + rect1.altura > rect2.y;
}

// Faz o reset de todas as armadilhas para o estado inicial quando o jogador perde
function reiniciarNivel() {
    barco.x = 50;
    barco.y = 300;
    barco.vX = 0;
    barco.vY = 0;
    barco.angulo = 0;
    
    if (nivelAtual === 1) {
        dadosNivel1.gatilho.ativado = false;
        const ilha = dadosNivel1.obstaculos.find(o => o.eArmadilha);
        if (ilha) ilha.visivel = false;
    } else if (nivelAtual === 2) {
        dadosNivel2.gatilho.ativado = false;
        const kraken = dadosNivel2.obstaculos.find(o => o.eKraken);
        if (kraken) {
            kraken.visivel = false;
            kraken.x = 500;
            kraken.y = -100; // Coloca o Kraken de volta na sua toca secreta
        }
    }

    configurarMeta();
}

// Executada quando o barco bate num obstáculo ou falha o porto
function morrer() {
    contadorMortes++;
    reiniciarNivel();
}

// Executada quando o barco consegue estacionar com sucesso no porto
function passarNivel() {
    nivelAtual++;
    if (nivelAtual === 2) {
        cenario = dadosNivel2;
        reiniciarNivel();
    } else {
        alert(`🏆 Incrível! Superaste todos os perigos do mar!\nMortes Acumuladas: ${contadorMortes}`);
        nivelAtual = 1;
        cenario = dadosNivel1;
        contadorMortes = 0;
        reiniciarNivel();
    }
}

// Loop de Atualização Mecânica (Logica do Jogo)
function atualizar() {
    // Captura inputs das setas ou WASD e aplica força gradual
    if (teclas["ArrowUp"] || teclas["w"]) barco.vY -= barco.aceleracao;
    if (teclas["ArrowDown"] || teclas["s"]) barco.vY += barco.aceleracao;
    if (teclas["ArrowLeft"] || teclas["a"]) barco.vX -= barco.aceleracao;
    if (teclas["ArrowRight"] || teclas["d"]) barco.vX += barco.aceleracao;

    // Aplica a resistência da água (inércia/deslizamento)
    barco.vX *= barco.atrito;
    barco.vY *= barco.atrito;
    
    // Atualiza a posição real com base nas velocidades calculadas
    barco.x += barco.vX;
    barco.y += barco.vY;

    // Calcula para onde o barco está virado com base no vetor de movimento
    if (Math.abs(barco.vX) > 0.1 || Math.abs(barco.vY) > 0.1) {
        barco.angulo = Math.atan2(barco.vY, barco.vX);
    }

    // Paredes invisíveis do mapa (limites do ecrã do Canvas)
    if (barco.x < 0) barco.x = 0;
    if (barco.x > canvas.width - barco.largura) barco.x = canvas.width - barco.largura;
    if (barco.y < 0) barco.y = 0;
    if (barco.y > canvas.height - barco.altura) barco.y = canvas.height - barco.altura;

    // --- EXECUÇÃO DAS ARMADILHAS POR NÍVEL ---
    
    // Nível 1: Ativação da Ilha Pop-up
    if (nivelAtual === 1) {
        if (!cenario.gatilho.ativado && verificarColisao(barco, cenario.gatilho)) {
            cenario.gatilho.ativado = true;
            const ilha = cenario.obstaculos.find(o => o.eArmadilha);
            if (ilha) ilha.visivel = true;
        }
    }

    // Nível 2: Despertar e Inteligência Artificial de Perseguição do Kraken
    if (nivelAtual === 2) {
        const kraken = cenario.obstaculos.find(o => o.eKraken);
        if (!cenario.gatilho.ativado && verificarColisao(barco, cenario.gatilho)) {
            cenario.gatilho.ativado = true;
            if (kraken) kraken.visivel = true;
        }
        
        // Se o Kraken foi provocado, ele calcula a distância e nada direito ao barco
        if (kraken && kraken.visivel) {
            const dx = (barco.x + barco.largura / 2) - (kraken.x + kraken.largura / 2);
            const dy = (barco.y + barco.altura / 2) - (kraken.y + kraken.altura / 2);
            const distancia = Math.sqrt(dx * dx + dy * dy);
            
            if (distancia > 0) {
                kraken.x += (dx / distancia) * kraken.velocidade;
                kraken.y += (dy / distancia) * kraken.velocidade;
            }
        }
    }

    // --- SISTEMA DE VERIFICAÇÃO DE DANOS ---
    cenario.obstaculos.forEach(obs => {
        if (obs.visivel && verificarColisao(barco, obs)) {
            morrer();
        }
    });

    // --- CONDIÇÃO DE VITÓRIA ---
    if (verificarColisao(barco, meta)) {
        passarNivel();
    }
}

// Loop de Renderização (Desenho Gráfico)
function desenhar() {
    // Limpa o frame anterior para evitar rastos no ecrã
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Desenhar o Porto de Destino (Cais de Madeira)
    ctx.fillStyle = "#8b5a2b"; // Castanho madeira
    ctx.fillRect(meta.x, meta.y, meta.largura, meta.altura);
    ctx.strokeStyle = "#4a2e15"; // Linha de contorno da madeira
    ctx.lineWidth = 3;
    ctx.strokeRect(meta.x, meta.y, meta.largura, meta.altura);

    // Linha amarela indicando a zona de atracagem segura
    ctx.fillStyle = "#ffd700";
    ctx.fillRect(meta.x + meta.largura - 10, meta.y, 10, meta.altura);

    // 2. Desenhar a Lista de Obstáculos e Ilhas do nível ativo
    cenario.obstaculos.forEach(obs => {
        if (obs.visivel) {
            ctx.fillStyle = obs.cor;
            ctx.fillRect(obs.x, obs.y, obs.largura, obs.altura);
            ctx.strokeStyle = "#000";
            ctx.lineWidth = 2;
            ctx.strokeRect(obs.x, obs.y, obs.largura, obs.altura);
        }
    });

    // 3. Desenhar o Barco com o Pivot de Rotação correto
    ctx.save();
    ctx.translate(barco.x + barco.largura / 2, barco.y + barco.altura / 2);
    ctx.rotate(barco.angulo);
    ctx.drawImage(imagemBarco, -barco.largura / 2, -barco.altura / 2, barco.largura, barco.altura);
    ctx.restore();

    // 4. Desenhar Elementos de Texto (Interface HUD)
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px Arial";
    ctx.fillText(cenario.nome, 20, 35);
    ctx.fillText("MORTES: " + contadorMortes, 20, 65);
}

// Loop Infinito de Execução (Sincronizado com os Hz do monitor)
function loopJogo() {
    atualizar();
    desenhar();
    requestAnimationFrame(loopJogo);
}

// Inicializa a meta e arranca com o loop assim que a imagem do barco carregar
imagemBarco.onload = () => {
    configurarMeta();
    loopJogo();
};
