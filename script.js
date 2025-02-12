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
        // Clear any existing timer before starting a new one
        if (countdownTimer) clearInterval(countdownTimer);
        
        timeLeft = timerDuration; // Reset time
        countdownDisplay.textContent = timeLeft;
        
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

    // Start the countdown when page loads
    startCountdown();

    // Pause timer on hover
    noticePopup.addEventListener('mouseenter', () => {
        if (countdownTimer) clearInterval(countdownTimer);
    });

    // Resume timer on mouse leave
    noticePopup.addEventListener('mouseleave', () => {
        if (timeLeft > 0) {
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
    });

    // Clear timer when manually closed
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

    // Add this to your existing script.js
    document.getElementById('newsletterForm').addEventListener('submit', function(e) {
        e.preventDefault();
        // Add your newsletter signup logic here
        alert('Thank you for subscribing! You will receive updates from SSBA.');
        this.reset();
    });

    // Chat Widget functionality
    const chatButton = document.getElementById('chatButton');
    const chatPopup = document.getElementById('chatPopup');
    const closeChat = document.getElementById('closeChat');
    const sendMessage = document.getElementById('sendMessage');
    const userInput = document.getElementById('userInput');
    const chatMessages = document.getElementById('chatMessages');

    // Initial bot message
    addMessage("Hi! 👋 I'm SSBA's AI assistant. How can I help you today?", 'bot');

    // Toggle chat popup
    chatButton.addEventListener('click', () => {
        chatPopup.classList.toggle('active');
        // Remove notification dot when chat is opened
        chatButton.querySelector('.notification-dot').style.display = 'none';
    });

    closeChat.addEventListener('click', () => {
        chatPopup.classList.remove('active');
    });

    // Send message function
    async function sendMessageToBot() {
        const message = userInput.value.trim();
        if (!message) return;

        // Add user message to chat
        addMessage(message, 'user');
        userInput.value = '';

        // Show typing indicator
        const typingIndicator = addMessage('Typing...', 'bot');

        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer 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",
                    "HTTP-Referer": "https://shivshaktibalacademy.edu.np",
                    "X-Title": "SSBA Assistant",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "deepseek/deepseek-r1:free",
                    messages: [
                        {
                            role: "system",
                            content: `You are SSBA's AI assistant. Your primary role is to assist with school-related inquiries only.

KEY INFORMATION TO SHARE:
1. Academic Programs:
   - Classes: Playgroup to Grade 5
   - Age groups: 2-11 years
   - Curriculum: Modern teaching with practical approach

2. Facilities:
   - Transportation: Available from Lahan to Mirchaiya
   - Hostel: 24/7 supervised accommodation
   - Labs & Equipment: Modern learning facilities
   - Sports & Recreation: Multiple activities

3. Faculty:
   - Qualified teachers with B.Ed certification
   - Regular training and development
   - Weekly parent-teacher meetings

4. Extra-curricular:
   - Sports activities
   - Cultural programs
   - Art and craft
   - Science projects

INTERACTION GUIDELINES:
- Keep responses focused on school-related topics
- If asked about non-school topics, politely redirect to school-related matters
- For fee structure or specific admission details, direct them to:
  Phone: +977 984-2000000
  Email: info@ssba.edu.np
- Be friendly but professional
- Encourage campus visits and admission inquiries
- Use simple, clear language
- Keep responses concise and relevant

If you receive questions unrelated to the school, respond with:
"I'm focused on helping you with information about Shiv Shakti Bal Academy. Could you please ask me about our academic programs, facilities, or admission process?"`
                        },
                        {
                            role: "user",
                            content: message
                        }
                    ]
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                throw new Error(`API request failed: ${errorData.error?.message || 'Unknown error'}`);
            }

            const data = await response.json();
            typingIndicator.remove();

            if (data.choices && data.choices[0] && data.choices[0].message) {
                const botResponse = data.choices[0].message.content;
                addMessage(botResponse, 'bot');
            } else {
                throw new Error('Invalid response format');
            }

        } catch (error) {
            console.error('Error:', error);
            typingIndicator.remove();
            addMessage("I apologize for the technical difficulty. Please contact our admission office:\nPhone: +977 984-2000000\nEmail: info@ssba.edu.np", 'bot');
        }
    }

    // Add message to chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return messageDiv;
    }

    // Send message on button click
    sendMessage.addEventListener('click', sendMessageToBot);

    // Send message on Enter key (Shift+Enter for new line)
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessageToBot();
        }
    });

    // Auto-resize textarea
    userInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
}); 