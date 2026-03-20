// ======================
// SUPER PREMIUM ABOUT PAGE
// ======================

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Only run on about page
    if (!document.querySelector('.about-hero')) return;
    
    console.log('💖 Super Premium About Page Initialized');
    
    // Initialize about page features
    initAboutPage();
});

function initAboutPage() {
    // Animate stats counter
    initStatsCounter();
    
    // Parallax effect on hero
    initParallaxEffect();
    
    // Hover effects on team cards
    initTeamHoverEffects();
    
    // Timeline animations
    initTimelineAnimation();
}

// ======================
// STATS COUNTER ANIMATION
// ======================
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const target = element.textContent;
                
                if (target.includes('K')) {
                    animateCounter(element, 0, 50, 2000);
                } else if (target.includes('+')) {
                    animateCounter(element, 0, 25, 2000);
                } else {
                    animateCounter(element, 2020, 2024, 2000);
                }
                
                observer.unobserve(element);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(number => observer.observe(number));
}

function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        if (element.textContent.includes('K')) {
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = `${value}K+`;
        } else if (element.textContent.includes('+')) {
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = `${value}+`;
        } else {
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value;
        }
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    
    window.requestAnimationFrame(step);
}

// ======================
// PARALLAX EFFECT
// ======================
function initParallaxEffect() {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.about-hero');
        
        if (hero) {
            hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
        }
    });
}

// ======================
// TEAM HOVER EFFECTS
// ======================
function initTeamHoverEffects() {
    const teamCards = document.querySelectorAll('.team-card');
    
    teamCards.forEach(card => {
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

// ======================
// TIMELINE ANIMATION
// ======================
function initTimelineAnimation() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    timelineItems.forEach(item => observer.observe(item));
}

// ======================
// SMOOTH SCROLL
// ======================
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