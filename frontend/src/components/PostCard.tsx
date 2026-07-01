import React from 'react';
import { BlogPost } from '../types';

interface PostCardProps {
  post: BlogPost;
  isAdmin: boolean;
  onClick: () => void;
  onEdit: (event: React.MouseEvent) => void;
  onDelete: (event: React.MouseEvent) => void;
}

export default function PostCard({ post, isAdmin, onClick, onEdit, onDelete }: PostCardProps) {
  const hoverColors = ['hover:bg-[#BADFDB]', 'hover:bg-[#FFA4A4]', 'hover:bg-[#FFBDBD]'];
  const idNum = parseInt(post.id) || post.title.charCodeAt(0) || 0;

  return (
    <article onClick={onClick} className={`group relative flex flex-col md:flex-row gap-8 p-6 md:p-8 rounded-[24px] border-2 border-transparent ${hoverColors[idNum % hoverColors.length]} hover:border-neutral-900 hover:shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] hover:-translate-y-1 transition-all duration-300 bg-transparent`} id={`post-card-${post.id}`}>
      {post.coverImage && (
        <div className="md:w-1/3 h-48 md:h-44 overflow-hidden shrink-0 bg-white border-2 border-neutral-900 rounded-[16px] shadow-[3px_3px_0px_0px_rgba(17,17,17,1)]">
          <img src={post.coverImage} alt={post.title} referrerPolicy="no-referrer" className="w-full h-full object-cover filter grayscale-[15%] group-hover:grayscale-0 transition-all duration-500" />
        </div>
      )}
      <div className="flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 bg-white border-2 border-neutral-900 rounded-full text-[10px] font-sans uppercase tracking-wider font-bold text-neutral-800">{post.category}</span>
            {isAdmin && (
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={(event) => { event.stopPropagation(); onEdit(event); }} className="px-2.5 py-1 bg-white border border-neutral-900 rounded-md text-[10px] uppercase font-bold" id={`btn-edit-card-${post.id}`}>Edit</button>
                <button onClick={(event) => { event.stopPropagation(); onDelete(event); }} className="px-2.5 py-1 bg-[#FFA4A4] border border-neutral-900 rounded-md text-[10px] uppercase font-bold" id={`btn-delete-card-${post.id}`}>Delete</button>
              </div>
            )}
          </div>
          <h3 className="font-sans text-2xl md:text-3xl font-extrabold tracking-tight leading-[1.2]">{post.title}</h3>
          <p className="text-sm text-neutral-700 leading-relaxed font-serif line-clamp-3">{post.excerpt}</p>
        </div>
        <div className="flex items-center space-x-3 text-[11px] font-mono text-neutral-500 uppercase tracking-wider">
          <span>{post.date}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-900/20"></span>
          <span>{post.readTime}</span>
        </div>
      </div>
    </article>
  );
}
