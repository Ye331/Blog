import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileModalProps {
  currentProfile: UserProfile;
  onSave: (profile: UserProfile) => void;
  onClose: () => void;
}

export default function ProfileModal({ currentProfile, onSave, onClose }: ProfileModalProps) {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [github, setGithub] = useState('');
  const [twitter, setTwitter] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    setName(currentProfile.name);
    setTitle(currentProfile.title);
    setBio(currentProfile.bio);
    setAvatar(currentProfile.avatar);
    setGithub(currentProfile.github || '');
    setTwitter(currentProfile.twitter || '');
    setEmail(currentProfile.email || '');
  }, [currentProfile]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    onSave({ name, title, bio, avatar, github: github || undefined, twitter: twitter || undefined, email: email || undefined });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/45 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FCF9EA] border-4 border-neutral-900 rounded-[24px] w-full max-w-lg shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] overflow-hidden">
        <div className="px-6 py-5 border-b-2 border-neutral-900 flex items-center justify-between bg-white">
          <div>
            <h2 className="text-sm font-sans font-extrabold uppercase tracking-widest">Customize Profile</h2>
            <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mt-0.5">Personalize your author biography</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900" id="btn-close-profile-modal">
            <X className="h-5 w-5 stroke-[2.5]" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-[#FCF9EA]">
          <div className="grid grid-cols-2 gap-4">
            <label className="space-y-1.5">
              <span className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold block">Author Name</span>
              <input required value={name} onChange={(event) => setName(event.target.value)} className="w-full px-3 py-2 text-xs bg-white border-2 border-neutral-900 rounded-[12px]" />
            </label>
            <label className="space-y-1.5">
              <span className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold block">Professional Title</span>
              <input value={title} onChange={(event) => setTitle(event.target.value)} className="w-full px-3 py-2 text-xs bg-white border-2 border-neutral-900 rounded-[12px]" />
            </label>
          </div>
          <div className="space-y-2.5">
            <label className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold block">Avatar Image URL</label>
            <div className="flex items-center space-x-3">
              {avatar && <img src={avatar} alt="Avatar preview" className="w-12 h-12 rounded-full object-cover border-2 border-neutral-900" />}
              <input value={avatar} onChange={(event) => setAvatar(event.target.value)} className="flex-1 px-3 py-2 text-xs bg-white border-2 border-neutral-900 rounded-[12px] font-mono" />
            </div>
          </div>
          <label className="space-y-1.5 block">
            <span className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold block">Author Biography</span>
            <textarea rows={3} value={bio} onChange={(event) => setBio(event.target.value)} className="w-full px-3 py-2 text-xs bg-white border-2 border-neutral-900 rounded-[12px] font-serif leading-relaxed" />
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t-2 border-neutral-900/10">
            <input placeholder="Github URL" value={github} onChange={(event) => setGithub(event.target.value)} className="w-full px-2.5 py-1.5 text-[10px] bg-white border-2 border-neutral-900 rounded-[12px] font-mono" />
            <input placeholder="Twitter URL" value={twitter} onChange={(event) => setTwitter(event.target.value)} className="w-full px-2.5 py-1.5 text-[10px] bg-white border-2 border-neutral-900 rounded-[12px] font-mono" />
            <input type="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full px-2.5 py-1.5 text-[10px] bg-white border-2 border-neutral-900 rounded-[12px] font-mono" />
          </div>
          <div className="pt-4 flex justify-end space-x-2 border-t-2 border-neutral-900/10">
            <button type="button" onClick={onClose} className="px-4 py-2 text-[11px] uppercase tracking-wider font-bold text-neutral-500 hover:text-neutral-900">Cancel</button>
            <button type="submit" className="px-6 py-2.5 bg-[#BADFDB] hover:bg-[#a6d5d1] border-2 border-neutral-900 text-[11px] uppercase tracking-wider font-bold shadow-[3px_3px_0px_0px_rgba(17,17,17,1)]">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}
