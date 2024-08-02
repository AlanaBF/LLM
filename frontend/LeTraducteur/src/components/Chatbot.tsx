import { useEffect } from 'react';

const Chatbot: React.FC = () => {
  useEffect(() => {
    // Type assertions for better type safety
    const messagesContainer = document.getElementById('messages-container') as HTMLElement | null;
    const messageForm = document.getElementById('message-form') as HTMLFormElement | null;
    const messageInput = document.getElementById('message-input') as HTMLTextAreaElement | null;

    const addMessage = (message: string, role: string, imgSrc: string): void => {
      const messageElement = document.createElement('div');
      const textElement = document.createElement('p');
      
      const imgElement = document.createElement('img');
      imgElement.src = imgSrc;
    
      if (role === 'user') {
        messageElement.className = 'message user';
        imgElement.className = "float-right mx-2 max-w-40 top-0 left-0 w-12 h-12 rounded-full";
        textElement.className = "max-w-7/10 bg-white text-navy float-right text-left p-2 rounded-2xl";
      } else if (role === 'aibot') {
        messageElement.className = 'message aibot';
        imgElement.className = "float-left mx-2 max-w-40 top-0 left-0 w-12 h-12 opacity-0 transform translate-y-full animate-fade-in-bottom";
        textElement.className = "max-w-7/10 bg-white text-navy float-left text-left p-2 rounded-2xl opacity-0 transform translate-y-full animate-fade-in-bottom";
      } else if (role === 'error') {
        messageElement.className = 'message error';
        imgElement.className = "float-left mx-2 max-w-40 top-0 left-0 w-12 h-12 opacity-0 transform translate-y-full animate-fade-in-bottom";
        textElement.className = "max-w-7/10 bg-white text-gray-800 float-left text-left p-2 rounded-2xl opacity-0 transform translate-y-full animate-fade-in-bottom";
      }
    
      messageElement.appendChild(imgElement);
      textElement.innerText = message;
      messageElement.appendChild(textElement);
      if (messagesContainer) {
        messagesContainer.appendChild(messageElement);
        const clearDiv = document.createElement('div');
        clearDiv.style.clear = 'both';
        messagesContainer.appendChild(clearDiv);
      }
    };

    const sendMessage = async (message: string): Promise<void> => {
      addMessage(message, 'user', '/assets/britishlogo.png');
      
      // Loading spinner
      const loadingElement = document.createElement('div');
      loadingElement.className = "float-left mx-2 w-12 h-12 rounded-full border-t-2 border-navy animate-spin";
      
      // Loading text
      const loadingTextElement = document.createElement('p');
      loadingTextElement.className = "mb-2 p-2 rounded-lg bg-navy text-white border border-navy float-left text-left animate-fade-in-bottom";
      loadingTextElement.innerText = 'Loading....Please wait';
      
      if (messagesContainer) {
        messagesContainer.appendChild(loadingElement);
        messagesContainer.appendChild(loadingTextElement);
      }
    
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
    
        if (loadingElement.parentNode) loadingElement.parentNode.removeChild(loadingElement);
        if (loadingTextElement.parentNode) loadingTextElement.parentNode.removeChild(loadingTextElement);
    
        addMessage(responseMessage, 'aibot', '/assets/frenchlogo.png');
      } catch (error) {
        console.error('Error:', error);
        if (loadingElement.parentNode) loadingElement.parentNode.removeChild(loadingElement);
        if (loadingTextElement.parentNode) loadingTextElement.parentNode.removeChild(loadingTextElement);
        addMessage('An error occurred. Please try again.', 'error', '/assets/Error.png');
      }
    };
    

    if (messageForm && messageInput) {
      messageForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const message = messageInput.value.trim();
        if (message !== '') {
          messageInput.value = '';
          await sendMessage(message);
        }
      });
    }

    // Cleanup event listener on component unmount
    return () => {
      if (messageForm && messageInput) {
        messageForm.removeEventListener('submit', async (event) => {
          event.preventDefault();
          const message = messageInput.value.trim();
          if (message !== '') {
            messageInput.value = '';
            await sendMessage(message);
          }
        });
      }
    };
  }, []);

  return (
    <div className="relative flex flex-col min-h-screen bg-[#2cd0fa]">
      {/* Background Image with Opacity */}
      <div className="absolute inset-0 bg-cover bg-center opacity-50 md:opacity-70" 
           style={{ backgroundImage: 'url(/assets/backgroundimage.png)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }}></div>
  
      {/* Content */}
      <div className="relative flex flex-col min-h-screen bg-transparent">
        <div id="messages-container" className="flex-grow overflow-y-auto p-4">
          {/* Messages will be appended here */}
        </div>
        <form id="message-form" className="flex items-center justify-center p-4 bg-navy rounded-lg shadow-md w-10/12 mx-auto mb-4">
          <textarea 
            id="message-input" 
            placeholder="Send a message..." 
            className="flex-grow p-2 mr-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-navy bg-white text-navy font-dosis"
          ></textarea>
          <button 
            type="submit" 
            className="px-4 py-2 bg-[#2cd0fa] text-white rounded-lg hover:bg-[#2cd0fa] focus:outline-none focus:ring-2 focus:ring-[#2cd0fa]"
          >
            ➤
          </button>
        </form>
      </div>
    </div>
  );
  
}

export default Chatbot;
