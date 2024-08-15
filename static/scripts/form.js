const openButton = document.querySelector('#openButton');
const sendButton = document.querySelector('#sendButton');
const closeButton = document.querySelector('#closeButton');
const rateElement = document.querySelector('#rate');

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
  sendButton.addEventListener('click', removeOpacity);
}

if (closeButton) {
  closeButton.addEventListener('click', removeOpacity);
}
