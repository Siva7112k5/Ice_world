// ======================
// NOTIFICATION SYSTEM
// ======================

// Ensure notification function is globally available
window.showNotification = function(message, type = 'success', duration = 3000) {
    console.log('Notification called:', message); // Debug log
    
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Icon based on type
    const icons = {
        success: '✅',
        info: 'ℹ️',
        warning: '⚠️', 
        error: '❌'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${icons[type] || '📢'}</span>
            <span class="notification-message">${message}</span>
        </div>
        <button class="notification-close">×</button>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Auto remove
    const timeout = setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }
    }, duration);
    
    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            clearTimeout(timeout);
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
    }
};

// Add notification styles dynamically (if not already in CSS)
function addNotificationStyles() {
    if (document.querySelector('#notification-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(255, 77, 109, 0.2);
            padding: 1rem 1.5rem;
            display: flex;
            align-items: center;
            gap: 1rem;
            transform: translateX(120%);
            transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            z-index: 9999;
            border-left: 4px solid var(--rich-pink, #ff4d6d);
            max-width: 400px;
            min-width: 300px;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.8rem;
            flex: 1;
        }
        
        .notification-icon {
            font-size: 1.3rem;
        }
        
        .notification-message {
            color: #333;
            font-weight: 500;
            font-size: 0.95rem;
        }
        
        .notification-close {
            background: none;
            border: none;
            font-size: 1.3rem;
            cursor: pointer;
            color: #999;
            transition: color 0.2s;
            padding: 0 0.2rem;
        }
        
        .notification-close:hover {
            color: var(--rich-pink, #ff4d6d);
        }
        
        .notification-success {
            border-left-color: #00b894;
        }
        
        .notification-info {
            border-left-color: var(--rich-pink, #ff4d6d);
        }
        
        .notification-warning {
            border-left-color: #fdcb6e;
        }
        
        .notification-error {
            border-left-color: #d63031;
        }
        
        @media (max-width: 480px) {
            .notification {
                left: 20px;
                right: 20px;
                min-width: auto;
                max-width: none;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Initialize notification styles
addNotificationStyles();

console.log('Notification system loaded'); // Debug log

console.log("NEW FILE LOADED");