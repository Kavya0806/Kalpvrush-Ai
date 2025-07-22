const KalpvrakshAI = (function() {
  'use strict';

  // Configuration
  const CONFIG = {
    DEBUG: false,
    MATRIX_FPS: 30,
    MATRIX_FADE: 0.05,
    MATRIX_CHARS: '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    PARTICLE_COUNT: 20,
    GLITCH_CHANCE: 0.1
  };

  // Cached DOM elements
  let elements = {};
  let intervals = [];
  let animationFrames = [];

  /* ==================== UTILITY FUNCTIONS ==================== */
  
  const log = (message, type = 'info') => {
    if (!CONFIG.DEBUG) return;
    const styles = {
      info: 'color: #00ffff; font-weight: bold;',
      success: 'color: #00ff41; font-weight: bold;',
      error: 'color: #ff0041; font-weight: bold;',
      warn: 'color: #ffff00; font-weight: bold;'
    };
    console.log(`%c${message}`, styles[type]);
  };

  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func.apply(this, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const cacheElements = () => {
    elements = {
      // Modal elements
      scheduleBtnHero: document.getElementById('scheduleBtnHero'),
      scheduleBtnFinal: document.getElementById('scheduleBtnFinal'),
      modalOverlay: document.getElementById('enquiryModal'),
      closeBtn: document.getElementById('closeModal'),
      enquiryForm: document.getElementById('enquiryForm'),
      successBlock: document.getElementById('successMessage'),
      
      // CTA elements
      heroCta: document.getElementById('hero-cta'),
      finalCta: document.getElementById('final-cta'),
      
      // Matrix and effects
      matrixCanvas: document.getElementById('matrix-canvas'),
      heroTitle: document.querySelector('.hero__title'),
      heroSubtitle: document.querySelector('.hero__subtitle'),
      hero: document.querySelector('.hero'),
      
      // Sections
      contactSection: document.getElementById('contact') || document.querySelector('.final-cta')
    };
    
    log('DOM elements cached', 'success');
  };

  /* ==================== MATRIX BACKGROUND ==================== */
  
  const MatrixBackground = {
    canvas: null,
    ctx: null,
    columns: 0,
    drops: [],
    animationId: null,

    init() {
      this.canvas = elements.matrixCanvas;
      if (!this.canvas) {
        log('Matrix canvas not found', 'warn');
        return false;
      }

      this.ctx = this.canvas.getContext('2d');
      this.resize();
      this.start();
      
      // Add debounced resize listener
      window.addEventListener('resize', debounce(() => this.resize(), 250));
      
      log('Matrix background initialized', 'success');
      return true;
    },

    resize() {
      if (!this.canvas) return;
      
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      
      const fontSize = 14;
      this.columns = Math.floor(this.canvas.width / fontSize);
      this.drops = new Array(this.columns).fill(1);
    },

    draw() {
      if (!this.ctx || !this.canvas) return;

      // Semi-transparent black background for fade effect
      this.ctx.fillStyle = `rgba(10, 10, 10, ${CONFIG.MATRIX_FADE})`;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      // Neon green matrix text
      this.ctx.fillStyle = '#00ff41';
      this.ctx.font = '14px monospace';

      this.drops.forEach((y, i) => {
        const char = CONFIG.MATRIX_CHARS.charAt(Math.floor(Math.random() * CONFIG.MATRIX_CHARS.length));
        const x = i * 14;
        
        this.ctx.fillText(char, x, y * 14);

        // Reset drop randomly or when it reaches bottom
        if (y * 14 > this.canvas.height && Math.random() > 0.975) {
          this.drops[i] = 0;
        }
        this.drops[i]++;
      });
    },

    start() {
      if (this.animationId) return;
      
      const animate = () => {
        this.draw();
        this.animationId = requestAnimationFrame(animate);
      };
      
      animate();
    },

    stop() {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
    }
  };

  /* ==================== MODAL SYSTEM ==================== */
  
  const ModalSystem = {
    focusableElements: [],
    firstFocusable: null,
    lastFocusable: null,

    init() {
      this.bindEvents();
      log('Modal system initialized', 'success');
    },

    bindEvents() {
      // Schedule button events
      if (elements.scheduleBtnHero) {
        elements.scheduleBtnHero.addEventListener('click', (e) => {
          e.preventDefault();
          this.open();
        });
      }

      if (elements.scheduleBtnFinal) {
        elements.scheduleBtnFinal.addEventListener('click', (e) => {
          e.preventDefault();
          this.open();
        });
      }

      // Close button
      if (elements.closeBtn) {
        elements.closeBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.close();
        });
      }

      // Outside click
      if (elements.modalOverlay) {
        elements.modalOverlay.addEventListener('click', (e) => {
          if (e.target === elements.modalOverlay) {
            this.close();
          }
        });
      }

      // Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen()) {
          this.close();
        }
      });

      // Form submission
      if (elements.enquiryForm) {
        elements.enquiryForm.addEventListener('submit', this.handleSubmit.bind(this));
      }
    },

    open() {
      if (!elements.modalOverlay) return;

      log('Opening modal', 'info');
      
      elements.modalOverlay.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      
      setTimeout(() => {
        elements.modalOverlay.classList.add('active');
      }, 10);

      this.resetForm();
      this.setupFocusTrap();
      
      setTimeout(() => {
        const firstInput = document.getElementById('fullName');
        if (firstInput) firstInput.focus();
      }, 350);
    },

    close() {
      if (!elements.modalOverlay) return;

      log('Closing modal', 'info');
      
      elements.modalOverlay.classList.remove('active');
      
      setTimeout(() => {
        elements.modalOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
      }, 300);
      
      this.releaseFocusTrap();
    },

    isOpen() {
      return elements.modalOverlay && elements.modalOverlay.classList.contains('active');
    },

    resetForm() {
      if (elements.enquiryForm) {
        elements.enquiryForm.reset();
        elements.enquiryForm.style.display = 'block';
      }
      if (elements.successBlock) {
        elements.successBlock.style.display = 'none';
        elements.successBlock.classList.remove('show');
      }
    },

    handleSubmit(e) {
      e.preventDefault();

      const formData = new FormData(elements.enquiryForm);

      fetch('https://script.google.com/macros/s/AKfycbzIfFh-DOp5j8ds7ntTa3SNwLpaoMtDNvCP-A5MmcwM-E4pvPaAIxv-D9_dx8Q3i1xi/exec', {
        method: 'POST',
        body: new FormData(document.getElementById('enquiryForm')),
        mode: "cors"
        // Do NOT set Content-Type header; browser will set it automatically for FormData
      })
      .then(response => response.json())
      .then(() => {
        if (elements.successBlock) elements.successBlock.style.display = 'block';
        if (elements.enquiryForm) elements.enquiryForm.style.display = 'none';
        log('Form submitted successfully', 'success');
      })
      .catch(error => {
        log('Form submission failed: ' + error.message, 'error');
        alert('Submission failed. Please try again.');
      });
    },

    setupFocusTrap() {
      if (!elements.modalOverlay) return;

      this.focusableElements = elements.modalOverlay.querySelectorAll(
        'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      
      if (this.focusableElements.length) {
        this.firstFocusable = this.focusableElements[0];
        this.lastFocusable = this.focusableElements[this.focusableElements.length - 1];
      }

      elements.modalOverlay.addEventListener('keydown', this.handleTabKey.bind(this));
    },

    releaseFocusTrap() {
      if (elements.modalOverlay) {
        elements.modalOverlay.removeEventListener('keydown', this.handleTabKey.bind(this));
      }
    },

    handleTabKey(e) {
      if (e.key !== 'Tab' || !this.focusableElements.length) return;

      if (e.shiftKey) {
        if (document.activeElement === this.firstFocusable) {
          e.preventDefault();
          this.lastFocusable.focus();
        }
      } else {
        if (document.activeElement === this.lastFocusable) {
          e.preventDefault();
          this.firstFocusable.focus();
        }
      }
    }
  };

  /* ==================== SCROLL & NAVIGATION ==================== */
  
  const Navigation = {
    init() {
      this.bindCTAEvents();
      this.initSmoothScroll();
      this.initExternalLinks();
      this.addScrollProgress();
      log('Navigation system initialized', 'success');
    },

    bindCTAEvents() {
      if (elements.heroCta) {
        elements.heroCta.addEventListener('click', (e) => {
          e.preventDefault();
          this.scrollToContact();
          this.addClickEffect(elements.heroCta);
        });
      }

      if (elements.finalCta) {
        elements.finalCta.addEventListener('click', (e) => {
          e.preventDefault();
          this.scrollToContact();
          this.addClickEffect(elements.finalCta);
        });
      }
    },

    scrollToContact() {
      const target = elements.contactSection;
      
      if (!target) {
        log('Contact section not found, scrolling to bottom', 'warn');
        window.scrollTo({
          top: document.body.scrollHeight - window.innerHeight,
          behavior: 'smooth'
        });
        return;
      }

      const rect = target.getBoundingClientRect();
      const offsetTop = window.pageYOffset + rect.top - 80;

      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });

      // Add highlight effect
      setTimeout(() => {
        target.style.transition = 'all 0.5s ease';
        target.style.boxShadow = '0 0 50px rgba(0, 255, 65, 0.4)';
        target.style.transform = 'scale(1.01)';

        setTimeout(() => {
          target.style.boxShadow = 'none';
          target.style.transform = 'scale(1)';
        }, 1500);
      }, 800);

      log('Scrolled to contact section', 'success');
    },

    initSmoothScroll() {
      document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href');
          if (href && href !== '#') {
            e.preventDefault();
            const target = document.getElementById(href.substring(1));
            if (target) {
              const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
              window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
          }
        });
      });
    },

    initExternalLinks() {
      const selectors = [
        'a[href^="mailto:"]',
        'a[href^="https://wa.me"]',
        'a[href^="https://linkedin.com"]'
      ];

      selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(link => {
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
          
          link.addEventListener('click', (e) => {
            this.addClickEffect(link);
            log('External link clicked: ' + link.href, 'info');
          });
        });
      });
    },

    addClickEffect(element) {
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

      const rect = element.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = '50%';
      ripple.style.top = '50%';
      ripple.style.marginLeft = -size/2 + 'px';
      ripple.style.marginTop = -size/2 + 'px';

      const originalPosition = element.style.position;
      element.style.position = 'relative';
      element.appendChild(ripple);

      setTimeout(() => {
        if (ripple.parentNode) ripple.remove();
        element.style.position = originalPosition;
      }, 600);
    },

    addScrollProgress() {
      const progressBar = document.createElement('div');
      progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 2px;
        background: linear-gradient(90deg, #00ff41, #00ffff);
        box-shadow: 0 0 10px rgba(0, 255, 65, 0.5);
        z-index: 9999;
        transition: width 0.1s ease;
      `;
      document.body.appendChild(progressBar);

      window.addEventListener('scroll', debounce(() => {
        const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = Math.min(100, Math.max(0, scrolled)) + '%';
      }, 10));
    }
  };

  /* ==================== CYBERPUNK EFFECTS ==================== */
  
  const CyberpunkEffects = {
    glitchInterval: null,

    init() {
      this.addGlitchEffect();
      this.addTypingAnimation();
      this.initButtonEffects();
      this.addParticleEffects();
      this.addScanlineEffect();
      this.initScrollReveal();
      this.injectStyles();
      log('Cyberpunk effects initialized', 'success');
    },

    addGlitchEffect() {
      if (!elements.heroTitle) return;

      const originalText = elements.heroTitle.textContent;
      const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

      this.glitchInterval = setInterval(() => {
        if (Math.random() < CONFIG.GLITCH_CHANCE) {
          let glitchedText = '';
          
          for (let i = 0; i < originalText.length; i++) {
            if (Math.random() < 0.1 && originalText[i] !== ' ') {
              glitchedText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
            } else {
              glitchedText += originalText[i];
            }
          }

          elements.heroTitle.textContent = glitchedText;

          setTimeout(() => {
            elements.heroTitle.textContent = originalText;
          }, 50);
        }
      }, 3000);

      intervals.push(this.glitchInterval);
    },

    addTypingAnimation() {
      if (!elements.heroSubtitle) return;

      const text = elements.heroSubtitle.textContent;
      elements.heroSubtitle.textContent = '';
      elements.heroSubtitle.style.borderRight = '2px solid #00ff41';

      let i = 0;
      const typeInterval = setInterval(() => {
        elements.heroSubtitle.textContent = text.slice(0, i);
        i++;

        if (i > text.length) {
          clearInterval(typeInterval);
          elements.heroSubtitle.style.borderRight = 'none';
        }
      }, 50);

      intervals.push(typeInterval);
    },

    initButtonEffects() {
      document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('mouseenter', function() {
          this.style.animation = 'cyber-pulse 0.3s ease-out';
        });

        button.addEventListener('mouseleave', function() {
          this.style.animation = 'neon-glow 2s ease-in-out infinite alternate';
        });
      });
    },

    addParticleEffects() {
      if (!elements.hero) return;

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
      elements.hero.appendChild(particleContainer);

      for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
        this.createParticle(particleContainer);
      }
    },

    createParticle(container) {
      const particle = document.createElement('div');
      const duration = 5 + Math.random() * 10;
      
      particle.style.cssText = `
        position: absolute;
        width: 2px;
        height: 2px;
        background: #00ff41;
        box-shadow: 0 0 6px #00ff41;
        animation: float-particle ${duration}s linear infinite;
        left: ${Math.random() * 100}%;
      `;

      container.appendChild(particle);

      setTimeout(() => {
        if (particle.parentNode) {
          particle.remove();
          this.createParticle(container);
        }
      }, duration * 1000);
    },

    addScanlineEffect() {
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
    },

    initScrollReveal() {
      const revealElements = document.querySelectorAll('.service-card, .value-prop, .process-step, .testimonial-card, .section__title');
      
      revealElements.forEach((el, index) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${index * 150}ms`;
      });

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

      revealElements.forEach(el => observer.observe(el));
    },

    injectStyles() {
      const style = document.createElement('style');
      style.textContent = `
        @keyframes float-particle {
          0% { transform: translateY(100vh); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100px); opacity: 0; }
        }
        
        @keyframes cyber-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes ripple {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(4); opacity: 0; }
        }
        
        @keyframes scan {
          0% { transform: translateY(-10px); }
          100% { transform: translateY(100vh); }
        }
        
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .reveal {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s ease-out;
        }
        
        .reveal.in-view {
          opacity: 1;
          transform: translateY(0);
        }
        
        .hero__content > * {
          opacity: 0;
          transform: translateY(20px);
          animation: slideInUp 0.8s ease-out forwards;
        }
        
        .hero__title { animation-delay: 0.2s; }
        .hero__subtitle { animation-delay: 0.4s; }
        .hero__cta { animation-delay: 0.6s; }
        
        .btn:focus-visible {
          outline: 2px solid #00ff41 !important;
          outline-offset: 2px;
          box-shadow: 0 0 20px rgba(0, 255, 65, 0.5) !important;
        }
        
        a:focus-visible {
          outline: 2px solid #00ffff !important;
          outline-offset: 2px;
        }
        
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          
          .particles { display: none !important; }
          #matrix-canvas { opacity: 0.1 !important; }
        }
      `;
      document.head.appendChild(style);
    },

    cleanup() {
      if (this.glitchInterval) {
        clearInterval(this.glitchInterval);
        this.glitchInterval = null;
      }
    }
  };

  /* ==================== ACCESSIBILITY ==================== */
  
  const Accessibility = {
    init() {
      this.addKeyboardSupport();
      this.respectMotionPreferences();
      log('Accessibility features initialized', 'success');
    },

    addKeyboardSupport() {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          const focused = document.activeElement;
          if (focused && focused.classList.contains('btn')) {
            e.preventDefault();
            focused.click();
          }
        }
      });
    },

    respectMotionPreferences() {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mediaQuery.matches) {
        log('Reduced motion preference detected', 'info');
        // Styles are handled in CSS
      }
    }
  };

  /* ==================== CLEANUP & LIFECYCLE ==================== */
  
  const cleanup = () => {
    log('Cleaning up resources', 'info');
    
    // Clear all intervals
    intervals.forEach(interval => clearInterval(interval));
    intervals = [];
    
    // Cancel animation frames
    animationFrames.forEach(frame => cancelAnimationFrame(frame));
    animationFrames = [];
    
    // Stop matrix animation
    MatrixBackground.stop();
    
    // Cleanup effects
    CyberpunkEffects.cleanup();
  };

  /* ==================== PUBLIC API ==================== */
  
  const init = () => {
    log('🚀 Initializing Kalpvruksh AI Cyberpunk Interface', 'success');
    
    cacheElements();
    MatrixBackground.init();
    ModalSystem.init();
    Navigation.init();
    CyberpunkEffects.init();
    Accessibility.init();
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', cleanup);
    
    // Performance logging
    setTimeout(() => {
      log('🔧 Performance Stats:', 'info');
      log(`Matrix Canvas: ${elements.matrixCanvas ? '✅' : '❌'}`, 'info');
      log(`Modal System: ${elements.modalOverlay ? '✅' : '❌'}`, 'info');
      log(`Navigation: ${elements.heroCta || elements.finalCta ? '✅' : '❌'}`, 'info');
      log(`Contact Section: ${elements.contactSection ? '✅' : '❌'}`, 'info');
    }, 1000);
  };

  // Public API
  return {
    init,
    cleanup,
    elements: () => elements,
    config: CONFIG
  };

})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', KalpvrakshAI.init);

// Global error handling
window.addEventListener('error', (e) => {
  console.error('Kalpvruksh AI Error:', e.error);
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = KalpvrakshAI;
}
