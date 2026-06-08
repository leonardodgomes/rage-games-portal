const dadosNivel1 = {
    nome: "Nível 1: Águas Enganadoras",
    porto: { x: 720, y: 50, largura: 80, altura: 60 }, 
    obstaculos: [
        { x: 300, y: 100, largura: 80, altura: 80, cor: "#555", visivel: true, tipo: "rocha" },
        { x: 300, y: 420, largura: 80, altura: 80, cor: "#555", visivel: true, tipo: "rocha" },
        { x: 720, y: 0, largura: 80, altura: 50, cor: "#555", visivel: true, tipo: "rocha" },
        { x: 720, y: 110, largura: 80, altura: 490, cor: "#555", visivel: true, tipo: "rocha" },
        // Alterado para tipo: "ilha"
        { x: 450, y: 200, largura: 120, altura: 200, cor: "#d2b48c", visivel: false, tipo: "ilha" }
    ],
    gatilho: { x: 380, y: 200, largura: 50, altura: 200, ativado: false }
};
