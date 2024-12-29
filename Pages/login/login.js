document.addEventListener('DOMContentLoaded', () => {
    const hash = text => {
        const hashObj = new jsSHA('SHA-512', 'TEXT', { numRounds: 1 });
        hashObj.update(text);
        return hashObj.getHash('HEX');
    };

    const loginForm = document.querySelector('form');
    const emailInput = loginForm.querySelector('input[type="email"]');
    const passwordInput = loginForm.querySelector('input[type="password"]');

    const emailError = document.createElement('p');
    emailError.classList.add('error-message');
    emailError.style.color = 'red';

    const passwordError = document.createElement('p');
    passwordError.classList.add('error-message');
    passwordError.style.color = 'red';

    emailInput.insertAdjacentElement('afterend', emailError);
    passwordInput.insertAdjacentElement('afterend', passwordError);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let users = [];

    fetch('/edo-frizer/Pages/login/users.json')
        .then(response => response.json())
        .then(data => {
            users = data;
        })
        .catch(error => {
            console.error('Error loading users:', error);
        });

    loginForm.addEventListener('submit', event => {
        event.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        let hasError = false;

        if (!emailRegex.test(email)) {
            emailError.textContent =
                'Invalid email format. Please enter a valid email.';
            hasError = true;
        } else {
            emailError.textContent = '';
        }

        if (password.length < 8) {
            passwordError.textContent =
                'Invalid password. Must be 8 characters or longer.';
            hasError = true;
        } else {
            passwordError.textContent = '';
        }

        if (!hasError) {
            const user = users.find(user => user.email === email);
            const hashedPassword = hash(password);

            if (user && user.password === hashedPassword) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', email);

                alert(`Logged in as: ${email}`);
                window.location.href = '/edo-frizer/Pages/home/home.html';
            } else {
                alert('Invalid email or password');
            }
        }
    });
});

//useruser123
//admin123
//edinedin123
//password123
//password321