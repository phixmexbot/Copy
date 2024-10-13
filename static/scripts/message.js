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
      let isScrolling = false;

      appendMessageChunk(messageChunks[chunkIndex]);
      messageBox.style.opacity = '1';

      function handleScroll(event) {
        event.preventDefault();
        if (isScrolling) return;

        const scrollThreshold = 50;

        if (event.deltaY > scrollThreshold) {
          if (chunkIndex < messageChunks.length - 1) {
            isScrolling = true;
            chunkIndex++;
            messageBox.style.opacity = '0';
            appendMessageChunk(messageChunks[chunkIndex]);
            messageBox.style.opacity = '1';
            setTimeout(() => {
              isScrolling = false;
            }, 300);
          }
        } else if (event.deltaY < -scrollThreshold) {
          if (chunkIndex > 0) {
            isScrolling = true;
            chunkIndex--;
            messageBox.style.opacity = '0';
            appendMessageChunk(messageChunks[chunkIndex]);
            messageBox.style.opacity = '1';
            setTimeout(() => {
              isScrolling = false;
            }, 300);
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
