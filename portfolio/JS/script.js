document.addEventListener('DOMContentLoaded', function() {

    // ScrollReveal for smooth animations
    const sr = ScrollReveal({
        origin: 'bottom',
        distance: '20px',
        duration: 500,
        delay: 200,
        easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
        mobile: true,
        reset: false
    });

    sr.reveal('#hero > *', { interval: 100, origin: 'top' });
    sr.reveal('.section-title', { origin: 'left' });
    sr.reveal('#about .about-text', { origin: 'left' });
    sr.reveal('#about .about-image', { origin: 'right' });
    sr.reveal('.project-card', { interval: 100 });
    sr.reveal('#contact > *', { interval: 100 });

    // Hide/Show Navbar on scroll
    let lastScrollY = window.scrollY;
    const header = document.querySelector('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 10px 30px -10px rgba(2, 12, 27, 0.7)';
        } else {
            header.style.boxShadow = 'none';
        }

        if (lastScrollY < window.scrollY && window.scrollY > 100) {
            header.style.top = '-80px'; // Hide header
        } else {
            header.style.top = '0'; // Show header
        }
        lastScrollY = window.scrollY;
    });

});