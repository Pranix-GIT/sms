document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.mobile-menu-overlay');
    const body = document.querySelector('body');
    const header = document.querySelector('header');
    const mainNav = document.querySelector('.main-nav');
    const videoModal = document.querySelector('.video-modal');
    const closeModal = document.querySelector('.close-modal');
    const watchButton = document.querySelector('.cta-button');
    const iframe = document.querySelector('#youtube-player');

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

    // Function to handle video modal
    function toggleVideoModal() {
        videoModal.classList.toggle('active');
        
        // If modal is active, play video
        if (videoModal.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
            // Update iframe src to start playing
            iframe.src = iframe.src + '&autoplay=1';
        } else {
            document.body.style.overflow = 'auto';
            // Stop video when modal is closed
            iframe.src = iframe.src.replace('&autoplay=1', '');
        }
    }

    // Event listeners
    watchButton.addEventListener('click', toggleVideoModal);
    closeModal.addEventListener('click', toggleVideoModal);

    // Close modal when clicking outside
    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) {
            toggleVideoModal();
        }
    });

    // Close modal with ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal.classList.contains('active')) {
            toggleVideoModal();
        }
    });

    // Add notice overlay to body
    const noticeOverlay = document.createElement('div');
    noticeOverlay.className = 'notice-overlay';
    document.body.appendChild(noticeOverlay);

    // Notice popup functionality
    const noticePopup = document.querySelector('.notice-popup');
    const noticeClose = document.querySelector('.notice-close');
    const countdownDisplay = document.getElementById('countdown');

    function closeNotice() {
        noticePopup.style.animation = 'fadeOut 0.3s ease forwards';
        noticeOverlay.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => {
            noticePopup.style.display = 'none';
            noticeOverlay.style.display = 'none';
        }, 300);
    }

    // Add countdown timer functionality
    const timerDuration = 10; // 10 seconds
    let timeLeft = timerDuration;
    let countdownTimer;

    function startCountdown() {
        countdownTimer = setInterval(() => {
            timeLeft--;
            if (countdownDisplay) {
                countdownDisplay.textContent = timeLeft;
            }
            if (timeLeft <= 0) {
                clearInterval(countdownTimer);
                closeNotice();
            }
        }, 1000);
    }

    // Start the countdown
    startCountdown();

    // Reset timer when user hovers over notice
    noticePopup.addEventListener('mouseenter', () => {
        clearInterval(countdownTimer);
    });

    // Resume timer when user leaves notice
    noticePopup.addEventListener('mouseleave', () => {
        startCountdown();
    });

    noticeClose.addEventListener('click', () => {
        clearInterval(countdownTimer);
        closeNotice();
    });

    noticeOverlay.addEventListener('click', () => {
        clearInterval(countdownTimer);
        closeNotice();
    });

    // Close notice with ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            clearInterval(countdownTimer);
            closeNotice();
        }
    });

    // Add fadeOut animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeOut {
            from {
                opacity: 1;
            }
            to {
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Accordion functionality
    const accordionButtons = document.querySelectorAll('.accordion-button');
    
    accordionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const accordionItem = button.parentElement;
            const isActive = accordionItem.classList.contains('active');
            
            // Close all accordion items
            document.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                accordionItem.classList.add('active');
            }
        });
    });
}); 