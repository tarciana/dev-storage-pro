/**
 * ARQUIVO: assets/js/app.js
 * Objetivo: Gerenciar a interface e buscar dados da API real.
 */

let allUsers = [];
let favorites = JSON.parse(localStorage.getItem('dev_favorites')) || [];

const ui = {
    list: document.querySelector('#user-list'),
    search: document.querySelector('#search-input'),
    themeBtn: document.querySelector('#theme-toggle'),
    themeIcon: document.querySelector('#theme-icon'),
    loader: document.querySelector('#loading-state')
};

/**
 * FUNÇÃO DE INICIALIZAÇÃO
 * Corrigida para usar a URL limpa da API.
 */
async function startApp() {
    // 1. Aplicar Tema Salvo
    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.classList.add('dark');
        if (ui.themeIcon) ui.themeIcon.textContent = '☀️';
    }

    if (ui.list) ui.list.innerHTML = `<div class="col-span-full text-center py-20 text-indigo-600 font-bold animate-pulse">Buscando desenvolvedores na nuvem...</div>`;

    try {
        // CORREÇÃO AQUI: A URL deve ser apenas o texto entre aspas, sem colchetes.
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        
        if (!response.ok) throw new Error('Falha na resposta da rede');
        
        allUsers = await response.json();
        render();
    } catch (err) {
        console.error("Erro detalhado:", err);
        if (ui.list) ui.list.innerHTML = `<div class="col-span-full text-red-500 text-center py-10">❌ Erro ao carregar dados. Verifique a conexão com a API.</div>`;
    }
}

/**
 * FUNÇÃO DE RENDERIZAÇÃO
 */
function render() {
    if (!ui.list) return;
    
    const term = ui.search ? ui.search.value : "";
    const filtered = DevLogic.filterUsers(allUsers, term);
    
    ui.list.innerHTML = filtered.map(user => {
        const isFav = favorites.includes(user.id);
        const initial = DevLogic.formatAvatar(user.name);
        
        return `
            <div class="user-card bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm relative">
                <button onclick="handleFavorite(${user.id})" class="absolute top-4 right-4 text-2xl focus:outline-none">
                    <span class="favorite-star ${isFav ? 'text-yellow-400' : 'text-slate-200 dark:text-slate-700'}">★</span>
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
    }).join('') || `<div class="col-span-full py-20 text-center text-slate-400">Nenhum desenvolvedor encontrado para "${term}".</div>`;
}

// Handler de Favoritos
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
        ui.themeIcon.textContent = isDark ? '☀️' : '🌙';
    });
}

window.onload = startApp;