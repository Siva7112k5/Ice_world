// ======================
// CART MANAGEMENT - COMPLETE WORKING VERSION (INR UPDATED)
// ======================

// Cart state
let cart = [];

function initCart() {
    const savedCart = localStorage.getItem("pinkCart");
    cart = savedCart ? JSON.parse(savedCart) : [];
    updateGlobalCartCount();
    if (typeof window.renderCartItems === "function") {
        window.renderCartItems();
    }
}

// ======================
// SAVE CART TO STORAGE
// ======================
function saveCart() {
    try {
        localStorage.setItem('pinkCart', JSON.stringify(cart));
        console.log('Cart saved:', cart.length, 'items');
    } catch(e) {
        console.log('Error saving cart:', e);
    }
    updateGlobalCartCount();
}

// ======================
// GET CART DATA
// ======================
window.getCart = function() {
    return [...cart];
};

// ======================
// GET CART ITEM COUNT
// ======================
window.getCartItemCount = function() {
    let count = 0;
    for (let i = 0; i < cart.length; i++) {
        count = count + (cart[i].qty || 1);
    }
    return count;
};

// ======================
// CALCULATE CART TOTAL (INR UPDATED)
// ======================
window.calculateCartTotal = function() {
    let total = 0;
    for (let i = 0; i < cart.length; i++) {
        total = total + ((cart[i].qty || 1) * (cart[i].price || 199));
    }
    return total;
};

// ======================
// UPDATE GLOBAL CART COUNT
// ======================
window.updateGlobalCartCount = function() {
    const count = getCartItemCount();
    const cartCountElements = document.querySelectorAll('#globalCartCount, .cart-count');
    
    for (let i = 0; i < cartCountElements.length; i++) {
        const el = cartCountElements[i];
        if (el) {
            el.textContent = count;
            el.style.display = count > 0 ? 'flex' : 'none';
        }
    }
};

// ======================
// ADD TO CART (INR UPDATED)
// ======================
window.addToCart = function(item) {
    console.log('Adding to cart:', item);
    
    if (!item || !item.flavor) {
        alert('Invalid item');
        return false;
    }
    
    const cartItem = {
        id: 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        flavor: item.flavor,
        image: item.image || 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400',
        topping: item.topping || 'Sprinkles',
        cone: item.cone || 'Waffle',
        qty: parseInt(item.qty) || 1,
        price: parseInt(item.price) || 199
    };
    
    cart.push(cartItem);
    saveCart();
    
    alert('✅ ' + cartItem.flavor + ' added to cart!');
    return cartItem;
};

// ======================
// REMOVE FROM CART
// ======================
window.removeFromCart = function(itemId) {
    console.log('Removing item:', itemId);
    
    if (!itemId) {
        alert('Invalid item ID');
        return false;
    }
    
    let newCart = [];
    let removedItem = '';
    
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === itemId) {
            removedItem = cart[i].flavor;
        } else {
            newCart.push(cart[i]);
        }
    }
    
    cart = newCart;
    saveCart();
    
    alert('🗑️ ' + removedItem + ' removed from cart');
    
    if (typeof window.renderCartItems === 'function') {
        window.renderCartItems();
    }
    
    return true;
};

// ======================
// INCREASE QUANTITY
// ======================
window.increaseQuantity = function(itemId) {
    console.log('Increasing quantity:', itemId);
    
    if (!itemId) return false;
    
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === itemId) {
            if (cart[i].qty >= 10) {
                alert('Maximum quantity is 10');
                return false;
            }
            cart[i].qty = (cart[i].qty || 1) + 1;
            saveCart();
            
            if (typeof window.renderCartItems === 'function') {
                window.renderCartItems();
            }
            return true;
        }
    }
    
    return false;
};

// ======================
// DECREASE QUANTITY
// ======================
window.decreaseQuantity = function(itemId) {
    console.log('Decreasing quantity:', itemId);
    
    if (!itemId) return false;
    
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === itemId) {
            if (cart[i].qty <= 1) {
                if (confirm('Remove this item from cart?')) {
                    removeFromCart(itemId);
                }
                return false;
            }
            cart[i].qty = (cart[i].qty || 1) - 1;
            saveCart();
            
            if (typeof window.renderCartItems === 'function') {
                window.renderCartItems();
            }
            return true;
        }
    }
    
    return false;
};

// ======================
// CLEAR CART
// ======================
window.clearCart = function() {
    console.log('Clearing cart');
    
    if (cart.length === 0) {
        alert('Your cart is already empty!');
        return false;
    }
    
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        saveCart();
        alert('✅ Cart cleared successfully!');
        
        if (typeof window.renderCartItems === 'function') {
            window.renderCartItems();
        }
        return true;
    }
    
    return false;
};

// ======================
// UPDATE CART ITEM QUANTITY
// ======================
window.updateCartItemQuantity = function(itemId, newQty) {
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === itemId) {
            cart[i].qty = Math.min(Math.max(parseInt(newQty) || 1, 1), 10);
            saveCart();
            return true;
        }
    }
    return false;
};

// Initialize cart when page loads
document.addEventListener("DOMContentLoaded", function() {
    initCart();
});
// Add to cart.js
async function syncCartWithServer() {
    const token = localStorage.getItem('pinkToken');
    if (!token) return;
    
    try {
        await fetch(`${API_BASE}/cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ items: getCart() })
        });
    } catch (error) {
        console.log('Offline mode - cart saved locally');
    }
}