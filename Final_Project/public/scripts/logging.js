// This script is used to check if the user is logged in or not.

document.addEventListener('DOMContentLoaded', function () {
    var isLoggedIn = false; 

    fetch('/isLoggedIn').then(function (response) {
        response.json().then(function (data) {
            isLoggedIn = data.isLoggedIn;

            // Get the li element
            var liElement = document.getElementById('logoutSignupLink');

            // Create the anchor element
            var anchorElement = document.createElement('a');
            
            // Set the anchor's text content and attributes based on the isLoggedIn value
            if (isLoggedIn) {
                anchorElement.href = '/logout';
                anchorElement.textContent = 'Logout';
                anchorElement.className = 'nav-link'; // Apply the same class as other nav links

                // Add click event listener for Logout
                anchorElement.addEventListener('click', function (event) {
                    event.preventDefault();
                    window.location.href = '/logout'; // Redirect to the logout endpoint
                });
            } else {
                anchorElement.href = '/static/pages/signup.html';
                anchorElement.textContent = 'Sign Up';
                anchorElement.className = 'nav-link'; 

                // Add click event listener for Sign Up
                anchorElement.addEventListener('click', function (event) {
                    event.preventDefault();
                    window.location.href = '/static/pages/signup.html';
                });
            }

            // Append the anchor element to the li element
            if (liElement) {
                liElement.appendChild(anchorElement);
            } else {
                console.error("Element with ID 'logoutSignupLink' not found.");
            }
        });
    });
});

