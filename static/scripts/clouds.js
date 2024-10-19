// Function to create and append clouds based on screen width
function createClouds() {
  // Clear existing clouds
  const container = document.getElementById('cloud-container');
  container.innerHTML = '';

  // Set cloud count to always be 20
  const cloudCount = 20;

  // Create all clouds based on the calculated count
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

  // Lift the clouds higher by adjusting the container's position or clouds' styles
  container.style.position = 'relative';
  container.style.top = '-50px'; // Adjust this value to lift the clouds higher
}

// Create clouds on initial load
createClouds();

// Recreate clouds on window resize
window.addEventListener('resize', createClouds);
