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

    // Get chat elements
    const chatButton = document.getElementById('chatButton');
    const chatPopup = document.getElementById('chatPopup');
    const closeChat = document.getElementById('closeChat');
    const sendMessage = document.getElementById('sendMessage');
    const userInput = document.getElementById('userInput');
    const chatMessages = document.getElementById('chatMessages');

    // Toggle chat popup
    chatButton.addEventListener('click', () => {
        chatPopup.classList.toggle('active');
        // Remove notification dot when chat is opened
        chatButton.querySelector('.notification-dot').style.display = 'none';
    });

    closeChat.addEventListener('click', () => {
        chatPopup.classList.remove('active');
    });

    // Add message to chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.innerHTML = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return messageDiv;
    }

    // QA Database
    const qaDatabase = {
        welcome: {
            message: "Hi! 👋 I'm SSBA's Assistant. How can I help you today?",
            options: [
                "Programs & Classes",
                "Admission Process",
                "Fee Structure",
                "School Facilities",
                "Contact Information"
            ]
        },
        "programs & classes": {
            message: "We offer classes from Playgroup (PG) to Grade 5. What would you like to know more about?",
            options: [
                "Age Requirements",
                "Class Timings",
                "Teaching Methodology",
                "Back to Main Menu"
            ]
        },
        "age requirements": {
            message: "Our age requirements are:\n• Playgroup: 2.5-3 years\n• Nursery: 3-4 years\n• LKG: 4-5 years\n• UKG: 5-6 years\n• Grade 1-5: 6-11 years",
            options: [
                "Admission Process",
                "Class Timings",
                "Back to Main Menu"
            ]
        },
        "class timings": {
            message: "Our school hours are:\n• Sunday - Friday: 10:00 AM - 4:00 PM\n• Saturday: Closed\n\nStudents should arrive 15 minutes before classes begin.",
            options: [
                "Age Requirements",
                "Teaching Methodology",
                "Back to Main Menu"
            ]
        },
        "teaching methodology": {
            message: "We follow a modern teaching approach including:\n• Activity-Based Learning\n• Montessori Techniques\n• Practical Demonstrations\n• Regular Parent-Teacher Meetings\n• Focus on Holistic Development",
            options: [
                "School Facilities",
                "Extra Activities",
                "Back to Main Menu"
            ]
        },
        "admission process": {
            message: "For admission, you'll need:\n• Birth Certificate\n• 2 Passport Photos\n• Previous School Report Card (if applicable)\n\nWould you like to know more about:",
            options: [
                "Fee Structure",
                "Required Documents",
                "Schedule a Visit",
                "Back to Main Menu"
            ]
        },
        "required documents": {
            message: "Required documents for admission:\n• Birth Certificate (original + copy)\n• 2 Recent Passport Photos\n• Previous School Report Card\n• Transfer Certificate (if applicable)\n• Parent's ID Proof",
            options: [
                "Fee Structure",
                "Schedule a Visit",
                "Back to Main Menu"
            ]
        },
        "schedule a visit": {
            message: "You can visit our school:\n• Weekdays: 10:00 AM - 4:00 PM\n• Contact: 9842839339 for appointment\n• Location: Chandra Ayodhyapur, Siraha\n\nWould you like our contact information?",
            options: [
                "Contact Information",
                "Direction to School",
                "Back to Main Menu"
            ]
        },
        "fee structure": {
            message: "Our fee structure is as follows:\n• Admission Fee: रु 3,500\n• Monthly Fee: रु 2,500\n• Annual Fee: रु 2,500\n• Exam Fee: रु 500\n• Academic Fee: रु 5,500",
            options: [
                "Transportation Fee",
                "Payment Schedule",
                "Scholarships",
                "Back to Main Menu"
            ]
        },
        "transportation fee": {
            message: "Transportation fee varies based on distance:\n• Available from Lahan to Mirchaiya\n• AC and Non-AC options\n• Monthly payment system\n\nContact office for exact rates from your location.",
            options: [
                "Fee Structure",
                "Contact Information",
                "Back to Main Menu"
            ]
        },
        "payment schedule": {
            message: "Fee payment schedule:\n• Monthly Fee: By 10th of each month\n• Annual Fee: At start of session\n• Exam Fee: Before each term\n• Multiple payment options available",
            options: [
                "Fee Structure",
                "Scholarships",
                "Back to Main Menu"
            ]
        },
        "scholarships": {
            message: "We offer scholarships for:\n• Meritorious Students\n• Financially Challenged Families\n• Sports Excellence\n• Single Parent Children\n\nContact office for details.",
            options: [
                "Contact Information",
                "Fee Structure",
                "Back to Main Menu"
            ]
        },
        "school facilities": {
            message: "We offer modern facilities including:\n• Spacious Classrooms\n• Computer Labs\n• Library\n• Sports Ground\n• CCTV Surveillance\n• Cafeteria",
            options: [
                "Transportation",
                "Extra Activities",
                "Safety Measures",
                "Back to Main Menu"
            ]
        },
        "transportation": {
            message: "Our transportation service includes:\n• Coverage: Lahan to Mirchaiya\n• Experienced drivers\n• GPS tracked vehicles\n• Separate staff supervision\n• Door-to-door pickup/drop",
            options: [
                "Transportation Fee",
                "Safety Measures",
                "Back to Main Menu"
            ]
        },
        "extra activities": {
            message: "Extra-curricular activities include:\n• Sports (Football, Badminton, Cricket)\n• Art & Craft Workshops\n• Cultural Programs\n• Music & Dance Classes\n• Educational Excursions",
            options: [
                "School Facilities",
                "Teaching Methodology",
                "Back to Main Menu"
            ]
        },
        "safety measures": {
            message: "Our safety measures include:\n• CCTV Surveillance\n• Trained Security Staff\n• Fire Safety Equipment\n• First Aid Facilities\n• Regular Safety Drills",
            options: [
                "School Facilities",
                "Contact Information",
                "Back to Main Menu"
            ]
        },
        "contact information": {
            message: "📞 Phone: 033-401099\n📱 Mobile: 9842839339 (Admission)\n📧 Email: shivshakti.balacademy@gmail.com\n📍 Location: Chandra Ayodhyapur, Siraha, Nepal",
            options: [
                "Schedule a Visit",
                "Direction to School",
                "Back to Main Menu"
            ]
        },
        "direction to school": {
            message: "Our school is located in Chandra Ayodhyapur, Siraha:\n• Near [Landmark]\n• [X] km from Lahan\n• [Y] km from Mirchaiya\n\nWould you like to schedule a visit?",
            options: [
                "Schedule a Visit",
                "Contact Information",
                "Back to Main Menu"
            ]
        },
        "back to main menu": {
            message: "What would you like to know about?",
            options: [
                "Programs & Classes",
                "Admission Process",
                "Fee Structure",
                "School Facilities",
                "Contact Information"
            ]
        }
    };

    // Function to create option buttons
    function createOptionButtons(options) {
        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'chat-options';
        
        options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'option-button';
            button.textContent = option;
            button.onclick = () => handleOptionClick(option);
            optionsDiv.appendChild(button);
        });
        
        return optionsDiv;
    }

    // Handle option click
    function handleOptionClick(option) {
        const lowercaseOption = option.toLowerCase();
        addMessage(option, 'user');
        
        if (qaDatabase[lowercaseOption]) {
            showTypingIndicator()
                .then(() => {
                    addMessage(qaDatabase[lowercaseOption].message, 'bot');
                    if (qaDatabase[lowercaseOption].options) {
                        const optionsDiv = createOptionButtons(qaDatabase[lowercaseOption].options);
                        chatMessages.appendChild(optionsDiv);
                        optionsDiv.style.opacity = '0';
                        setTimeout(() => optionsDiv.style.opacity = '1', 100);
                    }
                });
        }
    }

    // Show typing indicator with animation
    async function showTypingIndicator() {
        const typingIndicator = addMessage(
            `<div class="typing-indicator">
                <span></span><span></span><span></span>
            </div>`, 
            'bot'
        );
        await new Promise(resolve => setTimeout(resolve, 1000));
        typingIndicator.remove();
    }

    // Handle text input
    sendMessage.addEventListener('click', () => {
        const message = userInput.value.trim();
        if (message) {
            addMessage(message, 'user');
            userInput.value = '';
            handleUserInput(message);
        }
    });

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage.click();
        }
    });

    // Function to handle user text input
    function handleUserInput(message) {
        const lowercaseMsg = message.toLowerCase();
        let found = false;

        // Check if message contains any keywords from qaDatabase
        Object.entries(qaDatabase).forEach(([key, value]) => {
            if (lowercaseMsg.includes(key) && !found) {
                found = true;
                showTypingIndicator()
                    .then(() => {
                        addMessage(value.message, 'bot');
                        if (value.options) {
                            const optionsDiv = createOptionButtons(value.options);
                            chatMessages.appendChild(optionsDiv);
                            optionsDiv.style.opacity = '0';
                            setTimeout(() => optionsDiv.style.opacity = '1', 100);
                        }
                    });
            }
        });

        // If no matching response found, show default message
        if (!found) {
            showTypingIndicator()
                .then(() => {
                    addMessage(qaDatabase.welcome.message, 'bot');
                    const optionsDiv = createOptionButtons(qaDatabase.welcome.options);
                    chatMessages.appendChild(optionsDiv);
                    optionsDiv.style.opacity = '0';
                    setTimeout(() => optionsDiv.style.opacity = '1', 100);
                });
        }
    }

    // Initialize chat with welcome message
    addMessage(qaDatabase.welcome.message, 'bot');
    const initialOptions = createOptionButtons(qaDatabase.welcome.options);
    chatMessages.appendChild(initialOptions);
}); 