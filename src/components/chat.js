import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Segment, Container, Button, Icon } from 'semantic-ui-react';
import { ref, push, onValue, serverTimestamp, remove } from 'firebase/database';
import { database } from '../admin/auth';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import '../App.css';

const Delta = Quill.import('delta');

// Utility function to detect if the user is on a mobile device
const isMobileDevice = () => {
  return /Mobi|Android/i.test(navigator.userAgent);
};

const ChatComponent = ({ userEmail }) => {
  const [messages, setMessages] = useState([]);
  const containerRef = useRef(null);
//   const defaultValueRef = useRef(
//     new Delta().insert('Share something...', {
//       size: 'large',
//       color: '#999',
//       italic: true,
//     })
//   );
  const chatEndRef = useRef(null);
  const quillRef = useRef(null);

  // Fetch messages from the database
  useEffect(() => {
    const messagesRef = ref(database, 'messages');
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedMessages = Object.entries(data)
          .map(([key, value]) => ({
            id: key,
            ...value,
          }))
          .sort((a, b) => a.timestamp - b.timestamp);
        setMessages(formattedMessages);
      }
    });
  }, []);

  // Scroll to the latest message when messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Initialize the Quill editor
  useLayoutEffect(() => {
    const container = containerRef.current;
    const editorContainer = container.appendChild(container.ownerDocument.createElement('div'));

    // Determine the toolbar options based on device type
    const toolbarOptions = isMobileDevice() ? false : [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block', 'link'],
      [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ size: ['small', false, 'large', 'huge'] }, { header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }, { font: [] }, { align: [] }],
      ['clean'],
    ];

    const quill = new Quill(editorContainer, {
      theme: 'snow',
      modules: {
        toolbar: toolbarOptions,
      },
    });

    quillRef.current = quill;

    // if (defaultValueRef.current) {
    //   quill.setContents(defaultValueRef.current);
    // }

    return () => {
      quillRef.current = null;
      container.innerHTML = '';
    };
  }, []);

  // Handle message sending
  const handleSendMessage = () => {
    if (!userEmail) {
      console.error('User email is undefined. Cannot send message.');
      return;
    }

    const quillInstance = quillRef.current;
    const messageDelta = quillInstance.getContents(); // Get Delta instead of HTML

    if (quillInstance && quillInstance.getText().trim() !== '') {
      const messagesRef = ref(database, 'messages');
      const newMessage = {
        userEmail: userEmail,
        text: messageDelta, // Store delta instead of HTML
        timestamp: serverTimestamp(),
      };
      push(messagesRef, newMessage)
        .then(() => {
          quillInstance.setText(''); // Clear the editor after sending the message
        })
        .catch((error) => {
          console.error('Error sending message:', error);
        });
    }
  };

  // Handle hotkeys for sending messages
  const handleHotKeys = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSendMessage();
    } else if (e.key === 'Enter') {
        e.preventDefault();
        const quillInstance = quillRef.current;
        quillInstance.insertText(quillInstance.getSelection().index, '\n');
    }
  };

  // Handle message deletion
  const handleDeleteMessage = (messageId) => {
    const messageRef = ref(database, `messages/${messageId}`);
    remove(messageRef)
      .then(() => {
        console.log('Message deleted successfully');
      })
      .catch((error) => {
        console.error('Error deleting message:', error);
      });
  };

  // Initialize read-only Quill editors for each message
  useEffect(() => {
    messages.forEach((msg) => {
      const messageContainer = document.getElementById(`message-${msg.id}`);
      if (messageContainer && !messageContainer.hasChildNodes()) {
        const quill = new Quill(messageContainer, {
          readOnly: true,
          theme: 'bubble', // Use a simpler theme for read-only
          modules: {
            toolbar: false, // No toolbar for read-only mode
          },
        });

        // Ensure we are using the correct format to set the content
        if (msg.text && msg.text.ops) {
          quill.setContents(msg.text);
        } else {
          console.error('Message content is not in Delta format:', msg.text);
        }
      }
    });
  }, [messages]);

  return (
    <Container
      fluid
      style={{
        height: '60vh',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
      }}
    >
      {/* Chat Messages Display */}
      <Segment
        basic
        className="scroll"
        style={{
          overflowY: 'scroll',
          padding: '1rem',
          border: '1px solid #ccc',
          borderRadius: '5px',
          backgroundColor: '#f9f9f9',
          wordBreak: 'break-word',
          flexGrow: 1,
          marginBottom: '1rem',
        }}
      >
        {messages.map((msg) => (
          <div key={msg.id} style={{ marginBottom: '1rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
              onMouseEnter={(e) => {
                if (e.currentTarget.querySelector(`#delete-${msg.id}`)) {
                  e.currentTarget.querySelector(`#delete-${msg.id}`).style.visibility = 'visible';
                }
              }}
              onMouseLeave={(e) => {
                if (e.currentTarget.querySelector(`#delete-${msg.id}`)) {
                  e.currentTarget.querySelector(`#delete-${msg.id}`).style.visibility = 'hidden';
                }
              }}
            >
              <div>
                <strong style={{ color: '#333' }}>{msg.userEmail}</strong>
                <span style={{ marginLeft: '0.5rem', color: '#aaa', fontSize: '0.8em' }}>
                  {msg.timestamp && new Date(msg.timestamp).toLocaleString()}
                </span>
              </div>
              {msg.userEmail === userEmail && (
                <Button
                  id={`delete-${msg.id}`}
                  icon
                  size="mini"
                  style={{ visibility: 'hidden' }}
                  onClick={() => handleDeleteMessage(msg.id)}
                >
                  <Icon name="trash" color="red" />
                </Button>
              )}
            </div>
            <div
              id={`message-${msg.id}`}
              className="chat-message-content"
              style={{
                marginTop: '0.5rem',
                borderRadius: '4px',
                backgroundColor: '#fff',
                padding: '0.5rem',
                minHeight: '3rem',
              }}
            />
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </Segment>

      {/* Editor Area */}
      <div
        ref={containerRef}
        onKeyDown={handleHotKeys}
        style={{
          height: '17vh',
          position: 'relative',
          marginBottom: '1rem'
        }}
      />
      {/* Floating Send Button */}
      <Button
        icon
        circular
        size='massive'
        color="blue"
        onClick={handleSendMessage}
        style={{
          position: 'absolute',
          bottom: '-15px',
          right: '25px',
          zIndex: '1',
          transform: 'translateY(-50%)',
        }}
      >
        <Icon name="send" />
      </Button>
    </Container>
  );
};

export default ChatComponent;