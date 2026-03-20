// Cart Management System
(function() {
    // Cart storage key
    const CART_KEY = 'pinkCart';
    
    // Get cart from localStorage
    function getCart() {
        try {
            return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
        } catch(e) {
            return [];
        }
    }
    
    // Save cart to localStorage
    function saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        // Trigger cart update event
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    }
    
    // Add item to cart
    window.addToCart = function(item) {
        const cart = getCart();
        cart.push({
            ...item,
            id: Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            addedAt: new Date().toISOString()
        });
        saveCart(cart);
        showNotification(`${item.flavor} added to cart! 🍦`, 'success');
        return true;
    };
    
    // Remove item from cart
    window.removeFromCart = function(itemId) {
        let cart = getCart();
        const removedItem = cart.find(item => item.id === itemId);
        cart = cart.filter(item => item.id !== itemId);
        saveCart(cart);
        if (removedItem) {
            showNotification(`${removedItem.flavor} removed from cart`, 'info');
        }
        return true;
    };
    
    // Update item quantity
    window.updateCartItemQty = function(itemId, qty) {
        const cart = getCart();
        const item = cart.find(item => item.id === itemId);
        if (item) {
            item.qty = Math.max(1, qty);
            saveCart(cart);
        }
        return true;
    };
    
    // Clear entire cart
    window.clearCart = function() {
        saveCart([]);
        showNotification('Cart cleared', 'info');
        return true;
    };
    
    // Get cart total
    window.getCartTotal = function() {
        const cart = getCart();
        return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    };
    
    // Get cart item count
    window.getCartCount = function() {
        const cart = getCart();
        return cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    };
    
    // Export cart for checkout
    window.getCartForCheckout = function() {
        return getCart();
    };
    
    // Update global cart count
    window.updateGlobalCartCount = function() {
        const count = getCartCount();
        const cartCountEl = document.getElementById('globalCartCount');
        if (cartCountEl) {
            cartCountEl.textContent = count;
            cartCountEl.style.display = count > 0 ? 'flex' : 'none';
        }
    };
    
    // Listen for cart updates
    window.addEventListener('cartUpdated', function() {
        if (typeof window.updateGlobalCartCount === 'function') {
            window.updateGlobalCartCount();
        }
        // Also update cart display if on cart page
        if (typeof window.renderCart === 'function') {
            window.renderCart();
        }
    });
    
    // Initialize
    document.addEventListener('DOMContentLoaded', function() {
        window.updateGlobalCartCount();
    });
})();