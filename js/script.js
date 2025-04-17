// Change button color when clicked
document.getElementById('linkedIn').addEventListener('click', function() {
    this.style.backgroundColor = '#FFCB05';
    this.style.color = '#000000';
});

// Handle the subscribe form submission
document.getElementById('subscribeForm').addEventListener('submit', function(event) {
    event.preventDefault(); // prevent real page reload

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();

    if (name === '' || email === '') {
        alert('Please fill in both your name and email!');
        return;
    }

    alert(`Thank you for subscribing, ${name}!`);
    // Optionally, you can clear the form
    this.reset();
});

// Update copyright year automatically
document.getElementById('year').textContent = new Date().getFullYear();
