// Favorites Management System
(function() {
    const FAVORITES_KEY = 'pinkFavorites';
    
    // Get favorites from localStorage
    function getFavorites() {
        try {
            return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
        } catch(e) {
            return [];
        }
    }
    
    // Save favorites
    function saveFavorites(favorites) {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        window.dispatchEvent(new CustomEvent('favoritesUpdated'));
    }
    
    // Toggle favorite
    window.toggleFavorite = function(flavor, id, buttonElement) {
        let favorites = getFavorites();
        const existingIndex = favorites.findIndex(f => f.id === id || f.flavor === flavor);
        
        if (existingIndex >= 0) {
            favorites.splice(existingIndex, 1);
            if (buttonElement) {
                buttonElement.classList.remove('active');
                buttonElement.innerHTML = '🤍';
            }
            showNotification(`Removed ${flavor} from favorites`, 'info');
        } else {
            favorites.push({
                id: id,
                flavor: flavor,
                addedAt: new Date().toISOString()
            });
            if (buttonElement) {
                buttonElement.classList.add('active');
                buttonElement.innerHTML = '❤️';
            }
            showNotification(`${flavor} added to favorites! ❤️`, 'success');
        }
        
        saveFavorites(favorites);
        return favorites;
    };
    
    // Check if item is favorite
    window.isFavorite = function(id, flavor) {
        const favorites = getFavorites();
        return favorites.some(f => f.id === id || f.flavor === flavor);
    };
    
    // Get all favorites
    window.getFavorites = function() {
        return getFavorites();
    };
    
    // Clear all favorites
    window.clearAllFavorites = function() {
        if (confirm('Are you sure you want to clear all favorites?')) {
            saveFavorites([]);
            showNotification('All favorites cleared', 'info');
            if (typeof window.renderFavorites === 'function') {
                window.renderFavorites();
            }
        }
    };
    
    // Update favorite button UI
    window.updateFavoriteButton = function(button, id, flavor) {
        if (window.isFavorite(id, flavor)) {
            button.classList.add('active');
            button.innerHTML = '❤️';
        } else {
            button.classList.remove('active');
            button.innerHTML = '🤍';
        }
    };
})();