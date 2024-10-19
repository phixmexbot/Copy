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

// Function to show clouds
function showClouds() {
  const container = document.getElementById('cloud-container');
  createClouds(); // Create clouds
  container.classList.add('clouds-visible');

  // Set opacity to 1 for fade-in effect
  const clouds = container.querySelectorAll('.cloud');
  clouds.forEach(cloud => {
    cloud.style.transition = 'opacity 0.5s'; // Transition for opacity
    cloud.style.opacity = '1'; // Fade in clouds
  });

  cloudsVisible = true; // Set clouds as visible
  cloudsCreatedByHash = true; // Mark that clouds were created by hash change
}

// Function to hide clouds
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
      showClouds(); // Show clouds if they were not created by hash change
    }
  } else {
    // If the hash is not light, snow, or rain, do nothing
  }
}

// Add event listener to the button
document.querySelector('.moon').addEventListener('click', () => {
  // Only toggle clouds if they weren't created by a hash change
  if (!cloudsCreatedByHash) {
    cloudsVisible ? hideClouds() : showClouds();
  }
});

// Listen for hash changes
window.addEventListener('hashchange', handleHashChange);

// Initial check on page load
handleHashChange();
