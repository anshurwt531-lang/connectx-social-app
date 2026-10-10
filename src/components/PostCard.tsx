import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Sparkles,
  Music,
  MapPin,
  Play,
  Film,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { Post, User } from '../types';

interface PostCardProps {
  post: Post;
  currentUser: User;
  onLikeToggle: (postId: string) => void;
  onSaveToggle: (postId: string) => void;
  onOpenComments: (post: Post) => void;
  onAnimateMedia?: (imageUrl: string, prompt?: string) => void;
  onSelectUser?: (user: User) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUser: _currentUser,
  onLikeToggle,
  onSaveToggle,
  onOpenComments,
  onAnimateMedia,
  onSelectUser,
}) => {
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  const handleDoubleTap = () => {
    if (!post.isLiked) {
      onLikeToggle(post.id);
    }
    setShowHeartBurst(true);
    setTimeout(() => setShowHeartBurst(false), 900);
  };

  const handleShare = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <article className="w-full bg-[#0d0f19] border border-white/10 rounded-2xl md:rounded-3xl overflow-hidden shadow-xl mb-6 transition-all hover:border-white/15">
      {/* Header */}
      <div className="flex items-center justify-between p-3.5 md:p-4">
        <div
          onClick={() => onSelectUser && onSelectUser(post.author)}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-violet-500/40 group-hover:ring-violet-400 transition-all"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors">
                {post.author.name}
              </span>
              {post.author.isVerified && (
                <ShieldCheck className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span>@{post.author.username}</span>
              {post.location && (
                <span className="flex items-center gap-0.5 text-zinc-500 truncate max-w-[140px]">
                  • <MapPin className="w-3 h-3 text-zinc-400 inline" /> {post.location}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* AI Origin Badge */}
        {post.isAiGenerated && (
          <div className="flex items-center gap-1 py-1 px-2.5 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-300 text-[11px] font-semibold">
            <Sparkles className="w-3 h-3 text-violet-400" />
            <span>AI Studio</span>
          </div>
        )}
      </div>

      {/* Media Container with Double-tap action */}
      <div
        className="relative w-full aspect-square md:aspect-[4/3] bg-zinc-950 overflow-hidden cursor-pointer select-none"
        onDoubleClick={handleDoubleTap}
      >
        {post.videoUrl && isPlayingVideo ? (
          <video
            src={post.videoUrl}
            autoPlay
            loop
            controls
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={post.imageUrl}
            alt={post.caption}
            className="w-full h-full object-cover hover:scale-[1.01] transition-transform duration-500"
          />
        )}

        {/* Video play overlay if has video */}
        {post.videoUrl && !isPlayingVideo && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsPlayingVideo(true);
            }}
            className="absolute inset-0 flex items-center justify-center bg-black/30 group hover:bg-black/40 transition-colors"
          >
            <div className="p-4 rounded-full bg-violet-600/90 text-white shadow-xl group-hover:scale-110 transition-transform">
              <Play className="w-8 h-8 fill-current ml-1" />
            </div>
            <span className="absolute bottom-4 left-4 px-2.5 py-1 rounded-full bg-black/60 text-white text-xs font-semibold backdrop-blur-md flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5" /> Veo 60fps Reel
            </span>
          </button>
        )}

        {/* Double-tap Heart Burst Animation */}
        {showHeartBurst && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-ping">
            <Heart className="w-24 h-24 text-pink-500 fill-pink-500 drop-shadow-2xl" />
          </div>
        )}

        {/* Brand/Logo Watermark if logo */}
        {post.logoBrand && (
          <div className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-white text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-violet-400" />
            Brand: {post.logoBrand}
          </div>
        )}

        {/* Quick Animate button if image can be animated with Veo */}
        {onAnimateMedia && !post.videoUrl && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAnimateMedia(post.imageUrl, post.caption);
            }}
            className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-violet-950/80 hover:bg-violet-900 border border-violet-400/40 text-violet-200 text-xs font-bold backdrop-blur-md shadow-lg flex items-center gap-1.5 transition-all"
            title="Animate this post into video using Veo"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Animate with Veo</span>
          </button>
        )}
      </div>

      {/* Action Bar */}
      <div className="p-3.5 md:p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Like Button */}
            <button
              onClick={() => onLikeToggle(post.id)}
              className="flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors group"
            >
              <Heart
                className={`w-6 h-6 transition-transform group-active:scale-125 ${
                  post.isLiked
                    ? 'text-pink-500 fill-pink-500 scale-105'
                    : 'text-zinc-300 group-hover:text-pink-400'
                }`}
              />
              <span className={`text-xs font-bold ${post.isLiked ? 'text-pink-400' : 'text-zinc-300'}`}>
                {post.likesCount.toLocaleString()}
              </span>
            </button>

            {/* Comment Button */}
            <button
              onClick={() => onOpenComments(post)}
              className="flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors group"
            >
              <MessageCircle className="w-6 h-6 text-zinc-300 group-hover:text-violet-400" />
              <span className="text-xs font-bold text-zinc-300">
                {post.commentsCount.toLocaleString()}
              </span>
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="text-zinc-300 hover:text-white transition-colors relative"
              title="Share post"
            >
              {isCopied ? (
                <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
                  <Check className="w-5 h-5" />
                  <span className="hidden sm:inline">Copied!</span>
                </div>
              ) : (
                <Share2 className="w-5 h-5 hover:text-cyan-400" />
              )}
            </button>
          </div>

          {/* Bookmark / Save Button */}
          <button
            onClick={() => onSaveToggle(post.id)}
            className="text-zinc-300 hover:text-white transition-colors"
          >
            <Bookmark
              className={`w-5 h-5 ${
                post.isSaved ? 'text-amber-400 fill-amber-400' : 'hover:text-amber-300'
              }`}
            />
          </button>
        </div>

        {/* Music Track Badge */}
        {post.musicTrack && (
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 bg-white/[0.03] px-2.5 py-1 rounded-lg w-max">
            <Music className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
            <span className="font-medium text-zinc-300">{post.musicTrack}</span>
          </div>
        )}

        {/* Caption & Hashtags */}
        <div className="text-sm space-y-1">
          <div>
            <span
              onClick={() => onSelectUser && onSelectUser(post.author)}
              className="font-bold text-white mr-2 cursor-pointer hover:underline"
            >
              {post.author.username}
            </span>
            <span className="text-zinc-300 leading-relaxed">{post.caption}</span>
          </div>

          {post.hashtags && post.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {post.hashtags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium text-violet-400 hover:text-violet-300 cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Comments Preview Trigger */}
        <div className="flex items-center justify-between text-xs text-zinc-500 pt-1">
          <button
            onClick={() => onOpenComments(post)}
            className="text-zinc-400 hover:text-white transition-colors font-medium"
          >
            {post.commentsCount > 0
              ? `View all ${post.commentsCount} comments`
              : 'Add the first comment...'}
          </button>
          <span>{post.timestamp}</span>
        </div>
      </div>
    </article>
  );
};
