document.addEventListener("DOMContentLoaded", function() {
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
});
