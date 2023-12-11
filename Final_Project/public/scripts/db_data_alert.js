// To display the data from the database in the browser

// JavaScript code in your signup.html or a separate script file
document.getElementById('signupForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    try {
        const response = await fetch('/signup', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const result = await response.text();
            alert(result); // Display success message in a popup
        } else {
            const errorData = await response.text();
            alert(errorData); // Display error message in a popup
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while signing up.'); // Display generic error message in a popup
    }
});

