// ======================
// ORDER PAGE - COMPLETE WORKING VERSION (INR UPDATED)
// ======================

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Only run on order page
    if (!document.getElementById('cartItemsList')) return;
    
    console.log('🛒 Order Page Initialized');
    
    // Initialize order page
    initOrderPage();
});

// ======================
// INITIALIZE ORDER PAGE
// ======================
function initOrderPage() {
    // Render cart items
    renderCartItems();
    
    // Initialize event listeners
    initOrderEventListeners();
    initCustomerModal();
    loadRecommendedItems();
}

// ======================
// RENDER CART ITEMS (INR UPDATED)
// ======================
function renderCartItems() {
    const container = document.getElementById('cartItemsList');
    const countSpan = document.getElementById('cartItemCount');
    
    if (!container) return;
    
    const cartItems = getCart();
    const totalItems = getCartItemCount();
    
    if (countSpan) {
        countSpan.textContent = totalItems + ' items';
    }
    
    if (cartItems.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <h3>Your cart is empty</h3>
                <p>Looks like you haven't added any sweet treats yet!</p>
                <a href="menu.html" class="btn-browse-menu">
                    <span>Browse Menu</span>
                    <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        `;
        
        const orderSummary = document.getElementById('orderSummary');
        if (orderSummary) {
            orderSummary.style.display = 'none';
        }
        return;
    }
    
    const orderSummary = document.getElementById('orderSummary');
    if (orderSummary) {
        orderSummary.style.display = 'block';
    }
    
    let html = '';
    
    for (let i = 0; i < cartItems.length; i++) {
        const item = cartItems[i];
        const itemTotal = item.qty * item.price;
        
        html += `
            <div class="cart-item" data-cart-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.flavor}" loading="lazy">
                </div>
                
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.flavor}</h4>
                    <div class="cart-item-specs">
                        <span class="cart-item-spec">
                            <i class="fas fa-candy-cane"></i>
                            ${item.topping}
                        </span>
                        <span class="cart-item-spec">
                            <i class="fas fa-ice-cream"></i>
                            ${item.cone}
                        </span>
                    </div>
                    <div class="cart-item-price">
                        Price per scoop: <strong>₹${item.price}</strong>
                    </div>
                </div>
                
                <div class="cart-item-actions">
                    <div class="cart-item-quantity">
                        <button class="qty-btn minus" onclick="decreaseQuantity('${item.id}')">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" class="qty-input" value="${item.qty}" 
                               min="1" max="10" readonly>
                        <button class="qty-btn plus" onclick="increaseQuantity('${item.id}')">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    
                    <div class="cart-item-total">
                        ₹${itemTotal}
                    </div>
                    
                    <button class="btn-remove" onclick="removeFromCart('${item.id}')">
                        <i class="fas fa-trash-alt"></i> Remove
                    </button>
                </div>
            </div>
        `;
    }
    
    container.innerHTML = html;
    updateOrderSummary();
}

// ======================
// UPDATE ORDER SUMMARY (INR UPDATED)
// ======================
function updateOrderSummary() {
    const cartItems = getCart();
    
    const subtotalEl = document.getElementById('summarySubtotal');
    const deliveryEl = document.getElementById('summaryDelivery');
    const taxEl = document.getElementById('summaryTax');
    const totalEl = document.getElementById('summaryTotal');
    
    if (!subtotalEl) return;
    
    if (cartItems.length === 0) {
        subtotalEl.textContent = '₹0';
        if (deliveryEl) deliveryEl.innerHTML = '₹0';
        if (taxEl) taxEl.textContent = '₹0';
        if (totalEl) totalEl.textContent = '₹0';
        return;
    }
    
    let subtotal = 0;
    for (let i = 0; i < cartItems.length; i++) {
        subtotal = subtotal + (cartItems[i].qty * cartItems[i].price);
    }
    
    const delivery = subtotal >= 999 ? 0 : 49;
    const tax = Math.round(subtotal * 0.05);
    let total = subtotal + delivery + tax;
    
    // Apply promo discount
    const discount = applyPromoCode();
    total = total - discount;
    
    subtotalEl.textContent = '₹' + subtotal;
    deliveryEl.innerHTML = delivery === 0 ? '<span class="free-delivery">FREE</span>' : '₹' + delivery;
    taxEl.textContent = '₹' + tax;
    totalEl.textContent = '₹' + total;
}

// ======================
// PROMO CODE SYSTEM (INR UPDATED)
// ======================
let activeDiscount = 0;
let appliedPromoCode = '';

function applyPromoCode() {
    const promoInput = document.getElementById('promoCode');
    if (!promoInput) return 0;
    
    const code = promoInput.value.toUpperCase();
    const promoMessage = document.getElementById('promoMessage');
    
    if (!code) {
        activeDiscount = 0;
        appliedPromoCode = '';
        if (promoMessage) promoMessage.innerHTML = '';
        return 0;
    }
    
    const cartItems = getCart();
    let subtotal = 0;
    for (let i = 0; i < cartItems.length; i++) {
        subtotal = subtotal + (cartItems[i].qty * cartItems[i].price);
    }
    
    if (code === 'PINK10') {
        const discount = Math.round(subtotal * 0.1);
        activeDiscount = discount;
        appliedPromoCode = code;
        if (promoMessage) {
            promoMessage.innerHTML = '<span style="color: #00b894;"><i class="fas fa-check-circle"></i> 10% discount applied! (Save ₹' + discount + ')</span>';
        }
        return discount;
    } else if (code === 'FREESHIP') {
        activeDiscount = 0;
        appliedPromoCode = code;
        if (promoMessage) {
            promoMessage.innerHTML = '<span style="color: #00b894;"><i class="fas fa-check-circle"></i> Free delivery applied!</span>';
        }
        return 0;
    } else if (code === 'WELCOME50') {
        activeDiscount = 50;
        appliedPromoCode = code;
        if (promoMessage) {
            promoMessage.innerHTML = '<span style="color: #00b894;"><i class="fas fa-check-circle"></i> ₹50 discount applied!</span>';
        }
        return 50;
    } else {
        if (promoMessage) {
            promoMessage.innerHTML = '<span style="color: #ff4d6d;"><i class="fas fa-exclamation-circle"></i> Invalid promo code</span>';
        }
        activeDiscount = 0;
        appliedPromoCode = '';
        return 0;
    }
}

// ======================
// ORDER EVENT LISTENERS
// ======================
function initOrderEventListeners() {
    // Clear cart button
    const clearCartBtn = document.getElementById('clearCartBtn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (typeof window.clearCart === 'function') {
                window.clearCart();
            }
        });
    }
    
    // Apply promo button
    const applyPromoBtn = document.getElementById('applyPromoBtn');
    if (applyPromoBtn) {
        applyPromoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            applyPromoCode();
            updateOrderSummary();
        });
    }
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        // Remove existing listeners
        const newCheckoutBtn = checkoutBtn.cloneNode(true);
        checkoutBtn.parentNode.replaceChild(newCheckoutBtn, checkoutBtn);
        
        newCheckoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const cartItems = getCart();
            
            if (cartItems.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            
            // Show customer modal
            const modal = document.getElementById('customerDetailsModal');
            if (modal) {
                loadCustomerOrderItems();
                modal.classList.add('show');
            }
        });
    }
}

// ======================
// CUSTOMER MODAL FUNCTIONS (INR UPDATED)
// ======================

function initCustomerModal() {
    const modal = document.getElementById('customerDetailsModal');
    if (!modal) return;
    
    const closeBtn = modal.querySelector('.customer-modal-close');
    const cancelBtn = document.getElementById('cancelCustomerModal');
    const form = document.getElementById('customerForm');
    const paymentSelect = document.getElementById('paymentMethod');
    const upiOptions = document.getElementById('upiOptions');
    
    // Close modal function
    const closeModal = function() {
        modal.classList.remove('show');
    };
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    if (paymentSelect && upiOptions) {
        paymentSelect.addEventListener('change', function() {
            if (this.value === 'upi') {
                upiOptions.style.display = 'block';
            } else {
                upiOptions.style.display = 'none';
            }
        });
    }
    
    if (form) {
        // Remove existing listeners
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);
        
        // ===== UPDATED FORM SUBMISSION WITH ORDER CONFIRMATION =====
        newForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate all required fields
            const name = document.getElementById('fullName')?.value;
            const phone = document.getElementById('phoneNumber')?.value;
            const address = document.getElementById('deliveryAddress')?.value;
            const city = document.getElementById('city')?.value;
            const pincode = document.getElementById('pincode')?.value;
            const paymentMethod = document.getElementById('paymentMethod')?.value;
            
            // Comprehensive validation
            if (!name || !phone || !address || !city || !pincode || !paymentMethod) {
                alert('Please fill all required fields');
                return;
            }
            
            // Validate phone number (10 digits)
            if (!/^\d{10}$/.test(phone)) {
                alert('Please enter valid 10-digit phone number');
                return;
            }
            
            // Validate pincode (6 digits)
            if (!/^\d{6}$/.test(pincode)) {
                alert('Please enter valid 6-digit pincode');
                return;
            }
            
            // Get all form data
            const customerData = {
                fullName: name,
                phoneNumber: phone,
                email: document.getElementById('emailAddress')?.value || '',
                deliveryAddress: address,
                deliveryInstructions: document.getElementById('deliveryInstructions')?.value || '',
                city: city,
                pincode: pincode,
                paymentMethod: paymentMethod,
                upiId: document.getElementById('upiId')?.value || ''
            };
            
            // Get cart items
            const cartItems = getCart();
            
            // Calculate final total
            let subtotal = 0;
            for (let i = 0; i < cartItems.length; i++) {
                subtotal = subtotal + (cartItems[i].qty * cartItems[i].price);
            }
            
            const delivery = subtotal >= 999 ? 0 : 49;
            const tax = Math.round(subtotal * 0.05);
            const discount = activeDiscount || 0;
            const total = subtotal + delivery + tax - discount;
            
            // Generate unique order ID (format: PSC-YYYYMMDD-XXXXX)
            const date = new Date();
            const dateStr = date.getFullYear() + 
                           String(date.getMonth() + 1).padStart(2, '0') + 
                           String(date.getDate()).padStart(2, '0');
            const randomNum = Math.floor(10000 + Math.random() * 90000);
            const orderId = 'PSC-' + dateStr + '-' + randomNum;
            
            // Create complete order object
            const orderData = {
                orderId: orderId,
                orderDate: date.toISOString(),
                customer: customerData,
                items: cartItems,
                pricing: {
                    subtotal: subtotal,
                    delivery: delivery,
                    tax: tax,
                    discount: discount,
                    total: total
                },
                appliedPromo: appliedPromoCode || null,
                status: 'confirmed',
                timestamp: Date.now()
            };
            
            // ===== STORE ORDER IN LOCAL STORAGE =====
            // Get existing orders or create new array
            let allOrders = [];
            try {
                const savedOrders = localStorage.getItem('pinkOrders');
                if (savedOrders) {
                    allOrders = JSON.parse(savedOrders);
                }
            } catch(e) {
                console.log('Error loading orders:', e);
                allOrders = [];
            }
            
            // Add new order
            allOrders.push(orderData);
            
            // Save to localStorage
            try {
                localStorage.setItem('pinkOrders', JSON.stringify(allOrders));
                console.log('Order saved to localStorage:', orderId);
            } catch(e) {
                console.log('Error saving order:', e);
            }
            
            // Close modal
            closeModal();
            
            // ===== CLEAR CART =====
            
            
            // ===== REDIRECT TO SUCCESS PAGE =====
            // Store order ID in session for success page
            sessionStorage.setItem('lastOrderId', orderId);
            sessionStorage.setItem('lastOrderTotal', total);
            
            // Redirect to success page (create success.html if needed)
            localStorage.removeItem("pinkCart");
            window.location.href = 'order-success.html?order=' + orderId;
            
            // Alternative: Show success message and stay on page
            // showOrderSuccess(orderId, total);
        });
    }
}

// ======================
// OPTIONAL: SHOW SUCCESS MODAL (if you prefer not to redirect)
// ======================
function showOrderSuccess(orderId, total) {
    // Create success message element
    const successDiv = document.createElement('div');
    successDiv.className = 'order-success-message';
    successDiv.innerHTML = `
        <div class="success-content">
            <div class="success-icon">🎉</div>
            <h2>Order Confirmed!</h2>
            <p>Thank you for shopping with Pink Scoops</p>
            <div class="success-details">
                <p><i class="fas fa-check-circle"></i> Order ID: ${orderId}</p>
                <p><i class="fas fa-rupee-sign"></i> Total: ₹${total}</p>
                <p><i class="fas fa-truck"></i> Delivery within 30-45 minutes</p>
                <p><i class="fas fa-envelope"></i> Confirmation sent to your email</p>
            </div>
            <button class="success-btn" onclick="window.location.href='menu.html'">Continue Shopping</button>
        </div>
    `;
    
    document.body.appendChild(successDiv);
    
    // Auto remove after 8 seconds
    setTimeout(() => {
        const msg = document.querySelector('.order-success-message');
        if (msg) {
            msg.classList.add('fade-out');
            setTimeout(() => {
                if (msg.parentNode) {
                    msg.remove();
                }
            }, 300);
        }
    }, 8000);
}

function loadCustomerOrderItems() {
    const container = document.getElementById('customerOrderItems');
    const totalEl = document.getElementById('customerOrderTotal');
    
    if (!container || !totalEl) return;
    
    const cartItems = getCart();
    let total = 0;
    let html = '';
    
    for (let i = 0; i < cartItems.length; i++) {
        const item = cartItems[i];
        const itemTotal = item.qty * item.price;
        total = total + itemTotal;
        
        html = html + `
            <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px dashed #eee;">
                <span>${item.flavor} x${item.qty}</span>
                <span>₹${itemTotal}</span>
            </div>
        `;
    }
    
    container.innerHTML = html;
    totalEl.textContent = '₹' + total;
}

// ======================
// LOAD RECOMMENDED ITEMS (INR UPDATED)
// ======================
function loadRecommendedItems() {
    const recommendedContainer = document.getElementById('recommendedItems');
    if (!recommendedContainer) return;
    
    const recommended = [
        { id: 'rec1', name: 'Mango Magic', price: 199, image: 'properties/Mango-Ice-Cream-frt.jpg' },
        { id: 'rec2', name: 'Nutty Caramel crunch', price: 249, image: 'properties/nutty spc.jpg' },
        { id: 'rec3', name: 'Oreo Volcano', price: 219, image: 'properties/oreo spc.jpg' },
        { id: 'rec4', name: 'Strawberry Swirl', price: 239, image: 'properties/fruit.jpg' }
    ];
    
    let html = '';
    
    for (let i = 0; i < recommended.length; i++) {
        const item = recommended[i];
        html += `
            <div style="background: white; padding: 1rem; border-radius: 20px; text-align: center; box-shadow: 0 5px 15px rgba(0,0,0,0.05);">
                <img src="${item.image}" alt="${item.name}" style="width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 15px;">
                <h4 style="color: #ff4d6d; margin: 0.5rem 0;">${item.name}</h4>
                <p style="font-weight: bold; color: #ff4d6d;">₹${item.price}</p>
                <button onclick="addToCart({flavor:'${item.name}', image:'${item.image}', price:${item.price}})" 
                        style="background: #ff4d6d; color: white; border: none; padding: 0.5rem 1rem; border-radius: 25px; cursor: pointer;">
                    <i class="fas fa-plus"></i> Add
                </button>
            </div>
        `;
    }
    
    recommendedContainer.innerHTML = html;
}

// Make functions globally available
window.renderCartItems = renderCartItems;
window.updateOrderSummary = updateOrderSummary;
window.applyPromoCode = applyPromoCode;
window.loadCustomerOrderItems = loadCustomerOrderItems;
document.getElementById("customerForm").addEventListener("submit", function(e){

e.preventDefault();

// cart data
const cartData = JSON.parse(localStorage.getItem("pinkCart")) || [];

// save order
localStorage.setItem("lastOrder", JSON.stringify(cartData));

// generate order id
const orderId = "PSC-" + Date.now();

// clear cart
localStorage.removeItem("pinkCart");

// redirect success page
window.location.href = "success.html?order=" + orderId;

});