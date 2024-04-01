import React, { useState } from 'react';

// Assuming you're using axios for HTTP requests (you can install it with `npm install axios`)
import axios from 'axios';
const styles = {
  Button: {
    cursor: 'pointer',
    top: '512px',
    left: '914px',
    width: '136px',
    height: '36px',
    padding: '0px 8px',
    border: '0',
    boxSizing: 'border-box',
    borderRadius: '24px',
    backgroundColor: '#5856d6',
    color: '#ffffff',
    fontSize: '14px',
    fontFamily: 'Source Sans Pro',
    fontWeight: 700,
    lineHeight: '16px',
    outline: 'none',
    display: 'flex',
    justifyContent: 'center', // Centers content horizontally
    alignItems: 'center', // Centers content vertically
  }, 
  input: {
      padding: '10px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      resize: 'none', // Prevent textarea from being resized
      width: '90%', // Ensure the textarea width is consistent within the container
      minHeight: '100px', // You can adjust the height as needed

  },
  sendButton: {
    padding: '10px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#5856d6',
    color: '#ffffff',
    cursor: 'pointer',
    
  },
    container: {
    position: 'fixed', // Changed to 'fixed' to overlay on top of other content
    top: '20%', // Centered vertically, adjust as needed
    left: '50%', // Centered horizontally
    transform: 'translate(-50%, -50%)',
    zIndex: 1000, // Ensure it's above other content
    width: '400px', // Set a fixed size
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    boxSizing: 'border-box',
  },
  closeButton: {
    alignSelf: 'flex-end',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#5856d6',
    fontSize: '20px',
  },
};

const NotiButton = () => {
  const [showInput, setShowInput] = useState(false);
  const [message, setMessage] = useState('');

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSend = async () => {
    try {
      await axios.post('http://128.197.53.112:3000/send-message', { message });
      // Close and clear after sending
      setShowInput(false);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div>
      <button style={styles.Button} onClick={() => setShowInput(true)}>Notify visitors</button>
      {showInput && (
        <div style={styles.container}>
          <button style={styles.closeButton} onClick={() => setShowInput(false)}>✕</button>
          <textarea
            style={styles.input}
            value={message}
            onChange={handleMessageChange}
            placeholder="Enter your message"
          />
          <button style={styles.sendButton} onClick={handleSend}>Send</button>
        </div>
      )}
    </div>
  );
};

export default NotiButton;