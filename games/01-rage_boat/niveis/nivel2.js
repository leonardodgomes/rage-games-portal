const dadosNivel2 = {
    nome: "Nível 2: O Domínio do Kraken",
    porto: { x: 720, y: 460, largura: 80, altura: 60 }, 
    obstaculos: [
        // Corredor inicial feito em blocos proporcionais de 60x60
        { x: 200, y: 0, largura: 60, altura: 60, cor: "#555", visivel: true, tipo: "rocha" },
        { x: 200, y: 60, largura: 60, altura: 60, cor: "#555", visivel: true, tipo: "rocha" },
        { x: 200, y: 120, largura: 60, altura: 60, cor: "#555", visivel: true, tipo: "rocha" },
        
        { x: 200, y: 360, largura: 60, altura: 60, cor: "#555", visivel: true, tipo: "rocha" },
        { x: 200, y: 420, largura: 60, altura: 60, cor: "#555", visivel: true, tipo: "rocha" },
        { x: 200, y: 480, largura: 60, altura: 60, cor: "#555", visivel: true, tipo: "rocha" },
        { x: 200, y: 540, largura: 60, altura: 60, cor: "#555", visivel: true, tipo: "rocha" },
        
        // Barreira do Porto Superior (Blocos empilhados)
        { x: 720, y: 0, largura: 80, altura: 80, cor: "#555", visivel: true, tipo: "rocha" },
        { x: 720, y: 80, largura: 80, altura: 80, cor: "#555", visivel: true, tipo: "rocha" },
        { x: 720, y: 160, largura: 80, altura: 80, cor: "#555", visivel: true, tipo: "rocha" },
        { x: 720, y: 240, largura: 80, altura: 80, cor: "#555", visivel: true, tipo: "rocha" },
        { x: 720, y: 320, largura: 80, altura: 80, cor: "#555", visivel: true, tipo: "rocha" },
        { x: 720, y: 380, largura: 80, altura: 80, cor: "#555", visivel: true, tipo: "rocha" },
        
        // Margem abaixo do porto
        { x: 720, y: 520, largura: 80, altura: 80, cor: "#555", visivel: true, tipo: "rocha" },

        // O Kraken (Tamanho proporcional ao barco)
        { x: 500, y: -100, largura: 50, altura: 50, cor: "#8a2be2", visivel: false, tipo: "kraken", velocidade: 2.5 }
    ],
    gatilho: { x: 260, y: 0, largura: 40, altura: 600, ativado: false }
};
