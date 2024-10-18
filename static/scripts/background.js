document.addEventListener('DOMContentLoaded', () => {

  const moon = document.querySelector('.moon');
  const background = document.querySelector('.background');

  let isDayMode = false; // Flag to track the mode

  moon.addEventListener('click', function(event) {
    // Check if the background element exists
    if (!background) {
      console.error('Background element not found');
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
      background.style.background = `radial-gradient(circle at ${xPos}px ${yPos}px, #0f1a2b, #411d63)`;
      background.classList.remove('wave'); // Reset wave class
      void background.offsetWidth; // Trigger reflow to restart the animation
      background.classList.add('wave'); // Re-add the wave class
    } else {
      // Switch to day mode
      background.style.background = `radial-gradient(circle at ${xPos}px ${yPos}px, #87CEFA, #fff95b)`;
      background.classList.remove('wave'); // Reset wave class
      void background.offsetWidth; // Trigger reflow to restart the animation
      background.classList.add('wave'); // Re-add the wave class
    }

    isDayMode = !isDayMode; // Toggle the mode
  });

  
  setTimeout(() => {
    const max_stars = 100;
    const stars = [];
    
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
  }, 300); 
});

