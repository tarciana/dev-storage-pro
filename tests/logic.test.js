/**
 * TESTES UNITÁRIOS - DEV STORAGE PRO
 * Para rodar, você pode colar este código no console do navegador após carregar a página.
 */

const suite = (name, tests) => {
    console.log(`\n🧪 INICIANDO SUÍTE: ${name}`);
    tests();
};

const assert = (message, condition) => {
    if (condition) {
        console.log(`  ✅ PASSED: ${message}`);
    } else {
        console.error(`  ❌ FAILED: ${message}`);
    }
};

suite("Validação de Lógica de Negócio", () => {
    const mockUsers = [
        { name: "Tarciana", company: { name: "Google" } },
        { name: "Dev", company: { name: "Open Source" } }
    ];

    // Teste de Filtro
    const filtrados = DevLogic.filterUsers(mockUsers, "Google");
    assert("Filtro por empresa funciona", filtrados.length === 1 && filtrados[0].name === "Tarciana");

    // Teste de Avatar
    assert("Formatação de avatar pega a primeira letra", DevLogic.formatAvatar("javascript") === "J");

    // Teste de Favoritos
    let favs = [1];
    favs = DevLogic.toggleFavorite(favs, 2);
    assert("Adiciona favorito corretamente", favs.includes(2) && favs.length === 2);
    
    favs = DevLogic.toggleFavorite(favs, 1);
    assert("Remove favorito corretamente", !favs.includes(1) && favs.length === 1);
});