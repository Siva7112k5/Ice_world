// Main JavaScript file
console.log('Pink Scoops - Main JS Loaded');

// Global functions
function showNotification(message, type = 'info') {
    // This will be defined in notifications.js
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
    }
}

// Update cart count globally
function updateGlobalCartCount() {
    try {
        const cart = JSON.parse(localStorage.getItem('pinkCart') || '[]');
        const cartCount = cart.reduce((sum, item) => sum + (item.qty || 0), 0);
        const cartCountEl = document.getElementById('globalCartCount');
        if (cartCountEl) {
            cartCountEl.textContent = cartCount;
            cartCountEl.style.display = cartCount > 0 ? 'flex' : 'none';
        }
    } catch(e) {
        console.error('Error updating cart count:', e);
    }
}

// Update history count
function updateGlobalHistoryCount() {
    try {
        const orders = JSON.parse(localStorage.getItem('pinkOrders') || '[]');
        const historyCountEl = document.getElementById('globalHistoryCount');
        if (historyCountEl) {
            historyCountEl.textContent = orders.length;
            historyCountEl.style.display = orders.length > 0 ? 'flex' : 'none';
        }
    } catch(e) {
        console.error('Error updating history count:', e);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    updateGlobalCartCount();
    updateGlobalHistoryCount();
    
    // Listen for cart updates
    window.addEventListener('cartUpdated', function() {
        updateGlobalCartCount();
    });
    
    // Listen for order updates
    window.addEventListener('orderPlaced', function() {
        updateGlobalHistoryCount();
    });
});