
import React from 'react';
import { UserIcon } from './UserIcon';

interface PlayerCardProps {
  name: string;
  isCurrentUser?: boolean;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ name, isCurrentUser = false }) => {
  const baseClasses = "flex items-center p-3 rounded-lg transition-all duration-300";
  const conditionalClasses = isCurrentUser
    ? "bg-indigo-500/20 border border-indigo-500/50"
    : "bg-slate-700/50 hover:bg-slate-700";
  
  const textClass = isCurrentUser ? "text-indigo-300" : "text-slate-300";

  return (
    <div className={`${baseClasses} ${conditionalClasses}`}>
      <UserIcon className={`w-6 h-6 mr-4 ${textClass}`} />
      <span className={`font-medium ${isCurrentUser ? 'text-white' : 'text-slate-200'}`}>{name}</span>
      {isCurrentUser && <span className="ml-auto text-xs font-semibold text-indigo-400 bg-indigo-500/20 px-2 py-1 rounded-full">Du</span>}
    </div>
  );
};
