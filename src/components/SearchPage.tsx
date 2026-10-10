import React, { useState } from 'react';
import { Search, TrendingUp, Users, Heart, MessageCircle, Play, Sparkles, ShieldCheck } from 'lucide-react';
import { User, Post } from '../types';

interface SearchPageProps {
  users: User[];
  posts: Post[];
  onSelectUser: (user: User) => void;
  onSelectPost: (post: Post) => void;
  onFollowToggle: (userId: string) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  users,
  posts,
  onSelectUser,
  onSelectPost,
  onFollowToggle,
}) => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'people' | 'logos' | 'videos'>('all');

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.username.toLowerCase().includes(query.toLowerCase()) ||
      u.bio.toLowerCase().includes(query.toLowerCase())
  );

  const filteredPosts = posts.filter((p) => {
    const matchesQuery =
      p.caption.toLowerCase().includes(query.toLowerCase()) ||
      p.author.username.toLowerCase().includes(query.toLowerCase()) ||
      p.hashtags.some((t) => t.toLowerCase().includes(query.toLowerCase()));

    if (!matchesQuery) return false;
    if (activeCategory === 'logos') return Boolean(p.logoBrand || p.isAiGenerated);
    if (activeCategory === 'videos') return Boolean(p.isVideo || p.videoUrl);
    return true;
  });

  const trendingTopics = [
    { tag: '#VeoVideo', count: '142K creations', category: 'Generative Video' },
    { tag: '#Gemini3Pro', count: '98K marks', category: 'AI Branding' },
    { tag: '#LogoDesign', count: '87K posts', category: 'Graphic Design' },
    { tag: '#CyberpunkArt', count: '64K snaps', category: 'Creative' },
    { tag: '#SpatialInterface', count: '41K posts', category: 'Tech' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-20">
      {/* Search Header */}
      <div className="bg-[#0e101d] border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-xl space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search creators, companies, @usernames, or #hashtags..."
            className="w-full py-3.5 pl-12 pr-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-violet-500 shadow-inner"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          {[
            { id: 'all', label: 'All Discover' },
            { id: 'people', label: 'People & Creators' },
            { id: 'logos', label: '✨ AI Logos & Brands' },
            { id: 'videos', label: '🎥 Veo Video Reels' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`py-1.5 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 border-violet-400 text-white shadow-md'
                  : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Suggested People / Search Results */}
      {(activeCategory === 'all' || activeCategory === 'people' || query.length > 0) && (
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-violet-400" />
              <span>{query ? 'People Results' : 'Suggested Creators & Founders'}</span>
            </h3>
            <span className="text-xs text-zinc-500">{filteredUsers.length} people</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="p-3.5 rounded-2xl bg-[#0e101d] border border-white/10 flex items-center justify-between gap-3 hover:border-violet-500/30 transition-all shadow-md group"
              >
                <div
                  onClick={() => onSelectUser(user)}
                  className="flex items-center gap-3 cursor-pointer min-w-0 flex-1"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-violet-500/30 group-hover:ring-violet-400 transition-all flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white truncate">{user.name}</span>
                      {user.isVerified && (
                        <ShieldCheck className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
                      )}
                    </div>
                    <span className="text-[11px] text-zinc-400 block truncate">
                      @{user.username}
                    </span>
                    <span className="text-[10px] text-zinc-500 block truncate">
                      {user.followersCount.toLocaleString()} followers
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onFollowToggle(user.id)}
                  className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                    user.isFollowing
                      ? 'bg-white/10 text-zinc-300 hover:bg-rose-500/20 hover:text-rose-300'
                      : 'bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-violet-700/20'
                  }`}
                >
                  {user.isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Trending Topics & Hashtags */}
      <section className="p-4 md:p-5 rounded-2xl md:rounded-3xl bg-[#0e101d] border border-white/10 shadow-lg space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-amber-400" />
          <span>Trending in ConnectX Creative Ecosystem</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {trendingTopics.map((topic) => (
            <div
              key={topic.tag}
              onClick={() => setQuery(topic.tag)}
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer transition-colors"
            >
              <span className="text-[10px] uppercase font-bold text-violet-400 tracking-wider block">
                {topic.category}
              </span>
              <span className="text-xs font-bold text-white block mt-0.5">{topic.tag}</span>
              <span className="text-[10px] text-zinc-400 block mt-0.5">{topic.count}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Explore Grid (Instagram & Snapchat Media Showcase) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-fuchsia-400" />
            <span>Visual Explore Grid</span>
          </h3>
          <span className="text-xs text-zinc-500">{filteredPosts.length} posts</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="relative aspect-square rounded-xl md:rounded-2xl overflow-hidden bg-zinc-950 border border-white/10 cursor-pointer group shadow-md"
            >
              <img
                src={post.imageUrl}
                alt={post.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Video Indicator */}
              {post.isVideo && (
                <div className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white backdrop-blur-md shadow-md">
                  <Play className="w-3.5 h-3.5 fill-current" />
                </div>
              )}

              {/* AI Badge */}
              {post.isAiGenerated && (
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-violet-600/80 text-white text-[10px] font-bold backdrop-blur-md">
                  AI Studio
                </div>
              )}

              {/* Hover Overlay with Likes & Comments */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white font-bold text-sm">
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4 fill-current text-pink-500" />
                  {post.likesCount}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4 fill-current text-violet-400" />
                  {post.commentsCount}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
