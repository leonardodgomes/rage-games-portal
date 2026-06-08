// dadosNivel1 está disponível globalmente para o game.js
const dadosNivel1 = {
    nome: "Nível 1: Águas Enganadoras",
    // Nova propriedade: Onde fica o porto neste nível
    porto: { x: 720, y: 50, largura: 80, altura: 60 }, 
    obstaculos: [
        // Rochas Normais
        { x: 300, y: 100, largura: 80, altura: 80, cor: "#555", visivel: true },
        { x: 300, y: 420, largura: 80, altura: 80, cor: "#555", visivel: true },
        
        // Paredes que bloqueiam o resto da costa (forçando a entrar no porto)
        { x: 720, y: 0, largura: 80, altura: 50, cor: "#555", visivel: true },
        { x: 720, y: 110, largura: 80, altura: 490, cor: "#555", visivel: true },

        // A Ilha Armadilha (Continua igual)
        { x: 450, y: 200, largura: 120, altura: 200, cor: "#d2b48c", visivel: false, eArmadilha: true }
    ],
    gatilho: { x: 380, y: 200, largura: 50, altura: 200, ativado: false }
};
