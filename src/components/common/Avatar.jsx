import React from 'react';

export function Avatar({ user, name, src, size = 'md', className = '' }) {
  const userName = name || (user ? user.name : 'User');
  const userAvatar = src || (user ? user.avatar : null);

  const getInitials = (str) => {
    if (!str) return 'U';
    const parts = str.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return str.slice(0, 2).toUpperCase();
  };

  const sizeClasses = {
    xs: 'w-5 h-5 text-[9px]',
    sm: 'w-7 h-7 text-[11px]',
    md: 'w-9 h-9 text-xs',
    lg: 'w-11 h-11 text-sm',
    xl: 'w-14 h-14 text-base font-bold'
  };

  const selectedSize = sizeClasses[size] || sizeClasses.md;

  if (userAvatar) {
    return (
      <img
        src={userAvatar}
        alt={userName}
        className={`rounded-full object-cover border border-zinc-700/80 shrink-0 ${selectedSize} ${className}`}
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
    );
  }

  return (
    <div
      className={`rounded-full bg-zinc-800 text-zinc-200 border border-zinc-700 font-semibold flex items-center justify-center shrink-0 ${selectedSize} ${className}`}
    >
      {getInitials(userName)}
    </div>
  );
}
