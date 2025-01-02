document.addEventListener('DOMContentLoaded', () => {
    function switchLanguage(language) {
        const translatableElements = document.querySelectorAll(
            '[data-text-sr], [data-text-en], [data-value-sr], [data-value-en], [data-placeholder-sr], [data-placeholder-en]'
        );

        try {
            translatableElements.forEach(element => {
                const textContent = element.getAttribute(
                    `data-text-${language}`
                );
                if (textContent) element.textContent = textContent;

                const valueContent = element.getAttribute(
                    `data-value-${language}`
                );
                if (valueContent) element.value = valueContent;

                const placeholderContent = element.getAttribute(
                    `data-placeholder-${language}`
                );
                if (placeholderContent)
                    element.placeholder = placeholderContent;
            });
        } catch (error) {
            console.error('Error in switching language:', error);
        }

        document
            .querySelectorAll('.language-select')
            .forEach(languageSelect => {
                languageSelect.value = language;
            });

        localStorage.setItem('Language', language);
    }

    const savedLanguage = localStorage.getItem('Language') || 'en';
    switchLanguage(savedLanguage);

    function initializeLanguageSwitcher() {
        document
            .querySelectorAll('.language-select')
            .forEach(languageSelect => {
                languageSelect.value = savedLanguage;
                languageSelect.addEventListener('change', e => {
                    switchLanguage(e.target.value);
                });
            });
    }

    window.addEventListener('resize', initializeLanguageSwitcher);

    initializeLanguageSwitcher();
});

const logoutButtons = document.querySelectorAll(
    'button[data-text-en="Log out"], button[data-text-sr="Odjavi se"]'
);

if (logoutButtons.length > 0) {
    logoutButtons.forEach(button => {
        button.addEventListener('click', () => {
            const confirmation = confirm('Are you sure you want to log out?');
            if (confirmation) {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userEmail');
                alert('You have been logged out successfully.');
                window.location.href = '/edo-frizer/Pages/login/login.html';
            }
        });
    });
}
