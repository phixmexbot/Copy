document.addEventListener("DOMContentLoaded", function () {
    const doodle = document.querySelector("css-doodle");
    let rainStarted = false;

    function startRainAnimation() {
        if (!rainStarted) {
            doodle.style.display = "block"; // Show the doodle element
            rainStarted = true;
        }
    }

    function checkHashAndStartAnimation() {
        if (window.location.hash === "#rain" && !rainStarted) {
            startRainAnimation();
        }
    }

    // Initially hide the doodle element until the animation is triggered
    doodle.style.display = "none";

    // Check the hash value when the page loads
    checkHashAndStartAnimation();

    // Listen for hash changes
    window.addEventListener("hashchange", checkHashAndStartAnimation);
});
