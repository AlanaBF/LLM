let conversationHistory = [];

const messagesContainer = document.getElementById('messages-container');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

const addMessage = (message, role, imgSrc) => {
  const messageElement = document.createElement('div');
  const textElement = document.createElement('p');
  messageElement.className = `message ${role}`;
  const imgElement = document.createElement('img');
  imgElement.src = `${imgSrc}`;
  messageElement.appendChild(imgElement);
  textElement.innerText = message;
  messageElement.appendChild(textElement);
  messagesContainer.appendChild(messageElement);
  var clearDiv = document.createElement("div");
  clearDiv.style.clear = "both";
  messagesContainer.appendChild(clearDiv);
};

const sendMessage = async (message) => {
  addMessage(message, 'user', '../static/britishlogo.png');
  const loadingElement = document.createElement('div');
  const loadingtextElement = document.createElement('p');
  loadingElement.className = `loading-animation`;
  loadingtextElement.className = `loading-text`;
  loadingtextElement.innerText = 'Loading....Please wait';
  messagesContainer.appendChild(loadingElement);
  messagesContainer.appendChild(loadingtextElement);

  const url = 'http://127.0.0.1:5000/chatbot';
  const requestBody = {
    prompt: message
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    const responseMessage = data['response'];

    const loadanimation = document.querySelector('.loading-animation');
    const loadtxt = document.querySelector('.loading-text');
    loadanimation.remove();
    loadtxt.remove();

    addMessage(responseMessage, 'aibot', '../static/frenchlogo.png');

  } catch (error) {
    console.error('Error:', error);
    const loadanimation = document.querySelector('.loading-animation');
    const loadtxt = document.querySelector('.loading-text');
    loadanimation.remove();
    loadtxt.remove();
    addMessage('An error occurred. Please try again.', 'error', '../static/Error.png');
  }
};

messageForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const message = messageInput.value.trim();
  if (message !== '') {
    messageInput.value = '';
    await sendMessage(message);
  }
});
