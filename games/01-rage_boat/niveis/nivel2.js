const dadosNivel2 = {
    nome: "Nível 2: O Domínio do Kraken",
    obstaculos: [
        // Corredor estreito de rochas
        { x: 200, y: 0, largura: 40, altura: 250, cor: "#555", visivel: true },
        { x: 200, y: 350, largura: 40, altura: 250, cor: "#555", visivel: true },
        // O Kraken (Inimigo móvel - começa parado/invisível)
        { x: 500, y: -100, largura: 60, altura: 60, cor: "#8a2be2", visivel: false, eKraken: true, velocidade: 2.5 }
    ],
    gatilho: { x: 250, y: 0, largura: 40, altura: 600, ativado: false }
};
