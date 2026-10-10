export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  banner?: string;
  bio: string;
  company?: string;
  website?: string;
  location?: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isVerified?: boolean;
  isFollowing?: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  text: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
}

export interface Post {
  id: string;
  author: User;
  imageUrl: string;
  videoUrl?: string;
  isVideo?: boolean;
  aspectRatio?: '1:1' | '9:16' | '16:9' | '4:5';
  caption: string;
  hashtags: string[];
  location?: string;
  musicTrack?: string;
  likesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  commentsCount: number;
  comments: Comment[];
  timestamp: string;
  isAiGenerated?: boolean;
  aiModel?: string;
  logoBrand?: string;
}

export interface Story {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  hasUnseenStories: boolean;
  items: {
    id: string;
    mediaUrl: string;
    isVideo?: boolean;
    duration: number; // in seconds
    caption?: string;
    timestamp: string;
    isAiGenerated?: boolean;
  }[];
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  mediaUrl?: string;
  isAiGenerated?: boolean;
}

export interface ChatContact {
  id: string;
  user: User;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  isTyping?: boolean;
  messages: Message[];
}

export interface LogoGenerationConfig {
  companyName: string;
  industry: string;
  style: string;
  colorPalette: string;
  additionalDetails: string;
  aspectRatio: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  imageSize: '1K' | '2K' | '4K';
}

export interface VideoGenerationConfig {
  prompt: string;
  imageBase64: string;
  aspectRatio: '16:9' | '9:16';
  resolution: '720p' | '1080p';
}
