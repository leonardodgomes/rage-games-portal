const dadosNivel2 = {
    nome: "Nível 2: O Domínio do Kraken",
    porto: { x: 720, y: 480, largura: 80, height: 60, largura: 80, altura: 60 }, 
    obstaculos: [
        // Corredor estreito de rochas inicial
        { x: 200, y: 0, largura: 40, altura: 250, cor: "#555", visivel: true },
        { x: 200, y: 350, largura: 40, altura: 250, cor: "#555", visivel: true },
        
        // Paredes do porto inferior
        { x: 720, y: 0, largura: 80, altura: 480, cor: "#555", visivel: true },
        { x: 720, y: 540, largura: 80, altura: 60, cor: "#555", visivel: true },

        // O KRAKEN (Corrigido: "velocidade" com 'e' no fim)
        { x: 500, y: -100, largura: 60, altura: 60, cor: "#8a2be2", visivel: false, eKraken: true, velocidade: 2.5 }
    ],
    gatilho: { x: 250, y: 0, largura: 40, altura: 600, ativado: false }
};
