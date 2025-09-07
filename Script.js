// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Initialize all website functionality
function initializeWebsite() {
    setupSmoothScrolling();
    setupHeaderEffects();
    setupScrollAnimations();
    setupFormHandlers();
    setupInteractiveEffects();
    setupMobileMenu();
    setupLoadingAnimation();
}

// Smooth scrolling for navigation links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Header scroll effects
function setupHeaderEffects() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(26, 26, 46, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
            header.style.boxShadow = '0 2px 30px rgba(0,0,0,0.2)';
        } else {
            header.style.background = 'linear-gradient(135deg, #1a1a2e, #16213e)';
            header.style.backdropFilter = 'none';
            header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        }
    });
}

// Scroll-triggered animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Add staggered animation for grid items
                if (entry.target.classList.contains('category-card') || 
                    entry.target.classList.contains('testimonial-card') ||
                    entry.target.classList.contains('usp-item')) {
                    
                    const delay = Array.from(entry.target.parentElement.children)
                                      .indexOf(entry.target) * 100;
                    entry.target.style.transitionDelay = delay + 'ms';
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.category-card, .testimonial-card, .usp-item, .arrival-showcase, .wholesale-form')
            .forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
}

// Form handling
function setupFormHandlers() {
    // Wholesale form
    const wholesaleForm = document.getElementById('wholesaleForm');
    if (wholesaleForm) {
        wholesaleForm.addEventListener('submit', handleWholesaleSubmission);
    }

    // Newsletter form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmission);
    }
}

// Handle wholesale form submission
function handleWholesaleSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Validate required fields
    const requiredFields = ['name', 'business', 'email', 'city'];
    let isValid = true;
    
    requiredFields.forEach(field => {
        const input = form.querySelector(`input[name="${field}"]`);
        if (input && !input.value.trim()) {
            showFieldError(input);
            isValid = false;
        } else if (input) {
            clearFieldError(input);
        }
    });
    
    // Email validation
    const emailInput = form.querySelector('input[name="email"]');
    if (emailInput && !isValidEmail(emailInput.value)) {
        showFieldError(emailInput, 'Please enter a valid email address');
        isValid = false;
    }
    
    if (isValid) {
        showFormSuccess(form, 'Wholesale inquiry submitted successfully! We\'ll contact you within 24 hours.');
        
        // Here you would typically send the data to your backend
        console.log('Wholesale form data:', data);
        
        // Reset form after delay
        setTimeout(() => {
            form.reset();
            resetFormButton(form);
        }, 3000);
    }
}

// Handle newsletter form submission
function handleNewsletterSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const emailInput = form.querySelector('input[name="email"]');
    const button = form.querySelector('button[type="submit"]');
    
    if (emailInput && isValidEmail(emailInput.value)) {
        const originalText = button.textContent;
        button.textContent = 'Subscribed! ✓';
        button.style.background = '#28a745';
        
        // Here you would typically send the email to your backend
        console.log('Newsletter subscription:', emailInput.value);
        
        setTimeout(() => {
            emailInput.value = '';
            button.textContent = originalText;
            button.style.background = 'linear-gradient(45deg, #ff4757, #ff3838)';
        }, 2000);
    } else {
        showFieldError(emailInput, 'Please enter a valid email address');
    }
}

// Form validation helpers
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFieldError(input, message = 'This field is required') {
    input.style.borderColor = '#ff4757';
    input.style.boxShadow = '0 0 0 3px rgba(255, 71, 87, 0.2)';
    
    // Remove existing error message
    const existingError = input.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = 'color: #ff4757; font-size: 0.8rem; margin-top: 5px;';
    errorDiv.textContent = message;
    input.parentElement.appendChild(errorDiv);
    
    setTimeout(() => {
        clearFieldError(input);
    }, 3000);
}

function clearFieldError(input) {
    input.style.borderColor = '';
    input.style.boxShadow = '';
    
    const errorMessage = input.parentElement.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function showFormSuccess(form, message) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = '✓ Success!';
    submitBtn.style.background = '#28a745';
    submitBtn.disabled = true;
    
    // Show success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.style.cssText = 'background: #d4edda; color: #155724; padding: 10px; border-radius: 5px; margin-top: 15px; text-align: center; font-size: 0.9rem;';
    successDiv.textContent = message;
    form.appendChild(successDiv);
    
    setTimeout(() => {
        if (successDiv.parentElement) {
            successDiv.remove();
        }
    }, 5000);
}

function resetFormButton(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Submit Inquiry';
    submitBtn.style.background = 'linear-gradient(45deg, #ff4757, #ff3838)';
    submitBtn.disabled = false;
}

// Interactive effects
function setupInteractiveEffects() {
    // Button ripple effects
    setupButtonRipples();
    
    // Card hover effects
    setupCardHovers();
    
    // Parallax effects
    setupParallaxEffects();
    
    // Smooth horizontal scrolling
    setupHorizontalScroll();
}

// Button ripple effect
function setupButtonRipples() {
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Enhanced card hover effects
function setupCardHovers() {
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.transition = 'all 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add click effect
        card.addEventListener('click', function() {
            this.style.transform = 'translateY(-5px) scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            }, 150);
        });
    });
}

// Parallax effects for hero sections
function setupParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.hero, .new-arrivals');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const rate = scrolled * -0.5;
            const rect = element.getBoundingClientRect();
            
            // Only apply parallax when element is in viewport
            if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
                element.style.transform = `translateY(${rate}px)`;
            }
        });
    });
}

// Smooth horizontal scrolling for testimonials and USP
function setupHorizontalScroll() {
    const scrollContainers = document.querySelectorAll('.usp-grid, .testimonial-grid');
    
    scrollContainers.forEach(container => {
        let isScrolling = false;
        
        container.addEventListener('wheel', function(e) {
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
            
            e.preventDefault();
            
            if (!isScrolling) {
                isScrolling = true;
                
                this.scrollBy({
                    left: e.deltaY > 0 ? 200 : -200,
                    behavior: 'smooth'
                });
                
                setTimeout(() => {
                    isScrolling = false;
                }, 300);
            }
        }, { passive: false });
    });
}

// Mobile menu functionality
function setupMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
        
        // Close menu when clicking on links
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        });
    }
}

// Loading animation
function setupLoadingAnimation() {
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Trigger initial animations
        setTimeout(() => {
            const heroContent = document.querySelector('.hero-content');
            if (heroContent) {
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'translateY(0)';
            }
        }, 200);
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Performance optimizations
const debouncedResize = debounce(() => {
    // Handle window resize events
    window.dispatchEvent(new Event('optimizedResize'));
}, 250);

const throttledScroll = throttle(() => {
    // Handle optimized scroll events
    window.dispatchEvent(new Event('optimizedScroll'));
}, 16);

window.addEventListener('resize', debouncedResize);
window.addEventListener('scroll', throttledScroll);

// Advanced interactions
function setupAdvancedInteractions() {
    // Category card click to shop functionality
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            const categoryName = this.querySelector('h3').textContent.toLowerCase();
            // Redirect to category page (implement your routing logic)
            console.log(`Navigate to ${categoryName} category`);
            
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Icon hover effects
    document.querySelectorAll('.icon').forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.2) rotate(5deg)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });
    
    // USP item interactions
    document.querySelectorAll('.usp-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.usp-icon');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotateY(180deg)';
                icon.style.transition = 'all 0.3s ease';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.usp-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotateY(0deg)';
            }
        });
    });
}

// Call advanced interactions after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupAdvancedInteractions();
});

// Search functionality (basic implementation)
function setupSearchFunctionality() {
    const searchIcon = document.querySelector('.nav-icons .icon');
    if (searchIcon) {
        searchIcon.addEventListener('click', function() {
            // Toggle search overlay or redirect to search page
            console.log('Search functionality triggered');
            
            // Simple implementation - could expand to full search overlay
            const searchQuery = prompt('What are you looking for?');
            if (searchQuery) {
                console.log(`Searching for: ${searchQuery}`);
                // Implement actual search logic here
            }
        });
    }
}

// Cart functionality (basic implementation)
function setupCartFunctionality() {
    const cartIcon = document.querySelector('.nav-icons .icon:last-child');
    if (cartIcon) {
        cartIcon.addEventListener('click', function() {
            // Toggle cart drawer or redirect to cart page
            console.log('Cart functionality triggered');
            
            // Add visual feedback
            this.style.transform = 'scale(1.3)';
            this.style.filter = 'drop-shadow(0 0 15px #ff6b9d)';
            
            setTimeout(() => {
                this.style.transform = 'scale(1)';
                this.style.filter = 'drop-shadow(0 0 10px #ff6b9d)';
            }, 200);
        });
    }
}

// Wishlist functionality (basic implementation)
function setupWishlistFunctionality() {
    const wishlistIcon = document.querySelector('.nav-icons .icon:nth-child(2)');
    if (wishlistIcon) {
        wishlistIcon.addEventListener('click', function() {
            console.log('Wishlist functionality triggered');
            
            // Add heart animation
            this.style.color = '#ff4757';
            this.style.transform = 'scale(1.3)';
            
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 300);
        });
    }
}

// Initialize additional functionalities
document.addEventListener('DOMContentLoaded', function() {
    setupSearchFunctionality();
    setupCartFunctionality();
    setupWishlistFunctionality();
});

// Lazy loading for images (if needed)
function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Social media sharing functionality
function setupSocialSharing() {
    const socialLinks = document.querySelectorAll('.footer-section a[href="#"]');
    
    socialLinks.forEach((link, index) => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const socialPlatforms = ['Instagram', 'Facebook', 'TikTok', 'Pinterest'];
            const platform = socialPlatforms[index] || 'Social Media';
            
            console.log(`Opening ${platform}`);
            
            // Add click effect
            this.style.transform = 'scale(1.5)';
            this.style.filter = 'brightness(1.5)';
            
            setTimeout(() => {
                this.style.transform = 'scale(1)';
                this.style.filter = 'brightness(1)';
            }, 200);
        });
    });
}

// Accessibility improvements
function setupAccessibility() {
    // Add keyboard navigation support
    document.querySelectorAll('.btn, .category-card, .testimonial-card').forEach(element => {
        element.setAttribute('tabindex', '0');
        
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Add ARIA labels where needed
    const searchIcon = document.querySelector('.nav-icons .icon:first-child');
    if (searchIcon) {
        searchIcon.setAttribute('aria-label', 'Search products');
        searchIcon.setAttribute('role', 'button');
    }
    
    const wishlistIcon = document.querySelector('.nav-icons .icon:nth-child(2)');
    if (wishlistIcon) {
        wishlistIcon.setAttribute('aria-label', 'View wishlist');
        wishlistIcon.setAttribute('role', 'button');
    }
    
    const cartIcon = document.querySelector('.nav-icons .icon:last-child');
    if (cartIcon) {
        cartIcon.setAttribute('aria-label', 'View shopping cart');
        cartIcon.setAttribute('role', 'button');
    }
}

// Performance monitoring
function setupPerformanceMonitoring() {
    // Monitor page load performance
    window.addEventListener('load', function() {
        if ('performance' in window) {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Page loaded in ${loadTime}ms`);
            
            // Track Core Web Vitals if available
            if ('web-vitals' in window) {
                // This would require the web-vitals library
                // getCLS, getFID, getFCP, getLCP, getTTFB
            }
        }
    });
}

// Error handling
function setupErrorHandling() {
    window.addEventListener('error', function(e) {
        console.error('JavaScript error:', e.error);
        
        // You could send this to an error tracking service
        // trackError(e.error);
    });
    
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled promise rejection:', e.reason);
        
        // Prevent the default browser error handling
        e.preventDefault();
    });
}

// Initialize all additional features
document.addEventListener('DOMContentLoaded', function() {
    setupLazyLoading();
    setupSocialSharing();
    setupAccessibility();
    setupPerformanceMonitoring();
    setupErrorHandling();
});

// Analytics tracking (placeholder)
function trackEvent(category, action, label = '') {
    // Google Analytics or other analytics service integration
    console.log(`Analytics: ${category} - ${action} - ${label}`);
    
    // Example: gtag('event', action, { event_category: category, event_label: label });
}

// Track important user interactions
document.addEventListener('DOMContentLoaded', function() {
    // Track form submissions
    document.getElementById('wholesaleForm')?.addEventListener('submit', () => {
        trackEvent('Form', 'Wholesale Inquiry Submitted');
    });
    
    document.getElementById('newsletterForm')?.addEventListener('submit', () => {
        trackEvent('Form', 'Newsletter Subscription');
    });
    
    // Track button clicks
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('click', function() {
            trackEvent('Button', 'Primary CTA Click', this.textContent.trim());
        });
    });
    
    // Track category clicks
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            const categoryName = this.querySelector('h3').textContent;
            trackEvent('Category', 'Category Card Click', categoryName);
        });
    });
});

// Cookie consent (basic implementation)
function setupCookieConsent() {
    // Check if consent was already given
    if (!localStorage.getItem('cookieConsent')) {
        // Create cookie banner (simplified version)
        const banner = document.createElement('div');
        banner.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: #1a1a2e;
            color: white;
            padding: 15px;
            z-index: 10000;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 14px;
        `;
        
        banner.innerHTML = `
            <span>We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.</span>
            <button onclick="acceptCookies()" style="background: #ff4757; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Accept</button>
        `;
        
        document.body.appendChild(banner);
    }
}

function acceptCookies() {
    localStorage.setItem('cookieConsent', 'true');
    document.querySelector('[onclick="acceptCookies()"]').parentElement.remove();
    trackEvent('Privacy', 'Cookie Consent Accepted');
}

// Initialize cookie consent
document.addEventListener('DOMContentLoaded', setupCookieConsent);

// Final initialization call
document.addEventListener('DOMContentLoaded', function() {
    console.log('Madam\'s Secret website fully loaded and interactive!');
    
    // Add any final setup here
    setTimeout(() => {
        document.body.classList.add('fully-loaded');
    }, 1000);
});

// Export functions for potential external use
window.MadamsSecret = {
    trackEvent,
    setupLazyLoading,
    setupAccessibility,
    debounce,
    throttle
};
