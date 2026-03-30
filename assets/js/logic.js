const DevLogic = {
    filterUsers: (users, term) => {
        const lowerTerm = term.toLowerCase();
        return users.filter(u => 
            u.name.toLowerCase().includes(lowerTerm) || 
            u.company.name.toLowerCase().includes(lowerTerm)
        );
    },

    toggleFavorite: (favorites, id) => {
        return favorites.includes(id) 
            ? favorites.filter(favId => favId !== id) 
            : [...favorites, id];
    },

    formatAvatar: (name) => name.charAt(0).toUpperCase()
};
