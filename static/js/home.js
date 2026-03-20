// ======================
// PREMIUM HOME PAGE
// ======================

document.addEventListener('DOMContentLoaded', function() {
    initPremiumHome();
});

function initPremiumHome() {
    // Only run on home page
    if (!document.querySelector('.hero-3d-container')) return;
    
    console.log('🚀 Initializing Premium Home Page...');
    
    // Initialize all premium features
    initParallaxEffects();
    initCounterAnimation();
    initTypingEffect();
    init3DTilt();
    initSmoothScroll();
    initHoverEffects();
}

// 1. PARALLAX EFFECTS
function initParallaxEffects() {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        
        // Parallax for floating ice creams
        const icecreams = document.querySelectorAll('.icecream-3d');
        icecreams.forEach((ice, index) => {
            const speed = 0.1 + (index * 0.05);
            ice.style.transform = `translateY(${scrolled * speed}px)`;
        });
        
        // Parallax for particles
        const particles = document.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            const speed = 0.05 + (index * 0.02);
            particle.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
        });
    });
}

// 2. COUNTER ANIMATION
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number, .hero-badges + div div:first-child');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.textContent) || 50;
                animateCounter(counter, 0, target, 2000);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        
        if (element.classList.contains('stat-number')) {
            element.textContent = value + (element.textContent.includes('K') ? 'K+' : '');
        } else {
            element.textContent = value + (element.textContent.includes('★') ? '★' : '');
        }
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// 3. TYPING EFFECT
function initTypingEffect() {
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (!heroSubtitle) return;
    
    const originalText = heroSubtitle.textContent;
    heroSubtitle.textContent = '';
    
    let i = 0;
    function typeWriter() {
        if (i < originalText.length) {
            heroSubtitle.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    }
    
    // Start typing after a delay
    setTimeout(typeWriter, 1000);
}

// 4. 3D TILT EFFECT
function init3DTilt() {
    const cards = document.querySelectorAll('.feature-card-premium, .offer-card-premium');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// 5. SMOOTH SCROLL
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// 6. HOVER EFFECTS
function initHoverEffects() {
    // Gallery hover sound effect (optional)
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transition = 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        });
    });
    
    // Floating animation on hero icons
    const heroIcons = document.querySelectorAll('.premium-badge');
    heroIcons.forEach((icon, index) => {
        icon.style.animation = `float ${3 + index}s ease-in-out infinite`;
    });
}

// 7. PARTICLE GENERATOR
function createParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'generated-particle';
        particle.innerHTML = ['🍦', '🌸', '🍓', '✨', '💖'][Math.floor(Math.random() * 5)];
        particle.style.cssText = `
            position: absolute;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            font-size: ${Math.random() * 2 + 1}rem;
            opacity: ${Math.random() * 0.3 + 0.1};
            animation: particleFloat ${Math.random() * 10 + 10}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
            pointer-events: none;
            z-index: 1;
        `;
        hero.appendChild(particle);
    }
}

// 8. CURSOR EFFECT
function initCursorEffect() {
    // const cursor = document.createElement('div');
    // cursor.className = 'custom-cursor';
    cursor.style.cssText = `
         width: 30px;
         height: 30px;
         border: 2px solid var(--rich-pink);
         border-radius: 50%;
         position: fixed;
         pointer-events: none;
         z-index: 9999;
         transition: all 0.1s ease;
         transition-property: width, height, border, transform;
         transform: translate(-50%, -50%);
         display: none;
    `;
    document.body.appendChild(cursor);
    
    const cursorDot = document.createElement('div');
    cursorDot.style.cssText = `
        width: 6px;
        height: 6px;
        background: var(--rich-pink);
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        transition: all 0.05s ease;
        transform: translate(-50%, -50%);
        display: none;
    `;
    document.body.appendChild(cursorDot);
    
    // Only show custom cursor on non-touch devices
    if (!('ontouchstart' in window)) {
        cursor.style.display = 'block';
        cursorDot.style.display = 'block';
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            cursorDot.style.left = e.clientX + 'px';
            cursorDot.style.top = e.clientY + 'px';
        });
        
        // Hover effect on clickable elements
        document.querySelectorAll('a, button, .btn-premium, .feature-card-premium, .offer-card-premium').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.width = '50px';
                cursor.style.height = '50px';
                cursor.style.border = '2px solid #ff8cae';
                cursor.style.backgroundColor = 'rgba(255,77,109,0.1)';
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.style.width = '30px';
                cursor.style.height = '30px';
                cursor.style.border = '2px solid var(--rich-pink)';
                cursor.style.backgroundColor = 'transparent';
            });
        });
    }
}

// 9. LOADING PROGRESS BAR
function initLoadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'loading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: var(--pink-gradient);
        z-index: 10000;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// 10. Initialize everything
window.addEventListener('load', function() {
    // Create particles after page load
    setTimeout(() => {
        createParticles();
    }, 2000);
    
    // Initialize cursor effect
    initCursorEffect();
    
    // Initialize loading progress
    initLoadingProgress();
    
    // Animate feature cards sequentially
    const featureCards = document.querySelectorAll('.feature-card-premium');
    featureCards.forEach((card, index) => {
        card.style.animation = `fadeInUp 0.6s ease ${index * 0.2}s forwards`;
    });
});

// Export functions for global use
window.initPremiumHome = initPremiumHome;
