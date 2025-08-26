import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPaperPlane, 
  faImage, 
  faBars, 
  faComments, 
  faUser, 
  faSearch, 
  faEllipsisV, 
  faPhone, 
  faVideo, 
  faFileAlt, 
  faSmile, 
  faPaperclip, 
  faMicrophone, 
  faTimes, 
  faCheck, 
  faClock, 
  faExclamationTriangle, 
  faBell, 
  faEnvelope, 
  faHome,
  faGraduationCap,
  faUserGraduate,
  faUserTie,
  faChalkboardTeacher,
  faBookOpen,
  faCalendarAlt,
  faMapMarkerAlt,
  faStar,
  faHeart,
  faThumbsUp,
  faReply,
  faForward,
  faArchive,
  faTrash,
  faEdit,
  faEye,
  faEyeSlash,
  faLock,
  faUnlock,
  faCog,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Link } from "react-router-dom";

const Communication = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Sample chat data
  const sampleChats = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      role: 'Course Coordinator',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=6366f1&color=fff&size=128',
      lastMessage: 'Please review the assignment I submitted.',
      timestamp: '2 hours ago',
      unreadCount: 2,
      status: 'online',
      department: 'Computer Science',
      courses: ['Data Structures', 'Algorithms'],
      isOnline: true
    },
    {
      id: 2,
      name: 'Prof. Michael Chen',
      role: 'Department Head',
      avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=10b981&color=fff&size=128',
      lastMessage: 'Can we reschedule the lab session?',
      timestamp: '1 day ago',
      unreadCount: 0,
      status: 'offline',
      department: 'Computer Science',
      courses: ['Software Engineering', 'Database Systems'],
      isOnline: false
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      role: 'Research Coordinator',
      avatar: 'https://ui-avatars.com/api/?name=Emily+Rodriguez&background=f59e0b&color=fff&size=128',
      lastMessage: 'The research proposal has been approved.',
      timestamp: '3 days ago',
      unreadCount: 1,
      status: 'away',
      department: 'Computer Science',
      courses: ['Research Methods', 'Machine Learning'],
      isOnline: true
    },
    {
      id: 4,
      name: 'Prof. David Wilson',
      role: 'Academic Advisor',
      avatar: 'https://ui-avatars.com/api/?name=David+Wilson&background=ef4444&color=fff&size=128',
      lastMessage: 'Student registration is now open.',
      timestamp: '1 week ago',
      unreadCount: 0,
      status: 'offline',
      department: 'Computer Science',
      courses: ['Computer Networks', 'Operating Systems'],
      isOnline: false
    }
  ];

  // Sample messages for active chat
  const sampleMessages = [
    {
      id: 1,
      senderId: 1,
      senderName: 'Dr. Sarah Johnson',
      senderAvatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=6366f1&color=fff&size=128',
      message: 'Hi! I wanted to discuss the upcoming course schedule.',
      timestamp: '10:30 AM',
      type: 'text',
      isRead: true
    },
    {
      id: 2,
      senderId: 'me',
      senderName: 'You',
      senderAvatar: 'https://ui-avatars.com/api/?name=Faculty+Member&background=8b5cf6&color=fff&size=128',
      message: 'Hello Dr. Johnson! Sure, I\'m available to discuss the schedule.',
      timestamp: '10:32 AM',
      type: 'text',
      isRead: true
    },
    {
      id: 3,
      senderId: 1,
      senderName: 'Dr. Sarah Johnson',
      senderAvatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=6366f1&color=fff&size=128',
      message: 'Great! I\'ve prepared a draft schedule. Can you review it?',
      timestamp: '10:35 AM',
      type: 'text',
      isRead: true
    },
    {
      id: 4,
      senderId: 'me',
      senderName: 'You',
      senderAvatar: 'https://ui-avatars.com/api/?name=Faculty+Member&background=8b5cf6&color=fff&size=128',
      message: 'Of course! Please share the draft and I\'ll review it.',
      timestamp: '10:37 AM',
      type: 'text',
      isRead: false
    }
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        onAuthStateChanged(auth, async (user) => {
          if (!user) {
            setError("No user is logged in.");
            setLoading(false);
            return;
          }

          setUser(user);
          setMessages(sampleMessages);
          setActiveChat(sampleChats[0]);
          setLoading(false);
        });
      } catch (err) {
        console.error("Error fetching user data:", err.message);
        setError(err.message || "Error fetching user data.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        senderId: 'me',
        senderName: 'You',
        senderAvatar: 'https://ui-avatars.com/api/?name=Faculty+Member&background=8b5cf6&color=fff&size=128',
        message: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text',
        isRead: false
      };
      setMessages([...messages, message]);
      setNewMessage('');
      setIsTyping(false);
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
          senderId: 'me',
          senderName: 'You',
          senderAvatar: 'https://ui-avatars.com/api/?name=Faculty+Member&background=8b5cf6&color=fff&size=128',
          message: selectedFile.name,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'file',
          fileUrl: reader.result,
          isRead: false
        };
        setMessages([...messages, message]);
        setSelectedFile(null);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleChatClick = (chat) => {
    setActiveChat(chat);
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const filteredChats = sampleChats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <div className="h-12 shimmer rounded-lg mb-4"></div>
            <div className="h-6 shimmer rounded w-1/3"></div>
          </div>
          <div className="grid gap-6 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <div className="glass rounded-xl shadow-lg p-6 animate-fade-in">
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <div className="w-12 h-12 shimmer rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 shimmer rounded w-3/4 mb-2"></div>
                        <div className="h-3 shimmer rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-3">
              <div className="glass rounded-xl shadow-lg p-6 animate-fade-in">
                <div className="space-y-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 shimmer rounded w-1/4"></div>
                      <div className="h-10 shimmer rounded-lg"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-6">
        <div className="text-center">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 text-6xl mb-4 animate-bounce" />
          <div className="text-red-600 text-xl font-semibold">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faComments} className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Communication Hub
                </h1>
                <p className="text-gray-600 text-sm">Connect with faculty, students, and staff</p>
              </div>
            </div>
            <Link 
              to="/home"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg shadow-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
            >
              <FontAwesomeIcon icon={faHome} />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Sidebar - Chat List */}
          <div className="lg:col-span-1">
            <div className={`fixed lg:relative top-0 left-0 w-full lg:w-auto bg-white/80 backdrop-blur-sm shadow-lg flex flex-col transition-transform duration-300 transform z-50 ${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            }`}>
              <div className="glass rounded-xl shadow-lg p-6 animate-fade-in">
                {/* Search Bar */}
                <div className="relative mb-6">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                {/* Chat List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredChats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => handleChatClick(chat)}
                      className={`cursor-pointer p-4 rounded-xl transition-all duration-300 hover:bg-white/50 ${
                        activeChat?.id === chat.id ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <img 
                            src={chat.avatar} 
                            alt={`${chat.name} profile`} 
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                            chat.isOnline ? 'bg-green-500' : 'bg-gray-400'
                          }`}></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-800 truncate">{chat.name}</h3>
                            <span className="text-xs text-gray-500">{chat.timestamp}</span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">{chat.role}</p>
                          <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                          {chat.unreadCount > 0 && (
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-indigo-600 font-medium">{chat.department}</span>
                              <span className="bg-indigo-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                                {chat.unreadCount}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mobile Close Button */}
                <button 
                  className="lg:hidden absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                  onClick={toggleSidebar}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <div className="glass rounded-xl shadow-lg flex flex-col h-[600px] animate-fade-in">
              {activeChat ? (
                <>
                  {/* Chat Header */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white/50 rounded-t-xl">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img 
                          src={activeChat.avatar} 
                          alt={`${activeChat.name} profile`} 
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                          activeChat.isOnline ? 'bg-green-500' : 'bg-gray-400'
                        }`}></div>
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-800">{activeChat.name}</h2>
                        <p className="text-sm text-gray-600">{activeChat.role} • {activeChat.department}</p>
                        <p className="text-xs text-gray-500">
                          {activeChat.isOnline ? 'Online' : 'Offline'} • {activeChat.courses.join(', ')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-500 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all duration-300">
                        <FontAwesomeIcon icon={faPhone} />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all duration-300">
                        <FontAwesomeIcon icon={faVideo} />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all duration-300">
                        <FontAwesomeIcon icon={faEllipsisV} />
                      </button>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-br from-blue-50/50 to-purple-50/50">
                    <div className="space-y-4">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-xs lg:max-w-md ${msg.senderId === 'me' ? 'order-2' : 'order-1'}`}>
                            <div className={`p-4 rounded-2xl shadow-md ${
                              msg.senderId === 'me' 
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' 
                                : 'bg-white text-gray-800'
                            }`}>
                              {msg.type === 'file' ? (
                                <div className="flex items-center space-x-2">
                                  <FontAwesomeIcon icon={faFileAlt} />
                                  <span>{msg.message}</span>
                                </div>
                              ) : (
                                <p>{msg.message}</p>
                              )}
                              <div className={`text-xs mt-2 ${
                                msg.senderId === 'me' ? 'text-indigo-100' : 'text-gray-500'
                              }`}>
                                {msg.timestamp}
                                {msg.senderId === 'me' && (
                                  <span className="ml-2">
                                    {msg.isRead ? (
                                      <FontAwesomeIcon icon={faCheck} className="text-blue-300" />
                                    ) : (
                                      <FontAwesomeIcon icon={faClock} className="text-gray-400" />
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className={`w-8 h-8 rounded-full overflow-hidden ${msg.senderId === 'me' ? 'order-1' : 'order-2'}`}>
                            <img 
                              src={msg.senderAvatar} 
                              alt={`${msg.senderName} profile`} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      ))}
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="bg-white p-4 rounded-2xl shadow-md">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="p-6 border-t border-gray-200 bg-white/50 rounded-b-xl">
                    <div className="flex items-center space-x-3">
                      <button className="p-2 text-gray-500 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all duration-300">
                        <FontAwesomeIcon icon={faPaperclip} />
                      </button>
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          placeholder="Type a message..."
                          value={newMessage}
                          onChange={(e) => {
                            setNewMessage(e.target.value);
                            setIsTyping(true);
                            setTimeout(() => setIsTyping(false), 1000);
                          }}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                        />
                        <button
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-500"
                        >
                          <FontAwesomeIcon icon={faSmile} />
                        </button>
                      </div>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-input"
                      />
                      <label 
                        htmlFor="file-input" 
                        className="p-3 text-gray-500 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all duration-300 cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faImage} />
                      </label>
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        <FontAwesomeIcon icon={faPaperPlane} />
                      </button>
                    </div>
                    {selectedFile && (
                      <div className="mt-3 flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                        <span className="text-sm text-indigo-700">{selectedFile.name}</span>
                        <div className="flex space-x-2">
                          <button
                            onClick={handleSendFile}
                            className="text-xs bg-indigo-500 text-white px-2 py-1 rounded hover:bg-indigo-600 transition-colors"
                          >
                            Send
                          </button>
                          <button
                            onClick={() => setSelectedFile(null)}
                            className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FontAwesomeIcon icon={faComments} className="text-white text-3xl" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Select a conversation</h3>
                    <p className="text-gray-600">Choose a chat from the sidebar to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full shadow-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-110 z-50"
          onClick={toggleSidebar}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>
    </div>
  );
};

export default Communication;
