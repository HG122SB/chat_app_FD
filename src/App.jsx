// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Send, Mic, MicOff, Search, MoreVertical, Phone, Video, ArrowLeft, Smile, Paperclip, CheckCheck, Plus, UserPlus } from 'lucide-react';

const EMOJIS = ['grinning', 'joy', 'heart_eyes', 'laughing', 'sob', 'angry', 'thumbsup', 'thumbsdown', 'fire', '100', 'rocket', 'star', 'party_popper', 'wave', 'heart', 'pray', 'muscle', 'ok_hand'];

const INITIAL_PEOPLE = [
  { id: 1, name: "Alex Johnson", phone: "+1 234 567 890", avatar: "A", status: "Available", online: true, lastSeen: "online" },
  { id: 2, name: "Sarah Chen", phone: "+1 987 654 321", avatar: "S", status: "Busy", online: false, lastSeen: "2 hours ago" },
  { id: 3, name: "Mike Davis", phone: "+44 7700 900123", avatar: "M", status: "At work", online: true, lastSeen: "online" },
  { id: 4, name: "Emma Wilson", phone: "+91 98765 43210", avatar: "E", status: "Hey there! I am using WhatsApp", online: false, lastSeen: "10:30 AM" },
  { id: 5, name: "Rahul Sharma", phone: "+91 87654 32109", avatar: "R", status: "Coding...", online: true, lastSeen: "online" },
  { id: 6, name: "Lisa Brown", phone: "+1 555 123 4567", avatar: "L", status: "Traveling", online: false, lastSeen: "Yesterday" },
  { id: 7, name: "James Kim", phone: "+82 10 1234 5678", avatar: "J", status: "Sleeping", online: false, lastSeen: "3:15 AM" },
  { id: 8, name: "Priya Patel", phone: "+91 91234 56789", avatar: "P", status: "Coffee time", online: true, lastSeen: "online" },
];

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [user, setUser] = useState(null);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  
  const [people, setPeople] = useState(INITIAL_PEOPLE);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddPerson, setShowAddPerson] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState({});
  const [typing, setTyping] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');

  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [darkMode, messages, selectedChat]);

  // Login
  const handleLogin = () => { if (phone.length >= 8) setShowOtp(true); };
  const handleOtp = () => { if (otp === '123456') setUser({ name: "You", phone, avatar: "Y" }); };

  // Add New Person
  const addPerson = () => {
    if (newName && newPhone) {
      setPeople(prev => [...prev, {
        id: Date.now(),
        name: newName,
        phone: newPhone,
        avatar: newName.charAt(0).toUpperCase(),
        status: "Hey there! I am using WhatsApp",
        online: Math.random() > 0.5,
        lastSeen: "just now"
      }]);
      setNewName(''); setNewPhone(''); setShowAddPerson(false);
    }
  };

  // Filter People
  const filteredPeople = people.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.phone.includes(searchQuery)
  );

  // Send Message
  const sendMessage = () => {
    if (!message.trim() && !audioURL) return;
    const newMsg = {
      id: Date.now(),
      text: message || '[Voice Message]',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      from: 'me',
      audio: audioURL || null
    };
    setMessages(prev => ({
      ...prev,
      [selectedChat.id]: [...(prev[selectedChat.id] || []), newMsg]
    }));
    setMessage(''); setAudioURL('');

    // Simulate reply
    setTimeout(() => {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        const replies = ["Haha yes!", "Okay", "Nice!", "Call me", "Busy now", "Loved it", "See you!", "Yes sure"];
        setMessages(prev => ({
          ...prev,
          [selectedChat.id]: [...prev[selectedChat.id], {
            id: Date.now() + 1,
            text: replies[Math.floor(Math.random() * replies.length)],
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            from: 'them'
          }]
        }));
      }, 1000 + Math.random() * 2000);
    }, 800);
  };

  // Voice Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = e => audioChunks.current.push(e.data);
      mediaRecorder.current.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
        setAudioURL(URL.createObjectURL(blob));
        audioChunks.current = [];
        stream.getTracks().forEach(t => t.stop());
      };
      mediaRecorder.current.start();
      setRecording(true);
    } catch (err) { alert('Please allow microphone access'); }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && recording) {
      mediaRecorder.current.stop();
      setRecording(false);
    }
  };

  if (!user) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-green-50'}`}>
        <div className="bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-2xl w-96">
          <h2 className="text-3xl font-bold text-center mb-8 text-green-600">WhatsApp</h2>
          {!showOtp ? (
            <>
              <input type="tel" placeholder="Your Phone Number" value={phone} onChange={e => setPhone(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl mb-4 focus:ring-4 focus:ring-green-300 outline-none" />
              <button onClick={handleLogin} className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700">
                Send OTP
              </button>
            </>
          ) : (
            <>
              <p className="text-center mb-4 text-sm">We sent OTP to {phone}</p>
              <input type="text" placeholder="Enter OTP (123456)" value={otp} onChange={e => setOtp(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl mb-4 focus:ring-4 focus:ring-green-300 outline-none" />
              <button onClick={handleOtp} className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700">
                Verify & Continue
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-[#0b141a]' : 'bg-gray-100'}`}>
      {/* Sidebar */}
      <div className={`${selectedChat ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-96 ${darkMode ? 'bg-[#111b21]' : 'bg-white'} border-r ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        {/* Header */}
        <div className="bg-[#1f2c34] p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-xl font-bold text-white">
              {user.avatar}
            </div>
            <div>
              <p className="font-medium text-white">My Account</p>
              <p className="text-xs text-gray-300">{user.phone}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Sun className="w-6 h-6 text-gray-300" /> : <Moon className="w-6 h-6" />}
            </button>
            <button onClick={() => setShowAddPerson(true)}><UserPlus className="w-6 h-6 text-gray-300" /></button>
            <button onClick={() => setUser(null)}><MoreVertical className="w-6 h-6 text-gray-300" /></button>
          </div>
        </div>

        {/* Search */}
        <div className="p-3">
          <div className="flex items-center gap-3 bg-[#2a3942] rounded-lg px-4 py-3">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none flex-1 text-white placeholder-gray-400"
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          {filteredPeople.map(person => (
            <div
              key={person.id}
              onClick={() => setSelectedChat(person)}
              className="p-4 hover:bg-[#2a3942] cursor-pointer flex items-center gap-4 border-b border-gray-800"
            >
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                  {person.avatar}
                </div>
                {person.online && (
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-4 border-[#111b21]"></div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white">{person.name}</h3>
                <p className="text-sm text-gray-400 truncate">{person.status}</p>
              </div>
              <div className="text-xs text-gray-500">
                {person.online ? 'Online' : person.lastSeen}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      {selectedChat && (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-[#1f2c34] p-3 flex items-center gap-3">
            <button onClick={() => setSelectedChat(null)} className="md:hidden">
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-xl font-bold text-white">
              {selectedChat.avatar}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white">{selectedChat.name}</h3>
              <p className="text-xs text-gray-400">
                {selectedChat.online ? 'Online' : selectedChat.lastSeen}
              </p>
            </div>
            <div className="flex gap-4">
              <Phone className="w-6 h-6 text-gray-400" />
              <Video className="w-6 h-6 text-gray-400" />
              <MoreVertical className="w-6 h-6 text-gray-400" />
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-cover bg-center">
            {typing && (
              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                <span className="text-sm">typing...</span>
              </div>
            )}
            {(messages[selectedChat.id] || []).map(msg => (
              <div key={msg.id} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl ${msg.from === 'me' ? 'bg-[#005c4b] text-white' : 'bg-[#2a3942] text-white'} shadow-lg`}>
                  {msg.audio ? (
                    <audio controls src={msg.audio} className="w-64 rounded-lg"></audio>
                  ) : (
                    <p className="text-lg">{msg.text}</p>
                  )}
                  <div className="text-xs opacity-70 flex items-center gap-1 justify-end mt-1">
                    {msg.time}
                    {msg.from === 'me' && <CheckCheck className="w-4 h-4" />}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Voice Preview */}
          {audioURL && (
            <div className="bg-[#1f2c34] p-3 flex items-center gap-3">
              <audio controls src={audioURL} className="flex-1"></audio>
              <button onClick={() => setAudioURL('')} className="text-red-400">Cancel</button>
            </div>
          )}

          {/* Input Bar */}
          <div className="bg-[#1f2c34] p-3 flex items-center gap-3">
            <button onClick={() => setShowEmoji(!showEmoji)}>
              <Smile className="w-6 h-6 text-gray-400" />
            </button>
            <button><Paperclip className="w-6 h-6 text-gray-400" /></button>
            <input
              type="text"
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Type a message"
              className="flex-1 bg-[#2a3942] rounded-full px-5 py-3 text-white outline-none placeholder-gray-400"
            />
            {message || audioURL ? (
              <button onClick={sendMessage}>
                <Send className="w-6 h-6 text-green-500" />
              </button>
            ) : (
              <button
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                className="relative"
              >
                {recording ? (
                  <MicOff className="w-7 h-7 text-red-500 animate-pulse" />
                ) : (
                  <Mic className="w-7 h-7 text-gray-400" />
                )}
                {recording && <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>}
              </button>
            )}
          </div>

          {/* Emoji Picker */}
          {showEmoji && (
            <div className="absolute bottom-24 left-4 bg-[#1f2c34] p-4 rounded-2xl shadow-2xl grid grid-cols-8 gap-3 z-50">
              {EMOJIS.map(e => (
                <button
                  key={e}
                  onClick={() => { setMessage(m => m + e); setShowEmoji(false); }}
                  className="text-3xl hover:bg-[#2a3942] rounded-xl p-2 transition"
                >{e}</button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Person Modal */}
      {showAddPerson && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#111b21] p-8 rounded-2xl w-96">
            <h2 className="text-2xl font-bold text-white mb-6">Add New Contact</h2>
            <input placeholder="Full Name" value={newName} onChange={e => setNewName(e.target.value)} className="w-full p-4 bg-[#2a3942] rounded-xl text-white mb-4 outline-none" />
            <input placeholder="Phone Number" value={newPhone} onChange={e => setNewPhone(e.target.value)} className="w-full p-4 bg-[#2a3942] rounded-xl text-white mb-6 outline-none" />
            <div className="flex gap-3">
              <button onClick={addPerson} className="flex-1 bg-green-600 py-3 rounded-xl font-bold text-white hover:bg-green-700">Add Person</button>
              <button onClick={() => setShowAddPerson(false)} className="flex-1 bg-gray-700 py-3 rounded-xl font-bold text-white">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!selectedChat && (
        <div className="hidden md:flex flex-1 items-center justify-center bg-[#0b141a]">
          <div className="text-center">
            <div className="text-9xl mb-8 opacity-20">WhatsApp</div>
            <p className="text-2xl text-gray-500">Select a contact to start chatting</p>
          </div>
        </div>
      )}
    </div>
  );
}