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
