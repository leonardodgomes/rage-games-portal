const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// --- IMAGENS ---
const imagemBarco = new Image();
imagemBarco.src = "assets/barco.png";

// --- GESTÃO DE ESTADO ---
let contadorMortes = 0;
let nivelAtual = 1;
let cenario = dadosNivel1; // Começa com o Nível 1

const barco = {
    x: 50, y: 300, largura: 40, altura: 30,
    vX: 0, vY: 0, aceleracao: 0.2, atrito: 0.95, angulo: 0
};

const meta = { x: 760, y: 0, largura: 40, altura: 600 };
const teclas = {};
window.addEventListener("keydown", (e) => teclas[e.key] = true);
window.addEventListener("keyup", (e) => teclas[e.key] = false);

function verificarColisao(rect1, rect2) {
    return rect1.x < rect2.x + rect2.largura &&
           rect1.x + rect1.largura > rect2.x &&
           rect1.y < rect2.y + rect2.altura &&
           rect1.y + rect1.altura > rect2.y;
}

function reiniciarNivel() {
    barco.x = 50; barco.y = 300; barco.vX = 0; barco.vY = 0; barco.angulo = 0;
    
    // Resetar armadilhas específicas do nível ativo
    if (nivelAtual === 1) {
        dadosNivel1.gatilho.ativado = false;
        dadosNivel1.obstaculos.find(o => o.eArmadilha).visivel = false;
    } else if (nivelAtual === 2) {
        dadosNivel2.gatilho.ativado = false;
        const kraken = dadosNivel2.obstaculos.find(o => o.eKraken);
        kraken.visivel = false;
        kraken.x = 500; kraken.y = -100; // Reseta posição do Kraken
    }
}

function morrer() {
    contadorMortes++;
    reiniciarNivel();
}

function passarNivel() {
    nivelAtual++;
    if (nivelAtual === 2) {
        cenario = dadosNivel2;
        reiniciarNivel();
    } else {
        alert(`🏆 Parabéns! Completaste todos os níveis!\nMortes Totais: ${contadorMortes}`);
        nivelAtual = 1;
        cenario = dadosNivel1;
        contadorMortes = 0;
        reiniciarNivel();
    }
}

function atualizar() {
    // Controlo e Física do Barco
    if (teclas["ArrowUp"] || teclas["w"]) barco.vY -= barco.aceleracao;
    if (teclas["ArrowDown"] || teclas["s"]) barco.vY += barco.aceleracao;
    if (teclas["ArrowLeft"] || teclas["a"]) barco.vX -= barco.aceleracao;
    if (teclas["ArrowRight"] || teclas["d"]) barco.vX += barco.aceleracao;

    barco.vX *= barco.atrito; barco.vY *= barco.atrito;
    barco.x += barco.vX; barco.y += barco.vY;

    if (Math.abs(barco.vX) > 0.1 || Math.abs(barco.vY) > 0.1) {
        barco.angulo = Math.atan2(barco.vY, barco.vX);
    }

    // Limites da tela
    if (barco.x < 0) barco.x = 0;
    if (barco.x > canvas.width - barco.largura) barco.x = canvas.width - barco.largura;
    if (barco.y < 0) barco.y = 0;
    if (barco.y > canvas.height - barco.altura) barco.y = canvas.height - barco.altura;

    // --- LÓGICA DO NÍVEL 1 (Ilha Surpresa) ---
    if (nivelAtual === 1) {
        if (!cenario.gatilho.ativado && verificarColisao(barco, cenario.gatilho)) {
            cenario.gatilho.ativado = true;
            cenario.obstaculos.find(o => o.eArmadilha).visivel = true;
        }
    }

    // --- LÓGICA DO NÍVEL 2 (Movimento do Kraken) ---
    if (nivelAtual === 2) {
        const kraken = cenario.obstaculos.find(o => o.eKraken);
        if (!cenario.gatilho.ativado && verificarColisao(barco, cenario.gatilho)) {
            cenario.gatilho.ativado = true;
            kraken.visivel = true;
        }
        // Se o Kraken foi ativado, ele persegue implacavelmente a posição do barco
        if (kraken.visivel) {
            const dx = (barco.x + barco.largura/2) - (kraken.x + kraken.largura/2);
            const dy = (barco.y + barco.altura/2) - (kraken.y + kraken.altura/2);
            const distancia = Math.sqrt(dx * dx + dy * dy);
            
            if (distancia > 0) {
                kraken.x += (dx / distancia) * kraken.velocidade;
                kraken.y += (dy / distancia) * kraken.velocidade;
            }
        }
    }

    // --- VERIFICAR COLISÕES ---
    cenario.obstaculos.forEach(obs => {
        if (obs.visivel && verificarColisao(barco, obs)) {
            morrer();
        }
    });

    // --- VERIFICAR VITÓRIA ---
    if (verificarColisao(barco, meta)) {
        passarNivel();
    }
}

function desenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Linha de Chegada
    ctx.fillStyle = "rgba(52, 199, 89, 0.4)";
    ctx.fillRect(meta.x, meta.y, meta.largura, meta.altura);

    // Desenhar Obstáculos do nível ativo
    cenario.obstaculos.forEach(obs => {
        if (obs.visivel) {
            ctx.fillStyle = obs.cor;
            ctx.fillRect(obs.x, obs.y, obs.largura, obs.altura);
            ctx.strokeStyle = "#000"; ctx.lineWidth = 2;
            ctx.strokeRect(obs.x, obs.y, obs.largura, obs.altura);
        }
    });

    // Desenhar o Barco com Rotação
    ctx.save();
    ctx.translate(barco.x + barco.largura / 2, barco.y + barco.altura / 2);
    ctx.rotate(barco.angulo);
    ctx.drawImage(imagemBarco, -barco.largura / 2, -barco.altura / 2, barco.largura, barco.altura);
    ctx.restore();

    // Interface Gráfica (HUD)
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px Arial";
    ctx.fillText(cenario.nome, 20, 35);
    ctx.fillText("MORTES: " + contadorMortes, 20, 65);
}

function loopJogo() {
    atualizar(); desenhar();
    requestAnimationFrame(loopJogo);
}

imagemBarco.onload = () => { loopJogo(); };
