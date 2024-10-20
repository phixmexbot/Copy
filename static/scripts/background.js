document.addEventListener('DOMContentLoaded', () => {

const moon = document.querySelector('.moon');
const background = document.querySelector('.background');
const ground = document.querySelector('.ground'); // Select the ground element
const rocks = document.querySelectorAll('.rock'); // Select all rock elements
const cactusPath = document.querySelector('.cactus path'); // Select the path inside the cactus SVG

let isDayMode = false; // Flag to track the mode

moon.addEventListener('click', function(event) {
  // Check if the background element exists
  if (!background || !ground) {
    console.error('Background or ground element not found');
    return;
  }

  // Get the position of the moon element
  const rect = moon.getBoundingClientRect();
  const xPos = rect.left + rect.width / 2; // Center of the moon
  const yPos = rect.top + rect.height / 2; // Center of the moon

  // Create a CSS variable for the position of the wave effect
  background.style.setProperty('--x-pos', `${xPos}px`);
  background.style.setProperty('--y-pos', `${yPos}px`);

  // Toggle between day and night modes
  if (isDayMode) {
    // Switch to night mode
    background.style.background = `linear-gradient(to bottom, #0f1a2b, #411d63)`;
    
    // Change colors back to black uniformly
    ground.style.transition = 'background 0.5s'; // Smooth transition for ground color
    ground.style.background = 'black'; // Reset ground color
    rocks.forEach(rock => {
      rock.style.transition = 'background 0.5s'; // Smooth transition for rocks
      rock.style.background = 'black'; // Reset rock color
    });
    
    // Change cactus color to black
    cactusPath.style.transition = 'fill 0.5s'; // Smooth transition for cactus color
    cactusPath.style.fill = 'black'; // Reset cactus color

    background.classList.remove('wave'); // Reset wave class
    void background.offsetWidth; // Trigger reflow to restart the animation
    background.classList.add('wave'); // Re-add the wave class
  } else {
    // Switch to day mode
    background.style.background = `linear-gradient(to bottom, #87CEFA, #fff95b)`;
    
    // Change colors uniformly for day mode
    ground.style.transition = 'background 0.5s'; // Smooth transition for ground color
    ground.style.background = '#736944'; // Change ground color
    rocks.forEach(rock => {
      rock.style.transition = 'background 0.5s'; // Smooth transition for rocks
      rock.style.background = '#736944'; // Change rock color
    });
    
    // Change cactus color to #736944
    cactusPath.style.transition = 'fill 0.5s'; // Smooth transition for cactus color
    cactusPath.style.fill = '#736944'; // Change cactus color

    background.classList.remove('wave'); // Reset wave class
    void background.offsetWidth; // Trigger reflow to restart the animation
    background.classList.add('wave'); // Re-add the wave class
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
