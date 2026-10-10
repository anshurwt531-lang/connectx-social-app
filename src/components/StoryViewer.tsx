import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Heart, Send, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { Story } from '../types';

interface StoryViewerProps {
  story: Story;
  allStories: Story[];
  onClose: () => void;
  onSendReply: (recipientUsername: string, message: string) => void;
  onNextStoryUser?: () => void;
  onPrevStoryUser?: () => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({
  story,
  onClose,
  onSendReply,
  onNextStoryUser,
  onPrevStoryUser,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [sentFeedback, setSentFeedback] = useState(false);
  const [likeReacted, setLikeReacted] = useState(false);

  const currentItem = story.items[currentIndex] || story.items[0];
  const duration = (currentItem?.duration || 5) * 1000;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto progression
  useEffect(() => {
    if (isPaused) return;

    const interval = 50;
    const increment = (interval / duration) * 100;

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + increment;
      });
    }, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isPaused, duration]);

  const handleNext = () => {
    if (currentIndex < story.items.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
    } else if (onNextStoryUser) {
      onNextStoryUser();
      setCurrentIndex(0);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
    } else if (onPrevStoryUser) {
      onPrevStoryUser();
      setCurrentIndex(0);
      setProgress(0);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onSendReply(story.username, replyText);
    setReplyText('');
    setSentFeedback(true);
    setTimeout(() => setSentFeedback(false), 2000);
  };

  const sendQuickReaction = (emoji: string) => {
    onSendReply(story.username, emoji);
    setSentFeedback(true);
    setTimeout(() => setSentFeedback(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-0 md:p-4">
      {/* Background click to dismiss on desktop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-black/60 text-white/80 hover:text-white hover:bg-black/90 transition-all"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Desktop Prev / Next Nav Buttons */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handlePrev();
        }}
        className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          handleNext();
        }}
        className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Story Card Container */}
      <div
        className="relative w-full max-w-md h-full md:h-[92vh] max-h-[920px] bg-zinc-950 rounded-none md:rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between select-none z-10 border border-white/10"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Media Background */}
        <div className="absolute inset-0 z-0">
          {currentItem.isVideo ? (
            <video
              src={currentItem.mediaUrl}
              autoPlay
              playsInline
              loop
              muted={isMuted}
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={currentItem.mediaUrl}
              alt="Story content"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80" />
        </div>

        {/* Tap areas for left / right navigation */}
        <div className="absolute inset-0 z-10 flex">
          <div
            className="w-1/3 h-full cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
          />
          <div
            className="w-2/3 h-full cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
          />
        </div>

        {/* Top Header & Progress Bars */}
        <div className="relative z-20 p-4 space-y-3">
          {/* Progress segments */}
          <div className="flex items-center gap-1.5 w-full">
            {story.items.map((item, idx) => (
              <div key={item.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-75"
                  style={{
                    width:
                      idx < currentIndex
                        ? '100%'
                        : idx === currentIndex
                        ? `${progress}%`
                        : '0%',
                  }}
                />
              </div>
            ))}
          </div>

          {/* User info bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={story.userAvatar}
                alt={story.username}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-violet-400"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white leading-tight">{story.username}</span>
                  {currentItem.isAiGenerated && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-600/60 border border-violet-400/40 text-violet-200 flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" /> Veo/Gemini
                    </span>
                  )}
                </div>
                <span className="text-xs text-white/70">{currentItem.timestamp}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {currentItem.isVideo && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMuted(!isMuted);
                  }}
                  className="p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              )}
              <button
                onClick={onClose}
                className="md:hidden p-1.5 rounded-full bg-black/40 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Interactive Area & Reply Form */}
        <div className="relative z-20 p-4 space-y-3">
          {/* Caption */}
          {currentItem.caption && (
            <div className="p-3 rounded-2xl bg-black/50 backdrop-blur-md border border-white/10 text-white text-sm font-medium">
              {currentItem.caption}
            </div>
          )}

          {/* Sent Feedback notification */}
          {sentFeedback && (
            <div className="text-center py-1 px-3 rounded-lg bg-emerald-500/90 text-black font-bold text-xs animate-bounce">
              ✓ Reply sent to {story.username}&apos;s direct chat!
            </div>
          )}

          {/* Quick reactions */}
          <div className="flex items-center justify-around py-1">
            {['🔥', '❤️', '👏', '😮', '🚀'].map((emoji) => (
              <button
                key={emoji}
                onClick={(e) => {
                  e.stopPropagation();
                  sendQuickReaction(emoji);
                }}
                className="text-2xl hover:scale-125 transition-transform active:scale-95"
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Reply input & Heart button */}
          <form
            onSubmit={handleSendReply}
            className="flex items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder={`Reply to ${story.username}...`}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onFocus={() => setIsPaused(true)}
                onBlur={() => setIsPaused(false)}
                className="w-full py-2.5 pl-4 pr-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white placeholder-zinc-400 text-sm focus:outline-none focus:border-violet-400"
              />
              <button
                type="submit"
                disabled={!replyText.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-violet-400 hover:text-white disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setLikeReacted(!likeReacted);
                if (!likeReacted) sendQuickReaction('❤️');
              }}
              className={`p-2.5 rounded-full backdrop-blur-md border transition-all ${
                likeReacted
                  ? 'bg-pink-600 border-pink-400 text-white scale-110'
                  : 'bg-black/50 border-white/20 text-white hover:text-pink-400'
              }`}
            >
              <Heart className={`w-5 h-5 ${likeReacted ? 'fill-current' : ''}`} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
