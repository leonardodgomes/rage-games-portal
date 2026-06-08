const dadosNivel1 = {
    nome: "Nível 1: Águas Enganadoras",
    porto: { x: 720, y: 80, largura: 80, altura: 60 }, 
    obstaculos: [
        // Rochas centrais proporcionais
        { x: 300, y: 120, largura: 80, altura: 80, cor: "#555", visivel: true, tipo: "rocha" },
        { x: 300, y: 400, largura: 80, altura: 80, cor: "#555", visivel: true, tipo: "rocha" },
        
        // Parede Superior do Porto (Feita de blocos de 80x80)
        { x: 720, y: 0, largura: 80, altura: 80, cor: "#555", visivel: true, tipo: "rocha" },
        
        // Parede Inferior do Porto (Várias rochas empilhadas em vez de uma esticada)
        { x: 720, y: 140, largura: 80, altura: 80, cor: "#555", visivel: true, tipo: "rocha" },
        { x: 720, y: 220, largura: 80, altura: 80, cor: "#555", visivel: true, tipo: "rocha" },
        { x: 720, y: 300, largura: 80, altura: 80, cor: "#555", visivel: true, tipo: "rocha" },
        { x: 720, y: 380, largura: 80, altura: 80, cor: "#555", visivel: true, tipo: "rocha" },
        { x: 720, y: 460, largura: 80, altura: 80, cor: "#555", visivel: true, tipo: "rocha" },
        { x: 720, y: 520, largura: 80, altura: 80, cor: "#555", visivel: true, tipo: "rocha" },

        // A Ilha Armadilha (Proporcional)
        { x: 460, y: 220, largura: 100, altura: 100, cor: "#d2b48c", visivel: false, tipo: "ilha" }
    ],
    gatilho: { x: 380, y: 200, largura: 50, altura: 200, ativado: false }
};
