import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faImage, faBars } from '@fortawesome/free-solid-svg-icons';
import 'tailwindcss/tailwind.css';
import Push from 'push.js';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

const initialMessages = [
  { id: 1, sender: 'Alice Johnson', profileImage: 'https://via.placeholder.com/150', message: 'Please review the assignment I submitted.', timestamp: '2023-07-01 10:00 AM', type: 'text' },
  { id: 2, sender: 'Bob Smith', profileImage: 'https://via.placeholder.com/150', message: 'Can we reschedule the lab session?', timestamp: '2023-07-01 11:00 AM', type: 'text' },
];

const CommunicationPage = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeChat, setActiveChat] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: 'You',
        profileImage: 'https://via.placeholder.com/150',
        message: newMessage,
        timestamp: new Date().toLocaleString(),
        type: 'text'
      };
      socket.emit('sendMessage', message);
      setMessages([...messages, message]);
      setNewMessage('');
      Push.create("New Message", {
        body: newMessage,
        timeout: 4000,
      });
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSendFile = () => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const message = {
          id: messages.length + 1,
          sender: 'You',
          profileImage: 'https://via.placeholder.com/150',
          message: reader.result,
          timestamp: new Date().toLocaleString(),
          type: 'image'
        };
        socket.emit('sendMessage', message);
        setMessages([...messages, message]);
        setSelectedFile(null);
        Push.create("New File", {
          body: 'Image sent',
          timeout: 4000,
        });
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleChatClick = (chatId) => {
    setActiveChat(chatId);
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="compact-ui min-h-screen flex flex-col lg:flex-row bg-background overflow-hidden">
      <div className={`fixed lg:relative top-0 left-0 w-full lg:w-1/4 bg-surface border-r border-border-theme flex flex-col transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between p-3 border-b border-border-theme">
          <h2 className="text-base font-semibold text-primary">Chats</h2>
          <button className="lg:hidden text-primary hover:text-accent" onClick={toggleSidebar}>
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
        <div className="flex-grow overflow-y-auto">
          {messages.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleChatClick(chat.id)}
              className={`cursor-pointer p-3 border-b border-border-theme hover:bg-background transition ${activeChat === chat.id ? 'bg-background' : ''}`}
            >
              <div className="flex items-center space-x-4">
                <img src={chat.profileImage} alt={`${chat.sender} profile`} className="w-10 h-10 rounded-full" />
                <div>
                  <div className="font-medium text-primary text-sm">{chat.sender}</div>
                  <div className="text-xs text-secondary truncate">{chat.message}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-grow flex flex-col">
        <div className="flex-grow p-3 overflow-y-auto">
          {messages
            .filter((msg) => msg.id === activeChat)
            .map((msg) => (
              <div key={msg.id} className={`mb-2 p-3 max-w-md ${msg.sender === 'You' ? 'self-end bg-accent/10' : 'self-start bg-surface'} rounded-md border border-border-theme text-sm`}>
                <div className="flex items-center space-x-3">
                  <img src={msg.profileImage} alt={`${msg.sender} profile`} className="w-7 h-7 rounded-full" />
                  <p className="font-medium text-primary">{msg.sender} <span className="text-xs text-secondary">{msg.timestamp}</span></p>
                </div>
                {msg.type === 'image' ? (
                  <img src={msg.message} alt="Sent" className="w-full h-auto mt-2 rounded-md" />
                ) : (
                  <p className="mt-2 text-primary">{msg.message}</p>
                )}
              </div>
            ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-3 border-t border-border-theme bg-surface flex items-center space-x-2">
          <input
            type="text"
            placeholder="Type a message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow px-3 py-2 border border-border-theme rounded-md text-sm bg-background text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            onClick={handleSendMessage}
            className="btn-primary px-3 py-2 rounded-md hover:bg-accent/90 text-sm"
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            id="file-input"
          />
          <label htmlFor="file-input" onClick={handleSendFile} className="btn-secondary px-3 py-2 rounded-md hover:bg-secondary/90 text-sm cursor-pointer">
            <FontAwesomeIcon icon={faImage} />
          </label>
        </div>
      </div>
    </div>
  );
};

export default CommunicationPage;
