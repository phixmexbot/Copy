const openButton = document.querySelector('#openButton');
const sendButton = document.querySelector('#sendButton');
const closeButton = document.querySelector('#cancelButton'); // Corrected id from 'closeButton' to 'cancelButton'
const rateElement = document.querySelector('#rate');
const contactForm = document.querySelector('#frmContactForm');
const fullNameInput = document.querySelector('#txtFullName');
const emailInput = document.querySelector('#txtEmail');
const messageInput = document.querySelector('#txtContent');

const addOpacity = () => {
  if (rateElement) {
    rateElement.style.opacity = '0';
  }
};

const removeOpacity = () => {
  if (rateElement) {
    rateElement.style.opacity = '1';
  }
};

if (openButton) {
  openButton.addEventListener('click', addOpacity);
}

if (sendButton) {
  sendButton.addEventListener('click', () => {
    const fullName = fullNameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    if (email && message) {
      const formData = {
        name: fullName || 'Anonymous',
        email: email,
        feedback: message
      };

      fetch('/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(response => {
        if (response.ok) {
          // Clear the form fields
          fullNameInput.value = '';
          emailInput.value = '';
          messageInput.value = '';
          
          // Collapse the form
          contactForm.checked = false;
          
          // Reset the opacity
          removeOpacity();
        } else {
          console.error('Failed to send the message.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    } else {
      alert('Please fill out the required fields.');
    }
  });
}

if (closeButton) {
  closeButton.addEventListener('click', removeOpacity);
}
