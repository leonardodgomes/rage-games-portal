// dadosNivel1 está disponível globalmente para o game.js
const dadosNivel1 = {
    nome: "Nível 1: Águas Enganadoras",
    obstaculos: [
        // Rochas Estáticas
        { x: 300, y: 100, largura: 80, altura: 80, cor: "#555", visivel: true },
        { x: 300, y: 420, largura: 80, altura: 80, cor: "#555", visivel: true },
        // A Ilha Armadilha (Começa invisível)
        { x: 450, y: 200, largura: 120, altura: 200, cor: "#d2b48c", visivel: false, eArmadilha: true }
    ],
    gatilho: { x: 380, y: 200, largura: 50, altura: 200, ativado: false }
};
