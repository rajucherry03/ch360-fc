import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPaperPlane, 
  faImage, 
  faBars, 
  faComments,
  faUser,
  faClock,
  faFileImage
} from '@fortawesome/free-solid-svg-icons';
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-8 px-6">
        {/* Professional Header Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-lg mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-950 dark:text-white flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                  <FontAwesomeIcon icon={faComments} className="text-white text-lg"/>
                </div>
                Communication
              </h1>
              <p className="text-gray-800 dark:text-gray-200 text-base flex items-center gap-2">
                <FontAwesomeIcon icon={faUser} className="text-gray-800 dark:text-gray-200"/>
                Connect with students and colleagues through real-time messaging
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-gray-800 dark:text-gray-200">Active Chats</p>
                <p className="text-lg font-semibold text-gray-950 dark:text-white">{messages.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
          <div className="flex flex-col lg:flex-row h-[600px]">
            {/* Sidebar */}
            <div className={`lg:w-1/3 bg-gray-50 dark:bg-gray-700 border-r border-gray-200 dark:border-gray-600 flex flex-col ${isSidebarOpen ? 'block' : 'hidden lg:block'}`}>
              <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                <h2 className="text-lg font-bold text-gray-950 dark:text-white flex items-center gap-2">
                  <FontAwesomeIcon icon={faComments} className="text-primary"/>
                  Chats
                </h2>
              </div>
              <div className="flex-grow overflow-y-auto">
                {messages.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => handleChatClick(chat.id)}
                    className={`cursor-pointer p-4 border-b border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 ${activeChat === chat.id ? 'bg-primary/10 dark:bg-primary/20' : ''}`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                        <FontAwesomeIcon icon={faUser} className="text-white text-sm" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-gray-950 dark:text-white text-sm truncate">{chat.sender}</div>
                        <div className="text-xs text-gray-800 dark:text-gray-200 truncate">{chat.message}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-grow flex flex-col">
              <div className="flex-grow p-4 overflow-y-auto bg-white dark:bg-gray-800">
                {messages
                  .filter((msg) => msg.id === activeChat)
                  .map((msg) => (
                    <div key={msg.id} className={`mb-4 flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-md ${msg.sender === 'You' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-950 dark:text-white'} rounded-2xl p-4 shadow-md`}>
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                            <FontAwesomeIcon icon={faUser} className="text-white text-xs" />
                          </div>
                          <div>
                            <p className="font-bold text-sm">{msg.sender}</p>
                            <p className="text-xs opacity-70 flex items-center gap-1">
                              <FontAwesomeIcon icon={faClock} className="text-xs"/>
                              {msg.timestamp}
                            </p>
                          </div>
                        </div>
                        {msg.type === 'image' ? (
                          <img src={msg.message} alt="Sent" className="w-full h-auto rounded-xl" />
                        ) : (
                          <p className="text-sm leading-relaxed">{msg.message}</p>
                        )}
                      </div>
                    </div>
                  ))}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-grow px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-800 text-gray-950 dark:text-white placeholder:text-gray-800 dark:placeholder:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-4 py-3 bg-primary hover:bg-secondary text-white rounded-xl transition-all duration-300 hover:shadow-md font-semibold"
                  >
                    <FontAwesomeIcon icon={faPaperPlane} />
                  </button>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-input"
                    accept="image/*"
                  />
                  <label 
                    htmlFor="file-input" 
                    className="px-4 py-3 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 rounded-xl transition-all duration-300 hover:shadow-md cursor-pointer font-semibold"
                  >
                    <FontAwesomeIcon icon={faFileImage} />
                  </label>
                </div>
                {selectedFile && (
                  <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-800 dark:text-blue-300">Selected: {selectedFile.name}</span>
                      <button
                        onClick={handleSendFile}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs transition-all duration-300"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunicationPage;
