import React from 'react';
import { Home, Compass, PlusCircle, MessageSquare, User, Sparkles, LogIn, Info, ShieldCheck } from 'lucide-react';
import { User as UserType } from '../types';

interface NavigationProps {
  activeTab: 'home' | 'search' | 'create' | 'messages' | 'profile';
  setActiveTab: (tab: 'home' | 'search' | 'create' | 'messages' | 'profile') => void;
  currentUser: UserType;
  unreadCount: number;
  openCreateModal: (defaultTab?: 'logo' | 'video' | 'snap') => void;
  openAuthModal: () => void;
  openBackendNotice: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  unreadCount,
  openCreateModal,
  openAuthModal,
  openBackendNotice,
}) => {
  return (
    <>
      {/* Desktop & Tablet Sidebar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 lg:w-72 bg-[#090a10]/95 backdrop-blur-xl border-r border-white/10 z-40 p-4 justify-between">
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center justify-between px-3 py-2">
            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-amber-400 p-0.5 shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-[#090a10] rounded-[10px] flex items-center justify-center">
                  <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400 text-xl tracking-tighter">
                    CX
                  </span>
                </div>
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                  Connect<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400">X</span>
                </span>
                <span className="block text-[10px] uppercase tracking-widest text-zinc-400 font-semibold">
                  Social & Creative Studio
                </span>
              </div>
            </button>
          </div>

          {/* Prototype System Status Pill */}
          <button
            onClick={openBackendNotice}
            className="w-full px-3 py-2 rounded-xl bg-violet-950/40 border border-violet-500/30 hover:border-violet-400/60 transition-all flex items-center justify-between text-left group"
          >
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-medium text-violet-200">Prototype Demo Mode</span>
            </div>
            <Info className="w-3.5 h-3.5 text-violet-400 group-hover:text-white transition-colors" />
          </button>

          {/* Main Navigation Links */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab('home')}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'home'
                  ? 'bg-violet-600/20 text-white border border-violet-500/30 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Home className={`w-5 h-5 ${activeTab === 'home' ? 'text-violet-400' : 'text-zinc-400'}`} />
              <span>Home Feed</span>
            </button>

            <button
              onClick={() => setActiveTab('search')}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'search'
                  ? 'bg-violet-600/20 text-white border border-violet-500/30'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Compass className={`w-5 h-5 ${activeTab === 'search' ? 'text-violet-400' : 'text-zinc-400'}`} />
              <span>Explore & People</span>
            </button>

            {/* AI Creative Studio / Create Button with Glowing Accents */}
            <button
              onClick={() => openCreateModal('logo')}
              className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-violet-600/30 via-fuchsia-600/30 to-amber-500/20 border border-violet-500/40 text-white hover:border-violet-400 hover:from-violet-600/40 transition-all shadow-md shadow-violet-900/20 group"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-gradient-to-tr from-violet-500 to-pink-500 text-white shadow-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-white text-xs font-bold leading-tight">AI Logo & Studio</div>
                  <div className="text-[10px] text-zinc-300 font-normal">Gemini 3 Pro + Veo</div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-violet-400/20 text-violet-300 border border-violet-400/30">
                PRO
              </span>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'messages'
                  ? 'bg-violet-600/20 text-white border border-violet-500/30'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <MessageSquare className={`w-5 h-5 ${activeTab === 'messages' ? 'text-violet-400' : 'text-zinc-400'}`} />
                <span>Messages</span>
              </div>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-500 text-black">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'profile'
                  ? 'bg-violet-600/20 text-white border border-violet-500/30'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <User className={`w-5 h-5 ${activeTab === 'profile' ? 'text-violet-400' : 'text-zinc-400'}`} />
              <span>Profile</span>
            </button>
          </nav>
        </div>

        {/* User Card & Demo Login Drawer Button */}
        <div className="pt-4 border-t border-white/10 space-y-2">
          <div
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-violet-500/40"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-white truncate">{currentUser.name}</span>
                {currentUser.isVerified && (
                  <ShieldCheck className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
                )}
              </div>
              <p className="text-xs text-zinc-400 truncate">@{currentUser.username}</p>
            </div>
          </div>

          <button
            onClick={openAuthModal}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-medium text-zinc-300 hover:text-white transition-all"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Switch / Demo Accounts</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-[#090a10]/90 backdrop-blur-xl border-b border-white/10 z-40 px-4 flex items-center justify-between">
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2 focus:outline-none"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 to-amber-400 p-0.5">
            <div className="w-full h-full bg-[#090a10] rounded-[6px] flex items-center justify-center">
              <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400 text-xs">
                CX
              </span>
            </div>
          </div>
          <span className="text-lg font-black tracking-tight text-white">
            Connect<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-amber-400">X</span>
          </span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openCreateModal('logo')}
            className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-pink-600 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className="relative p-2 text-zinc-300 hover:text-white"
          >
            <MessageSquare className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#090a10]" />
            )}
          </button>

          <button
            onClick={openBackendNotice}
            className="p-2 text-violet-400 hover:text-violet-300"
            title="Prototype Status"
          >
            <Info className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#090a10]/95 backdrop-blur-2xl border-t border-white/10 z-40 px-4 flex items-center justify-around">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 py-1 transition-colors ${
            activeTab === 'home' ? 'text-violet-400' : 'text-zinc-400'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium">Home</span>
        </button>

        <button
          onClick={() => setActiveTab('search')}
          className={`flex flex-col items-center gap-1 py-1 transition-colors ${
            activeTab === 'search' ? 'text-violet-400' : 'text-zinc-400'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] font-medium">Search</span>
        </button>

        {/* Center Create Post & Studio Button */}
        <button
          onClick={() => openCreateModal('snap')}
          className="-mt-5 p-3 rounded-full bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-amber-400 text-white shadow-lg shadow-violet-600/30 hover:scale-105 transition-transform"
        >
          <PlusCircle className="w-6 h-6" />
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className={`relative flex flex-col items-center gap-1 py-1 transition-colors ${
            activeTab === 'messages' ? 'text-violet-400' : 'text-zinc-400'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-2 px-1 text-[9px] font-bold rounded-full bg-emerald-500 text-black">
              {unreadCount}
            </span>
          )}
          <span className="text-[10px] font-medium">Chat</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 py-1 transition-colors ${
            activeTab === 'profile' ? 'text-violet-400' : 'text-zinc-400'
          }`}
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className={`w-5 h-5 rounded-full object-cover ${
              activeTab === 'profile' ? 'ring-2 ring-violet-400' : ''
            }`}
          />
          <span className="text-[10px] font-medium">Profile</span>
        </button>
      </nav>
    </>
  );
};
