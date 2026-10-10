import React from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { Story, User } from '../types';

interface StoriesBarProps {
  stories: Story[];
  currentUser: User;
  onSelectStory: (story: Story) => void;
  onAddStory: () => void;
}

export const StoriesBar: React.FC<StoriesBarProps> = ({
  stories,
  currentUser,
  onSelectStory,
  onAddStory,
}) => {
  return (
    <div className="w-full overflow-x-auto scrollbar-none py-3 px-1 border-b border-white/5 bg-[#0e101a]/50 rounded-2xl mb-6">
      <div className="flex items-center gap-3.5 min-w-max px-2">
        {/* Current User Story / Add Story Button */}
        <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
          <div className="relative" onClick={onAddStory}>
            <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-violet-500 to-fuchsia-500 hover:scale-105 transition-transform">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-full h-full rounded-full object-cover ring-2 ring-[#090a10]"
              />
            </div>
            <div className="absolute bottom-0 right-0 p-1 rounded-full bg-violet-600 text-white ring-2 ring-[#090a10] shadow-md group-hover:scale-110 transition-transform">
              <Plus className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors truncate max-w-[70px]">
            Your Story
          </span>
        </div>

        {/* Stories from following/creators */}
        {stories
          .filter((s) => s.userId !== currentUser.id)
          .map((story) => (
            <div
              key={story.id}
              onClick={() => onSelectStory(story)}
              className="flex flex-col items-center gap-1.5 cursor-pointer group"
            >
              <div className="relative">
                <div
                  className={`w-16 h-16 rounded-full p-0.5 transition-transform group-hover:scale-105 ${
                    story.hasUnseenStories
                      ? 'bg-gradient-to-tr from-amber-400 via-fuchsia-500 to-violet-600 animate-pulse-subtle'
                      : 'bg-zinc-700/60'
                  }`}
                >
                  <img
                    src={story.userAvatar}
                    alt={story.username}
                    className="w-full h-full rounded-full object-cover ring-2 ring-[#090a10]"
                  />
                </div>
                {story.items.some((item) => item.isAiGenerated) && (
                  <div className="absolute -top-1 -right-1 p-1 rounded-full bg-gradient-to-tr from-fuchsia-600 to-amber-400 text-black shadow-sm ring-2 ring-[#090a10]">
                    <Sparkles className="w-2.5 h-2.5" />
                  </div>
                )}
              </div>
              <span className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors truncate max-w-[72px]">
                {story.username}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};
