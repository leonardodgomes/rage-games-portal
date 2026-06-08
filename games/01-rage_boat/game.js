const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// --- CARREGAR IMAGENS ---
const imagemBarco = new Image();
imagemBarco.src = "assets/barco.png";

// --- ESTADO DO JOGO ---
let contadorMortes = 0;

// Configurações do Barco
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

// --- OBSTÁCULOS E ARMADILHAS ---
// As armadilhas têm "visivel: false" e só aparecem quando o barco toca no gatilho (trigger)
const obstaculos = [
    // Rochas Normais (Sempre visíveis)
    { x: 300, y: 100, largura: 80, altura: 80, cor: "#555", visivel: true, armadilha: false },
    { x: 300, y: 420, largura: 80, altura: 80, cor: "#555", visivel: true, armadilha: false },
    
    // A ILHA ARMADILHA (Começa invisível)
    { x: 450, y: 200, largura: 120, height: 200, largura: 120, altura: 200, cor: "#d2b48c", visivel: false, armadilha: true }
];

// O Gatilho Invisível (Zona que o barco pisa para ativar a armadilha)
const gatilhoArmadilha = {
    x: 380,
    y: 200,
    largura: 50,
    altura: 200,
    ativado: false
};

// Meta / Objetivo (Chegar ao fim do ecrã do lado direito)
const meta = {
    x: 750,
    y: 0,
    largura: 50,
    altura: 600
};

const teclas = {};
window.addEventListener("keydown", (e) => teclas[e.key] = true);
window.addEventListener("keyup", (e) => teclas[e.key] = false);

// Função auxiliar para detetar colisão entre dois retângulos
function verificarColisao(rect1, rect2) {
    return rect1.x < rect2.x + rect2.largura &&
           rect1.x + rect1.largura > rect2.x &&
           rect1.y < rect2.y + rect2.altura &&
           rect1.y + rect1.altura > rect2.y;
}

function reiniciarJogo() {
    contadorMortes++;
    barco.x = 50;
    barco.y = 300;
    barco.vX = 0;
    barco.vY = 0;
    barco.angulo = 0;
    // Resetar a armadilha para o jogador cair nela outra vez!
    obstaculos[2].visivel = false;
    gatilhoArmadilha.ativado = false;
}

function atualizar() {
    // Movimento
    if (teclas["ArrowUp"] || teclas["w"]) barco.vY -= barco.aceleracao;
    if (teclas["ArrowDown"] || teclas["s"]) barco.vY += barco.aceleracao;
    if (teclas["ArrowLeft"] || teclas["a"]) barco.vX -= barco.aceleracao;
    if (teclas["ArrowRight"] || teclas["d"]) barco.vX += barco.aceleracao;

    barco.vX *= barco.atrito;
    barco.vY *= barco.atrito;
    barco.x += barco.vX;
    barco.y += barco.vY;

    if (Math.abs(barco.vX) > 0.1 || Math.abs(barco.vY) > 0.1) {
        barco.angulo = Math.atan2(barco.vY, barco.vX);
    }

    // Limites do ecrã
    if (barco.x < 0) barco.x = 0;
    if (barco.x > canvas.width - barco.largura) barco.x = canvas.width - barco.largura;
    if (barco.y < 0) barco.y = 0;
    if (barco.y > canvas.height - barco.altura) barco.y = canvas.height - barco.altura;

    // --- LÓGICA DA ARMADILHA (O GATILHO) ---
    if (!gatilhoArmadilha.ativado && verificarColisao(barco, gatilhoArmadilha)) {
        gatilhoArmadilha.ativado = true;
        obstaculos[2].visivel = true; // A ilha surge do nada bem na frente do barco!
    }

    // --- VERIFICAR COLISÕES COM OBSTÁCULOS ---
    obstaculos.forEach(obs => {
        if (obs.visivel && verificarColisao(barco, obs)) {
            reiniciarJogo();
        }
    });

    // --- VERIFICAR VITÓRIA ---
    if (verificarColisao(barco, meta)) {
        alert("Incrível! Conseguiste passar... por agora. Mortes: " + contadorMortes);
        contadorMortes = 0;
        reiniciarJogo();
    }
}

function desenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar a Meta (Linha verde de chegada)
    ctx.fillStyle = "rgba(52, 199, 89, 0.4)";
    ctx.fillRect(meta.x, meta.y, meta.largura, meta.altura);

    // Desenhar Obstáculos e Armadilhas
    obstaculos.forEach(obs => {
        if (obs.visivel) {
            ctx.fillStyle = obs.cor;
            ctx.fillRect(obs.x, obs.y, obs.largura, obs.altura);
            
            // Detalhe estético: borda preta nas rochas
            ctx.strokeStyle = "#000";
            ctx.lineWidth = 2;
            ctx.strokeRect(obs.x, obs.y, obs.largura, obs.altura);
        }
    });

    // Desenhar o Barco
    ctx.save();
    ctx.translate(barco.x + barco.largura / 2, barco.y + barco.altura / 2);
    ctx.rotate(barco.angulo);
    ctx.drawImage(imagemBarco, -barco.largura / 2, -barco.altura / 2, barco.largura, barco.altura);
    ctx.restore();

    // Desenhar a Interface (Contador de Mortes)
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px Arial";
    ctx.fillText("MORTES: " + contadorMortes, 20, 40);
}

function loopJogo() {
    atualizar();
    desenhar();
    requestAnimationFrame(loopJogo);
}

imagemBarco.onload = () => {
    loopJogo();
};
