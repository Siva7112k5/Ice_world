// ======================
// MENU PAGE - INR VERSION (UPDATED)
// ======================
function showMenuSkeleton() {
    // loading effect optional
}
// Render menu items with INR prices
function renderPremiumMenuItems() {
    const menuGrid = document.getElementById('menuGrid');
    if (!menuGrid) return;
    
    
    
    // Simulate loading delay
    setTimeout(() => {
        menuGrid.innerHTML = ICE_CREAM_DATA.map((iceCream, index) => `
            <div class="menu-card" data-category="${iceCream.category}" 
                 data-id="${iceCream.id}" 
                 data-price="${iceCream.price}" 
                 data-rating="${iceCream.rating}"
                 data-name="${iceCream.name}"
                 style="animation-delay: ${index * 0.1}s">
                
                <!-- Card Badges -->
                <div class="menu-card-badges">
                    <button class="menu-favorite-btn" data-flavor="${iceCream.name}" data-id="${iceCream.id}">
                        🤍
                    </button>
                    <div class="menu-rating-badge">
                        <span>⭐</span>
                        <small>${iceCream.rating}</small>
                    </div>
                </div>
                
                <!-- Image with Overlay -->
                <div class="menu-card-image-wrapper">
                    <img src="${iceCream.image}" alt="${iceCream.name}" class="menu-card-image" loading="lazy">
                    <div class="menu-card-overlay">
                        <button class="menu-card-quick-view" data-id="${iceCream.id}">
                            <i class="fas fa-eye"></i>
                            Quick View
                        </button>
                    </div>
                </div>
                
                <!-- Content -->
                <h3 class="menu-card-title">${iceCream.name}</h3>
                <p class="menu-card-desc">${iceCream.description}</p>
                
                <!-- Price in INR (UPDATED) -->
                <div class="menu-card-price">
                    <span class="menu-current-price">₹${iceCream.price.toFixed(2)}</span>
                    <span class="menu-old-price">₹${(iceCream.price + 80).toFixed(2)}</span>
                    <span class="menu-price-unit">/scoop</span>
                </div>
                
                <!-- Customization Section -->
                <div class="menu-customize-section">
                    <div class="menu-customize-group">
                        <label class="menu-customize-label">
                            <span>🍫</span> Choose Topping
                        </label>
                        <select class="menu-customize-select topping-select">
                            ${TOPPING_OPTIONS.map(option => 
                                `<option value="${option}">${option}</option>`
                            ).join('')}
                        </select>
                    </div>
                    
                    <div class="menu-customize-group">
                        <label class="menu-customize-label">
                            <span>🍦</span> Choose Cone
                        </label>
                        <select class="menu-customize-select cone-select">
                            ${CONE_OPTIONS.map(option => 
                                `<option value="${option}">${option}</option>`
                            ).join('')}
                        </select>
                    </div>
                    
                    <div class="menu-customize-group">
                        <label class="menu-customize-label">
                            <span>🔢</span> Quantity
                        </label>
                        <div class="menu-quantity-control">
                            <button class="menu-qty-btn minus" type="button">−</button>
                            <input type="number" class="menu-qty-input" value="1" min="1" max="10" readonly>
                            <button class="menu-qty-btn plus" type="button">+</button>
                        </div>
                    </div>
                </div>
                
                <!-- Add to Cart Button with INR (UPDATED) -->
                <button class="menu-add-to-cart" data-id="${iceCream.id}" 
                        data-name="${iceCream.name}" 
                        data-image="${iceCream.image}">
                    <i class="fas fa-shopping-cart"></i>
                    <span>Add to Cart · ₹${iceCream.price.toFixed(2)}</span>
                </button>
            </div>
        `).join('');
        // Add to Cart Button Click
        menuGrid.querySelectorAll('.menu-add-to-cart').forEach(btn => {
    btn.addEventListener('click', function () {

        const card = this.closest('.menu-card');
        const qtyInput = card.querySelector('.menu-qty-input');
        const quantity = parseInt(qtyInput.value) || 1;

        const iceCreamId = parseInt(this.dataset.id);

        const iceCream = ICE_CREAM_DATA.find(item => item.id === iceCreamId);

        if (!iceCream) return;

        // ✅ Call Cart Function
        const addedItem = addToCart({
            flavor: iceCream.name,
            image: iceCream.image,
            topping: card.querySelector('.topping-select').value,
            cone: card.querySelector('.cone-select').value,
            qty: quantity,
            price: iceCream.price
        });

        if (!addedItem) return;

        // 🟢 Button UI Change
        this.classList.add('added');
        this.innerHTML = `<i class="fas fa-check"></i> Added!`;
        this.disabled = true;

        setTimeout(() => {
            this.classList.remove('added');
            this.innerHTML = `
                <i class="fas fa-shopping-cart"></i>
                <span>Add to Cart · ₹${iceCream.price.toFixed(2)}</span>
            `;
            this.disabled = false;
        }, 2000);

    });
});
        
        // Attach event listeners
        // Attach quantity button listeners
menuGrid.querySelectorAll('.menu-qty-btn.minus').forEach(btn => {
    btn.addEventListener('click', () => {
        const input = btn.parentElement.querySelector('.menu-qty-input');
        let value = parseInt(input.value) || 1;
        if (value > 1) {
            input.value = value - 1;
        }
    });
});

menuGrid.querySelectorAll('.menu-qty-btn.plus').forEach(btn => {
    btn.addEventListener('click', () => {
        const input = btn.parentElement.querySelector('.menu-qty-input');
        let value = parseInt(input.value) || 1;
        if (value < 10) {
            input.value = value + 1;
        }
    });
});
        
        
    }, 800);
}
if (typeof updateFavoriteButtons === "function") {
    updateFavoriteButtons();
}

// ======================
// FIXED - PERFECTLY ALIGNED QUICK VIEW MODAL (UPDATED WITH INR)
// ======================

window.createQuickViewModal = function() {
    if (document.getElementById('quickViewModal')) return;
    
    const modalHTML = `
        <div id="quickViewModal" class="quick-view-modal">
            <div class="quick-view-content">
                <button class="quick-view-close">&times;</button>
                
                <div class="quick-view-body">
                    <div class="quick-view-image-section">
                        <div class="quick-view-image-wrapper">
                            <img id="quickViewImage" src="" alt="Ice Cream">
                        </div>
                    </div>
                    
                    <div class="quick-view-info-section">
                        <h2 id="quickViewTitle" class="quick-view-title"></h2>
                        
                        <div class="quick-view-rating-container">
                            <div class="quick-view-stars" id="quickViewStars"></div>
                            <span id="quickViewRating" class="quick-view-rating-text"></span>
                        </div>
                        
                        <p id="quickViewDescription" class="quick-view-description"></p>
                        
                        <div class="quick-view-price-container">
                            <span id="quickViewCurrentPrice" class="quick-view-current-price"></span>
                            <span id="quickViewOldPrice" class="quick-view-old-price"></span>
                        </div>
                        
                        <div class="quick-view-customize-section">
                            <h3>Customize Your Treat</h3>
                            
                            <div class="quick-view-option">
                                <label>🍫 Select Topping</label>
                                <select id="quickViewTopping" class="quick-view-select">
                                    <option value="Sprinkles">Sprinkles</option>
                                    <option value="Chocolate Chips">Chocolate Chips</option>
                                    <option value="Strawberry Syrup">Strawberry Syrup</option>
                                    <option value="Marshmallow">Marshmallow</option>
                                    <option value="Cookie Crumbles">Cookie Crumbles</option>
                                </select>
                            </div>
                            
                            <div class="quick-view-option">
                                <label>🍦 Select Cone</label>
                                <select id="quickViewCone" class="quick-view-select">
                                    <option value="Waffle Cone">Waffle Cone</option>
                                    <option value="Sugar Cone">Sugar Cone</option>
                                    <option value="Plain Cone">Plain Cone</option>
                                    <option value="Chocolate Dip Cone">Chocolate Dip Cone</option>
                                </select>
                            </div>
                            
                            <div class="quick-view-option">
                                <label>🔢 Quantity</label>
                                <div class="quick-view-quantity">
                                    <button class="quick-view-qty-btn minus" type="button">−</button>
                                    <input type="number" id="quickViewQty" class="quick-view-qty-input" value="1" min="1" max="10" readonly>
                                    <button class="quick-view-qty-btn plus" type="button">+</button>
                                </div>
                            </div>
                        </div>
                        
                        <button id="quickViewAddToCart" class="quick-view-add-to-cart">
                            <i class="fas fa-shopping-cart"></i>
                            Add to Cart - <span id="quickViewTotalPrice">₹4.99</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add CSS (keeping your existing CSS, just updating the modal styles with INR colors)
    const style = document.createElement('style');
    style.textContent = `
        .quick-view-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(8px);
            z-index: 99999;
            align-items: center;
            justify-content: center;
            animation: qvFadeIn 0.3s ease;
        }
        
        .quick-view-modal.show {
            display: flex;
        }
        
        .quick-view-content {
            background: white;
            width: 95%;
            max-width: 1200px;
            border-radius: 40px;
            position: relative;
            animation: qvSlideUp 0.4s ease;
            box-shadow: 0 40px 80px rgba(255, 77, 109, 0.3);
            overflow: hidden;
        }
        
        .quick-view-close {
            position: absolute;
            top: 20px;
            right: 25px;
            background: rgba(255, 255, 255, 0.9);
            border: none;
            font-size: 3rem;
            line-height: 1;
            cursor: pointer;
            color: #666;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.3s ease;
            z-index: 100;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .quick-view-close:hover {
            background: #ff4d6d;
            color: white;
            transform: rotate(90deg);
        }
        
        .quick-view-body {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0;
            background: white;
        }
        
        .quick-view-image-section {
            background: linear-gradient(145deg, #fff0f3, #ffffff);
            padding: 3rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .quick-view-image-wrapper {
            width: 100%;
            aspect-ratio: 1;
            border-radius: 30px;
            overflow: hidden;
            box-shadow: 0 25px 50px rgba(255, 77, 109, 0.25);
            border: 5px solid white;
        }
        
        .quick-view-image-wrapper img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.6s ease;
        }
        
        .quick-view-image-wrapper:hover img {
            transform: scale(1.1);
        }
        
        .quick-view-info-section {
            padding: 3rem;
            background: white;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }
        
        .quick-view-title {
            font-size: 2.5rem;
            font-weight: 800;
            color: #ff4d6d;
            margin: 0;
            line-height: 1.2;
        }
        
        .quick-view-rating-container {
            display: flex;
            align-items: center;
            gap: 0.8rem;
        }
        
        .quick-view-stars {
            color: #ffd700;
            font-size: 1.3rem;
            letter-spacing: 3px;
        }
        
        .quick-view-rating-text {
            color: #666;
            font-weight: 600;
            background: #fff0f3;
            padding: 0.3rem 1rem;
            border-radius: 30px;
            font-size: 0.9rem;
        }
        
        .quick-view-description {
            color: #555;
            line-height: 1.8;
            font-size: 1.1rem;
            margin: 0;
        }
        
        .quick-view-price-container {
            display: flex;
            align-items: baseline;
            gap: 1rem;
            margin: 0.5rem 0;
        }
        
        .quick-view-current-price {
            font-size: 2.2rem;
            font-weight: 800;
            color: #ff4d6d;
        }
        
        .quick-view-old-price {
            font-size: 1.3rem;
            color: #999;
            text-decoration: line-through;
        }
        
        .quick-view-customize-section {
            background: linear-gradient(145deg, #fff8f9, #ffffff);
            padding: 2rem;
            border-radius: 25px;
            border: 1px solid rgba(255, 77, 109, 0.1);
        }
        
        .quick-view-customize-section h3 {
            font-size: 1.3rem;
            color: #ff4d6d;
            margin: 0 0 1.5rem 0;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .quick-view-option {
            margin-bottom: 1.2rem;
        }
        
        .quick-view-option label {
            display: block;
            font-size: 0.95rem;
            color: #555;
            margin-bottom: 0.5rem;
            font-weight: 600;
        }
        
        .quick-view-select {
            width: 100%;
            padding: 1rem 1.2rem;
            border: 2px solid rgba(255, 77, 109, 0.1);
            border-radius: 15px;
            font-size: 0.95rem;
            color: #333;
            background: white;
            cursor: pointer;
            transition: all 0.3s ease;
            appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='%23ff4d6d'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 1.2rem center;
        }
        
        .quick-view-select:focus {
            outline: none;
            border-color: #ff4d6d;
            box-shadow: 0 0 0 4px rgba(255, 77, 109, 0.1);
        }
        
        .quick-view-quantity {
            display: flex;
            align-items: center;
            gap: 1rem;
            background: white;
            border-radius: 50px;
            padding: 0.3rem;
            border: 2px solid rgba(255, 77, 109, 0.1);
        }
        
        .quick-view-qty-btn {
            width: 45px;
            height: 45px;
            border: none;
            background: linear-gradient(135deg, #fff0f3, #ffffff);
            color: #ff4d6d;
            font-size: 1.5rem;
            font-weight: bold;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .quick-view-qty-btn:hover {
            background: linear-gradient(135deg, #ff4d6d, #ff8cae);
            color: white;
            transform: scale(0.95);
        }
        
        .quick-view-qty-input {
            width: 70px;
            text-align: center;
            border: none;
            font-size: 1.2rem;
            font-weight: 700;
            color: #333;
            background: transparent;
        }
        
        .quick-view-qty-input:focus {
            outline: none;
        }
        
        .quick-view-add-to-cart {
            background: linear-gradient(135deg, #ff4d6d, #ff8cae);
            color: white;
            border: none;
            padding: 1.2rem 2rem;
            border-radius: 50px;
            font-weight: 700;
            font-size: 1.2rem;
            cursor: pointer;
            transition: all 0.4s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            margin-top: 0.5rem;
            border: 2px solid transparent;
        }
        
        .quick-view-add-to-cart:hover {
            transform: translateY(-5px) scale(1.02);
            box-shadow: 0 20px 40px rgba(255, 77, 109, 0.4);
            border-color: white;
        }
        
        .quick-view-add-to-cart i {
            font-size: 1.3rem;
            animation: qvBounce 2s infinite;
        }
        
        @keyframes qvFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes qvSlideUp {
            from {
                opacity: 0;
                transform: translateY(50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes qvBounce {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(5px); }
        }
        
        @media (max-width: 992px) {
            .quick-view-body {
                grid-template-columns: 1fr;
            }
            
            .quick-view-image-section {
                padding: 2rem;
            }
            
            .quick-view-info-section {
                padding: 2rem;
            }
            
            .quick-view-title {
                font-size: 2rem;
            }
        }
        
        @media (max-width: 576px) {
            .quick-view-content {
                width: 95%;
                max-height: 90vh;
                overflow-y: auto;
            }
            
            .quick-view-info-section {
                padding: 1.5rem;
            }
            
            .quick-view-title {
                font-size: 1.8rem;
            }
            
            .quick-view-current-price {
                font-size: 1.8rem;
            }
            
            .quick-view-customize-section {
                padding: 1.5rem;
            }
        }
    `;
    
    document.head.appendChild(style);
    
    // Modal close functionality
    const modal = document.getElementById('quickViewModal');
    const closeBtn = modal.querySelector('.quick-view-close');
    
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
    
    // Quantity controls
    const qtyInput = document.getElementById('quickViewQty');
    const minusBtn = modal.querySelector('.quick-view-qty-btn.minus');
    const plusBtn = modal.querySelector('.quick-view-qty-btn.plus');
    
    if (minusBtn) {
        minusBtn.addEventListener('click', () => {
            let val = parseInt(qtyInput.value) || 1;
            if (val > 1) {
                qtyInput.value = val - 1;
                updateTotalPrice();
            }
        });
    }
    
    if (plusBtn) {
        plusBtn.addEventListener('click', () => {
            let val = parseInt(qtyInput.value) || 1;
            if (val < 10) {
                qtyInput.value = val + 1;
                updateTotalPrice();
            }
        });
    }
    
    // Update total price function with INR
    function updateTotalPrice() {
        const priceEl = document.getElementById('quickViewCurrentPrice');
        const totalEl = document.getElementById('quickViewTotalPrice');
        const qty = parseInt(document.getElementById('quickViewQty').value) || 1;
        
        if (priceEl && totalEl) {
            const price = parseFloat(priceEl.textContent.replace('₹', '')) || 4.99;
            totalEl.textContent = `₹${(price * qty).toFixed(2)}`;
        }
    }
    
    // Add to cart functionality
    const addBtn = document.getElementById('quickViewAddToCart');
    if (addBtn) {
        addBtn.addEventListener('click', function() {
            const flavorId = modal.dataset.flavorId;
            const flavor = modal.dataset.flavorName;
            const image = modal.dataset.flavorImage;
            const topping = document.getElementById('quickViewTopping')?.value || 'Sprinkles';
            const cone = document.getElementById('quickViewCone')?.value || 'Waffle Cone';
            const qty = parseInt(document.getElementById('quickViewQty')?.value) || 1;
            
            if (typeof window.addToCart === 'function') {
                window.addToCart({
                    flavorId,
                    flavor,
                    image,
                    topping,
                    cone,
                    qty
                });
                
                // Animate button
                this.style.background = '#00b894';
                this.innerHTML = '<i class="fas fa-check"></i> Added to Cart!';
                
                setTimeout(() => {
                    modal.classList.remove('show');
                }, 800);
            }
        });
    }
};

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('menuGrid')) {
        // Create modal
        if (typeof window.createQuickViewModal === 'function') {
            window.createQuickViewModal();
        }
        
        // Initialize quick view
       // initQuickView();
    }
});
document.addEventListener("DOMContentLoaded", function () {
    renderPremiumMenuItems();
})
// ======================
// ADD TO CART CLICK HANDLER (WORKING)
// ======================


// ======================
// FILTER FUNCTIONALITY
// ======================

function initMenuFilters() {
    const filterButtons = document.querySelectorAll('.menu-filter-btn');
    const menuCards = document.querySelectorAll('.menu-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {

            // Active button style
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            menuCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = "block";
                } else {
                    card.style.display = "none";
                }
            });

            
        });
    });
}

// Call after menu render
document.addEventListener("DOMContentLoaded", function () {
    setTimeout(() => {
        initMenuFilters();
    }, 1000);
});
// ======================
// SEARCH FUNCTIONALITY
// ======================

function initMenuSearch() {
    const searchInput = document.getElementById('menuSearchInput');
    const menuCards = document.querySelectorAll('.menu-card');
    const emptyState = document.getElementById('menuEmptyState');

    if (!searchInput) return;

    searchInput.addEventListener('input', function () {
        const searchValue = this.value.toLowerCase();
        let visibleCount = 0;

        menuCards.forEach(card => {
            const name = card.getAttribute('data-name').toLowerCase();

            if (name.includes(searchValue)) {
                card.style.display = "block";
                visibleCount++;
            } else {
                card.style.display = "none";
            }
        });

        // Show empty state
        if (visibleCount === 0) {
            emptyState.style.display = "block";
        } else {
            emptyState.style.display = "none";
        }

        document.getElementById('menuShowingCount').innerText =
            `Showing ${visibleCount} flavors`;
    });
}

// Call after render
document.addEventListener("DOMContentLoaded", function () {
    setTimeout(() => {
        initMenuSearch();
    }, 1000);
});
// ======================
// SORT FUNCTIONALITY
// ======================

function initMenuSort() {
    const sortSelect = document.getElementById('menuSortSelect');
    const menuGrid = document.getElementById('menuGrid');

    if (!sortSelect || !menuGrid) return;

    sortSelect.addEventListener('change', function () {
        const sortValue = this.value;
        const cards = Array.from(menuGrid.querySelectorAll('.menu-card'));

        cards.sort((a, b) => {
            const priceA = parseFloat(a.dataset.price);
            const priceB = parseFloat(b.dataset.price);
            const ratingA = parseFloat(a.dataset.rating);
            const ratingB = parseFloat(b.dataset.rating);
            const nameA = a.dataset.name.toLowerCase();
            const nameB = b.dataset.name.toLowerCase();

            if (sortValue === 'price-low') return priceA - priceB;
            if (sortValue === 'price-high') return priceB - priceA;
            if (sortValue === 'rating') return ratingB - ratingA;
            if (sortValue === 'name') return nameA.localeCompare(nameB);

            // Featured (default) → original order
            return 0;
        });

        // Re-append sorted cards
        cards.forEach(card => menuGrid.appendChild(card));
    });
}

// Call after render
document.addEventListener("DOMContentLoaded", function () {
    setTimeout(() => {
        initMenuSort();
    }, 1000);
});
// ======================


