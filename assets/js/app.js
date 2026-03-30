/**
 * ARQUIVO: assets/js/app.js
 * Objetivo: Gerenciar a interface e buscar dados da API.
 * Nota: Certifique-se de que o logic.js é carregado ANTES deste arquivo no HTML.
 */

let allUsers = [];
let favorites = JSON.parse(localStorage.getItem('dev_favorites')) || [];

// Seleção de elementos do DOM
const ui = {
    list: document.querySelector('#user-list'),
    search: document.querySelector('#search-input'),
    themeBtn: document.querySelector('#theme-toggle'),
    themeIcon: document.querySelector('#theme-icon'),
};

/**
 * FUNÇÃO DE INICIALIZAÇÃO
 */
async function startApp() {
    console.log("🚀 App iniciado...");

    // 1. Aplicar Tema Salvo
    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.classList.add('dark');
        if (ui.themeIcon) ui.themeIcon.textContent = '☀️';
    }

    // 2. Feedback visual de carregamento
    if (ui.list) {
        ui.list.innerHTML = `
            <div class="col-span-full text-center py-20 text-indigo-600 font-bold animate-pulse">
                Buscando desenvolvedores na nuvem...
            </div>
        `;
    }

    try {
        // 3. Busca de Dados (URL Limpa)
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) throw new Error(`Erro na API: ${response.status}`);
        
        allUsers = await response.json();
        console.log("✅ Dados recebidos:", allUsers);
        
        render();

    } catch (err) {
        console.error("❌ Erro ao inicializar app:", err);
        if (ui.list) {
            ui.list.innerHTML = `
                <div class="col-span-full text-red-500 text-center py-10 bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-100 dark:border-red-900/20">
                    <p class="font-bold">Não foi possível carregar os dados.</p>
                    <p class="text-sm opacity-70">Verifique a sua ligação à internet ou a URL da API.</p>
                </div>
            `;
        }
    }
}

/**
 * FUNÇÃO DE RENDERIZAÇÃO
 */
function render() {
    if (!ui.list) return;
    
    const term = ui.search ? ui.search.value : "";
    
    // Verifica se a lógica global existe antes de filtrar
    if (typeof DevLogic === 'undefined') {
        console.error("⚠️ Erro: O objeto DevLogic não foi encontrado. Verifique se o arquivo logic.js foi carregado.");
        return;
    }

    const filtered = DevLogic.filterUsers(allUsers, term);
    
    ui.list.innerHTML = filtered.map(user => {
        const isFav = favorites.includes(user.id);
        const initial = DevLogic.formatAvatar(user.name);
        
        return `
            <div class="user-card bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm relative">
                <button onclick="handleFavorite(${user.id})" class="absolute top-4 right-4 text-2xl focus:outline-none hover:scale-110 transition-transform">
                    <span class="${isFav ? 'text-yellow-400' : 'text-slate-200 dark:text-slate-700'}">★</span>
                </button>
                
                <div class="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center font-bold mb-4">
                    ${initial}
                </div>
                
                <h3 class="text-xl font-bold text-slate-800 dark:text-white leading-tight pr-8">${user.name}</h3>
                <p class="text-indigo-500 text-xs font-bold uppercase mb-4 tracking-widest">${user.company.name}</p>
                
                <div class="space-y-2 text-slate-500 dark:text-slate-400 text-sm">
                    <p>📧 ${user.email}</p>
                    <p>🌐 ${user.website}</p>
                </div>
            </div>
        `;
    }).join('') || `
        <div class="col-span-full py-20 text-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
            Nenhum desenvolvedor encontrado para "${term}".
        </div>
    `;
}

// Global Handlers
window.handleFavorite = (id) => {
    favorites = DevLogic.toggleFavorite(favorites, id);
    localStorage.setItem('dev_favorites', JSON.stringify(favorites));
    render();
};

// Listeners
if (ui.search) ui.search.addEventListener('input', render);

if (ui.themeBtn) {
    ui.themeBtn.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        if (ui.themeIcon) ui.themeIcon.textContent = isDark ? '☀️' : '🌙';
    });
}

window.onload = startApp;