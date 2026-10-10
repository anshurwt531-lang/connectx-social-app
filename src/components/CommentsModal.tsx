import React, { useState } from 'react';
import { X, Send, Heart } from 'lucide-react';
import { Post, Comment, User } from '../types';

interface CommentsModalProps {
  post: Post;
  currentUser: User;
  onClose: () => void;
  onAddComment: (postId: string, text: string) => void;
}

export const CommentsModal: React.FC<CommentsModalProps> = ({
  post,
  currentUser,
  onClose,
  onAddComment,
}) => {
  const [commentText, setCommentText] = useState('');
  const [commentsList, setCommentsList] = useState<Comment[]>(post.comments);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: `c_${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.avatar,
      text: commentText.trim(),
      timestamp: 'Just now',
      likes: 0,
      isLiked: false,
    };

    setCommentsList((prev) => [newComment, ...prev]);
    onAddComment(post.id, commentText.trim());
    setCommentText('');
  };

  const toggleCommentLike = (commentId: string) => {
    setCommentsList((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const isLiked = !c.isLiked;
          return {
            ...c,
            isLiked,
            likes: isLiked ? c.likes + 1 : Math.max(0, c.likes - 1),
          };
        }
        return c;
      })
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-[#0e101a] border border-white/10 rounded-t-3xl md:rounded-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-base">Comments</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-zinc-300">
              {commentsList.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Caption Header as main comment */}
        <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-start gap-3">
          <img
            src={post.author.avatar}
            alt={post.author.username}
            className="w-9 h-9 rounded-full object-cover ring-1 ring-violet-500/30 flex-shrink-0"
          />
          <div className="flex-1 text-sm">
            <span className="font-bold text-white mr-2">@{post.author.username}</span>
            <span className="text-zinc-300 leading-relaxed">{post.caption}</span>
            <div className="text-xs text-zinc-500 mt-1">{post.timestamp}</div>
          </div>
        </div>

        {/* Comments Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {commentsList.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-sm">
              No comments yet. Start the conversation!
            </div>
          ) : (
            commentsList.map((c) => (
              <div key={c.id} className="flex items-start gap-3 group">
                <img
                  src={c.userAvatar}
                  alt={c.username}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">@{c.username}</span>
                    <span className="text-[11px] text-zinc-500">{c.timestamp}</span>
                  </div>
                  <p className="text-sm text-zinc-200 mt-0.5 break-words">{c.text}</p>
                </div>
                <button
                  onClick={() => toggleCommentLike(c.id)}
                  className={`p-1 flex flex-col items-center gap-0.5 text-xs transition-colors ${
                    c.isLiked ? 'text-pink-500' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${c.isLiked ? 'fill-current' : ''}`} />
                  {c.likes > 0 && <span className="text-[10px]">{c.likes}</span>}
                </button>
              </div>
            ))
          )}
        </div>

        {/* Quick Emojis Bar */}
        <div className="px-4 py-2 border-t border-white/5 flex items-center justify-around bg-black/20 text-lg">
          {['❤️', '🔥', '👏', '😍', '🙌', '✨', '⚡'].map((emoji) => (
            <button
              key={emoji}
              onClick={() => setCommentText((prev) => prev + emoji)}
              className="hover:scale-125 transition-transform"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Add comment input */}
        <form onSubmit={handleSubmit} className="p-3 border-t border-white/10 flex items-center gap-2 bg-[#090a10]">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          />
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={`Comment as @${currentUser.username}...`}
            className="flex-1 py-2 px-3 rounded-full bg-white/5 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-violet-500"
          />
          <button
            type="submit"
            disabled={!commentText.trim()}
            className="p-2 rounded-full bg-violet-600 text-white hover:bg-violet-500 disabled:opacity-40 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
