document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('admissionForm');
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const nextButtons = document.querySelectorAll('.next-btn');
    const prevButtons = document.querySelectorAll('.prev-btn');
    
    let currentStep = 1;

    // Handle Next button clicks
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Validate current step before proceeding
            if (validateStep(currentStep)) {
                // Hide current step
                document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.remove('active');
                progressSteps[currentStep - 1].classList.remove('active');
                
                // Show next step
                currentStep++;
                document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.add('active');
                progressSteps[currentStep - 1].classList.add('active');
                
                // Update progress bar
                updateProgress(currentStep);
            }
        });
    });

    // Handle Previous button clicks
    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Hide current step
            document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.remove('active');
            progressSteps[currentStep - 1].classList.remove('active');
            
            // Show previous step
            currentStep--;
            document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.add('active');
            progressSteps[currentStep - 1].classList.add('active');
            
            // Update progress bar
            updateProgress(currentStep);
        });
    });

    // Validate each step
    function validateStep(step) {
        const currentStepElement = document.querySelector(`.form-step[data-step="${step}"]`);
        const inputs = currentStepElement.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('error');
                
                // Add error message
                let errorMessage = input.nextElementSibling;
                if (!errorMessage || !errorMessage.classList.contains('error-message')) {
                    errorMessage = document.createElement('span');
                    errorMessage.classList.add('error-message');
                    errorMessage.textContent = 'This field is required';
                    input.parentNode.insertBefore(errorMessage, input.nextSibling);
                }
            } else {
                input.classList.remove('error');
                const errorMessage = input.nextElementSibling;
                if (errorMessage && errorMessage.classList.contains('error-message')) {
                    errorMessage.remove();
                }
            }
        });

        return isValid;
    }

    // Handle all document uploads
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        input.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const docItem = this.closest('.document-item');
                const label = docItem.querySelector('label');
                
                // Update label text to show selected file
                label.innerHTML = `<i class="fas fa-check"></i> ${file.name}`;
                label.style.background = '#55B79D';
                label.style.color = 'white';
                
                // Create preview element if it doesn't exist
                let preview = docItem.querySelector('.doc-preview');
                if (!preview) {
                    preview = document.createElement('div');
                    preview.className = 'doc-preview';
                    docItem.insertBefore(preview, docItem.firstChild);
                }

                // Handle different file types
                if (file.type.startsWith('image/')) {
                    // For images
                    preview.innerHTML = '<img src="" alt="Document preview">';
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        preview.querySelector('img').src = e.target.result;
                        preview.classList.add('active');
                        docItem.classList.add('has-preview');
                    };
                    reader.readAsDataURL(file);
                } else if (file.type === 'application/pdf') {
                    // For PDFs
                    preview.innerHTML = `
                        <div class="pdf-preview">
                            <i class="fas fa-file-pdf"></i>
                            <span>${file.name}</span>
                        </div>
                    `;
                    preview.classList.add('active');
                    docItem.classList.add('has-preview');
                }
            }
        });
    });

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (validateStep(currentStep)) {
            const submitBtn = form.querySelector('.submit-btn');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

            try {
                // Create FormData object
                const formData = new FormData(form);
                
                // Add file data
                fileInputs.forEach(input => {
                    if (input.files[0]) {
                        formData.append(input.name, input.files[0]);
                    }
                });

                // Submit the form
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    alert('Application submitted successfully!');
                    
                    // Reset form and file inputs
                    form.reset();
                    fileInputs.forEach(input => {
                        const docItem = input.closest('.document-item');
                        const label = docItem.querySelector('label');
                        const preview = docItem.querySelector('.doc-preview');
                        
                        // Reset label
                        label.innerHTML = '<i class="fas fa-upload"></i> Upload';
                        label.style.background = 'none';
                        label.style.color = '#55B79D';
                        
                        // Remove preview if exists
                        if (preview) {
                            preview.remove();
                        }
                    });

                    // Reset to first step
                    currentStep = 1;
                    document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
                    document.querySelector('.form-step[data-step="1"]').classList.add('active');
                    document.querySelectorAll('.progress-step').forEach(step => step.classList.remove('active', 'completed'));
                    document.querySelector('.progress-step[data-step="1"]').classList.add('active');
                    updateProgress(1);

                    // Redirect to admission page
                    window.location.href = 'admission.html';
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                alert('There was an error submitting your application. Please try again.');
                console.error('Submission error:', error);
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Submit Application';
            }
        }
    });

    // Remove error styling on input
    form.addEventListener('input', (e) => {
        if (e.target.classList.contains('error')) {
            e.target.classList.remove('error');
            const errorMessage = e.target.nextElementSibling;
            if (errorMessage && errorMessage.classList.contains('error-message')) {
                errorMessage.remove();
            }
        }
    });

    // Update progress bar
    function updateProgress(step) {
        const formProgress = document.querySelector('.form-progress');
        formProgress.setAttribute('data-progress', step);

        // Update completed steps
        progressSteps.forEach((stepEl, index) => {
            if (index + 1 < step) {
                stepEl.classList.add('completed');
            } else {
                stepEl.classList.remove('completed');
            }
        });
    }

    // Initialize progress bar
    updateProgress(1);
}); 