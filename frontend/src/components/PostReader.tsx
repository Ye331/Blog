import { ArrowLeft, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { BlogPost } from '../types';
import MarkdownContent from './MarkdownContent';

interface PostReaderProps {
  post: BlogPost;
  onBack: () => void;
}

export default function PostReader({ post, onBack }: PostReaderProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="max-w-3xl mx-auto px-6 py-12" id="post-reader-container">
      <button onClick={onBack} className="group inline-flex items-center space-x-2 px-4 py-2 bg-white border-2 border-neutral-900 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] hover:bg-[#BADFDB] mb-12" id="btn-reader-back">
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to Journal</span>
      </button>
      <article className="space-y-8">
        <div className="space-y-4">
          <span className="inline-block px-3 py-1 bg-[#BADFDB] border-2 border-neutral-900 rounded-full text-[10px] font-sans uppercase tracking-wider font-bold">{post.category}</span>
          <h1 className="font-sans text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.15]">{post.title}</h1>
          <div className="flex items-center space-x-3 text-[11px] font-mono text-neutral-500 uppercase tracking-wider">
            <span>{post.date}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-900/20"></span>
            <span>{post.readTime}</span>
          </div>
        </div>
        {post.coverImage && (
          <div className="w-full aspect-video rounded-[24px] overflow-hidden bg-white border-2 border-neutral-900 shadow-[6px_6px_0px_0px_rgba(17,17,17,1)]">
            <img src={post.coverImage} alt={post.title} referrerPolicy="no-referrer" className="w-full h-full object-contain filter grayscale-[5%]" />
          </div>
        )}
        <div className="pt-6 text-neutral-800">
          <MarkdownContent content={post.content} />
        </div>
      </article>
      <div className="mt-20 pt-10 border-t-2 border-dashed border-neutral-900/10 flex flex-col sm:flex-row items-center justify-between text-xs font-serif text-neutral-400 gap-6">
        <span className="flex items-center space-x-2 italic text-neutral-500">
          <BookOpen className="h-4 w-4 text-neutral-400" />
          <span>Completed: &ldquo;{post.title}&rdquo;</span>
        </span>
        <button onClick={onBack} className="px-6 py-2.5 bg-white hover:bg-[#FFBDBD] border-2 border-neutral-900 text-[10px] uppercase tracking-wider font-bold shadow-[3px_3px_0px_0px_rgba(17,17,17,1)]">Return to home</button>
      </div>
    </motion.div>
  );
}
