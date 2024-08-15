document.addEventListener('DOMContentLoaded', () => {
  const openButton = document.querySelector('.btn-open');
  const cancelButton = document.querySelector('.contact-cancel');
  const sendButton = document.querySelector('#sendButton');
  const contactForm = document.querySelector('#frmContactForm');
  const rateDiv = document.createElement('div');
  
  // Create the div with id 'rate'
  rateDiv.id = 'rate';
  rateDiv.style.display = 'none';
  document.body.appendChild(rateDiv);

  // Function to toggle the visibility of the rate div
  const toggleRateDiv = (visible) => {
    rateDiv.style.display = visible ? 'block' : 'none';
  };

  // Show the rate div when the form is opened
  openButton.addEventListener('click', () => {
    contactForm.checked = true;
    toggleRateDiv(true);
  });

  // Hide the rate div when the cancel button is clicked
  cancelButton.addEventListener('click', () => {
    contactForm.checked = false;
    toggleRateDiv(false);
  });

  // Hide the rate div and send the form data as JSON when the send button is clicked
  sendButton.addEventListener('click', () => {
    contactForm.checked = false;
    toggleRateDiv(false);

    // Prepare form data as JSON
    const formData = {
      name: document.querySelector('input[name="name"]').value,
      email: document.querySelector('input[name="email"]').value,
      message: document.querySelector('textarea[name="message"]').value,
    };

    // Send data to the /process directory
    fetch('/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  });
});
