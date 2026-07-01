import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { BlogPost } from '../types';

interface PostEditorProps {
  postToEdit?: BlogPost | null;
  onSave: (post: Omit<BlogPost, 'id' | 'date'> & { id?: string }) => void;
  onClose: () => void;
}

const PRESET_COVERS = [
  { name: 'Minimal Workspace', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80' },
  { name: 'Design Studio', url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80' },
  { name: 'Developer Desk', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80' },
];

export default function PostEditor({ postToEdit, onSave, onClose }: PostEditorProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Design');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [readTime, setReadTime] = useState('5 min read');

  useEffect(() => {
    if (postToEdit) {
      setTitle(postToEdit.title);
      setCategory(postToEdit.category);
      setExcerpt(postToEdit.excerpt);
      setContent(postToEdit.content);
      setCoverImage(postToEdit.coverImage || '');
      setReadTime(postToEdit.readTime);
    } else {
      setTitle('');
      setCategory('Design');
      setExcerpt('');
      setContent('');
      setCoverImage(PRESET_COVERS[0].url);
      setReadTime('5 min read');
    }
  }, [postToEdit]);

  useEffect(() => {
    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(wordCount / 200));
    setReadTime(`${minutes} min read`);
  }, [content]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onSave({
      id: postToEdit?.id,
      title,
      category,
      excerpt: excerpt || `${content.slice(0, 140)}...`,
      content,
      coverImage: coverImage || undefined,
      readTime,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/45 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FCF9EA] border-4 border-neutral-900 rounded-[24px] w-full max-w-4xl shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-5 border-b-2 border-neutral-900 flex items-center justify-between bg-white">
          <div>
            <h2 className="text-sm font-sans font-extrabold uppercase tracking-widest">{postToEdit ? 'Edit Article' : 'Write New Article'}</h2>
            <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mt-0.5">{readTime} estimated pace</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900" id="btn-close-editor">
            <X className="h-5 w-5 stroke-[2.5]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FCF9EA]" id="editor-form">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <label className="md:col-span-2 space-y-1.5">
              <span className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold block">Article Title</span>
              <input required value={title} onChange={(event) => setTitle(event.target.value)} className="w-full px-4 py-2.5 text-sm bg-white border-2 border-neutral-900 rounded-[12px]" />
            </label>
            <label className="space-y-1.5">
              <span className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold block">Category</span>
              <input required value={category} onChange={(event) => setCategory(event.target.value)} className="w-full px-4 py-2.5 text-sm bg-white border-2 border-neutral-900 rounded-[12px]" />
            </label>
          </div>

          <label className="space-y-2 block">
            <span className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold block">Cover Image URL</span>
            <input value={coverImage} onChange={(event) => setCoverImage(event.target.value)} className="w-full px-4 py-2.5 text-xs bg-white border-2 border-neutral-900 rounded-[12px] font-mono" />
          </label>

          <div className="flex flex-wrap gap-2">
            {PRESET_COVERS.map((preset) => (
              <button key={preset.name} type="button" onClick={() => setCoverImage(preset.url)} className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold border-2 rounded-full bg-white hover:border-neutral-900">
                {preset.name}
              </button>
            ))}
          </div>

          <label className="space-y-1.5 block">
            <span className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold block">Short Excerpt</span>
            <input maxLength={180} value={excerpt} onChange={(event) => setExcerpt(event.target.value)} className="w-full px-4 py-2.5 text-sm bg-white border-2 border-neutral-900 rounded-[12px]" />
          </label>

          <label className="space-y-1.5 block">
            <span className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold block">Content Workspace</span>
            <textarea required rows={12} value={content} onChange={(event) => setContent(event.target.value)} className="w-full px-4 py-3 text-sm bg-white border-2 border-neutral-900 rounded-[12px] font-serif leading-relaxed" />
          </label>

          <div className="px-0 py-4 border-t-2 border-neutral-900 flex items-center justify-end space-x-3 bg-[#FCF9EA]">
            <button type="button" onClick={onClose} className="px-4 py-2 text-[11px] uppercase tracking-wider font-bold text-neutral-500 hover:text-neutral-900">Discard</button>
            <button type="submit" disabled={!title.trim() || !content.trim()} className="px-6 py-2.5 bg-[#FFA4A4] hover:bg-[#ff8f8f] border-2 border-neutral-900 text-[11px] uppercase tracking-wider font-bold shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] disabled:opacity-40">
              {postToEdit ? 'Save Changes' : 'Publish Article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
