let cloudsVisible = false; // State to track cloud visibility
let cloudsCreatedByHash = false; // Flag to check if clouds were created by hash change

// Function to create and append clouds based on screen width
function createClouds() {
  // Clear existing clouds
  const container = document.getElementById('cloud-container');
  container.innerHTML = '';

  const cloudCount = 20; // Fixed number of clouds

  // Create clouds based on calculated count
  for (let i = 1; i <= cloudCount; i++) {
    const cloudDiv = document.createElement('div');
    const sizeClass = (i % 4 === 0) ? 'tiny' : (i % 3 === 0) ? 'small' : (i % 2 === 0) ? 'normal' : 'large';
    cloudDiv.className = `cloud ${sizeClass} cloud-${i}`;

    // Set initial opacity to 0
    cloudDiv.style.opacity = '0';

    // Create inner divs
    for (let j = 0; j < 4; j++) {
      const innerDiv = document.createElement('div');
      cloudDiv.appendChild(innerDiv);
    }

    // Append the cloud to the container
    container.appendChild(cloudDiv);
  }
}

// Function to show clouds with a fade-in effect and optional delay
function showClouds(withDelay = false) {
  const container = document.getElementById('cloud-container');
  createClouds(); // Create clouds
  container.classList.add('clouds-visible');

  // Function to fade in the clouds
  function fadeInClouds() {
    const clouds = container.querySelectorAll('.cloud');
    clouds.forEach(cloud => {
      cloud.style.transition = 'opacity 0.5s'; // Transition for opacity
      cloud.style.opacity = '1'; // Fade in clouds
    });
    cloudsVisible = true; // Set clouds as visible
  }

  // Apply delay if needed (both button-triggered and hash-triggered clouds use the same process)
  setTimeout(fadeInClouds, withDelay ? 500 : 0); // 0.5 second delay for button or hash-triggered clouds
}

// Function to hide clouds with a fade-out effect
function hideClouds() {
  const container = document.getElementById('cloud-container');
  container.classList.remove('clouds-visible');

  // Immediately set opacity to 0 for fade-out
  const clouds = container.querySelectorAll('.cloud');
  clouds.forEach(cloud => {
    cloud.style.opacity = '0'; // Fade out clouds
  });

  // Clear clouds after fade-out
  setTimeout(() => {
    container.innerHTML = ''; // Clear clouds after fade-out
  }, 500); // Match this time with the CSS transition duration

  cloudsVisible = false; // Set clouds as not visible
}

// Function to handle hash changes
function handleHashChange() {
  const hash = window.location.hash.substring(1); // Get the hash without the '#'
  if (hash === 'light' || hash === 'snow' || hash === 'rain') {
    if (!cloudsCreatedByHash) {
      showClouds(true); // Show clouds with the same delay and animation for hash change
      cloudsCreatedByHash = true; // Mark that clouds were created by hash change
    }
  } else if (cloudsCreatedByHash) {
    // Do not hide clouds if they were created by a hash change
  }
}

// Function to toggle clouds with the button
function toggleCloudsByButton() {
  if (cloudsCreatedByHash) {
    // If clouds were created by hash change, do nothing (button has no effect)
    return;
  }

  // Toggle clouds visibility created by button
  if (cloudsVisible) {
    hideClouds();
  } else {
    showClouds(true); // Show clouds with a 0.5-second delay
  }
}

// Add event listener to the button
document.querySelector('.moon').addEventListener('click', toggleCloudsByButton);

// Listen for hash changes
window.addEventListener('hashchange', handleHashChange);

// Initial check on page load
handleHashChange();
