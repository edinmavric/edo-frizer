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

    const users = [
        {
            email: 'user@example.com',
            password:
                '44fed277b3252323d3001cddd3794f7190e00dc8d1c70bf6168c80cb0ccdf762ca53da9ced20588e15b66d06ab7e962609a7c0caee383e669390d86bc3eb43d6', // Hashed value of 'password123'
        },
        {
            email: 'admin@example.com',
            password:
                '7fcf4ba391c48784edde599889d6e3f1e47a27db36ecc050cc92f259bfac38afad2c68a1ae804d77075e8fb722503f3eca2b2c1006ee6f6c7b7628cb45fffd1d', // Hashed value of 'admin123'
        },
        {
            email: 'edin@gmail.com',
            password:
                '36704f543d8683ec76b475e134567f8e1250279b87b65f3e2c8d7eb246dc3c7b38c34eaf5263f7a3766546fbda23e62a226a594f15f1e8d064131ef04b572ed0', // Hashed value of 'edinedin123'
        },
        {
            email: 'apljaskovic@np.ac.rs',
            password:
                'bed4efa1d4fdbd954bd3705d6a2a78270ec9a52ecfbfb010c61862af5c76af1761ffeb1aef6aca1bf5d02b3781aa854fabd2b69c790de74e17ecfec3cb6ac4bf', // Hashed value of 'password321'
        },
        {
            email: 'spurkovic@np.ac.rs',
            password:
                '743e849368d890e56817cbc957590ac7381a246dfd141256a3c8d42c4839bbb3849daa79fb7f35acd2f3917d5f46c44294636f4ab35181647dfa750156b600c0', // Hashed value of 'password321'
        },
    ];

    //useruser123
    //admin123
    //edinedin123
    //password123
    //password321

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
