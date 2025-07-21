// Kalpvruksh AI - Cyberpunk Landing Page JavaScript (Fixed)

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMatrixBackground();
    initScrollReveal();
    initSmoothScrolling();
    initCyberpunkEffects();
    initExternalLinks();
    
    console.log('🚀 Kalpvruksh AI Cyberpunk Interface Loaded');
});

/**
 * Initialize Matrix Digital Rain Background
 */
function initMatrixBackground() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Matrix characters (including Japanese katakana for authentic look)
    const matrixChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    
    // Drops array - one per column
    const drops = new Array(columns).fill(1);
    
    // Matrix animation loop
    function drawMatrix() {
        // Semi-transparent black background for fade effect
        ctx.fillStyle = 'rgba(10, 10, 10, 0.04)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Green text
        ctx.fillStyle = '#00ff41';
        ctx.font = `${fontSize}px monospace`;
        
        // Draw characters
        for (let i = 0; i < drops.length; i++) {
            // Random character
            const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;
            
            ctx.fillText(char, x, y);
            
            // Reset drop randomly or when it reaches bottom
            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            
            drops[i]++;
        }
    }
    
    // Start matrix animation
    setInterval(drawMatrix, 35);
}

/**
 * Initialize scroll reveal animations
 */
function initScrollReveal() {
    const revealElements = [
        '.service-card',
        '.value-prop', 
        '.process-step',
        '.testimonial-card',
        '.section__title'
    ];
    
    // Add reveal classes with staggered delays
    revealElements.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, index) => {
            el.classList.add('reveal');
            el.style.transitionDelay = `${index * 150}ms`;
        });
    });
    
    // Intersection Observer for scroll reveals
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all reveal elements
    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Initialize smooth scrolling for CTAs (FIXED)
 */
function initSmoothScrolling() {
    const heroCta = document.getElementById('hero-cta');
    const finalCta = document.getElementById('final-cta');
    
    // Hero CTA click handler (FIXED)
    if (heroCta) {
        heroCta.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🎯 Hero CTA clicked - scrolling to contact');
            scrollToContact();
            addClickEffect(this);
        });
    }
    
    // Final CTA click handler (FIXED)
    if (finalCta) {
        finalCta.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🎯 Final CTA clicked - scrolling to contact');
            scrollToContact();
            addClickEffect(this);
        });
    }
    
    // Handle footer anchor links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                e.preventDefault();
                const targetId = href.substring(1);
                scrollToSection(targetId);
            }
        });
    });
}

/**
 * Scroll to contact section with cyberpunk effect (FIXED)
 */
function scrollToContact() {
    console.log('🔍 Searching for contact section...');
    
    // Try multiple selectors for contact section
    let contactSection = document.getElementById('contact');
    if (!contactSection) {
        contactSection = document.querySelector('.final-cta');
        console.log('📍 Using final-cta section as contact target');
    }
    
    if (!contactSection) {
        console.error('❌ No contact section found! Scrolling to bottom...');
        // Fallback: scroll to bottom
        window.scrollTo({
            top: document.body.scrollHeight - window.innerHeight,
            behavior: 'smooth'
        });
        return;
    }
    
    console.log('✅ Contact section found, initiating scroll...');
    
    // Calculate position with proper offset
    const rect = contactSection.getBoundingClientRect();
    const offsetTop = window.pageYOffset + rect.top - 80;
    
    // Perform smooth scroll
    window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
    });
    
    // Add cyberpunk highlight effect
    setTimeout(() => {
        contactSection.style.transition = 'all 0.5s ease';
        contactSection.style.boxShadow = '0 0 50px rgba(0, 255, 65, 0.4), 0 0 100px rgba(0, 255, 255, 0.2)';
        contactSection.style.transform = 'scale(1.01)';
        
        setTimeout(() => {
            contactSection.style.boxShadow = 'none';
            contactSection.style.transform = 'scale(1)';
        }, 1500);
    }, 800);
    
    console.log('🚀 Scroll completed with cyberpunk effect');
}

/**
 * Generic smooth scroll to section (FIXED)
 */
function scrollToSection(sectionId) {
    console.log('📍 Scrolling to section:', sectionId);
    const targetSection = document.getElementById(sectionId);
    
    if (!targetSection) {
        console.warn(`⚠️ Section "${sectionId}" not found`);
        return;
    }
    
    const rect = targetSection.getBoundingClientRect();
    const offsetTop = window.pageYOffset + rect.top - 80;
    
    window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
    });
}

/**
 * Initialize external links (FIXED)
 */
function initExternalLinks() {
    console.log('🔗 Initializing external links...');
    
    const externalSelectors = [
        'a[href^="mailto:"]',
        'a[href^="https://wa.me"]', 
        'a[href^="https://linkedin.com"]'
    ];
    
    let linkCount = 0;
    
    externalSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(link => {
            // Ensure target and rel attributes
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
            
            // Force immediate navigation behavior
            link.addEventListener('click', function(e) {
                console.log('🌐 External link clicked:', this.href);
                
                // Add visual feedback
                addClickEffect(this);
                
                // Force open in new tab/window
                setTimeout(() => {
                    try {
                        window.open(this.href, '_blank', 'noopener,noreferrer');
                    } catch (error) {
                        console.log('Fallback: Direct navigation');
                        window.location.href = this.href;
                    }
                }, 100);
            });
            
            linkCount++;
        });
    });
    
    console.log(`✅ Initialized ${linkCount} external links`);
}

/**
 * Initialize cyberpunk visual effects
 */
function initCyberpunkEffects() {
    // Add glitch effect to hero title
    addGlitchEffect();
    
    // Initialize particle effects
    initParticleEffects();
    
    // Add typing animation to hero subtitle
    addTypingAnimation();
    
    // Initialize button hover effects
    initButtonEffects();
    
    // Add scan line effect
    addScanlineEffect();
}

/**
 * Add glitch effect to hero title
 */
function addGlitchEffect() {
    const heroTitle = document.querySelector('.hero__title');
    if (!heroTitle) return;
    
    const originalText = heroTitle.textContent;
    
    setInterval(() => {
        if (Math.random() < 0.1) { // 10% chance every interval
            // Create glitch text
            const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
            let glitchedText = '';
            
            for (let i = 0; i < originalText.length; i++) {
                if (Math.random() < 0.1 && originalText[i] !== ' ') {
                    glitchedText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
                } else {
                    glitchedText += originalText[i];
                }
            }
            
            heroTitle.textContent = glitchedText;
            
            // Restore original text quickly
            setTimeout(() => {
                heroTitle.textContent = originalText;
            }, 50);
        }
    }, 3000);
}

/**
 * Add floating particle effects
 */
function initParticleEffects() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    // Create particle container
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particles';
    particleContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    `;
    hero.appendChild(particleContainer);
    
    // Create particles
    for (let i = 0; i < 20; i++) {
        createParticle(particleContainer);
    }
}

/**
 * Create individual particle
 */
function createParticle(container) {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: absolute;
        width: 2px;
        height: 2px;
        background: #00ff41;
        box-shadow: 0 0 6px #00ff41;
        animation: float-particle ${5 + Math.random() * 10}s linear infinite;
        left: ${Math.random() * 100}%`;
    
    container.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
            createParticle(container); // Create new particle
        }
    }, (5 + Math.random() * 10) * 1000);
}

/**
 * Add typing animation to hero subtitle
 */
function addTypingAnimation() {
    const subtitle = document.querySelector('.hero__subtitle');
    if (!subtitle) return;
    
    const text = subtitle.textContent;
    subtitle.textContent = '';
    subtitle.style.borderRight = '2px solid #00ff41';
    
    let i = 0;
    const typeInterval = setInterval(() => {
        subtitle.textContent = text.slice(0, i);
        i++;
        
        if (i > text.length) {
            clearInterval(typeInterval);
            subtitle.style.borderRight = 'none';
        }
    }, 50);
}

/**
 * Initialize enhanced button effects
 */
function initButtonEffects() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        // Add pulse effect on hover
        button.addEventListener('mouseenter', function() {
            this.style.animation = 'none';
            this.style.animation = 'cyber-pulse 0.3s ease-out';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.animation = 'neon-glow 2s ease-in-out infinite alternate';
        });
        
        // Add click sound effect simulation
        button.addEventListener('click', function() {
            console.log('🔊 Button clicked:', this.textContent.trim());
        });
    });
}

/**
 * Add click effect to buttons (ENHANCED)
 */
function addClickEffect(button) {
    // Create ripple effect
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(0, 255, 65, 0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
        z-index: 10;
    `;
    
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = '50%';
    ripple.style.top = '50%';
    ripple.style.marginLeft = -size/2 + 'px';
    ripple.style.marginTop = -size/2 + 'px';
    
    // Ensure button has relative positioning
    const originalPosition = button.style.position;
    button.style.position = 'relative';
    button.appendChild(ripple);
    
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.remove();
        }
        button.style.position = originalPosition;
    }, 600);
}

/**
 * Add scanning line effect
 */
function addScanlineEffect() {
    const scanline = document.createElement('div');
    scanline.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 1px;
        background: linear-gradient(90deg, transparent, #00ff41, transparent);
        box-shadow: 0 0 6px #00ff41;
        animation: scan 4s linear infinite;
        pointer-events: none;
        z-index: 9999;
        opacity: 0.3;
    `;
    document.body.appendChild(scanline);
}

/**
 * Add CSS animations dynamically
 */
function addCyberAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float-particle {
            0% {
                transform: translateY(100vh) translateX(0px);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100px) translateX(${-50 + Math.random() * 100}px);
                opacity: 0;
            }
        }
        
        @keyframes cyber-pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        @keyframes ripple {
            0% {
                transform: scale(0);
                opacity: 1;
            }
            100% {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes scan {
            0% { transform: translateY(-10px); }
            100% { transform: translateY(100vh); }
        }
        
        @keyframes matrix-flicker {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.2; }
        }
        
        .hero__matrix {
            animation: matrix-flicker 3s ease-in-out infinite;
        }
        
        /* Loading animations */
        .hero__content > * {
            opacity: 0;
            transform: translateY(20px);
            animation: slideInUp 0.8s ease-out forwards;
        }
        
        .hero__title {
            animation-delay: 0.2s;
        }
        
        .hero__subtitle {
            animation-delay: 0.4s;
        }
        
        .hero__cta {
            animation-delay: 0.6s;
        }
        
        @keyframes slideInUp {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize animations
addCyberAnimations();

// Add scroll progress indicator
function addScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 2px;
        background: linear-gradient(90deg, #00ff41, #00ffff, #0080ff);
        box-shadow: 0 0 10px rgba(0, 255, 65, 0.5);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = Math.min(100, Math.max(0, scrolled)) + '%';
    });
}

// Initialize scroll progress
addScrollProgress();

// Add performance monitoring
function logPerformance() {
    console.log(`%c🚀 Kalpvruksh AI Performance Stats`, 'color: #00ff41; font-weight: bold; font-size: 14px;');
    console.log(`Matrix Canvas: ${document.getElementById('matrix-canvas') ? '✅' : '❌'}`);
    console.log(`Scroll Reveals: ${document.querySelectorAll('.reveal').length} elements`);
    console.log(`Interactive Buttons: ${document.querySelectorAll('.btn').length} buttons`);
    console.log(`Contact Section: ${document.getElementById('contact') ? '✅' : '❌'}`);
    console.log(`Hero CTA: ${document.getElementById('hero-cta') ? '✅' : '❌'}`);
    console.log(`Final CTA: ${document.getElementById('final-cta') ? '✅' : '❌'}`);
}

// Performance check
setTimeout(logPerformance, 1000);

// Keyboard accessibility
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        const focusedElement = document.activeElement;
        if (focusedElement && focusedElement.classList.contains('btn')) {
            e.preventDefault();
            focusedElement.click();
        }
    }
});

// Add focus indicators for accessibility
const focusStyle = document.createElement('style');
focusStyle.textContent = `
    .btn:focus-visible {
        outline: 2px solid #00ff41 !important;
        outline-offset: 2px;
        box-shadow: 0 0 20px rgba(0, 255, 65, 0.5) !important;
    }
    
    a:focus-visible {
        outline: 2px solid #00ffff !important;
        outline-offset: 2px;
        box-shadow: 0 0 15px rgba(0, 255, 255, 0.4) !important;
    }
`;
document.head.appendChild(focusStyle);

// Debug logging
console.log('%c🔧 Kalpvruksh AI Cyberpunk Interface Initialized', 'color: #00ffff; font-weight: bold;');
console.log('Contact section exists:', !!document.getElementById('contact'));
console.log('Hero CTA exists:', !!document.getElementById('hero-cta'));
console.log('Final CTA exists:', !!document.getElementById('final-cta'));