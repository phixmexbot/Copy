// Function to create and append clouds based on screen width
function createClouds() {
  // Clear existing clouds
  const container = document.getElementById('cloud-container');
  container.innerHTML = '';

  // Calculate the number of clouds based on screen width
  const screenWidth = window.innerWidth;
  let cloudCount;

  // Set cloud count based on screen width
  if (screenWidth > 1200) {
    cloudCount = 20; // More clouds for larger screens
  } else if (screenWidth > 800) {
    cloudCount = 8;  // Medium amount of clouds for medium screens
  } else {
    cloudCount = 4;  // Fewer clouds for smaller screens
  }

  // Create clouds based on calculated count
  for (let i = 1; i <= cloudCount; i++) {
    const cloudDiv = document.createElement('div');
    const sizeClass = (i % 4 === 0) ? 'tiny' : (i % 3 === 0) ? 'small' : (i % 2 === 0) ? 'normal' : 'large';
    cloudDiv.className = `cloud ${sizeClass} cloud-${i}`;

    // Create inner divs
    for (let j = 0; j < 4; j++) {
      const innerDiv = document.createElement('div');
      cloudDiv.appendChild(innerDiv);
    }

    // Append the cloud to the container
    container.appendChild(cloudDiv);
  }
}

// Create clouds on initial load
createClouds();

// Recreate clouds on window resize
window.addEventListener('resize', createClouds);
