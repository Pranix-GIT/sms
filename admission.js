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

    // Update form submission handler
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (validateStep(currentStep)) {
            const submitBtn = form.querySelector('.submit-btn');
            
            try {
                // Show quick loading state
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
                
                // Add file validation
                const studentPhoto = document.getElementById('studentPhoto').files[0];
                const birthCert = document.getElementById('birthCert').files[0];
                
                // Validate required files
                if (!studentPhoto) {
                    throw new Error('Please upload student photo');
                }
                if (!birthCert) {
                    throw new Error('Please upload birth certificate');
                }
                
                // Create FormData and submit
                const formData = new FormData(form);
                
                // Submit the form using fetch
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData
                });
                
                if (response.ok) {
                    alert('Your form has been submitted. We will contact you back soon.');
                    form.reset();
                    // Reset to first step
                    currentStep = 1;
                    document.querySelectorAll('.form-step').forEach(step => {
                        step.classList.remove('active');
                    });
                    document.querySelector('.form-step[data-step="1"]').classList.add('active');
                    
                    // Reset progress
                    document.querySelectorAll('.progress-step').forEach(step => {
                        step.classList.remove('active', 'completed');
                    });
                    document.querySelector('.progress-step[data-step="1"]').classList.add('active');
                    updateProgress(1);
                    
                    // Reset file upload labels
                    document.querySelectorAll('.doc-upload label').forEach(label => {
                        label.innerHTML = '<i class="fas fa-upload"></i> Upload';
                        label.classList.remove('file-selected');
                    });
                    
                    // Remove previews
                    document.querySelectorAll('.doc-preview').forEach(preview => {
                        preview.remove();
                    });
                    
                    // Scroll to top
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    throw new Error('Form submission failed');
                }
                
            } catch (error) {
                alert(error.message || 'There was an error submitting your application. Please try again.');
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

    // Handle student photo preview
    const studentPhotoInput = document.getElementById('studentPhoto');
    if (studentPhotoInput) {
        studentPhotoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                const docItem = this.closest('.document-item');
                
                // Create preview element if it doesn't exist
                let preview = docItem.querySelector('.doc-preview');
                if (!preview) {
                    preview = document.createElement('div');
                    preview.className = 'doc-preview';
                    preview.innerHTML = '<img src="" alt="Student photo preview">';
                    docItem.insertBefore(preview, docItem.firstChild);
                }

                reader.onload = function(e) {
                    preview.querySelector('img').src = e.target.result;
                    preview.classList.add('active');
                    docItem.classList.add('has-preview');
                };

                reader.readAsDataURL(file);
            }
        });
    }

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

    // Add file preview for all document uploads
    document.querySelectorAll('input[type="file"]').forEach(input => {
        input.addEventListener('change', function(e) {
            const file = this.files[0];
            if (file) {
                // Update label to show file name
                const label = this.nextElementSibling;
                label.innerHTML = `<i class="fas fa-check"></i> ${file.name}`;
                label.classList.add('file-selected');
                
                // Show preview for images
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    const docItem = this.closest('.document-item');
                    
                    let preview = docItem.querySelector('.doc-preview');
                    if (!preview) {
                        preview = document.createElement('div');
                        preview.className = 'doc-preview';
                        preview.innerHTML = '<img src="" alt="Document preview">';
                        docItem.insertBefore(preview, docItem.firstChild);
                    }

                    reader.onload = function(e) {
                        preview.querySelector('img').src = e.target.result;
                        preview.classList.add('active');
                        docItem.classList.add('has-preview');
                    };

                    reader.readAsDataURL(file);
                }
            }
        });
    });
}); 