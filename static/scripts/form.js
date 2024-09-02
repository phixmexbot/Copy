const openButton = document.querySelector('#openButton');
const sendButton = document.querySelector('#sendButton');
const closeButton = document.querySelector('#cancelButton');
const rateElement = document.querySelector('#rate');
const contactForm = document.querySelector('#frmContactForm');
const fullNameInput = document.querySelector('#txtFullName');
const emailInput = document.querySelector('#txtEmail');
const messageInput = document.querySelector('#txtContent');

console.log(rateElement); // This should log the element to the console

const addOpacity = () => {
  if (rateElement) {
    console.log("zero");
    rateElement.removeAttribute('visible');
    rateElement.classList.add('hidden');
    
  }
};

const removeOpacity = () => {
  if (rateElement) {  
    console.log('one');
    rateElement.removeAttribute('hidden');
    rateElement.classList.add('visible');
  }
};

const showPopup = (message, isSuccess) => {
  const popup = document.createElement('div');
  popup.textContent = message;
  popup.style.position = 'fixed';
  popup.style.bottom = '20px';
  popup.style.right = '20px';
  popup.style.padding = '10px';
  popup.style.backgroundColor = isSuccess ? 'green' : 'red';
  popup.style.color = 'white';
  popup.style.borderRadius = '5px';
  popup.style.zIndex = '1000';
  document.body.appendChild(popup);

  setTimeout(() => {
    popup.remove();
  }, 3000);
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
      .then(response => response.text())
      .then(result => {
        if (result === 'Sent') {
          showPopup('Message sent successfully!', true);
          
          // Clear the form fields
          fullNameInput.value = '';
          emailInput.value = '';
          messageInput.value = '';

          // Collapse the form
          contactForm.checked = false;
          
          // Reset the opacity
          removeOpacity();
        } else {
          showPopup('Failed to send the message.', false);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        showPopup('An error occurred while sending the message.', false);
      });
    } else {
      alert('Please fill out the required fields.');
    }
  });
}

if (closeButton) {
  closeButton.addEventListener('click', removeOpacity);
}
