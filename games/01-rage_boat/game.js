const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// --- CARREGAR IMAGENS ---
const imagemBarco = new Image();
imagemBarco.src = "assets/boat.png"; // Caminho para a tua imagem

// Configurações do Barco
const barco = {
    x: 100,
    y: 300,
    largura: 40,      // Ajusta o tamanho conforme a tua imagem
    altura: 30,
    vX: 0,
    vY: 0,
    aceleracao: 0.2,
    atrito: 0.95,
    angulo: 0         // Nova propriedade para controlar a rotação
};

const teclas = {};
window.addEventListener("keydown", (e) => teclas[e.key] = true);
window.addEventListener("keyup", (e) => teclas[e.key] = false);

function atualizar() {
    if (teclas["ArrowUp"] || teclas["w"]) barco.vY -= barco.aceleracao;
    if (teclas["ArrowDown"] || teclas["s"]) barco.vY += barco.aceleracao;
    if (teclas["ArrowLeft"] || teclas["a"]) barco.vX -= barco.aceleracao;
    if (teclas["ArrowRight"] || teclas["d"]) barco.vX += barco.aceleracao;

    barco.vX *= barco.atrito;
    barco.vY *= barco.atrito;

    barco.x += barco.vX;
    barco.y += barco.vY;

    // Calcular o ângulo baseado na velocidade (faz o barco apontar para onde anda)
    // Usamos Math.abs para garantir que ele só roda se estiver a mexer-se minimamente
    if (Math.abs(barco.vX) > 0.1 || Math.abs(barco.vY) > 0.1) {
        barco.angulo = Math.atan2(barco.vY, barco.vX);
    }

    // Limites do ecrã
    if (barco.x < 0) barco.x = 0;
    if (barco.x > canvas.width - barco.largura) barco.x = canvas.width - barco.largura;
    if (barco.y < 0) barco.y = 0;
    if (barco.y > canvas.height - barco.altura) barco.y = canvas.height - barco.altura;
}

function desenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // --- DESENHAR O BARCO COM ROTAÇÃO ---
    ctx.save(); // Guarda o estado limpo do canvas

    // Move o ponto de rotação para o centro do barco
    ctx.translate(barco.x + barco.largura / 2, barco.y + barco.altura / 2);
    
    // Roda o canvas no ângulo do barco
    ctx.rotate(barco.angulo);

    // Desenha a imagem centralizada no ponto de rotação
    // Nota: Se a imagem demorar a carregar, o canvas desenha-a assim que estiver pronta
    ctx.drawImage(
        imagemBarco, 
        -barco.largura / 2, 
        -barco.altura / 2, 
        barco.largura, 
        barco.altura
    );

    ctx.restore(); // Restaura o canvas para o estado normal (sem rotação)
}

function loopJogo() {
    atualizar();
    desenhar();
    requestAnimationFrame(loopJogo);
}

// Iniciar o jogo
loopJogo();
