document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.mobile-menu-overlay');
    const body = document.querySelector('body');
    const header = document.querySelector('header');
    const mainNav = document.querySelector('.main-nav');

    function toggleMenu() {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        overlay.classList.toggle('active');
        body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
    }

    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    overlay.addEventListener('click', () => {
        toggleMenu();
    });

    // Close menu with ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            toggleMenu();
        }
    });

    // Prevent clicks inside mobile menu from closing it
    mobileMenu.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            mainNav.classList.add('header-scrolled');
        } else {
            mainNav.classList.remove('header-scrolled');
        }
    });
}); 