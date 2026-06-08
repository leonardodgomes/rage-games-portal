const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// --- CARREGAMENTO DE IMAGENS (ASSETS) ---
const imagens = {};
const arquivos = {
    barco: "assets/barco.png",
    mar: "assets/mar_textura.gif",
    rocha: "assets/rocha.png",
    ilha: "assets/ilha.png",
    kraken: "assets/kraken.png"
};

// Carrega todas as imagens dinamicamente
let imagensCarregadas = 0;
let totalImagens = Object.keys(arquivos).length;

for (let chave in arquivos) {
    imagens[chave] = new Image();
    imagens[chave].src = arquivos[chave];
    imagens[chave].onload = () => {
        imagensCarregadas++;
    };
}

// --- GESTÃO DE ESTADO ---
let contadorMortes = 0;
let nivelAtual = 1;
let cenario = dadosNivel1;

const barco = {
    x: 50, y: 300, largura: 40, altura: 30,
    vX: 0, vY: 0, aceleracao: 0.2, atrito: 0.95, angulo: 0
};

let meta = { x: 0, y: 0, largura: 0, altura: 0 };
const teclas = {};
window.addEventListener("keydown", (e) => teclas[e.key] = true);
window.addEventListener("keyup", (e) => teclas[e.key] = false);

function configurarMeta() {
    meta.x = cenario.porto.x;
    meta.y = cenario.porto.y;
    meta.largura = cenario.porto.largura;
    meta.altura = cenario.porto.altura;
}

function verificarColisao(rect1, rect2) {
    return rect1.x < rect2.x + rect2.largura &&
           rect1.x + rect1.largura > rect2.x &&
           rect1.y < rect2.y + rect2.altura &&
           rect1.y + rect1.altura > rect2.y;
}

function reiniciarNivel() {
    barco.x = 50; barco.y = 300; barco.vX = 0; barco.vY = 0; barco.angulo = 0;
    
    if (nivelAtual === 1) {
        dadosNivel1.gatilho.ativado = false;
        const ilha = dadosNivel1.obstaculos.find(o => o.tipo === 'ilha');
        if (ilha) ilha.visivel = false;
    } else if (nivelAtual === 2) {
        dadosNivel2.gatilho.ativado = false;
        const kraken = dadosNivel2.obstaculos.find(o => o.tipo === 'kraken');
        if (kraken) {
            kraken.visivel = false;
            kraken.x = 500; kraken.y = -100;
        }
    }
    configurarMeta();
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
        alert(`🏆 Incrível! Superaste todos os perigos!\nMortes Acumuladas: ${contadorMortes}`);
        nivelAtual = 1; cenario = dadosNivel1; contadorMortes = 0;
        reiniciarNivel();
    }
}

function atualizar() {
    if (!jogoIniciado) return;

    if (teclas["ArrowUp"] || teclas["w"]) barco.vY -= barco.aceleracao;
    if (teclas["ArrowDown"] || teclas["s"]) barco.vY += barco.aceleracao;
    if (teclas["ArrowLeft"] || teclas["a"]) barco.vX -= barco.aceleracao;
    if (teclas["ArrowRight"] || teclas["d"]) barco.vX += barco.aceleracao;

    barco.vX *= barco.atrito; barco.vY *= barco.atrito;
    barco.x += barco.vX; barco.y += barco.vY;

    if (Math.abs(barco.vX) > 0.1 || Math.abs(barco.vY) > 0.1) {
        barco.angulo = Math.atan2(barco.vY, barco.vX);
    }

    if (barco.x < 0) barco.x = 0;
    if (barco.x > canvas.width - barco.largura) barco.x = canvas.width - barco.largura;
    if (barco.y < 0) barco.y = 0;
    if (barco.y > canvas.height - barco.altura) barco.y = canvas.height - barco.altura;

    // Gatilho Nível 1
    if (nivelAtual === 1) {
        if (!cenario.gatilho.ativado && verificarColisao(barco, cenario.gatilho)) {
            cenario.gatilho.ativado = true;
            const ilha = cenario.obstaculos.find(o => o.tipo === 'ilha');
            if (ilha) ilha.visivel = true;
        }
    }

    // Perseguição do Kraken Nível 2
    if (nivelAtual === 2) {
        const kraken = cenario.obstaculos.find(o => o.tipo === 'kraken');
        if (!cenario.gatilho.ativado && verificarColisao(barco, cenario.gatilho)) {
            cenario.gatilho.ativado = true;
            if (kraken) kraken.visivel = true;
        }
        
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

    cenario.obstaculos.forEach(obs => {
        if (obs.visivel && verificarColisao(barco, obs)) {
            morrer();
        }
    });

    if (verificarColisao(barco, meta)) {
        passarNivel();
    }
}

function desenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. DESENHAR O MAR REALISTA (Repetir a imagem da água por todo o Canvas)
    if (imagens.mar.complete) {
        const padrao = ctx.createPattern(imagens.mar, 'repeat');
        ctx.fillStyle = padrao;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = "#1d70b8"; // Fundo de segurança azul
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // 2. Desenhar o Porto (Cais de Madeira)
    ctx.fillStyle = "#8b5a2b";
    ctx.fillRect(meta.x, meta.y, meta.largura, meta.altura);
    ctx.strokeStyle = "#4a2e15"; ctx.lineWidth = 3;
    ctx.strokeRect(meta.x, meta.y, meta.largura, meta.altura);
    ctx.fillStyle = "#ffd700";
    ctx.fillRect(meta.x + meta.largura - 10, meta.y, 10, meta.altura);

    // 3. DESENHAR OBSTÁCULOS COM IMAGENS REAIS
    cenario.obstaculos.forEach(obs => {
        if (obs.visivel) {
            let imgObstaculo = imagens.rocha; // Padrão é a rocha
            
            if (obs.tipo === 'ilha') imgObstaculo = imagens.ilha;
            if (obs.tipo === 'kraken') imgObstaculo = imagens.kraken;

            if (imgObstaculo.complete) {
                ctx.drawImage(imgObstaculo, obs.x, obs.y, obs.largura, obs.altura);
            } else {
                // Quadrado de segurança caso a imagem falhe
                ctx.fillStyle = obs.cor;
                ctx.fillRect(obs.x, obs.y, obs.largura, obs.altura);
            }
        }
    });

    // 4. Desenhar o Barco
    if (imagens.barco.complete) {
        ctx.save();
        ctx.translate(barco.x + barco.largura / 2, barco.y + barco.altura / 2);
        ctx.rotate(barco.angulo);
        ctx.drawImage(imagens.barco, -barco.largura / 2, -barco.altura / 2, barco.largura, barco.altura);
        ctx.restore();
    }

    // 5. Interface HUD
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px Arial";
    ctx.fillText(cenario.nome, 20, 35);
    ctx.fillText("MORTES: " + contadorMortes, 20, 65);
}

function loopJogo() {
    atualizar();
    desenhar();
    requestAnimationFrame(loopJogo);
}

// --- CONTROLO DE INÍCIO COM STORYTELLING ---
let jogoIniciado = false;

function iniciarAventura() {
    if (imagensCarregadas < totalImagens) {
        alert("O mar ainda está a carregar as texturas... Aguarda 2 segundos.");
        return;
    }
    document.getElementById("ecraHistoria").style.display = "none";
    jogoIniciado = true;
    configurarMeta();
    loopJogo();
}
