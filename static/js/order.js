// Order Page JavaScript
(function() {
    let cartItems = [];
    
    // Load cart items
    function loadCart() {
        if (typeof window.getCartForCheckout === 'function') {
            cartItems = window.getCartForCheckout();
            renderCartItems();
            updateSummary();
        }
    }
    
    // Render cart items
    function renderCartItems() {
        const container = document.getElementById('cartItemsList');
        if (!container) return;
        
        if (cartItems.length === 0) {
            container.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">🛒</div>
                    <h3>Your cart is empty</h3>
                    <p>Looks like you haven't added any ice cream yet.</p>
                    <a href="/menu" class="btn-primary">Browse Menu</a>
                </div>
            `;
            document.getElementById('cartItemCount').textContent = '0 items';
            return;
        }
        
        container.innerHTML = cartItems.map((item, index) => `
            <div class="cart-item" data-index="${index}">
                <div class="cart-item-image">
                    <img src="${item.image || 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400'}" alt="${item.flavor}">
                </div>
                <div class="cart-item-details">
                    <h4>${item.flavor}</h4>
                    <p>${item.topping || 'Sprinkles'} • ${item.cone || 'Waffle'}</p>
                    <div class="cart-item-price">₹${item.price}</div>
                </div>
                <div class="cart-item-quantity">
                    <button onclick="updateCartItemQty(${index}, ${item.qty - 1})">-</button>
                    <span>${item.qty}</span>
                    <button onclick="updateCartItemQty(${index}, ${item.qty + 1})">+</button>
                </div>
                <div class="cart-item-total">₹${item.price * item.qty}</div>
                <button class="cart-item-remove" onclick="removeCartItem(${index})">🗑️</button>
            </div>
        `).join('');
        
        document.getElementById('cartItemCount').textContent = `${cartItems.length} items`;
    }
    
    // Update cart item quantity
    window.updateCartItemQty = function(index, newQty) {
        if (newQty < 1) return;
        cartItems[index].qty = newQty;
        saveCartAndUpdate();
    };
    
    // Remove cart item
    window.removeCartItem = function(index) {
        cartItems.splice(index, 1);
        saveCartAndUpdate();
    };
    
    // Save cart and update UI
    function saveCartAndUpdate() {
        localStorage.setItem('pinkCart', JSON.stringify(cartItems));
        renderCartItems();
        updateSummary();
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    }
    
    // Update order summary
    function updateSummary() {
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
        const delivery = subtotal > 999 ? 0 : 49;
        const tax = Math.round(subtotal * 0.05);
        let total = subtotal + delivery + tax;
        
        // Apply promo discount if any
        let discount = 0;
        const promoCode = document.getElementById('promoCode')?.value;
        if (promoCode === 'PINK10') {
            discount = Math.round(total * 0.1);
            total -= discount;
        }
        
        document.getElementById('summarySubtotal').textContent = `₹${subtotal}`;
        document.getElementById('summaryDelivery').textContent = delivery === 0 ? 'FREE' : `₹${delivery}`;
        document.getElementById('summaryTax').textContent = `₹${tax}`;
        document.getElementById('summaryTotal').textContent = `₹${total}`;
        
        // Store total for checkout
        window.currentOrderTotal = total;
    }
    
    // Apply promo code
    function setupPromo() {
        const applyBtn = document.getElementById('applyPromoBtn');
        if (applyBtn) {
            applyBtn.addEventListener('click', function() {
                const code = document.getElementById('promoCode').value;
                const messageEl = document.getElementById('promoMessage');
                
                if (code === 'PINK10') {
                    messageEl.innerHTML = '<span style="color: #00b894;">✓ Promo code applied! 10% off</span>';
                    updateSummary();
                } else if (code === '') {
                    messageEl.innerHTML = '';
                    updateSummary();
                } else {
                    messageEl.innerHTML = '<span style="color: #d63031;">✗ Invalid promo code</span>';
                }
            });
        }
    }
    
    // Checkout
    function setupCheckout() {
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', function() {
                if (cartItems.length === 0) {
                    showNotification('Your cart is empty!', 'error');
                    return;
                }
                showCustomerModal();
            });
        }
    }
    
    // Show customer details modal
    function showCustomerModal() {
        const modal = document.getElementById('customerDetailsModal');
        if (modal) {
            modal.style.display = 'flex';
            renderOrderItemsInModal();
        }
    }
    
    // Render order items in modal
    function renderOrderItemsInModal() {
        const container = document.getElementById('customerOrderItems');
        if (!container) return;
        
        container.innerHTML = cartItems.map(item => `
            <div class="modal-order-item">
                <span>${item.flavor} x ${item.qty}</span>
                <span>₹${item.price * item.qty}</span>
            </div>
        `).join('');
        
        document.getElementById('customerOrderTotal').textContent = `₹${window.currentOrderTotal}`;
    }
    
    // Submit order
    function setupOrderSubmit() {
        const form = document.getElementById('customerForm');
        if (form) {
            form.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const orderData = {
                    customer: {
                        fullName: document.getElementById('fullName').value,
                        phoneNumber: document.getElementById('phoneNumber').value,
                        email: document.getElementById('emailAddress').value,
                        deliveryAddress: document.getElementById('deliveryAddress').value,
                        city: document.getElementById('city').value,
                        pincode: document.getElementById('pincode').value,
                        instructions: document.getElementById('deliveryInstructions').value,
                        paymentMethod: document.getElementById('paymentMethod').value
                    },
                    items: cartItems,
                    pricing: {
                        subtotal: cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0),
                        delivery: cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0) > 999 ? 0 : 49,
                        tax: Math.round(cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0) * 0.05),
                        discount: 0,
                        total: window.currentOrderTotal
                    }
                };
                
                try {
                    const response = await fetch('/api/orders', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(orderData)
                    });
                    
                    const result = await response.json();
                    
                    // Save to localStorage for order history
                    let orders = JSON.parse(localStorage.getItem('pinkOrders') || '[]');
                    orders.push(result);
                    localStorage.setItem('pinkOrders', JSON.stringify(orders));
                    
                    // Clear cart
                    localStorage.removeItem('pinkCart');
                    
                    // Store last order ID
                    sessionStorage.setItem('lastOrderId', result.orderId);
                    sessionStorage.setItem('lastOrderTotal', result.pricing.total);
                    
                    // Show success and redirect
                    showNotification('Order placed successfully! 🎉', 'success');
                    setTimeout(() => {
                        window.location.href = `/order-success?order=${result.orderId}`;
                    }, 1500);
                    
                } catch(e) {
                    console.error('Error placing order:', e);
                    showNotification('Error placing order. Please try again.', 'error');
                }
            });
        }
    }
    
    // Modal close functionality
    function setupModal() {
        const modal = document.getElementById('customerDetailsModal');
        const closeBtn = document.querySelector('.customer-modal-close');
        const cancelBtn = document.getElementById('cancelCustomerModal');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
        
        // Close on outside click
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // Show UPI field when UPI is selected
        const paymentMethod = document.getElementById('paymentMethod');
        if (paymentMethod) {
            paymentMethod.addEventListener('change', function() {
                const upiOptions = document.getElementById('upiOptions');
                if (upiOptions) {
                    upiOptions.style.display = this.value === 'upi' ? 'block' : 'none';
                }
            });
        }
    }
    
    // Initialize
    document.addEventListener('DOMContentLoaded', function() {
        loadCart();
        setupPromo();
        setupCheckout();
        setupOrderSubmit();
        setupModal();
        
        // Clear cart button
        const clearCartBtn = document.getElementById('clearCartBtn');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to clear your cart?')) {
                    cartItems = [];
                    saveCartAndUpdate();
                }
            });
        }
    });
})();