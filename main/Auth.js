document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = document.querySelector('input[type="password"]');
    const modal = document.getElementById("loginModal");
    const modalMessage = document.getElementById("modalMessage");
    const closeModal = document.getElementById("closeModal");
    const modalOk = document.getElementById("modalOk");

    // Hardcoded admin and user credentials
    const credentials = {
        admin: {
            email: "admin@gmail.com",
            password: "admin123",
            role: "admin",
            redirect: "addRecord/home.html"
        },
        user: {
            email: "user@gmail.com",
            password: "user123",
            role: "user",
            redirect: "main/userLogin.html"
        }
    };

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const email = emailInput.value;
        const password = passwordInput.value;

        const openModal = (message, isSuccess, redirectUrl) => {
            modalMessage.textContent = message;
            modal.style.display = "block";

            modalOk.onclick = function() {
                modal.style.display = "none";
                if (isSuccess) {
                    window.location.href = redirectUrl; 
                }
            };
        };

        closeModal.onclick = function() {
            modal.style.display = "none";
        };

        window.onclick = function(event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        };

        // Check credentials for admin or user
        if (email === credentials.admin.email && password === credentials.admin.password) {
            openModal("Login successful as Admin!", true, credentials.admin.redirect);
            localStorage.setItem('role', credentials.admin.role); // Set role in localStorage
        } else if (email === credentials.user.email && password === credentials.user.password) {
            openModal("Login successful as User!", true, credentials.user.redirect);
            localStorage.setItem('role', credentials.user.role); // Set role in localStorage
        } else {
            openModal("Incorrect email or password. Please try again.", false);
        }
    });
});
