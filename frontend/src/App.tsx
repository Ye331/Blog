/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FormEvent, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { FileText, RotateCcw } from 'lucide-react';
import { INITIAL_POSTS, DEFAULT_PROFILE } from './initialData';
import { BlogPost, UserProfile } from './types';
import Header from './components/Header';
import PostCard from './components/PostCard';
import PostEditor from './components/PostEditor';
import PostReader from './components/PostReader';
import ProfileModal from './components/ProfileModal';

type AuthUser = { role: 'admin' };
type PostFormData = Omit<BlogPost, 'id' | 'date'> & { id?: string };
const ADMIN_PATH = '/studio-a7ed8f996c916a75';

const apiFetch = async <T,>(url: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) throw new Error(`Request failed with ${response.status}`);
  if (response.status === 204) return undefined as T;
  return response.json();
};

function AdminLogin({ onLogin }: { onLogin: (user: AuthUser) => void }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const result = await apiFetch<{ user: AuthUser }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      onLogin(result.user);
    } catch {
      setError('Invalid admin credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCF9EA] text-neutral-900 flex items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white border-4 border-neutral-900 rounded-[24px] shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] p-6 space-y-5">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400">Admin Console</p>
          <h1 className="text-2xl font-sans font-extrabold tracking-tight mt-1">yeyeyang.cn</h1>
        </div>
        <label className="space-y-1.5 block">
          <span className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-neutral-800 block">Username</span>
          <input value={username} onChange={(event) => setUsername(event.target.value)} className="w-full px-3 py-2 text-sm bg-[#FCF9EA] border-2 border-neutral-900 rounded-[12px]" autoComplete="username" />
        </label>
        <label className="space-y-1.5 block">
          <span className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-neutral-800 block">Password</span>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full px-3 py-2 text-sm bg-[#FCF9EA] border-2 border-neutral-900 rounded-[12px]" autoComplete="current-password" />
        </label>
        {error && <p className="text-xs font-bold text-red-600">{error}</p>}
        <button type="submit" disabled={isSubmitting} className="w-full px-5 py-2.5 bg-[#FFA4A4] hover:bg-[#ff8f8f] text-neutral-900 border-2 border-neutral-900 shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] text-[11px] uppercase tracking-wider font-bold transition-all disabled:opacity-50">
          {isSubmitting ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}

export default function App() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [posts, setPosts] = useState<BlogPost[]>(INITIAL_POSTS);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState<BlogPost | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const isAdminRoute = window.location.pathname === ADMIN_PATH;
  const isAdmin = authUser?.role === 'admin' && isAdminRoute;

  const loadData = async () => {
    setIsDataLoading(true);
    try {
      const [loadedPosts, loadedProfile] = await Promise.all([
        apiFetch<BlogPost[]>('/api/posts'),
        apiFetch<UserProfile>('/api/profile'),
      ]);
      setPosts(loadedPosts);
      setProfile(loadedProfile);
    } catch {
      setPosts(INITIAL_POSTS);
      setProfile(DEFAULT_PROFILE);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    const loadAuth = async () => {
      try {
        const result = await apiFetch<{ user: AuthUser }>('/api/auth/me');
        setAuthUser(result.user);
      } catch {
        setAuthUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    };
    loadAuth();
    loadData();
  }, []);

  const filteredPosts = posts.filter((post) => {
    const query = searchQuery.toLowerCase();
    return (selectedCategory === 'All' || post.category === selectedCategory) &&
      (post.title.toLowerCase().includes(query) || post.excerpt.toLowerCase().includes(query) || post.content.toLowerCase().includes(query) || post.category.toLowerCase().includes(query));
  });

  const handleSavePost = async (updatedPostData: PostFormData) => {
    if (!isAdmin) return;
    if (updatedPostData.id) {
      const updatedPost = await apiFetch<BlogPost>(`/api/posts/${updatedPostData.id}`, { method: 'PUT', body: JSON.stringify(updatedPostData) });
      setPosts((prev) => prev.map((post) => (post.id === updatedPost.id ? updatedPost : post)));
      if (activePost?.id === updatedPost.id) setActivePost(updatedPost);
    } else {
      const newPost = await apiFetch<BlogPost>('/api/posts', { method: 'POST', body: JSON.stringify(updatedPostData) });
      setPosts((prev) => [newPost, ...prev]);
    }
    setIsEditorOpen(false);
    setPostToEdit(null);
  };

  const handleDeletePost = async (postId: string) => {
    if (!isAdmin) return;
    if (confirm('Are you absolutely sure you want to delete this article?')) {
      await apiFetch<void>(`/api/posts/${postId}`, { method: 'DELETE' });
      setPosts((prev) => prev.filter((post) => post.id !== postId));
      if (activePost?.id === postId) setActivePost(null);
    }
  };

  const handleSaveProfile = async (updatedProfile: UserProfile) => {
    if (!isAdmin) return;
    const savedProfile = await apiFetch<UserProfile>('/api/profile', { method: 'PUT', body: JSON.stringify(updatedProfile) });
    setProfile(savedProfile);
    setIsProfileModalOpen(false);
  };

  const handleResetDefaults = async () => {
    if (!isAdmin) return;
    if (confirm('This will restore the original demo articles. Continue?')) {
      const result = await apiFetch<{ profile: UserProfile; posts: BlogPost[] }>('/api/reset-demo-data', { method: 'POST' });
      setPosts(result.posts);
      setProfile(result.profile);
      setActivePost(null);
      setSelectedCategory('All');
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await apiFetch<void>('/api/auth/logout', { method: 'POST' });
    setAuthUser(null);
    setIsEditorOpen(false);
    setIsProfileModalOpen(false);
  };

  if (isAdminRoute && isAuthLoading) return <div className="min-h-screen bg-[#FCF9EA] flex items-center justify-center text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400">Checking admin session...</div>;
  if (isAdminRoute && !authUser) return <AdminLogin onLogin={setAuthUser} />;

  return (
    <div className="min-h-screen bg-[#FCF9EA] text-neutral-900 flex flex-col selection:bg-neutral-900 selection:text-white antialiased">
      <AnimatePresence mode="wait">
        {!activePost ? (
          <motion.div key="home-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col flex-1">
            <Header profile={profile} posts={posts} isAdmin={isAdmin} searchQuery={searchQuery} setSearchQuery={setSearchQuery} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} onNewPostClick={() => { if (!isAdmin) return; setPostToEdit(null); setIsEditorOpen(true); }} onEditProfileClick={() => { if (!isAdmin) return; setIsProfileModalOpen(true); }} onLogoutClick={handleLogout} />
            <main className="flex-1 mx-auto max-w-5xl w-full px-6 py-12">
              <div className="flex items-center justify-between mb-8 pb-3 border-b-2 border-dashed border-neutral-900/10">
                <h2 className="font-sans text-[10px] font-extrabold tracking-[0.2em] text-neutral-400 uppercase">{selectedCategory === 'All' ? 'ALL ESSAYS' : `${selectedCategory.toUpperCase()} ESSAYS`} ({filteredPosts.length})</h2>
                {isAdmin && <button onClick={handleResetDefaults} className="inline-flex items-center space-x-1 text-[10px] font-sans uppercase tracking-widest font-bold text-neutral-400 hover:text-neutral-900 transition-colors"><RotateCcw className="h-3.5 w-3.5" /><span>Reset Archive</span></button>}
              </div>
              {isDataLoading ? <div className="py-20 text-center text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400">Loading essays...</div> : filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 gap-6" id="posts-grid">{filteredPosts.map((post, idx) => <motion.div key={post.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: idx * 0.05, ease: 'easeOut' }}><PostCard post={post} isAdmin={isAdmin} onClick={() => setActivePost(post)} onEdit={() => { if (!isAdmin) return; setPostToEdit(post); setIsEditorOpen(true); }} onDelete={() => handleDeletePost(post.id)} /></motion.div>)}</div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 px-6 text-center max-w-md mx-auto space-y-6"><FileText className="h-12 w-12 text-neutral-300 stroke-[1.5]" /><div><h3 className="font-sans text-lg font-extrabold text-neutral-800">No entries match your view</h3><p className="text-xs text-neutral-500 font-sans mt-2 leading-relaxed">We couldn&apos;t find any articles matching this query. You can clear filters to view all.</p></div><div className="flex items-center space-x-3 pt-2"><button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }} className="px-5 py-2.5 bg-white border-2 border-neutral-900 shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] text-[10px] font-bold uppercase tracking-wider">Clear View</button>{isAdmin && <button onClick={() => setIsEditorOpen(true)} className="px-5 py-2.5 bg-[#BADFDB] border-2 border-neutral-900 shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] text-[10px] font-bold uppercase tracking-wider">Write Essay</button>}</div></div>
              )}
            </main>
          </motion.div>
        ) : <motion.main key="reader-view" className="flex-1"><PostReader post={activePost} onBack={() => setActivePost(null)} /></motion.main>}
      </AnimatePresence>
      <AnimatePresence>{isAdmin && isEditorOpen && <PostEditor postToEdit={postToEdit} onSave={handleSavePost} onClose={() => { setIsEditorOpen(false); setPostToEdit(null); }} />}</AnimatePresence>
      <AnimatePresence>{isAdmin && isProfileModalOpen && <ProfileModal currentProfile={profile} onSave={handleSaveProfile} onClose={() => setIsProfileModalOpen(false)} />}</AnimatePresence>
      <footer className="w-full py-12 mt-auto border-t-2 border-dashed border-neutral-900/10 bg-[#FCF9EA]"><div className="mx-auto max-w-5xl px-6 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-sans uppercase tracking-[0.15em] text-neutral-400"><span>&copy; 2026 {profile.name}. All rights reserved.</span><div className="flex items-center space-x-4"><span>Archived Locally</span>{isAdmin && <><span className="h-1 w-1 bg-neutral-300 rounded-full"></span><button onClick={handleResetDefaults} className="hover:text-neutral-900 underline">Factory Reset</button></>}</div></div></footer>
    </div>
  );
}
