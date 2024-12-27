document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('.contact-form');
    const nameInput = contactForm.querySelector('input[type="text"]');
    const emailInput = contactForm.querySelector('#user-email');
    const messageInput = contactForm.querySelector('textarea');

    const nameError = document.createElement('p');
    nameError.classList.add('error-message');
    nameError.style.color = 'red';

    const emailError = document.createElement('p');
    emailError.classList.add('error-message');
    emailError.style.color = 'red';

    const messageError = document.createElement('p');
    messageError.classList.add('error-message');
    messageError.style.color = 'red';

    nameInput.insertAdjacentElement('afterend', nameError);
    emailInput.insertAdjacentElement('afterend', emailError);
    messageInput.insertAdjacentElement('afterend', messageError);

    const fullNameRegex = /^[A-Z][a-z]+(\s[A-Z][a-z]+)*$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const userEmail = localStorage.getItem('userEmail');

    if (userEmail) {
        emailInput.value = userEmail;
    }

    contactForm.addEventListener('submit', event => {
        event.preventDefault();

        let hasError = false;

        if (!fullNameRegex.test(nameInput.value.trim())) {
            nameError.textContent = 'Full name is required.';
            hasError = true;
        } else {
            nameError.textContent = '';
        }

        if (!emailRegex.test(emailInput.value.trim())) {
            emailError.textContent = 'Please enter a valid email address.';
            hasError = true;
        } else {
            emailError.textContent = '';
        }

        if (messageInput.value.trim() === '') {
            messageError.textContent = 'Message cannot be empty.';
            hasError = true;
        } else {
            messageError.textContent = '';
        }

        if (!hasError) {
            window.location.href = '/edo-frizer/Pages/validation/contact/validation.html';
            contactForm.reset();
        }
    });
});
