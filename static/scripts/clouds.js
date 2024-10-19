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
    container.classList.remove('clouds-hidden');
    container.classList.add('clouds-visible');
  } else {
    container.classList.remove('clouds-visible');
    container.classList.add('clouds-hidden');

    // Delay removal of clouds to allow fade-out animation to finish
    setTimeout(() => {
      container.innerHTML = ''; // Clear clouds after fade-out
    }, 500); // Match this time with the CSS transition duration
  }
}

// Add event listener to the button
document.querySelector('.moon').addEventListener('click', toggleClouds);
