let cloudsVisible = false; // State to track cloud visibility

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

// Function to toggle clouds
function toggleClouds() {
  const container = document.getElementById('cloud-container');

  // Toggle visibility state
  cloudsVisible = !cloudsVisible;

  if (cloudsVisible) {
    createClouds(); // Create clouds
    // Start the fade-in animation after a delay of 0.5 seconds
    setTimeout(() => {
      container.classList.add('clouds-visible');

      // Set opacity to 1 for fade-in effect
      const clouds = container.querySelectorAll('.cloud');
      clouds.forEach(cloud => {
        cloud.style.transition = 'opacity 0.5s'; // Transition for opacity
        cloud.style.opacity = '1'; // Fade in clouds
      });
    }, 500); // 0.5 seconds
  } else {
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
  }
}

// Add event listener to the button
document.querySelector('.moon').addEventListener('click', toggleClouds);
