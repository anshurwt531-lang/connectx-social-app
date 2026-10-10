import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { StoriesBar } from './components/StoriesBar';
import { StoryViewer } from './components/StoryViewer';
import { PostCard } from './components/PostCard';
import { CommentsModal } from './components/CommentsModal';
import { CreativeStudio } from './components/CreativeStudio';
import { ChatScreen } from './components/ChatScreen';
import { SearchPage } from './components/SearchPage';
import { ProfilePage } from './components/ProfilePage';
import { AuthModal } from './components/AuthModal';
import { BackendNoticeModal } from './components/BackendNoticeModal';
import {
  CURRENT_USER,
  DEMO_USERS,
  INITIAL_POSTS,
  INITIAL_STORIES,
  INITIAL_CONTACTS,
} from './data/sampleData';
import { User, Post, Story, ChatContact } from './types';
import { Sparkles, TrendingUp, Info } from 'lucide-react';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'create' | 'messages' | 'profile'>(
    'home'
  );

  // App Data State
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);
  const [allUsers, setAllUsers] = useState<User[]>(DEMO_USERS);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);
  const [contacts, setContacts] = useState<ChatContact[]>(INITIAL_CONTACTS);

  // Selected Profile (when clicking another user)
  const [viewingUser, setViewingUser] = useState<User | null>(null);

  // Modals & Overlays State
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [activeCommentsPost, setActiveCommentsPost] = useState<Post | null>(null);
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [studioDefaultTab, setStudioDefaultTab] = useState<'logo' | 'video' | 'snap'>('logo');
  const [studioInitialImage, setStudioInitialImage] = useState<string | undefined>(undefined);
  const [studioInitialPrompt, setStudioInitialPrompt] = useState<string | undefined>(undefined);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isBackendNoticeOpen, setIsBackendNoticeOpen] = useState(false);

  // Unread messages count
  const unreadCount = contacts.reduce((sum, c) => sum + c.unreadCount, 0);

  // Handlers for Feed Interactions
  const handleLikeToggle = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likesCount: isLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
          };
        }
        return p;
      })
    );
  };

  const handleSaveToggle = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            isSaved: !p.isSaved,
          };
        }
        return p;
      })
    );
  };

  const handleAddComment = (postId: string, text: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [
              {
                id: `c_${Date.now()}`,
                userId: currentUser.id,
                username: currentUser.username,
                userAvatar: currentUser.avatar,
                text,
                timestamp: 'Just now',
                likes: 0,
              },
              ...p.comments,
            ],
          };
        }
        return p;
      })
    );
  };

  // Follow / Unfollow Toggle
  const handleFollowToggle = (userId: string) => {
    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const isFollowing = !u.isFollowing;
          return {
            ...u,
            isFollowing,
            followersCount: isFollowing ? u.followersCount + 1 : Math.max(0, u.followersCount - 1),
          };
        }
        return u;
      })
    );
    if (viewingUser && viewingUser.id === userId) {
      const isFollowing = !viewingUser.isFollowing;
      setViewingUser({
        ...viewingUser,
        isFollowing,
        followersCount: isFollowing
          ? viewingUser.followersCount + 1
          : Math.max(0, viewingUser.followersCount - 1),
      });
    }
  };

  // Publish from Creative Studio to Feed
  const handlePublishPost = (postData: Partial<Post>) => {
    const newPost: Post = {
      id: `post_${Date.now()}`,
      author: currentUser,
      imageUrl: postData.imageUrl || '',
      videoUrl: postData.videoUrl,
      isVideo: postData.isVideo || false,
      caption: postData.caption || '',
      hashtags: postData.hashtags || ['#ConnectX'],
      location: postData.location || 'ConnectX Studio',
      likesCount: 0,
      isLiked: false,
      isSaved: false,
      commentsCount: 0,
      comments: [],
      timestamp: 'Just now',
      isAiGenerated: postData.isAiGenerated || false,
      aiModel: postData.aiModel,
      logoBrand: postData.logoBrand,
    };

    setPosts((prev) => [newPost, ...prev]);
    setActiveTab('home');
  };

  // Add to Story
  const handleAddToStory = (mediaUrl: string, isVideo: boolean, caption?: string) => {
    const userStory = stories.find((s) => s.userId === currentUser.id);
    const newItem = {
      id: `s_item_${Date.now()}`,
      mediaUrl,
      isVideo,
      duration: isVideo ? 8 : 5,
      caption,
      timestamp: 'Just now',
      isAiGenerated: true,
    };

    if (userStory) {
      setStories((prev) =>
        prev.map((s) =>
          s.userId === currentUser.id
            ? {
                ...s,
                hasUnseenStories: false,
                items: [newItem, ...s.items],
              }
            : s
        )
      );
    } else {
      const newStory: Story = {
        id: `story_${Date.now()}`,
        userId: currentUser.id,
        username: 'Your Story',
        userAvatar: currentUser.avatar,
        hasUnseenStories: false,
        items: [newItem],
      };
      setStories((prev) => [newStory, ...prev]);
    }
  };

  // Open Studio
  const handleOpenStudio = (
    defaultTab: 'logo' | 'video' | 'snap' = 'logo',
    initialImage?: string,
    initialPrompt?: string
  ) => {
    setStudioDefaultTab(defaultTab);
    setStudioInitialImage(initialImage);
    setStudioInitialPrompt(initialPrompt);
    setIsStudioOpen(true);
  };

  // Send Direct Message from Story Viewer
  const handleSendStoryReply = (recipientUsername: string, message: string) => {
    const contact = contacts.find(
      (c) => c.user.username.toLowerCase() === recipientUsername.toLowerCase()
    );

    if (contact) {
      const newMsg = {
        id: `m_story_${Date.now()}`,
        senderId: currentUser.id,
        text: `Story reply: "${message}"`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'delivered' as const,
      };

      setContacts((prev) =>
        prev.map((c) =>
          c.id === contact.id
            ? {
                ...c,
                messages: [...c.messages, newMsg],
                lastMessage: newMsg.text,
                lastMessageTime: 'Just now',
              }
            : c
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#08090f] text-zinc-100 flex flex-col font-sans selection:bg-violet-500 selection:text-white">
      {/* Navigation Bars (Sidebar for desktop, Top and Bottom for mobile) */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'profile') setViewingUser(null);
        }}
        currentUser={currentUser}
        unreadCount={unreadCount}
        openCreateModal={handleOpenStudio}
        openAuthModal={() => setIsAuthOpen(true)}
        openBackendNotice={() => setIsBackendNoticeOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 md:pl-64 lg:pl-72 pt-16 md:pt-6 pb-20 md:pb-6 px-3 sm:px-6 max-w-7xl w-full mx-auto">
        {/* VIEW 1: HOME FEED */}
        {activeTab === 'home' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Feed Main Column */}
            <div className="lg:col-span-8 space-y-6">
              {/* Stories Bar */}
              <StoriesBar
                stories={stories}
                currentUser={currentUser}
                onSelectStory={(story) => setActiveStory(story)}
                onAddStory={() => handleOpenStudio('logo')}
              />

              {/* Quick AI Studio Banner Card */}
              <div className="p-4 sm:p-5 rounded-2xl md:rounded-3xl bg-gradient-to-r from-violet-950/60 via-[#15122b] to-fuchsia-950/50 border border-violet-500/30 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-md bg-gradient-to-tr from-violet-500 to-amber-400 text-white">
                      <Sparkles className="w-3.5 h-3.5" />
                    </span>
                    <h3 className="text-sm font-bold text-white">
                      ConnectX AI Brand Studio
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                      Gemini 3 Pro + Veo
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300">
                    Design a company logo in 4K resolution, then animate it into a 9:16 or 16:9 video!
                  </p>
                </div>

                <button
                  onClick={() => handleOpenStudio('logo')}
                  className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-xs font-bold shadow-md shadow-violet-800/30 flex items-center justify-center gap-1.5 transition-all whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Open Creator Studio</span>
                </button>
              </div>

              {/* Feed Stream */}
              <div className="space-y-6">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    currentUser={currentUser}
                    onLikeToggle={handleLikeToggle}
                    onSaveToggle={handleSaveToggle}
                    onOpenComments={(p) => setActiveCommentsPost(p)}
                    onAnimateMedia={(imgUrl, caption) => {
                      handleOpenStudio(
                        'video',
                        imgUrl,
                        `Animate this brand visual with dynamic 60fps kinetic motion and lighting: ${caption || ''}`
                      );
                    }}
                    onSelectUser={(u) => {
                      setViewingUser(u);
                      setActiveTab('profile');
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Desktop Right Discovery Column */}
            <div className="hidden lg:block lg:col-span-4 space-y-6 sticky top-6">
              {/* Profile Mini Card */}
              <div className="p-4 rounded-2xl bg-[#0e101d] border border-white/10 shadow-lg flex items-center justify-between">
                <div
                  onClick={() => {
                    setViewingUser(null);
                    setActiveTab('profile');
                  }}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-violet-500/30 group-hover:ring-violet-400 transition-all"
                  />
                  <div>
                    <span className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors block">
                      {currentUser.name}
                    </span>
                    <span className="text-xs text-zinc-400 block">@{currentUser.username}</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="text-xs font-bold text-violet-400 hover:text-violet-300 transition-colors"
                >
                  Switch
                </button>
              </div>

              {/* Suggested Creators */}
              <div className="p-4 rounded-2xl bg-[#0e101d] border border-white/10 shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Suggested For You
                  </span>
                  <button
                    onClick={() => setActiveTab('search')}
                    className="text-xs font-bold text-violet-400 hover:text-violet-300"
                  >
                    See All
                  </button>
                </div>

                <div className="space-y-3">
                  {allUsers
                    .filter((u) => u.id !== currentUser.id)
                    .slice(0, 3)
                    .map((user) => (
                      <div key={user.id} className="flex items-center justify-between gap-3">
                        <div
                          onClick={() => {
                            setViewingUser(user);
                            setActiveTab('profile');
                          }}
                          className="flex items-center gap-2.5 cursor-pointer min-w-0"
                        >
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-9 h-9 rounded-full object-cover ring-1 ring-violet-500/20"
                          />
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-white truncate block">
                              {user.name}
                            </span>
                            <span className="text-[11px] text-zinc-400 truncate block">
                              @{user.username}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleFollowToggle(user.id)}
                          className={`text-xs font-bold py-1 px-3 rounded-lg transition-all ${
                            user.isFollowing
                              ? 'text-zinc-400 hover:text-white'
                              : 'text-violet-400 hover:text-violet-300 hover:bg-violet-500/10'
                          }`}
                        >
                          {user.isFollowing ? 'Following' : 'Follow'}
                        </button>
                      </div>
                    ))}
                </div>
              </div>

              {/* Trending Tags Mini Card */}
              <div className="p-4 rounded-2xl bg-[#0e101d] border border-white/10 shadow-lg space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                  <span>Trending Topics</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {[
                    '#VeoVideo',
                    '#Gemini3Pro',
                    '#LogoDesign',
                    '#CleanTech',
                    '#Cyberpunk',
                    '#SpatialUI',
                  ].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setActiveTab('search')}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-zinc-300 hover:text-white transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prototype Badge footer */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-zinc-500 flex items-center justify-between">
                <span>ConnectX Prototype v1.0</span>
                <button
                  onClick={() => setIsBackendNoticeOpen(true)}
                  className="text-violet-400 hover:underline flex items-center gap-1"
                >
                  <Info className="w-3 h-3" />
                  <span>Status Info</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: SEARCH / DISCOVER */}
        {activeTab === 'search' && (
          <SearchPage
            users={allUsers}
            posts={posts}
            onSelectUser={(u) => {
              setViewingUser(u);
              setActiveTab('profile');
            }}
            onSelectPost={(p) => setActiveCommentsPost(p)}
            onFollowToggle={handleFollowToggle}
          />
        )}

        {/* VIEW 3: CHAT / MESSAGES */}
        {activeTab === 'messages' && (
          <ChatScreen
            contacts={contacts}
            currentUser={currentUser}
            onUpdateContacts={(updated) => setContacts(updated)}
            openBackendNotice={() => setIsBackendNoticeOpen(true)}
          />
        )}

        {/* VIEW 4: PROFILE */}
        {activeTab === 'profile' && (
          <ProfilePage
            user={viewingUser || currentUser}
            isCurrentUser={!viewingUser || viewingUser.id === currentUser.id}
            userPosts={posts.filter(
              (p) => p.author.id === (viewingUser ? viewingUser.id : currentUser.id)
            )}
            savedPosts={posts.filter((p) => p.isSaved)}
            onFollowToggle={handleFollowToggle}
            onUpdateProfile={(updated) => {
              setCurrentUser((prev) => ({ ...prev, ...updated }));
              setAllUsers((prev) =>
                prev.map((u) => (u.id === currentUser.id ? { ...u, ...updated } : u))
              );
            }}
            onSelectPost={(p) => setActiveCommentsPost(p)}
            openCreateStudio={() => handleOpenStudio('logo')}
          />
        )}
      </main>

      {/* OVERLAY: Fullscreen Story Viewer */}
      {activeStory && (
        <StoryViewer
          story={activeStory}
          allStories={stories}
          onClose={() => setActiveStory(null)}
          onSendReply={handleSendStoryReply}
        />
      )}

      {/* OVERLAY: Comments Modal */}
      {activeCommentsPost && (
        <CommentsModal
          post={activeCommentsPost}
          currentUser={currentUser}
          onClose={() => setActiveCommentsPost(null)}
          onAddComment={handleAddComment}
        />
      )}

      {/* OVERLAY: ConnectX Creative Studio Modal (Logo Designer + Veo Video Generator + Snap) */}
      {isStudioOpen && (
        <CreativeStudio
          initialTab={studioDefaultTab}
          initialImageForVideo={studioInitialImage}
          initialVideoPrompt={studioInitialPrompt}
          onPublishPost={handlePublishPost}
          onAddToStory={handleAddToStory}
          onClose={() => setIsStudioOpen(false)}
        />
      )}

      {/* OVERLAY: Auth & Demo Account Switcher Modal */}
      {isAuthOpen && (
        <AuthModal
          currentUser={currentUser}
          onSwitchUser={(user) => {
            setCurrentUser(user);
            setViewingUser(null);
          }}
          onClose={() => setIsAuthOpen(false)}
        />
      )}

      {/* OVERLAY: Prototype Architecture Notice Modal */}
      {isBackendNoticeOpen && (
        <BackendNoticeModal onClose={() => setIsBackendNoticeOpen(false)} />
      )}
    </div>
  );
}
