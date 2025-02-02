document.addEventListener("DOMContentLoaded", function () 
{
    const demoEmail = "demo@fitbot.com";
    const demoPassword = "password123";

    // Get form and input fields
    const loginForm = document.getElementById("login-form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const errorMessage = document.getElementById("error-message");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault(); 

        const enteredEmail = emailInput.value;
        const enteredPassword = passwordInput.value;

        if (enteredEmail === demoEmail && enteredPassword === demoPassword) {
            // Redirect to home.html
            window.location.href = "home.html";
        } else {
            // Show error message
            errorMessage.style.display = "block";
        }
    });
});
