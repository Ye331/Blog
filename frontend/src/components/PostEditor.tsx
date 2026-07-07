import React, { useEffect, useState } from 'react';
import { ImageUp, Trash2, X } from 'lucide-react';
import { BlogPost } from '../types';
import MarkdownContent from './MarkdownContent';

interface PostEditorProps {
  postToEdit?: BlogPost | null;
  onSave: (post: Omit<BlogPost, 'id' | 'date'> & { id?: string }) => void;
  onClose: () => void;
}

export default function PostEditor({ postToEdit, onSave, onClose }: PostEditorProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [readTime, setReadTime] = useState('5 min read');
  const [uploadError, setUploadError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

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
      setCategory('');
      setExcerpt('');
      setContent('');
      setCoverImage('');
      setReadTime('5 min read');
    }
    setUploadError('');
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

  const handleCoverUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setUploadError('');
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/uploads/images', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      if (!response.ok) {
        throw new Error(response.status === 413 ? 'Image must be 5MB or smaller.' : 'Upload failed. Use JPG, PNG, WebP, or GIF.');
      }
      const result = await response.json() as { url: string };
      setCoverImage(result.url);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed.');
    } finally {
      setIsUploading(false);
    }
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

          <div className="space-y-3">
            <span className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold block">Cover Image</span>
            <div className="flex flex-col md:flex-row gap-4">
              {coverImage ? (
                <div className="w-full md:w-56 aspect-video bg-white border-2 border-neutral-900 rounded-[12px] overflow-hidden">
                  <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-full md:w-56 aspect-video bg-white border-2 border-dashed border-neutral-300 rounded-[12px] flex items-center justify-center text-[10px] uppercase tracking-wider text-neutral-400 font-bold">
                  No cover
                </div>
              )}
              <div className="flex-1 space-y-3">
                <label className="inline-flex items-center space-x-2 px-4 py-2.5 bg-white hover:bg-neutral-50 border-2 border-neutral-900 rounded-[12px] shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] text-[10px] uppercase tracking-wider font-bold cursor-pointer">
                  <ImageUp className="h-4 w-4" />
                  <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
                  <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleCoverUpload} disabled={isUploading} className="sr-only" />
                </label>
                {coverImage && (
                  <button type="button" onClick={() => setCoverImage('')} className="ml-3 inline-flex items-center space-x-2 px-4 py-2.5 bg-[#FFBDBD] hover:bg-[#ffa6a6] border-2 border-neutral-900 rounded-[12px] text-[10px] uppercase tracking-wider font-bold">
                    <Trash2 className="h-4 w-4" />
                    <span>Clear</span>
                  </button>
                )}
                <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">JPG, PNG, WebP, or GIF. Max 5MB.</p>
                {uploadError && <p className="text-xs font-bold text-red-600">{uploadError}</p>}
              </div>
            </div>
          </div>

          <label className="space-y-1.5 block">
            <span className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold block">Short Excerpt</span>
            <input maxLength={180} value={excerpt} onChange={(event) => setExcerpt(event.target.value)} className="w-full px-4 py-2.5 text-sm bg-white border-2 border-neutral-900 rounded-[12px]" />
          </label>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <label className="space-y-1.5 block">
              <span className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold block">Markdown Workspace</span>
              <textarea required rows={16} value={content} onChange={(event) => setContent(event.target.value)} className="w-full px-4 py-3 text-sm bg-white border-2 border-neutral-900 rounded-[12px] font-mono leading-relaxed" />
            </label>
            <div className="space-y-1.5 block">
              <span className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold block">Live Preview</span>
              <div className="min-h-[384px] max-h-[520px] overflow-y-auto px-4 py-3 bg-white border-2 border-neutral-900 rounded-[12px]">
                {content.trim() ? <MarkdownContent content={content} /> : <p className="text-xs font-mono uppercase tracking-wider text-neutral-400">Preview appears here.</p>}
              </div>
            </div>
          </div>

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
