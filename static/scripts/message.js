const fullMessage = document.getElementById('message-text').textContent;
const messageBox = document.getElementById('message-box');
const messageContainer = document.querySelector('.message-container');

function calculateMaxChars() {
  const containerWidth = messageBox.clientWidth;
  const avgCharWidth = 5;
  const maxChars = Math.floor(containerWidth / avgCharWidth);
  return maxChars;
}

function chunkMessage(message, chunkSize) {
  const words = message.split(' ');
  const chunks = [];
  let currentChunk = '';

  words.forEach(word => {
    if ((currentChunk + word).length < chunkSize) {
      currentChunk += (currentChunk ? ' ' : '') + word;
    } else {
      chunks.push(currentChunk);
      currentChunk = word;
    }
  });
  
  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}

function appendMessageChunk(chunk) {
  messageBox.innerHTML = '';

  const newChunk = document.createElement('p');
  newChunk.textContent = chunk;

  messageBox.appendChild(newChunk);

  setTimeout(() => {
    newChunk.style.opacity = '1';
  }, 100);
}

function initScrollChunks() {
  const maxChars = calculateMaxChars();
  const messageChunks = chunkMessage(fullMessage, maxChars);

  let chunkIndex = 0;

  appendMessageChunk(messageChunks[chunkIndex]);
  messageBox.style.opacity = '1';

  function handleScroll(event) {
    event.preventDefault();
    let jumpAmount = 20;

    if (event.deltaY > 0) {
      if (chunkIndex < messageChunks.length - 1) {
        chunkIndex++;
        messageBox.style.opacity = '0';
        appendMessageChunk(messageChunks[chunkIndex]);
        messageBox.style.opacity = '1';
      } else {
        messageContainer.style.transform = `translate(-50%, -${jumpAmount}px)`;
        setTimeout(() => {
          messageContainer.style.transform = 'translate(-50%, 0)';
        }, 150);
      }
    } else {
      if (chunkIndex > 0) {
        chunkIndex--;
        messageBox.style.opacity = '0';
        appendMessageChunk(messageChunks[chunkIndex]);
        messageBox.style.opacity = '1';
      } else {
        messageContainer.style.transform = `translate(-50%, ${jumpAmount}px)`;
        setTimeout(() => {
          messageContainer.style.transform = 'translate(-50%, 0)';
        }, 150);
      }
    }
  }

  window.addEventListener('wheel', handleScroll);
  window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      handleScroll(event);
    }
  });
}

window.addEventListener('DOMContentLoaded', initScrollChunks);
