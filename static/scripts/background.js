document.addEventListener('DOMContentLoaded', () => {

const moon = document.querySelector('.moon');
const background = document.querySelector('.background');
const ground = document.querySelector('.ground');
const rocks = document.querySelectorAll('.rock');
const cactusPath = document.querySelector('.cactus path');

let isDayMode = false; // Flag to track the mode

moon.addEventListener('click', function(event) {
  if (!background || !ground) {
    console.error('Background or ground element not found');
    return;
  }

  // Get the position of the moon element
  const rect = moon.getBoundingClientRect();
  const xPos = rect.left + rect.width / 2; // Center of the moon
  const yPos = rect.top + rect.height / 2; // Center of the moon

  // Set the radial gradient's center position (from the moon's position)
  background.style.setProperty('--x-pos', `${xPos}px`);
  background.style.setProperty('--y-pos', `${yPos}px`);

  // Toggle between day and night modes with radial gradient
  if (isDayMode) {
    // Apply the night-mode gradient
    background.classList.add('night-mode-gradient');

    // Change colors for night mode
    ground.style.transition = 'background 0.5s';
    ground.style.background = 'black'; // Night mode ground
    rocks.forEach(rock => {
      rock.style.transition = 'background 0.5s';
      rock.style.background = 'black'; // Night mode rocks
    });
    cactusPath.style.transition = 'fill 0.5s';
    cactusPath.style.fill = 'black'; // Night mode cactus
  } else {
    // Reset to day-mode gradient
    background.classList.remove('night-mode-gradient');
    background.style.background = `radial-gradient(circle at var(--x-pos) var(--y-pos), #87CEFA 0%, #fff95b 100%)`;

    // Change colors for day mode
    ground.style.transition = 'background 0.5s';
    ground.style.background = '#736944'; // Day mode ground
    rocks.forEach(rock => {
      rock.style.transition = 'background 0.5s';
      rock.style.background = '#736944'; // Day mode rocks
    });
    cactusPath.style.transition = 'fill 0.5s';
    cactusPath.style.fill = '#736944'; // Day mode cactus
  }

  isDayMode = !isDayMode; // Toggle the mode
});

  // Function to handle hash change
function handleHashChange() {
  const hash = window.location.hash.slice(1); // Get the hash value without the '#'

  if (['light', 'rain', 'snow'].includes(hash)) {
    if (isDayMode) {
      background.style.transition = 'background 0.5s'; // Transition for background color change
      background.style.background = 'linear-gradient(to bottom, #b0c4de, #778899)';
    }
  }
}

// Listen for hash changes
window.addEventListener('hashchange', handleHashChange);
  
  
    const moonButton = document.querySelector('.moon'); // Select the moon button
    const shootingElement = document.getElementById('shooting'); // Select the shooting element
    const max_stars = 100;
    const stars = [];
    let starsVisible = true;  // Keep track of visibility state

    // Function to create stars
    function createStars() {
      for (let i = 0; i < max_stars; i++) {
        const star = document.createElement('span');
        const size = (Math.floor(Math.random() * 3) + 1);
        star.className = 'star';
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        star.style.background = `rgba(255, 255, 177, ${Math.random()})`;
        star.style.top = Math.ceil(Math.random() * 100) + '%';
        star.style.left = Math.ceil(Math.random() * 100) + '%';
        stars.push(star);
        document.body.appendChild(star);
      }

      for (let j = 0; j < max_stars * 0.6; j++) {
        const star = stars[j];
        star.style.animationName = 'glow';
        star.style.animationDelay = (Math.floor(Math.random() * 6) + 1) + 's';
        star.style.animationDuration = (Math.floor(Math.random() * 6) + 1) + 's';
      }
    }

    // Create stars after a 300ms delay
    setTimeout(() => {
      createStars();
    }, 300);

    // Add click event listener to toggle visibility of stars and shooting element
    moonButton.addEventListener('click', () => {
      if (starsVisible) {
        // Hide stars and shooting element
        stars.forEach(star => star.style.display = 'none');
        shootingElement.style.display = 'none';
      } else {
        // Show stars and shooting element
        stars.forEach(star => star.style.display = 'block');
        shootingElement.style.display = 'block';
      }
      starsVisible = !starsVisible;  // Toggle visibility state
    });
});

