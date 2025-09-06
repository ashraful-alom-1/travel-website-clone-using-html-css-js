// ==============================================
// IMPROVED ACTIVE NAVIGATION SYSTEM
// ==============================================

/**
 * Updates active navigation link based on current scroll position
 * Uses section offsets to determine which section is in view
 */
function updateActiveNav() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    let currentSection = '';
    
    // Check each section's position relative to viewport
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100; // 100px offset for header
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.id; // Set current section ID
        }
    });
    
    // Update active state on navigation links
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active'); // Highlight current section link
        }
    });
}

/**
 * Sets up smooth scrolling for navigation links with active state management
 */
document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Clear active state from all links
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
        });
        
        // Set active state on clicked link
        this.classList.add('active');
        
        // Get target section and scroll smoothly to it
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Account for fixed header
                behavior: 'smooth' // Smooth scrolling animation
            });
            
            // Update URL hash without page jump
            history.pushState(null, null, targetId);
        }
        
        // Handle mobile menu close on small screens
        if (window.innerWidth <= 768) {
            document.querySelector('.nav-links').classList.remove('active');
            document.querySelector('.hamburger').innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
});

/**
 * Sets initial active navigation link based on URL hash
 */
function setInitialActiveLink() {
    const currentHash = window.location.hash;
    const navLinks = document.querySelectorAll('.nav-links a');
    
    if (currentHash) {
        // Activate link matching current hash
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentHash) {
                link.classList.add('active');
            }
        });
    } else {
        // Default to home link if no hash present
        document.querySelector('.nav-links a[href="#home"]')?.classList.add('active');
    }
}




// ==============================================
// HEADER SCROLL EFFECT
// ==============================================

/**
 * Adds/removes 'scrolled' class based on scroll position
 * Changes header appearance when user scrolls down
 */
window.addEventListener('scroll', function() {
    const header = document.getElementById('header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled'); // Add shadow and background
    } else {
        header.classList.remove('scrolled'); // Return to transparent
    }
});



// ==============================================
// MOBILE MENU TOGGLE
// ==============================================

const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

/**
 * Toggles mobile menu visibility and hamburger icon
 */
hamburger.addEventListener('click', function() {
    navLinks.classList.toggle('active');
    // Switch between hamburger and close icon
    hamburger.innerHTML = navLinks.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            navLinks.classList.remove('active');
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
});



// ==============================================
// TESTIMONIAL SLIDER WITH 4-SECOND INTERVAL
// ==============================================

let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial');
const dots = document.querySelectorAll('.dot');
let sliderInterval;
const SLIDE_INTERVAL = 4000; // 4 seconds between slides

/**
 * Displays testimonial at specified index
 * @param {number} index - Index of testimonial to show
 */
function showTestimonial(index) {
    // Handle wrap-around for continuous sliding
    index = (index + testimonials.length) % testimonials.length;
    
    // Hide all testimonials and dots
    testimonials.forEach(t => t.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    
    // Show current testimonial and dot
    testimonials[index].classList.add('active');
    dots[index].classList.add('active');
    currentTestimonial = index;
    
    // Reset animation for smooth transition
    const currentTestimonialElement = testimonials[index];
    currentTestimonialElement.style.animation = 'none';
    void currentTestimonialElement.offsetWidth; // Trigger reflow
    currentTestimonialElement.style.animation = 'fadeIn 0.5s ease-out';
}

/**
 * Starts automatic rotation of testimonials
 */
function startAutoRotation() {
    // Clear existing interval to prevent duplicates
    clearInterval(sliderInterval);
    
    // Set new interval for auto-rotation
    sliderInterval = setInterval(() => {
        showTestimonial(currentTestimonial + 1);
    }, SLIDE_INTERVAL);
}

/**
 * Initializes testimonial slider functionality
 */
function initSlider() {
    // Exit if no testimonials found
    if (testimonials.length === 0) {
        console.warn('No testimonials found');
        return;
    }
    
    // Verify matching dots and testimonials
    if (testimonials.length !== dots.length) {
        console.error(`Mismatch: ${testimonials.length} testimonials but ${dots.length} dots`);
        return;
    }
    
    // Set up dot navigation click handlers
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(sliderInterval);
            showTestimonial(index);
            startAutoRotation();
        });
    });
    
    // Set up auto-rotation with hover pause
    startAutoRotation();
    
    const sliderContainer = document.querySelector('.testimonial-slider') || 
                          document.querySelector('.testimonials');
    
    if (sliderContainer) {
        // Pause on hover
        sliderContainer.addEventListener('mouseenter', () => {
            clearInterval(sliderInterval);
        });
        
        // Resume when mouse leaves
        sliderContainer.addEventListener('mouseleave', startAutoRotation);
    }
    
    // Initialize first testimonial
    showTestimonial(0);
}



// ==============================================
// SMOOTH SCROLLING FOR ALL HASH LINKS
// ==============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Account for header
                behavior: 'smooth' // Animated scrolling
            });
        }
    });
});



// ==============================================
// AUTHENTICATION SYSTEM
// ==============================================

/**
 * Initializes authentication system including:
 * - Modal handling
 * - Form validation
 * - User session management
 */
function initAuthSystem() {
    // DOM Elements
    const signupBtn = document.querySelector('.btn-signup');
    const loginBtn = document.querySelector('.btn-login');
    const signupModal = document.getElementById('signupModal');
    const loginModal = document.getElementById('loginModal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
    const authButtons = document.querySelector('.auth-buttons');

    // Check for existing logged in user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        authButtons.style.display = 'none'; // Hide auth buttons if logged in
    }



    // ==============================================
    // MODAL EVENT HANDLERS
    // ==============================================
    signupBtn?.addEventListener('click', () => openModal(signupModal));
    loginBtn?.addEventListener('click', () => openModal(loginModal));
    
    // Close modal buttons
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            closeModal(signupModal);
            closeModal(loginModal);
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === signupModal) closeModal(signupModal);
        if (e.target === loginModal) closeModal(loginModal);
    });

    // Switch between login and signup modals
    document.querySelectorAll('.switch-to-login').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal(signupModal);
            openModal(loginModal);
        });
    });

    document.querySelectorAll('.switch-to-signup').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal(loginModal);
            openModal(signupModal);
        });
    });



    // ==============================================
    // SIGNUP FORM HANDLING
    // ==============================================
    signupForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // Validate password match
        if (password !== confirmPassword) {
            showError('confirm-password', 'Passwords do not match');
            return;
        }
        
        // Validate password length
        if (password.length < 8) {
            showError('password', 'Password must be at least 8 characters');
            return;
        }
        
        // Check for existing user
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userExists = users.some(user => user.email === email);
        
        if (userExists) {
            showError('email', 'Email already registered');
            return;
        }
        
        // Create and store new user
        const newUser = {
            name,
            email,
            password
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        showSuccess('Account created successfully!');
        authButtons.style.display = 'none';
        setTimeout(() => {
            closeModal(signupModal);
            signupForm.reset();
        }, 1500);
    });



    // ==============================================
    // LOGIN FORM HANDLING
    // ==============================================
    loginForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(user => user.email === email && user.password === password);
        
        if (!user) {
            showError('login-password', 'Invalid email or password');
            return;
        }
        
        // Store current user session
        localStorage.setItem('currentUser', JSON.stringify(user));
        showSuccess('Login successful!');
        authButtons.style.display = 'none';
        setTimeout(() => {
            closeModal(loginModal);
            loginForm.reset();
        }, 1500);
    });



    // ==============================================
    // AUTH HELPER FUNCTIONS
    // ==============================================
    
    /**
     * Opens specified modal dialog
     * @param {HTMLElement} modal - Modal element to open
     */
    function openModal(modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    /**
     * Closes specified modal dialog
     * @param {HTMLElement} modal - Modal element to close
     */
    function closeModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
        // Clear any error messages
        document.querySelectorAll('.error-message').forEach(el => {
            el.style.display = 'none';
        });
    }

    /**
     * Displays error message for a form field
     * @param {string} fieldId - ID of the form field
     * @param {string} message - Error message to display
     */
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        let errorElement = field.nextElementSibling;
        
        // Create error element if it doesn't exist
        if (!errorElement || !errorElement.classList.contains('error-message')) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            field.parentNode.insertBefore(errorElement, field.nextSibling);
        }
        
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        field.style.borderColor = '#e74c3c'; // Red border for error
    }

    /**
     * Displays success message
     * @param {string} message - Success message to display
     */
    function showSuccess(message) {
        const successElement = document.createElement('div');
        successElement.className = 'success-message';
        successElement.textContent = message;
        successElement.style.display = 'block';
        
        const form = document.querySelector('.modal-content form');
        form.insertBefore(successElement, form.firstChild);
        
        setTimeout(() => {
            successElement.style.display = 'none';
        }, 3000);
    }
}



// ==============================================
// BLOG READ MORE FUNCTIONALITY
// ==============================================

/**
 * Initializes read more/less functionality for blog cards
 */
function initBlogReadMore() {
    document.querySelectorAll('.btn-read-more').forEach(button => {
        button.addEventListener('click', function() {
            const blogCard = this.closest('.blog-card');
            const fullContent = blogCard.querySelector('.blog-full-content');
            const excerpt = blogCard.querySelector('.blog-excerpt');
            
            if (fullContent.classList.contains('expanded')) {
                // Collapse content
                fullContent.style.maxHeight = '0';
                fullContent.classList.remove('expanded');
                excerpt.style.display = 'block';
                this.textContent = 'Read More';
            } else {
                // Expand content
                fullContent.style.display = 'block';
                fullContent.classList.add('expanded');
                fullContent.style.maxHeight = fullContent.scrollHeight + 'px';
                excerpt.style.display = 'none';
                this.textContent = 'Show Less';
            }
        });
    });
}



// ==============================================
// ABOUT SECTION READ MORE FUNCTIONALITY
// ==============================================

/**
 * Initializes read more/less functionality for about section
 */
function initAboutReadMore() {
    const readMoreBtn = document.querySelector('.read-more-btn');
    const moreText = document.querySelector('.more-text');

    if (readMoreBtn && moreText) {
        // Initially hide the more text
        moreText.style.maxHeight = '0';
        moreText.style.overflow = 'hidden';
        moreText.style.transition = 'max-height 0.5s ease';

        readMoreBtn.addEventListener('click', function() {
            if (moreText.style.maxHeight === '0px') {
                // Expand to show content
                moreText.style.maxHeight = moreText.scrollHeight + 'px';
                this.textContent = 'Read less';
            } else {
                // Collapse to hide content
                moreText.style.maxHeight = '0';
                this.textContent = 'Read more';
            }
        });
    }
}



// ==============================================
// BOOKING SYSTEM
// ==============================================

/**
 * Initializes booking system with:
 * - Tab switching
 * - Form validation
 * - Success/error handling
 */
function initBookingSystem() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const bookingForms = document.querySelectorAll('.booking-form');

    // Tab Switching
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            bookingForms.forEach(form => form.classList.remove('active'));
            button.classList.add('active');
            document.getElementById(`${button.dataset.tab}-tab`).classList.add('active');
        });
    });

    /**
     * Validates date ranges for booking forms
     * @param {string} startDateId - ID of start date input
     * @param {string} endDateId - ID of end date input
     * @returns {boolean} - True if dates are valid
     */
    function validateDates(startDateId, endDateId) {
        const startDate = new Date(document.getElementById(startDateId).value);
        const endDate = new Date(document.getElementById(endDateId).value);
        const today = new Date().setHours(0, 0, 0, 0);

        if (startDate < today) {
            showError(startDateId, 'Departure/Check-in/Pickup date cannot be in the past');
            return false;
        }
        if (endDate < startDate) {
            showError(endDateId, 'Return/Check-out date must be after departure/check-in');
            return false;
        }
        return true;
    }

    // Flight Booking Form
    document.getElementById('flightBookingForm')?.addEventListener('submit', e => {
        e.preventDefault();
        const isDateValid = validateDates('departure-date', 'return-date');

        if (isDateValid) {
            showSuccess('Searching flights...');
            console.log({
                from: document.getElementById('flight-from').value,
                to: document.getElementById('flight-to').value,
                departure: document.getElementById('departure-date').value,
                return: document.getElementById('return-date').value,
                passengers: document.getElementById('passengers').value
            });
            setTimeout(() => e.target.reset(), 1500);
        }
    });

    // Hotel Booking Form
    document.getElementById('hotelBookingForm')?.addEventListener('submit', e => {
        e.preventDefault();
        const isDateValid = validateDates('check-in-date', 'check-out-date');

        if (isDateValid) {
            showSuccess('Searching hotels...');
            console.log({
                destination: document.getElementById('hotel-destination').value,
                checkIn: document.getElementById('check-in-date').value,
                checkOut: document.getElementById('check-out-date').value,
                guests: document.getElementById('guests').value
            });
            setTimeout(() => e.target.reset(), 1500);
        }
    });

    // Cab Booking Form
    document.getElementById('cabBookingForm')?.addEventListener('submit', e => {
        e.preventDefault();
        const isDateValid = validateDates('pickup-date', 'pickup-date');

        if (isDateValid) {
            showSuccess('Searching cabs...');
            console.log({
                pickup: document.getElementById('pickup-location').value,
                dropoff: document.getElementById('dropoff-location').value,
                date: document.getElementById('pickup-date').value,
                passengers: document.getElementById('passengers-cab').value
            });
            setTimeout(() => e.target.reset(), 1500);
        }
    });

    // Train Booking Form
    document.getElementById('trainBookingForm')?.addEventListener('submit', e => {
        e.preventDefault();
        showSuccess('Searching trains...');
        console.log({
            from: document.getElementById('train-from').value,
            to: document.getElementById('train-to').value,
            date: document.getElementById('train-date').value,
            passengers: document.getElementById('train-passengers').value,
            class: document.getElementById('train-class').value
        });
        setTimeout(() => e.target.reset(), 1500);
    });

    // Cruise Booking Form
    document.getElementById('cruiseBookingForm')?.addEventListener('submit', e => {
        e.preventDefault();
        showSuccess('Processing cruise booking...');
        console.log({
            destination: document.getElementById('cruise-destination').value,
            date: document.getElementById('cruise-date').value,
            passengers: document.getElementById('cruise-passengers').value,
            package: document.querySelector('input[name="cruise-package"]:checked')?.value
        });
        setTimeout(() => e.target.reset(), 1500);
    });



    // ==============================================
    // BOOKING HELPER FUNCTIONS
    // ==============================================
    
    /**
     * Displays error message for booking form fields
     * @param {string} fieldId - ID of the form field
     * @param {string} message - Error message to display
     */
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        let error = field.nextElementSibling;
        if (!error || !error.classList.contains('error-message')) {
            error = document.createElement('div');
            error.className = 'error-message';
            field.parentNode.insertBefore(error, field.nextSibling);
        }
        error.textContent = message;
        error.style.display = 'block';
    }

    /**
     * Displays success message for booking forms
     * @param {string} message - Success message to display
     */
    function showSuccess(message) {
        const success = document.createElement('div');
        success.className = 'success-message';
        success.textContent = message;
        document.querySelector('.booking-form.active form').prepend(success);
        setTimeout(() => success.remove(), 3000);
    }
}



// ==============================================
// PAGE INITIALIZATION
// ==============================================

/**
 * Initializes all components when DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    // Fade in page for smoother loading experience
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => { document.body.style.opacity = '1'; }, 100);
    
    // Initialize all components
    setInitialActiveLink();
    window.addEventListener('scroll', updateActiveNav);
    initAuthSystem();
    initBlogReadMore();
    initAboutReadMore();
    initBookingSystem();
    initSlider(); // Initialize testimonial slider
    
    // Set active nav link based on current URL hash
    const currentHash = window.location.hash;
    if (currentHash) {
        const activeLink = document.querySelector(`.nav-links a[href="${currentHash}"]`);
        if (activeLink) activeLink.classList.add('active');
    } else {
        const homeLink = document.querySelector('.nav-links a[href="#home"]');
        if (homeLink) homeLink.classList.add('active');
    }
});