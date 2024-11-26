// Custom JavaScript for interactivity

document.addEventListener("DOMContentLoaded", function () {
    // Example: Highlight the first header after the page loads
    const firstHeader = document.querySelector("h1, h2, h3");
    if (firstHeader) {
        firstHeader.style.backgroundColor = "#f0f8ff"; // Light blue
    }
});
