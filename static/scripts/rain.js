document.addEventListener("DOMContentLoaded", function () {
    const doodle = document.querySelector("css-doodle");
    let rainStarted = false;

    function startRainAnimation() {
        if (!rainStarted) {
            doodle.style.display = "block"; // Show the doodle element
            doodle.style.opacity = "1"; // Set the opacity to 1 to make the doodle visible
            rainStarted = true;
        }
    }

    function checkHashAndStartAnimation() {
        if (window.location.hash === "#rain" && !rainStarted) {
            startRainAnimation();
        }
    }

    // Initially hide the doodle element by setting display to "none" and opacity to 0
    doodle.style.display = "none";
    doodle.style.opacity = "0";

    // Check the hash value when the page loads
    checkHashAndStartAnimation();

    // Listen for hash changes
    window.addEventListener("hashchange", checkHashAndStartAnimation);
});
