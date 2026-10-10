import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Phone,
  Video,
  Send,
  Image as ImageIcon,
  Mic,
  CheckCheck,
  Check,
  Sparkles,
  ArrowLeft,
  Info,
  Smile,
  X,
} from 'lucide-react';
import { ChatContact, Message, User } from '../types';

interface ChatScreenProps {
  contacts: ChatContact[];
  currentUser: User;
  onUpdateContacts: (updated: ChatContact[]) => void;
  openBackendNotice: () => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  contacts,
  currentUser,
  onUpdateContacts,
  openBackendNotice,
}) => {
  const [selectedContactId, setSelectedContactId] = useState<string>(contacts[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [isTypingSimulated, setIsTypingSimulated] = useState(false);
  const [activeCallModal, setActiveCallModal] = useState<'audio' | 'video' | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const selectedContact =
    contacts.find((c) => c.id === selectedContactId) || contacts[0];

  const filteredContacts = contacts.filter(
    (c) =>
      c.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Scroll to bottom on message updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedContact?.messages, isTypingSimulated]);

  // Handle sending a message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedContact) return;

    const messageText = inputText.trim();
    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'delivered',
    };

    const updatedContacts = contacts.map((c) => {
      if (c.id === selectedContact.id) {
        return {
          ...c,
          messages: [...c.messages, userMessage],
          lastMessage: messageText,
          lastMessageTime: 'Just now',
          unreadCount: 0,
        };
      }
      return c;
    });

    onUpdateContacts(updatedContacts);
    setInputText('');

    // Simulate smart auto-reply from contact after 1.5 seconds
    setIsTypingSimulated(true);
    setTimeout(() => {
      setIsTypingSimulated(false);

      const contactReplies: { [key: string]: string[] } = {
        user_maya: [
          'Awesome! The 3D render came through cleanly. Did you run it through Veo?',
          'Just uploaded the new neon logo to the team board! Looks incredible.',
          'Totally agree. The lighting gradients on ConnectX are so sharp.',
        ],
        user_marcus: [
          'Sounds great Alex! Let us catch up over coffee in Berlin.',
          'I was just reviewing those brutalist architecture shots, the shadows worked out nicely.',
          'Will send you the full resolution master file shortly.',
        ],
        user_elena: [
          'Got your message! I will incorporate this into the brand typography deck.',
          'The contrast between obsidian and gold foil is really striking.',
        ],
        user_kai: [
          'Working on the audio synth loop right now, will sync it to the logo animation! 🎶',
          'Loving the kinetic tempo of the video!',
        ],
      };

      const repliesPool = contactReplies[selectedContact.user.id] || [
        'Got it! Thanks for sharing this update.',
        'Looks fantastic on the feed!',
      ];
      const randomReply = repliesPool[Math.floor(Math.random() * repliesPool.length)];

      const contactReplyMsg: Message = {
        id: `reply_${Date.now()}`,
        senderId: selectedContact.user.id,
        text: randomReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'delivered',
      };

      const withReply = updatedContacts.map((c) => {
        if (c.id === selectedContact.id) {
          // Mark user message as read
          const updatedMessages = c.messages.map((m) =>
            m.senderId === currentUser.id ? { ...m, status: 'read' as const } : m
          );
          return {
            ...c,
            messages: [...updatedMessages, contactReplyMsg],
            lastMessage: randomReply,
            lastMessageTime: 'Just now',
          };
        }
        return c;
      });

      onUpdateContacts(withReply);
    }, 1800);
  };

  return (
    <div className="w-full h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)] max-w-6xl mx-auto bg-[#0d0f19] border border-white/10 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
      {/* Left Contact List (WhatsApp Style) */}
      <div
        className={`w-full md:w-80 lg:w-96 border-r border-white/10 flex flex-col bg-[#090a10] ${
          selectedContactId && 'hidden md:flex'
        }`}
      >
        {/* Contact List Header */}
        <div className="p-4 border-b border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              Messages
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                WhatsApp & Snap Mode
              </span>
            </h2>
            <button
              onClick={openBackendNotice}
              className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1"
            >
              <Info className="w-3.5 h-3.5" />
              <span>Demo Status</span>
            </button>
          </div>

          {/* Search Contacts Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search chats, contacts, or messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 pl-9 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        {/* Contacts Stream */}
        <div className="flex-1 overflow-y-auto divide-y divide-white/5">
          {filteredContacts.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-500">
              No conversations found matching &quot;{searchQuery}&quot;
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => {
                  setSelectedContactId(contact.id);
                  // Mark unread as 0
                  onUpdateContacts(
                    contacts.map((c) => (c.id === contact.id ? { ...c, unreadCount: 0 } : c))
                  );
                }}
                className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                  selectedContact?.id === contact.id
                    ? 'bg-violet-600/15 border-l-4 border-violet-500'
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={contact.user.avatar}
                    alt={contact.user.name}
                    className="w-12 h-12 rounded-full object-cover ring-1 ring-violet-500/30"
                  />
                  {contact.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-[#090a10]" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white truncate">
                      {contact.user.name}
                    </span>
                    <span className="text-[11px] text-zinc-400 flex-shrink-0">
                      {contact.lastMessageTime}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-xs text-zinc-400 truncate pr-2">
                      {contact.isTyping ? (
                        <span className="text-emerald-400 font-semibold italic">typing...</span>
                      ) : (
                        contact.lastMessage
                      )}
                    </p>
                    {contact.unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-emerald-500 text-black text-[10px] font-bold">
                        {contact.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right / Main Active Chat Conversation Area */}
      {selectedContact ? (
        <div
          className={`flex-1 flex flex-col bg-[#0b0d17] ${
            !selectedContactId ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Conversation Header */}
          <div className="p-3.5 px-4 border-b border-white/10 bg-[#0e101d] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedContactId('')}
                className="md:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="relative">
                <img
                  src={selectedContact.user.avatar}
                  alt={selectedContact.user.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-violet-500/30"
                />
                {selectedContact.isOnline && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0e101d]" />
                )}
              </div>

              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  {selectedContact.user.name}
                </h3>
                <span className="text-[11px] text-emerald-400 font-medium">
                  {isTypingSimulated
                    ? 'typing...'
                    : selectedContact.isOnline
                    ? 'Online'
                    : 'Last seen today'}
                </span>
              </div>
            </div>

            {/* Simulated Voice / Video Call buttons */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setActiveCallModal('audio')}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
                title="Voice Call Simulation"
              >
                <Phone className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveCallModal('video')}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
                title="Video Call Simulation"
              >
                <Video className="w-4 h-4" />
              </button>

              <button
                onClick={openBackendNotice}
                className="p-2 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 transition-colors"
                title="Architecture & Backend Notice"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Prototype Chat Notice Banner */}
          <div className="bg-violet-950/30 border-b border-violet-500/10 px-4 py-1.5 flex items-center justify-between text-[11px] text-violet-300">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Simulated prototype chat with instant smart replies.</span>
            </span>
            <button
              onClick={openBackendNotice}
              className="underline hover:text-white font-medium"
            >
              Backend requirements
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[radial-gradient(#1e2139_1px,transparent_1px)] [background-size:16px_16px]">
            {selectedContact.messages.map((msg) => {
              const isMine = msg.senderId === currentUser.id;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-md p-3 rounded-2xl text-xs sm:text-sm shadow-md ${
                      isMine
                        ? 'bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white rounded-tr-none'
                        : 'bg-[#181b29] text-zinc-100 border border-white/10 rounded-tl-none'
                    }`}
                  >
                    {msg.mediaUrl && (
                      <div className="mb-2 rounded-xl overflow-hidden">
                        <img
                          src={msg.mediaUrl}
                          alt="Attachment"
                          className="w-full max-h-60 object-cover"
                        />
                      </div>
                    )}
                    <p className="leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>
                    <div
                      className={`flex items-center justify-end gap-1 text-[10px] mt-1 ${
                        isMine ? 'text-violet-200' : 'text-zinc-400'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {isMine && (
                        <span>
                          {msg.status === 'read' ? (
                            <CheckCheck className="w-3.5 h-3.5 text-cyan-300 inline" />
                          ) : (
                            <Check className="w-3.5 h-3.5 text-white/60 inline" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isTypingSimulated && (
              <div className="flex items-center gap-1.5 p-2 rounded-2xl bg-[#181b29] border border-white/10 w-max text-xs text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 text-[11px] text-zinc-400">{selectedContact.user.name} is typing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-[#0e101d] border-t border-white/10 flex items-center gap-2"
          >
            <button
              type="button"
              onClick={() => setInputText((prev) => prev + '🔥 ')}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5"
            >
              <Smile className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => {
                const samplePhotos = [
                  'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&q=80',
                  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
                ];
                const pic = samplePhotos[Math.floor(Math.random() * samplePhotos.length)];
                const msgWithPhoto: Message = {
                  id: `pic_${Date.now()}`,
                  senderId: currentUser.id,
                  text: 'Check out this visual concept from ConnectX Studio! ✨',
                  mediaUrl: pic,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  status: 'delivered',
                };
                onUpdateContacts(
                  contacts.map((c) =>
                    c.id === selectedContact.id
                      ? {
                          ...c,
                          messages: [...c.messages, msgWithPhoto],
                          lastMessage: 'Photo attachment sent 📸',
                        }
                      : c
                  )
                );
              }}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5"
              title="Attach sample photo"
            >
              <ImageIcon className="w-5 h-5" />
            </button>

            <input
              type="text"
              placeholder={`Message @${selectedContact.user.username}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 py-2 px-3.5 rounded-full bg-white/5 border border-white/10 text-white placeholder-zinc-500 text-xs sm:text-sm focus:outline-none focus:border-violet-500"
            />

            <button
              type="button"
              onClick={() => {
                const simulatedVoiceMsg: Message = {
                  id: `voice_${Date.now()}`,
                  senderId: currentUser.id,
                  text: '🎙️ Voice note (0:14) • Sent via simulated ConnectX audio recorder',
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  status: 'delivered',
                };
                onUpdateContacts(
                  contacts.map((c) =>
                    c.id === selectedContact.id
                      ? {
                          ...c,
                          messages: [...c.messages, simulatedVoiceMsg],
                          lastMessage: '🎙️ Voice note (0:14)',
                        }
                      : c
                  )
                );
              }}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5"
              title="Send simulated voice note"
            >
              <Mic className="w-5 h-5" />
            </button>

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white disabled:opacity-40 hover:scale-105 active:scale-95 transition-all shadow-md shadow-violet-700/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 hidden md:flex items-center justify-center text-center p-8 text-zinc-500 text-sm">
          Select a contact to begin chatting
        </div>
      )}

      {/* Simulated Call Modal */}
      {activeCallModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#121422] border border-white/10 rounded-3xl p-6 text-center space-y-6 shadow-2xl">
            <div className="relative mx-auto w-24 h-24">
              <img
                src={selectedContact.user.avatar}
                alt={selectedContact.user.name}
                className="w-full h-full rounded-full object-cover ring-4 ring-violet-500 animate-pulse"
              />
              <span className="absolute bottom-1 right-1 p-1 rounded-full bg-emerald-500 text-black">
                {activeCallModal === 'video' ? (
                  <Video className="w-3.5 h-3.5" />
                ) : (
                  <Phone className="w-3.5 h-3.5" />
                )}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">{selectedContact.user.name}</h3>
              <p className="text-xs text-violet-300 mt-1">
                ConnectX {activeCallModal === 'video' ? 'Video' : 'Voice'} Calling (Demonstration)
              </p>
              <p className="text-[11px] text-zinc-400 mt-2">
                Real audio/video streams require a WebRTC signaling server & STUN/TURN infrastructure.
              </p>
            </div>

            <button
              onClick={() => setActiveCallModal(null)}
              className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg transition-colors flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              <span>End Call Simulation</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
