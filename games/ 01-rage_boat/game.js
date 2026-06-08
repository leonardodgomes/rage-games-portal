const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 1. Configurações do Barco (Propriedades)
const barco = {
    x: 100,         // Posição inicial Horizontal
    y: 300,         // Posição inicial Vertical
    largura: 30,
    altura: 20,
    vX: 0,          // Velocidade Horizontal atual
    vY: 0,          // Velocidade Vertical atual
    aceleracao: 0.2, // Quão rápido ganha velocidade
    atrito: 0.95,    // Efeito da água (faz o barco deslizar e parar aos poucos)
    velocidadeMaxima: 5
};

// 2. Sistema de Teclado (Saber quais teclas estão pressionadas)
const teclas = {};
window.addEventListener("keydown", (e) => teclas[e.key] = true);
window.addEventListener("keyup", (e) => teclas[e.key] = false);

// 3. Atualizar a Lógica do Jogo (Movimento e Física)
function atualizar() {
    // Aplicar aceleração conforme as teclas pressionadas
    if (teclas["ArrowUp"] || teclas["w"]) barco.vY -= barco.aceleracao;
    if (teclas["ArrowDown"] || teclas["s"]) barco.vY += barco.aceleracao;
    if (teclas["ArrowLeft"] || teclas["a"]) barco.vX -= barco.aceleracao;
    if (teclas["ArrowRight"] || teclas["d"]) barco.vX += barco.aceleracao;

    // Aplicar atrito da água (inércia)
    barco.vX *= barco.atrito;
    barco.vY *= barco.atrito;

    // Mover o barco somando a velocidade à posição
    barco.x += barco.vX;
    barco.y += barco.vY;

    // Impedir o barco de sair dos limites do ecrã
    if (barco.x < 0) barco.x = 0;
    if (barco.x > canvas.width - barco.largura) barco.x = canvas.width - barco.largura;
    if (barco.y < 0) barco.y = 0;
    if (barco.y > canvas.height - barco.altura) barco.y = canvas.height - barco.altura;
}

// 4. Desenhar os Elementos no Ecrã
function desenhar() {
    // Limpar o ecrã anterior para desenhar o novo frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar o barco (por agora, um retângulo branco)
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(barco.x, barco.y, barco.largura, barco.altura);
}

// 5. O Loop Principal do Jogo (Roda a 60 frames por segundo)
function loopJogo() {
    atualizar();
    desenhar();
    requestAnimationFrame(loopJogo); // Chama o próximo frame
}

// Iniciar o jogo!
loopJogo();
