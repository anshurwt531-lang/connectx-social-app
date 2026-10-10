import React, { useState } from 'react';
import { X, LogIn, UserPlus, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { User } from '../types';
import { DEMO_USERS } from '../data/sampleData';

interface AuthModalProps {
  currentUser: User;
  onSwitchUser: (user: User) => void;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  currentUser,
  onSwitchUser,
  onClose,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');

  const handleSimulatedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'signup' && name && username) {
      const newUser: User = {
        id: `user_${Date.now()}`,
        name,
        username: username.replace(/^@/, ''),
        avatar:
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
        bio: 'Just joined ConnectX! Exploring generative design and real-time social streams.',
        followersCount: 1,
        followingCount: 3,
        postsCount: 0,
      };
      onSwitchUser(newUser);
      onClose();
    } else {
      // Login simulation with Alex
      onSwitchUser(DEMO_USERS[0]);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-[#111322] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-full text-zinc-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-amber-400 p-0.5 shadow-lg shadow-violet-600/30">
            <div className="w-full h-full bg-[#111322] rounded-[14px] flex items-center justify-center">
              <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400 text-xl">
                CX
              </span>
            </div>
          </div>
          <h2 className="text-xl font-black text-white">
            {mode === 'login' ? 'Welcome back to ConnectX' : 'Create your ConnectX Account'}
          </h2>
          <p className="text-xs text-zinc-400">
            The next-generation social ecosystem & AI creative lab
          </p>
        </div>

        {/* Prototype Demonstration Banner */}
        <div className="p-3 rounded-2xl bg-violet-950/40 border border-violet-500/20 text-xs text-violet-200 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <span className="font-bold text-white">Prototype Mode</span>: Authentication is
            simulated locally. Real multi-tenant accounts require a PostgreSQL/Cloud SQL or
            Firebase Auth backend.
          </div>
        </div>

        {/* Mode Switch Tabs */}
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              mode === 'login'
                ? 'bg-violet-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              mode === 'signup'
                ? 'bg-violet-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Sign Up</span>
          </button>
        </div>

        {/* Quick Demo Accounts Switcher */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-zinc-400 block uppercase tracking-wider">
            1-Click Demo Profiles:
          </span>
          <div className="grid grid-cols-3 gap-2">
            {DEMO_USERS.slice(0, 3).map((user) => (
              <button
                key={user.id}
                onClick={() => {
                  onSwitchUser(user);
                  onClose();
                }}
                className={`p-2 rounded-xl text-center border transition-all ${
                  currentUser.id === user.id
                    ? 'bg-violet-600/30 border-violet-400 text-white'
                    : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover mx-auto mb-1 ring-1 ring-white/20"
                />
                <div className="text-[11px] font-bold text-white truncate">{user.name}</div>
                <div className="text-[9px] text-zinc-400 truncate">@{user.username}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Auth Form (Simulated) */}
        <form onSubmit={handleSimulatedSubmit} className="space-y-3 text-xs">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-zinc-300 font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Blake"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-violet-500"
                />
              </div>
              <div>
                <label className="block text-zinc-300 font-bold mb-1">Username</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. jordan_creates"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-violet-500"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-zinc-300 font-bold mb-1">Email Address</label>
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-bold mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-violet-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-amber-500 text-white font-bold text-xs shadow-lg shadow-violet-700/30 hover:opacity-95 transition-all mt-2"
          >
            {mode === 'login' ? 'Sign In (Simulated)' : 'Create Account (Simulated)'}
          </button>
        </form>
      </div>
    </div>
  );
};
