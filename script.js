// Video Modal Functionality
document.addEventListener('DOMContentLoaded', () => {
    const playButton = document.getElementById('playVideo');
    const modal = document.getElementById('videoModal');
    const closeButton = modal.querySelector('.close-modal');
    const iframe = modal.querySelector('iframe');
    const videoUrl = 'https://www.youtube.com/embed/IylqkNWndCA?autoplay=1';

    playButton.addEventListener('click', () => {
        modal.style.display = 'grid';
        iframe.src = videoUrl;
    });

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
        iframe.src = '';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            iframe.src = '';
        }
    });
}); 