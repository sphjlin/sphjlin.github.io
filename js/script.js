// This file contains the JavaScript code for the client project
document.getElementById("year").innerHTML = new Date().getFullYear();
// this javascript code is from Codex world:https://www.codexworld.com/how-to/get-current-year-to-display-dynamic-year-in-copyright-using-javascript/



// Change button color when clicked
const buttons = document.querySelectorAll('.prettybutton');
buttons.forEach(function(button) {
    button.addEventListener('click', function() {
        this.style.backgroundColor = '#FFCB05';
        this.style.color = '#000000';
    });
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


