import React, { useState } from 'react';
import {
  Grid,
  Bookmark,
  Sparkles,
  MapPin,
  Link as LinkIcon,
  Briefcase,
  Edit3,
  ShieldCheck,
  Film,
  Play,
  Heart,
  MessageCircle,
  X,
  Check,
} from 'lucide-react';
import { User, Post } from '../types';

interface ProfilePageProps {
  user: User;
  isCurrentUser: boolean;
  userPosts: Post[];
  savedPosts: Post[];
  onFollowToggle?: (userId: string) => void;
  onUpdateProfile?: (updatedUser: Partial<User>) => void;
  onSelectPost: (post: Post) => void;
  openCreateStudio: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  isCurrentUser,
  userPosts,
  savedPosts,
  onFollowToggle,
  onUpdateProfile,
  onSelectPost,
  openCreateStudio,
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'ai' | 'saved'>('posts');
  const [isEditing, setIsEditing] = useState(false);

  // Edit profile form state
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [company, setCompany] = useState(user.company || '');
  const [website, setWebsite] = useState(user.website || '');
  const [location, setLocation] = useState(user.location || '');
  const [avatar, setAvatar] = useState(user.avatar);

  const aiCreations = userPosts.filter((p) => p.isAiGenerated || p.logoBrand || p.isVideo);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateProfile) {
      onUpdateProfile({
        name,
        bio,
        company,
        website,
        location,
        avatar,
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-20">
      {/* Banner & Profile Info Card */}
      <div className="bg-[#0e101d] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        {/* Banner Cover Image */}
        <div className="relative h-44 sm:h-56 w-full bg-gradient-to-r from-violet-900 via-fuchsia-900 to-indigo-950 overflow-hidden">
          {user.banner ? (
            <img
              src={user.banner}
              alt="Profile banner"
              className="w-full h-full object-cover opacity-80"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-violet-800 to-pink-700" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e101d] via-transparent to-transparent" />
        </div>

        {/* Profile Details Container */}
        <div className="px-6 pb-6 pt-0 relative space-y-4">
          {/* Avatar and Action Buttons Row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-[#0e101d] shadow-2xl ring-4 ring-violet-500/40">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full rounded-full object-cover"
              />
              {user.isVerified && (
                <div
                  className="absolute bottom-1 right-1 p-1 rounded-full bg-violet-600 text-white ring-2 ring-[#0e101d]"
                  title="Verified Creator"
                >
                  <ShieldCheck className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              {isCurrentUser ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="py-2 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all flex items-center gap-1.5 border border-white/10"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </button>

                  <button
                    onClick={openCreateStudio}
                    className="py-2 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-violet-700/30"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Open AI Studio</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => onFollowToggle && onFollowToggle(user.id)}
                  className={`py-2 px-6 rounded-xl text-xs font-bold transition-all shadow-md ${
                    user.isFollowing
                      ? 'bg-white/10 text-zinc-300 hover:bg-rose-600/20 hover:text-rose-300'
                      : 'bg-violet-600 hover:bg-violet-500 text-white shadow-violet-700/30'
                  }`}
                >
                  {user.isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
            </div>
          </div>

          {/* User Name & Bio */}
          <div className="space-y-2">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">{user.name}</h1>
                {user.isVerified && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    VERIFIED
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-zinc-400">@{user.username}</p>
            </div>

            <p className="text-sm text-zinc-200 leading-relaxed max-w-2xl">{user.bio}</p>

            {/* Meta badges: company, location, website */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 pt-1">
              {user.company && (
                <span className="flex items-center gap-1 text-violet-300">
                  <Briefcase className="w-3.5 h-3.5" />
                  {user.company}
                </span>
              )}
              {user.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                  {user.location}
                </span>
              )}
              {user.website && (
                <a
                  href={user.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-cyan-400 hover:underline"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  {user.website.replace(/^https?:\/\//, '')}
                </a>
              )}
            </div>
          </div>

          {/* Follower Stats Counters */}
          <div className="flex items-center gap-6 pt-3 border-t border-white/5">
            <div>
              <span className="font-bold text-white text-base mr-1.5">{userPosts.length}</span>
              <span className="text-xs text-zinc-400">Posts</span>
            </div>
            <div>
              <span className="font-bold text-white text-base mr-1.5">
                {user.followersCount.toLocaleString()}
              </span>
              <span className="text-xs text-zinc-400">Followers</span>
            </div>
            <div>
              <span className="font-bold text-white text-base mr-1.5">
                {user.followingCount.toLocaleString()}
              </span>
              <span className="text-xs text-zinc-400">Following</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content Tabs */}
      <div className="flex border-b border-white/10 bg-[#0e101d] rounded-2xl p-1 shadow-md">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'posts'
              ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>Posts ({userPosts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ai')}
          className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'ai'
              ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>AI Logos & Veo Videos ({aiCreations.length})</span>
        </button>

        {isCurrentUser && (
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'saved'
                ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-4 h-4 text-amber-400" />
            <span>Saved ({savedPosts.length})</span>
          </button>
        )}
      </div>

      {/* Grid Content Showcase */}
      {activeTab === 'posts' && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
          {userPosts.length === 0 ? (
            <div className="col-span-full py-16 text-center text-zinc-500 text-sm">
              No posts shared yet. Create your first post!
            </div>
          ) : (
            userPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => onSelectPost(post)}
                className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-950 border border-white/10 cursor-pointer group shadow-lg"
              >
                <img
                  src={post.imageUrl}
                  alt={post.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {post.isVideo && (
                  <div className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white backdrop-blur-md">
                    <Film className="w-3.5 h-3.5" />
                  </div>
                )}
                {post.logoBrand && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-violet-600/80 text-white text-[10px] font-bold backdrop-blur-md">
                    Logo: {post.logoBrand}
                  </div>
                )}
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
            ))
          )}
        </div>
      )}

      {activeTab === 'ai' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {aiCreations.length === 0 ? (
            <div className="col-span-full py-16 text-center text-zinc-500 text-sm">
              No AI logos or video animations yet. Visit the Creative Studio to generate one!
            </div>
          ) : (
            aiCreations.map((post) => (
              <div
                key={post.id}
                onClick={() => onSelectPost(post)}
                className="rounded-2xl overflow-hidden bg-[#0e101d] border border-white/10 cursor-pointer group shadow-lg hover:border-violet-500/40 transition-all flex flex-col"
              >
                <div className="relative aspect-square bg-zinc-950 overflow-hidden">
                  <img
                    src={post.imageUrl}
                    alt={post.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {post.videoUrl && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                      <div className="p-3 rounded-full bg-violet-600 text-white shadow-xl group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 fill-current ml-0.5" />
                      </div>
                    </div>
                  )}
                  <div className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>{post.logoBrand ? `Brand: ${post.logoBrand}` : 'AI Studio Creation'}</span>
                  </div>
                </div>
                <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                  <p className="text-xs text-zinc-300 line-clamp-2">{post.caption}</p>
                  <span className="text-[10px] text-violet-400 font-mono font-semibold block">
                    {post.aiModel || 'Gemini 3 Pro + Veo'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
          {savedPosts.length === 0 ? (
            <div className="col-span-full py-16 text-center text-zinc-500 text-sm">
              No saved posts. Tap the bookmark icon on any post to save it here!
            </div>
          ) : (
            savedPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => onSelectPost(post)}
                className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-950 border border-white/10 cursor-pointer group shadow-lg"
              >
                <img
                  src={post.imageUrl}
                  alt={post.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white font-bold text-sm">
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4 fill-current text-pink-500" />
                    {post.likesCount}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#121422] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white">Edit ConnectX Profile</h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-300 font-bold mb-1">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-bold mb-1">Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-bold mb-1">Company / Brand</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-bold mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-bold mb-1">Website URL</label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-bold mb-1">Avatar Image URL</label>
                <input
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold flex items-center gap-1.5 shadow-md shadow-violet-700/30"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
