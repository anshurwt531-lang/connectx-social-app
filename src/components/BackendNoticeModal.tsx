import React from 'react';
import { X, CheckCircle, AlertTriangle, Database, Shield, Radio, Sparkles } from 'lucide-react';

interface BackendNoticeModalProps {
  onClose: () => void;
}

export const BackendNoticeModal: React.FC<BackendNoticeModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-[#111322] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-full text-zinc-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white shadow-lg">
            <Radio className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">System Architecture & Prototype Status</h2>
            <p className="text-xs text-zinc-400">
              Clear breakdown of functional features vs. demonstration capabilities
            </p>
          </div>
        </div>

        {/* Summary Pill */}
        <div className="p-3.5 rounded-2xl bg-violet-950/40 border border-violet-500/30 text-xs text-violet-200 space-y-1">
          <div className="font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Interactive Frontend Prototype with Real Server-Side AI</span>
          </div>
          <p className="text-[11px] leading-relaxed text-zinc-300">
            Per user specification, this application provides an interactive social media experience
            with transparent delineation between prototype simulation and backend requirements.
          </p>
        </div>

        {/* Feature Matrix */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Feature Breakdown:
          </h3>

          {/* Working Live Features */}
          <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <CheckCircle className="w-4 h-4" />
              <span>Fully Functional in Prototype:</span>
            </div>
            <ul className="text-xs text-zinc-300 space-y-1 pl-6 list-disc">
              <li>
                <strong>AI Logo Generation</strong>: Powered by{' '}
                <code className="text-emerald-300">gemini-3-pro-image-preview</code> with 1K, 2K,
                and 4K resolution options.
              </li>
              <li>
                <strong>AI Video Generation</strong>: Powered by{' '}
                <code className="text-emerald-300">veo-3.1-fast-generate-preview</code> with 16:9 and
                9:16 aspect ratios.
              </li>
              <li>
                <strong>Home Feed Interactions</strong>: Double-tap heart likes, real-time comment
                threads, bookmarking, and post sharing.
              </li>
              <li>
                <strong>Fullscreen Stories</strong>: Instagram & Snapchat progress bars, auto-play,
                tap navigation, and emoji reactions.
              </li>
              <li>
                <strong>Chat Simulation</strong>: Real-time messaging stream with smart contact auto-replies,
                read receipts, and status indicators.
              </li>
              <li>
                <strong>Creator Studio</strong>: Live camera snap filters and one-click publishing to feed/stories.
              </li>
            </ul>
          </div>

          {/* Features Requiring Backend Deployment */}
          <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-500/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <AlertTriangle className="w-4 h-4" />
              <span>Features That Require a Production Backend:</span>
            </div>
            <ul className="text-xs text-zinc-300 space-y-1.5 pl-6 list-disc">
              <li>
                <strong>User Authentication & Multi-Tenancy</strong>: Requires Cloud SQL (PostgreSQL) or
                Firebase Auth for password hashing, session tokens, and persistent user profiles.
              </li>
              <li>
                <strong>Live Peer-to-Peer Chat & Calls</strong>: Requires a WebSocket cluster or
                Firebase Firestore Realtime listeners, plus WebRTC signaling servers for voice/video.
              </li>
              <li>
                <strong>Cloud Asset Storage</strong>: Requires Google Cloud Storage or S3 for permanent
                hosting of user-uploaded media files.
              </li>
            </ul>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-colors"
        >
          Got it, return to ConnectX
        </button>
      </div>
    </div>
  );
};
