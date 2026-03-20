// Menu Page JavaScript
(function() {
    // Menu items data (will be loaded from server)
    let menuItems = [];
    
    // Load menu items from server
    async function loadMenuItems() {
        try {
            const response = await fetch('/api/products');
            menuItems = await response.json();
            renderMenuGrid(menuItems);
            updateItemCount(menuItems.length);
        } catch(e) {
            console.error('Error loading menu:', e);
            showNotification('Error loading menu items', 'error');
        }
    }
    
    // Render menu grid
    function renderMenuGrid(items) {
        const grid = document.getElementById('menuGrid');
        if (!grid) return;
        
        if (items.length === 0) {
            grid.innerHTML = `
                <div class="menu-empty-state">
                    <div class="menu-empty-icon">🔍</div>
                    <h3>No Flavors Found</h3>
                    <p>We couldn't find any ice cream matching your search.</p>
                    <button class="menu-empty-btn" onclick="clearSearch()">
                        <i class="fas fa-undo-alt"></i>
                        Clear Search
                    </button>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = items.map(item => `
            <div class="menu-card" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}">
                <div class="menu-card-badges">
                    <button class="menu-favorite-btn" onclick="toggleFavorite('${item.name}', ${item.id}, this)">
                        🤍
                    </button>
                    <div class="menu-rating-badge">
                        <span>⭐</span>
                        <small>${item.rating}</small>
                    </div>
                </div>
                
                <div class="menu-card-image-wrapper">
                    <img src="${item.image}" alt="${item.name}" class="menu-card-image">
                    <div class="menu-card-overlay">
                        <div class="menu-card-quick-view" onclick="quickView(${item.id})">
                            <i class="fas fa-eye"></i>
                            Quick View
                        </div>
                    </div>
                </div>
                
                <h3 class="menu-card-title">${item.name}</h3>
                <p class="menu-card-desc">${item.description}</p>
                
                <div class="menu-card-price">
                    <span class="menu-current-price">₹${item.price}</span>
                    ${item.old_price ? `<span class="menu-old-price">₹${item.old_price}</span>` : ''}
                    <span class="menu-price-unit">/scoop</span>
                </div>
                
                <div class="menu-customize-section">
                    <div class="menu-customize-group">
                        <div class="menu-customize-label">
                            <span>🍬</span>
                            <span>Topping</span>
                        </div>
                        <select class="menu-customize-select" data-topping>
                            ${(item.toppings || ['Sprinkles', 'Chocolate Sauce', 'Strawberry Syrup']).map(t => `<option value="${t}">${t}</option>`).join('')}
                        </select>
                    </div>
                    
                    <div class="menu-customize-group">
                        <div class="menu-customize-label">
                            <span>🍦</span>
                            <span>Cone</span>
                        </div>
                        <select class="menu-customize-select" data-cone>
                            ${(item.cones || ['Waffle', 'Sugar', 'Chocolate']).map(c => `<option value="${c}">${c}</option>`).join('')}
                        </select>
                    </div>
                </div>
                
                <div class="menu-quantity-control">
                    <button class="menu-qty-btn" onclick="decrementQty(this)">-</button>
                    <input type="number" class="menu-qty-input" value="1" min="1" max="10">
                    <button class="menu-qty-btn" onclick="incrementQty(this)">+</button>
                </div>
                
                <button class="menu-add-to-cart" onclick="addToCartFromCard(this)">
                    <i class="fas fa-cart-plus"></i>
                    Add to Cart
                </button>
            </div>
        `).join('');
        
        // Initialize favorite buttons
        document.querySelectorAll('.menu-favorite-btn').forEach(btn => {
            const card = btn.closest('.menu-card');
            const id = parseInt(card.dataset.id);
            const name = card.dataset.name;
            updateFavoriteButton(btn, id, name);
        });
    }
    
    // Add to cart from card
    window.addToCartFromCard = function(button) {
        const card = button.closest('.menu-card');
        const id = parseInt(card.dataset.id);
        const name = card.dataset.name;
        const price = parseInt(card.dataset.price);
        
        const toppingSelect = card.querySelector('[data-topping]');
        const coneSelect = card.querySelector('[data-cone]');
        const qtyInput = card.querySelector('.menu-qty-input');
        
        const item = {
            id: id,
            flavor: name,
            price: price,
            topping: toppingSelect ? toppingSelect.value : 'Sprinkles',
            cone: coneSelect ? coneSelect.value : 'Waffle',
            qty: parseInt(qtyInput.value),
            image: card.querySelector('.menu-card-image')?.src || ''
        };
        
        if (typeof window.addToCart === 'function') {
            window.addToCart(item);
        }
    };
    
    // Quantity controls
    window.incrementQty = function(btn) {
        const input = btn.parentElement.querySelector('.menu-qty-input');
        input.value = Math.min(parseInt(input.value) + 1, 10);
    };
    
    window.decrementQty = function(btn) {
        const input = btn.parentElement.querySelector('.menu-qty-input');
        input.value = Math.max(parseInt(input.value) - 1, 1);
    };
    
    // Quick view
    window.quickView = function(id) {
        const item = menuItems.find(i => i.id === id);
        if (item) {
            showNotification(`${item.name} - ₹${item.price} per scoop`, 'info');
        }
    };
    
    // Search functionality
    function setupSearch() {
        const searchInput = document.getElementById('menuSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', function(e) {
                const query = e.target.value.toLowerCase();
                const filtered = menuItems.filter(item => 
                    item.name.toLowerCase().includes(query) ||
                    item.description.toLowerCase().includes(query)
                );
                renderMenuGrid(filtered);
                updateItemCount(filtered.length);
            });
        }
    }
    
    // Filter functionality
    function setupFilters() {
        const filterBtns = document.querySelectorAll('.menu-filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const filter = this.dataset.filter;
                let filtered = menuItems;
                
                if (filter !== 'all') {
                    filtered = menuItems.filter(item => item.category === filter);
                }
                
                renderMenuGrid(filtered);
                updateItemCount(filtered.length);
            });
        });
    }
    
    // Sort functionality
    function setupSort() {
        const sortSelect = document.getElementById('menuSortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', function() {
                const sortBy = this.value;
                let sorted = [...menuItems];
                
                switch(sortBy) {
                    case 'price-low':
                        sorted.sort((a, b) => a.price - b.price);
                        break;
                    case 'price-high':
                        sorted.sort((a, b) => b.price - a.price);
                        break;
                    case 'rating':
                        sorted.sort((a, b) => b.rating - a.rating);
                        break;
                    case 'name':
                        sorted.sort((a, b) => a.name.localeCompare(b.name));
                        break;
                    default:
                        sorted = [...menuItems];
                }
                
                renderMenuGrid(sorted);
                updateItemCount(sorted.length);
            });
        }
    }
    
    // Update item count display
    function updateItemCount(count) {
        const countEl = document.getElementById('menuItemCount');
        const showingEl = document.getElementById('menuShowingCount');
        if (countEl) countEl.textContent = `${count} items`;
        if (showingEl) showingEl.textContent = `Showing ${count} flavors`;
    }
    
    // Clear search
    window.clearSearch = function() {
        const searchInput = document.getElementById('menuSearchInput');
        if (searchInput) {
            searchInput.value = '';
            renderMenuGrid(menuItems);
            updateItemCount(menuItems.length);
        }
    };
    
    // Initialize
    document.addEventListener('DOMContentLoaded', function() {
        loadMenuItems();
        setupSearch();
        setupFilters();
        setupSort();
    });
})();