let users = [];
let favorites = JSON.parse(localStorage.getItem('dev_favorites')) || [];

const ui = {
    list: document.querySelector('#user-list'),
    loader: document.querySelector('#loading-state'),
    search: document.querySelector('#search-input'),
    themeBtn: document.querySelector('#theme-toggle'),
    themeIcon: document.querySelector('#theme-icon')
};

async function init() {
    if (localStorage.getItem('theme') === 'dark') document.documentElement.classList.add('dark');
    
    ui.loader.classList.remove('hidden');
    try {
        const res = await fetch('[https://jsonplaceholder.typicode.com/users](https://jsonplaceholder.typicode.com/users)');
        users = await res.json();
        render();
    } catch (err) {
        ui.list.innerHTML = `<p class="text-red-500">Erro ao carregar dados.</p>`;
    } finally {
        ui.loader.classList.add('hidden');
    }
}

function render() {
    const term = ui.search.value;
    const filtered = DevLogic.filterUsers(users, term);
    
    ui.list.innerHTML = filtered.map(user => {
        const isFav = favorites.includes(user.id);
        return `
            <div class="user-card bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm relative">
                <button onclick="handleFavorite(${user.id})" class="absolute top-4 right-4 text-2xl">
                    <span class="${isFav ? 'text-yellow-400' : 'text-slate-200 dark:text-slate-700'}">★</span>
                </button>
                <div class="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center font-bold mb-4">
                    ${DevLogic.formatAvatar(user.name)}
                </div>
                <h3 class="text-xl font-bold dark:text-white">${user.name}</h3>
                <p class="text-indigo-500 text-xs font-bold uppercase mb-4">${user.company.name}</p>
                <p class="text-slate-500 dark:text-slate-400 text-sm">📧 ${user.email}</p>
            </div>
        `;
    }).join('') || `<p class="col-span-full text-center text-slate-400 py-10">Nenhum resultado.</p>`;
}

window.handleFavorite = (id) => {
    favorites = DevLogic.toggleFavorite(favorites, id);
    localStorage.setItem('dev_favorites', JSON.stringify(favorites));
    render();
};

ui.search.addEventListener('input', render);
ui.themeBtn.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    ui.themeIcon.textContent = isDark ? '☀️' : '🌙';
});

window.onload = init;
