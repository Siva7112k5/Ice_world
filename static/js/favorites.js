// ======================
// SUPER PREMIUM FAVORITES SYSTEM
// ======================

let favorites = [];

function loadFavorites() {
    try {
        const savedFavorites = localStorage.getItem('pinkFavorites');
        favorites = savedFavorites ? JSON.parse(savedFavorites) : [];
        console.log('❤️ Favorites loaded:', favorites.length, 'items');
        return favorites;
    } catch (error) {
        console.error('Error loading favorites:', error);
        favorites = [];
        return [];
    }
}

function saveFavorites() {
    try {
        localStorage.setItem('pinkFavorites', JSON.stringify(favorites));
        console.log('❤️ Favorites saved:', favorites.length, 'items');
        updateGlobalFavoriteCount();
    } catch (error) {
        console.error('Error saving favorites:', error);
    }
}

function updateGlobalFavoriteCount() {
    const countElements = document.querySelectorAll('.favorites-count-badge');
    countElements.forEach(el => {
        el.textContent = favorites.length;
        el.style.display = favorites.length > 0 ? 'flex' : 'none';
    });
}

function toggleFavorite(flavor, id, buttonElement) {
    console.log('Toggling favorite:', { flavor, id });
    
    const favoriteKey = `${id}-${flavor}`;
    const existingIndex = favorites.findIndex(fav => fav.key === favoriteKey);
    
    if (existingIndex === -1) {
        const favoriteItem = {
            id: id,
            flavor: flavor,
            key: favoriteKey,
            timestamp: Date.now(),
            image: getIceCreamImageById(id),
            description: getIceCreamDescriptionById(id),
            rating: getIceCreamRatingById(id),
            price: getIceCreamPriceById(id)
        };
        
        favorites.push(favoriteItem);
        saveFavorites();
        
        if (buttonElement) {
            buttonElement.innerHTML = '❤️';
            buttonElement.classList.add('active');
            buttonElement.style.animation = 'heartBeat 0.4s ease';
            setTimeout(() => {
                buttonElement.style.animation = '';
            }, 400);
        }
        
        alert(`❤️ ${flavor} added to favorites!`);
        
    } else {
        favorites.splice(existingIndex, 1);
        saveFavorites();
        
        if (buttonElement) {
            buttonElement.innerHTML = '🤍';
            buttonElement.classList.remove('active');
        }
        
        alert(`💔 ${flavor} removed from favorites`);
    }
    
    if (window.location.pathname.includes('favorites.html')) {
        renderFavorites();
    }
    
    return favorites;
}

function getIceCreamImageById(id) {
    if (typeof ICE_CREAM_DATA !== 'undefined') {
        const item = ICE_CREAM_DATA.find(ice => ice.id == id);
        return item ? item.image : 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400';
    }
    return 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400';
}

function getIceCreamDescriptionById(id) {
    if (typeof ICE_CREAM_DATA !== 'undefined') {
        const item = ICE_CREAM_DATA.find(ice => ice.id == id);
        return item ? item.description : 'Delicious premium ice cream';
    }
    return 'Delicious premium ice cream';
}

function getIceCreamRatingById(id) {
    if (typeof ICE_CREAM_DATA !== 'undefined') {
        const item = ICE_CREAM_DATA.find(ice => ice.id == id);
        return item ? item.rating : 4.8;
    }
    return 4.8;
}

function getIceCreamPriceById(id) {
    if (typeof ICE_CREAM_DATA !== 'undefined') {
        const item = ICE_CREAM_DATA.find(ice => ice.id == id);
        return item ? item.price : 199;
    }
    return 199;
}

function isFavorite(flavor, id) {
    const favoriteKey = `${id}-${flavor}`;
    return favorites.some(fav => fav.key === favoriteKey);
}

function getFavorites() {
    return [...favorites];
}

function removeFavorite(favoriteKey) {
    const index = favorites.findIndex(fav => fav.key === favoriteKey);
    if (index !== -1) {
        const removed = favorites[index];
        favorites.splice(index, 1);
        saveFavorites();
        alert(`💔 ${removed.flavor} removed from favorites`);
        renderFavorites();
        return true;
    }
    return false;
}

function clearAllFavorites() {
    if (favorites.length > 0) {
        if (confirm('Remove all favorites?')) {
            const count = favorites.length;
            favorites = [];
            saveFavorites();
            alert(`🧹 Removed ${count} items from favorites`);
            renderFavorites();
            updateFavoriteButtons();
        }
    }
}

// ======================
// RENDER FAVORITES PAGE (SINGLE VERSION)
// ======================
function renderFavorites() {
    const favoritesGrid = document.getElementById('favoritesGrid');
    if (!favoritesGrid) return;
    
    loadFavorites();
    
    console.log('Rendering favorites page. Items:', favorites.length);
    
    const countText = document.getElementById('favoritesCountText');
    const countTitle = document.getElementById('favoritesCountTitle');
    
    if (countText) {
        countText.textContent = `${favorites.length} ${favorites.length === 1 ? 'item' : 'items'}`;
    }
    
    if (countTitle) {
        countTitle.textContent = favorites.length > 0 ? 'Your Favorites' : 'No Favorites Yet';
    }
    
    const recommendedSection = document.getElementById('recommendedSection');
    if (recommendedSection) {
        recommendedSection.style.display = favorites.length > 0 ? 'block' : 'none';
    }
    
    if (favorites.length === 0) {
        favoritesGrid.innerHTML = `
            <div class="empty-favorites">
                <div class="empty-favorites-icon">
                    <i class="fas fa-heart"></i>
                    <span>✨</span>
                </div>
                <h3>No <span>Favorites</span> Yet</h3>
                <p>Start adding your favorite flavors and they'll appear here!</p>
                <div class="empty-favorites-actions">
                    <a href="menu.html" class="btn-explore">
                        <i class="fas fa-ice-cream"></i> Explore Menu
                    </a>
                </div>
            </div>
        `;
        loadRecommendedItems();
        return;
    }
    
    favorites.sort((a, b) => b.timestamp - a.timestamp);
    
    favoritesGrid.innerHTML = favorites.map((fav, index) => {
        const rating = fav.rating || 4.8;
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStar;
        
        let starsHTML = '';
        for (let i = 0; i < fullStars; i++) starsHTML += '★';
        if (halfStar) starsHTML += '½';
        for (let i = 0; i < emptyStars; i++) starsHTML += '☆';
        
        return `
            <div class="favorite-card" data-key="${fav.key}" data-aos="fade-up" data-aos-delay="${index * 50}">
                <div class="favorite-badge">
                    <i class="fas fa-heart"></i> <span>Favorite</span>
                </div>
                
                <button class="favorite-remove-btn" onclick="removeFavorite('${fav.key}')">
                    <i class="fas fa-times"></i>
                </button>
                
                <div class="favorite-image-container">
                    <img src="${fav.image}" alt="${fav.flavor}" class="favorite-image" loading="lazy">
                    <div class="favorite-image-overlay">
                        <div class="overlay-heart">
                            <i class="fas fa-heart"></i>
                        </div>
                    </div>
                </div>
                
                <div class="favorite-content">
                    <h3 class="favorite-title">${fav.flavor}</h3>
                    <p class="favorite-description">${fav.description || 'Delicious premium ice cream'}</p>
                    
                    <div class="favorite-rating">
                        <span class="rating-stars">${starsHTML}</span>
                        <span class="rating-value">${rating}</span>
                    </div>
                    
                    <div class="favorite-price">
                        <span class="current-price">₹${(fav.price || 199).toFixed(2)}</span>
                        <span class="price-unit">/scoop</span>
                    </div>
                    
                    <div class="favorite-actions">
                        <a href="menu.html" class="btn-view">
                            <i class="fas fa-eye"></i> View
                        </a>
                        <button class="btn-add-cart" 
                                data-id="${fav.id}" 
                                data-name="${fav.flavor}" 
                                data-image="${fav.image}">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    attachFavoriteCartListeners();
    loadRecommendedItems();
}

function loadRecommendedItems() {
    const recommendedGrid = document.getElementById('recommendedGrid');
    if (!recommendedGrid) return;
    
    let recommended = [];
    
    if (typeof ICE_CREAM_DATA !== 'undefined') {
        const favoriteIds = favorites.map(f => f.id);
        const availableItems = ICE_CREAM_DATA.filter(item => !favoriteIds.includes(item.id));
        const shuffled = [...availableItems].sort(() => 0.5 - Math.random());
        recommended = shuffled.slice(0, 4);
    }
    
    if (recommended.length === 0) {
        recommendedGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #888;">No recommendations available</p>';
        return;
    }
    
    recommendedGrid.innerHTML = recommended.map(item => `
        <div class="recommended-card">
            <img src="${item.image}" alt="${item.name}" loading="lazy">
            <h4>${item.name}</h4>
            <div class="recommended-price">₹${(item.price || 199).toFixed(2)}</div>
            <button class="btn-recommended-add" 
                    data-id="${item.id}" 
                    data-name="${item.name}" 
                    data-image="${item.image}">
                <i class="fas fa-plus"></i> Add to Cart
            </button>
        </div>
    `).join('');
    
    recommendedGrid.querySelectorAll('.btn-recommended-add').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const flavorId = this.dataset.id;
            const flavor = this.dataset.name;
            const image = this.dataset.image;
            
            if (typeof window.addToCart === 'function') {
                window.addToCart({
                    flavorId,
                    flavor,
                    image,
                    topping: 'Sprinkles',
                    cone: 'Waffle',
                    qty: 1
                });
                
                this.innerHTML = '<i class="fas fa-check"></i> Added!';
                this.style.background = '#00b894';
                this.style.color = 'white';
                this.style.border = 'none';
                
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-plus"></i> Add to Cart';
                    this.style.background = 'transparent';
                    this.style.color = '#ff4d6d';
                    this.style.border = '2px solid #ff4d6d';
                }, 2000);
            }
        });
    });
}

function attachFavoriteCartListeners() {
    document.querySelectorAll('.btn-add-cart').forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const flavorId = this.dataset.id;
            const flavor = this.dataset.name;
            const image = this.dataset.image;
            
            if (typeof window.addToCart === 'function') {
                window.addToCart({
                    flavorId,
                    flavor,
                    image,
                    topping: 'Sprinkles',
                    cone: 'Waffle',
                    qty: 1
                });
                
                this.innerHTML = '<i class="fas fa-check"></i> Added!';
                this.style.background = '#00b894';
                
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
                    this.style.background = 'linear-gradient(135deg, #ff4d6d, #ff8cae)';
                }, 2000);
            }
        });
    });
}

function updateFavoriteButtons() {
    const favoriteButtons = document.querySelectorAll('.favorite-btn, .menu-favorite-btn');
    
    favoriteButtons.forEach(btn => {
        const flavor = btn.dataset.flavor;
        const id = btn.dataset.id;
        
        if (flavor && id) {
            const isFav = isFavorite(flavor, id);
            btn.innerHTML = isFav ? '❤️' : '🤍';
            btn.classList.toggle('active', isFav);
        }
    });
}

function initFavorites() {
    loadFavorites();
    
    if (document.querySelector('.favorite-btn, .menu-favorite-btn')) {
        setTimeout(() => {
            updateFavoriteButtons();
        }, 500);
    }
    
    if (window.location.pathname.includes('favorites.html')) {
        renderFavorites();
    }
    
    console.log('❤️ Favorites system initialized');
}

window.favorites = favorites;
window.toggleFavorite = toggleFavorite;
window.isFavorite = isFavorite;
window.getFavorites = getFavorites;
window.removeFavorite = removeFavorite;
window.clearAllFavorites = clearAllFavorites;
window.renderFavorites = renderFavorites;
window.updateFavoriteButtons = updateFavoriteButtons;
window.initFavorites = initFavorites;

document.addEventListener('DOMContentLoaded', function() {
    initFavorites();
});

window.addEventListener('pageshow', function() {
    initFavorites();
});