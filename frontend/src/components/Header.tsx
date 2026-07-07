import { Search } from 'lucide-react';
import { BlogPost, UserProfile } from '../types';

interface HeaderProps {
  profile: UserProfile;
  posts: BlogPost[];
  isAdmin: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  onNewPostClick: () => void;
  onEditProfileClick: () => void;
  onLogoutClick: () => void;
}

export default function Header({
  profile,
  posts,
  isAdmin,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onNewPostClick,
  onEditProfileClick,
  onLogoutClick,
}: HeaderProps) {
  const categories = ['All', ...Array.from(new Set(posts.map((post) => post.category)))];
  const totalReadTime = posts.reduce((acc, post) => acc + (parseInt(post.readTime) || 5), 0);

  return (
    <header className="w-full bg-[#FCF9EA] text-neutral-900">
      <div className="mx-auto max-w-5xl px-6 py-6 md:py-8 flex items-center justify-between">
        <span className="font-sans text-2xl md:text-3xl font-extrabold tracking-tighter text-neutral-900" id="header-brand-text">
          yeyeyang<span className="text-[#FFA4A4]">.</span><span className="text-[#BADFDB]">cn</span>
        </span>

        {isAdmin && (
          <div className="flex items-center space-x-4">
            <button onClick={onEditProfileClick} className="px-4 py-2 bg-white hover:bg-neutral-50 border-2 border-neutral-900 shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] text-[11px] uppercase tracking-wider font-bold" id="btn-edit-profile">
              Bio
            </button>
            <button onClick={onNewPostClick} className="px-5 py-2.5 bg-[#FFA4A4] hover:bg-[#ff8f8f] border-2 border-neutral-900 shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] text-[11px] uppercase tracking-wider font-bold" id="btn-new-post">
              New Essay
            </button>
            <button onClick={onLogoutClick} className="px-4 py-2 bg-white hover:bg-neutral-50 border-2 border-neutral-900 text-[11px] uppercase tracking-wider font-bold" id="btn-admin-logout">
              Logout
            </button>
          </div>
        )}
      </div>

      <div className="mx-auto max-w-5xl px-6 py-10 md:py-16 grid grid-cols-1 md:grid-cols-4 gap-12 items-center">
        <div className="md:col-span-1 flex justify-center md:justify-start">
          <img src={profile.avatar} alt={profile.name} referrerPolicy="no-referrer" className="h-28 w-28 md:h-36 md:w-36 rounded-full object-cover border-4 border-neutral-900 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]" id="author-avatar" />
        </div>

        <div className="md:col-span-3 text-center md:text-left space-y-4">
          <div>
            <h1 className="font-sans text-4xl md:text-6xl font-extrabold tracking-tight leading-tight" id="author-name">
              {profile.name}
            </h1>
            <div className="inline-flex mt-2 px-3 py-1 bg-white border-2 border-neutral-900 rounded-full text-[10px] font-mono uppercase tracking-wider text-neutral-700">
              {profile.title}
            </div>
          </div>
          <p className="text-base md:text-xl font-medium text-neutral-800 leading-relaxed max-w-2xl font-serif italic" id="author-bio">
            &ldquo;{profile.bio}&rdquo;
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-2">
            <div className="flex items-center space-x-3">
              {profile.github && <a href={profile.github} target="_blank" rel="noreferrer" className="px-3 py-1 bg-[#BADFDB] hover:bg-[#a6d5d1] border-2 border-neutral-900 text-[10px] uppercase font-bold tracking-wider">Github</a>}
              {profile.twitter && <a href={profile.twitter} target="_blank" rel="noreferrer" className="px-3 py-1 bg-[#FFBDBD] hover:bg-[#ffa6a6] border-2 border-neutral-900 text-[10px] uppercase font-bold tracking-wider">Twitter</a>}
              {profile.email && <a href={`mailto:${profile.email}`} className="px-3 py-1 bg-white hover:bg-neutral-100 border-2 border-neutral-900 text-[10px] uppercase font-bold tracking-wider">Contact</a>}
            </div>
            <div className="hidden sm:flex items-center space-x-4 text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
              <span><strong className="text-neutral-900">{posts.length}</strong> essays</span>
              <span><strong className="text-neutral-900">{totalReadTime}m</strong> focus reading</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#FCF9EA] pb-6">
        <div className="mx-auto max-w-5xl px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center space-x-3 overflow-x-auto no-scrollbar py-2" id="categories-container">
            {categories.map((category, index) => {
              const isActive = selectedCategory === category;
              const colors = ['#BADFDB', '#FFA4A4', '#FFBDBD'];
              return (
                <button key={category} onClick={() => setSelectedCategory(category)} style={{ backgroundColor: isActive ? colors[index % colors.length] : 'transparent' }} className={`px-4 py-1.5 text-[11px] uppercase tracking-wider font-bold rounded-full transition-all border-2 shrink-0 ${isActive ? 'border-neutral-900 shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]' : 'border-transparent text-neutral-500 hover:text-neutral-900 hover:bg-white/40'}`}>
                  {category}
                </button>
              );
            })}
          </div>
          <div className="relative max-w-md w-full md:w-64 bg-white border-2 border-neutral-900 shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] py-1.5 px-3" id="search-input-wrapper">
            <input type="text" placeholder="Search Essays..." value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} className="w-full bg-transparent text-xs font-bold text-neutral-900 placeholder-neutral-400 focus:outline-none" id="search-input" />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-900 pointer-events-none stroke-[2.5]" />
          </div>
        </div>
      </div>
    </header>
  );
}
