function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

// Add this to handle the form submission
document.getElementById('contact-form').addEventListener('submit', async function(e) {
    e.preventDefault(); // Stop the page from reloading

    // Get data from the form
    const formData = {
        name: this.name.value,
        email: this.email.value,
        message: this.message.value
    };

try {
    const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    });

        const result = await response.json();

        if (response.ok) {
            alert('Message sent successfully!');
            this.reset(); // Clear the form
        } else {
            alert('Error sending message: ' + result.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to connect to the server.');
    }
});