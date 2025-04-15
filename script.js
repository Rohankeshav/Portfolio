document.addEventListener("DOMContentLoaded", function() {
    // Initialize particles.js
    if (typeof particlesJS !== 'undefined') {
        particlesJS("particles-js", {
            "particles": {
                "number": {
                    "value": 50,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#ffffff"
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 5
                    }
                },
                "opacity": {
                    "value": 0.5,
                    "random": false,
                    "anim": {
                        "enable": false,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": {
                        "enable": false,
                        "speed": 40,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#ffffff",
                    "opacity": 0.4,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 2,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 1
                        }
                    },
                    "bubble": {
                        "distance": 400,
                        "size": 40,
                        "duration": 2,
                        "opacity": 8,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 200,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true
        });

        // Update particle colors based on theme
        function updateParticleColors() {
            if (document.documentElement.classList.contains('light-mode')) {
                particlesJS.pJS.particles.color.value = '#333333';
                particlesJS.pJS.particles.line_linked.color = '#333333';
            } else {
                particlesJS.pJS.particles.color.value = '#ffffff';
                particlesJS.pJS.particles.line_linked.color = '#ffffff';
            }
            
            particlesJS.pJS.fn.particlesRefresh();
        }

        // Set up MutationObserver to watch for theme changes
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === "class") {
                    updateParticleColors();
                }
            });
        });

        observer.observe(document.documentElement, { attributes: true });
    }
    
    // Page loading animation
    document.body.classList.add('loaded');
    
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true
    });

    // Scroll to top button
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    // Show/hide scroll-to-top button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('opacity-100');
            scrollToTopBtn.classList.remove('opacity-0');
        } else {
            scrollToTopBtn.classList.add('opacity-0');
            scrollToTopBtn.classList.remove('opacity-100');
        }
    });
    
    // Scroll to top when button is clicked
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Mobile Menu Toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
        
        // Close mobile menu when clicking on a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    const htmlElement = document.documentElement;
    
    // Check for saved theme preference or use device preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        enableLightMode();
    } else if (savedTheme === 'dark' || window.matchMedia('(prefers-color-scheme: dark)').matches) {
        enableDarkMode();
    }
    
    // Toggle theme
    themeToggle.addEventListener('click', function() {
        if (htmlElement.classList.contains('light-mode')) {
            enableDarkMode();
        } else {
            enableLightMode();
        }
    });
    
    function enableLightMode() {
        htmlElement.classList.add('light-mode');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'light');
    }
    
    function enableDarkMode() {
        htmlElement.classList.remove('light-mode');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'dark');
    }

    // Typing Animation
    const rotatingText = document.getElementById('rotating-text');
    const phrases = ["Rohan Keshav Harish", "a Meta Certified Professional", "a Software Developer", "a Finance Enthusiast","a Google Certified Professional"];
    let index = 0;
    let letterIndex = 0;
    let currentPhrase = '';
    let isDeleting = false;

    function type() {
        currentPhrase = phrases[index];
        let displayText = currentPhrase.substring(0, letterIndex);

        if (isDeleting) {
            letterIndex--;
        } else {
            letterIndex++;
        }

        rotatingText.textContent = displayText;

        if (!isDeleting && letterIndex === currentPhrase.length) {
            setTimeout(() => isDeleting = true, 1000); // Pause before deleting
        } else if (isDeleting && letterIndex === 0) {
            isDeleting = false;
            index = (index + 1) % phrases.length;
        }

        setTimeout(type, isDeleting ? 100 : 150); // Adjust speed of typing and deleting
    }

    type();

    // Experience Section Reveal
    const experienceItems = document.querySelectorAll('.experience-item');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Adjust this value based on when you want to trigger the reveal
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    experienceItems.forEach(item => {
        observer.observe(item);
    });

    // Education Section Reveal
    const educationItems = document.querySelectorAll('.education-item');

    educationItems.forEach(item => {
        observer.observe(item);
    });

    // Smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Offset for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });
});
