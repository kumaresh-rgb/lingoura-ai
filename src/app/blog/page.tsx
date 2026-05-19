'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Search, Sun, Moon, ArrowRight, Clock, TrendingUp, Flame,
  Tag, ChevronRight, BookOpen, Star, Users, Zap, Filter, X
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: { name: string; avatar: string; role: string };
  date: string;
  readTime: number;
  views: number;
  featured: boolean;
  trending: boolean;
  image: string;
  imageColor: string;
}

// ─── Static Data ─────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: 'all', label: 'All Posts', icon: <BookOpen size={13} /> },
  { id: 'IELTS', label: 'IELTS', icon: <Star size={13} /> },
  { id: 'Speaking', label: 'Speaking', icon: <Users size={13} /> },
  { id: 'Writing', label: 'Writing', icon: <Filter size={13} /> },
  { id: 'Listening', label: 'Listening', icon: <TrendingUp size={13} /> },
  { id: 'Reading', label: 'Reading', icon: <BookOpen size={13} /> },
  { id: 'Vocabulary', label: 'Vocabulary', icon: <Tag size={13} /> },
  { id: 'Career English', label: 'Career English', icon: <Zap size={13} /> },
  { id: 'AI Learning', label: 'AI Learning', icon: <Flame size={13} /> },
  { id: 'Productivity', label: 'Productivity', icon: <TrendingUp size={13} /> },
];

const POSTS: Post[] = [
  {
    slug: 'ielts-band-9-speaking-strategies',
    title: 'How to Score Band 9 in IELTS Speaking: The Definitive 2026 Guide',
    excerpt: 'Unlock the examiner-level secrets behind Band 9 scores. This comprehensive guide breaks down fluency, coherence, lexical resource, and grammatical accuracy with real examples and AI-backed drills.',
    category: 'IELTS',
    tags: ['Band 9', 'Speaking', 'Strategy'],
    author: { name: 'Dr. Priya Nair', avatar: 'PN', role: 'IELTS Examiner' },
    date: 'May 14, 2026',
    readTime: 12,
    views: 28400,
    featured: true,
    trending: true,
    image: 'speaking',
    imageColor: 'from-violet-600 to-indigo-600',
  },
  {
    slug: 'ai-writing-feedback-vs-human',
    title: 'AI Writing Feedback vs Human Tutors: Which Is More Accurate for IELTS?',
    excerpt: 'We ran a 6-month study comparing AI-generated writing evaluations with certified IELTS examiners. The results were surprising — and tell us exactly where AI excels and where it falls short.',
    category: 'AI Learning',
    tags: ['AI', 'Writing', 'Research'],
    author: { name: 'Arjun Mehta', avatar: 'AM', role: 'Research Lead' },
    date: 'May 11, 2026',
    readTime: 9,
    views: 19200,
    featured: true,
    trending: true,
    image: 'ai',
    imageColor: 'from-pink-600 to-rose-600',
  },
  {
    slug: 'ielts-writing-task-2-coherence',
    title: 'Coherence & Cohesion: The Hidden Key to Writing Band 8+',
    excerpt: 'Most IELTS candidates focus on grammar and vocabulary but ignore cohesion — the invisible glue that holds arguments together. Here is how to master transitional phrases, pronoun reference, and paragraph unity.',
    category: 'Writing',
    tags: ['Band 8', 'Coherence', 'Essays'],
    author: { name: 'Sophie Chen', avatar: 'SC', role: 'Writing Coach' },
    date: 'May 9, 2026',
    readTime: 8,
    views: 15700,
    featured: false,
    trending: true,
    image: 'writing',
    imageColor: 'from-emerald-600 to-teal-600',
  },
  {
    slug: 'vocabulary-for-academic-ielts',
    title: '500 Academic Vocabulary Words That Examiners Love (With Contextual Examples)',
    excerpt: 'A curated list of high-frequency academic vocabulary grouped by topic, with natural sentence examples, collocations, and Band-level usage tips for Speaking and Writing.',
    category: 'Vocabulary',
    tags: ['Academic', 'Word List', 'Writing', 'Speaking'],
    author: { name: 'Lena Kovač', avatar: 'LK', role: 'Linguistics Expert' },
    date: 'May 7, 2026',
    readTime: 18,
    views: 34100,
    featured: true,
    trending: false,
    image: 'vocab',
    imageColor: 'from-amber-500 to-orange-600',
  },
  {
    slug: 'ielts-listening-section-4-tips',
    title: 'IELTS Listening Section 4 Mastery: Advanced Note-Taking Strategies',
    excerpt: "Section 4 is the hardest — a monologue with no break. We reveal the predictive listening framework that top scorers use to anticipate answers before they're spoken.",
    category: 'Listening',
    tags: ['Section 4', 'Note-taking', 'Advanced'],
    author: { name: 'James Osei', avatar: 'JO', role: 'Test Prep Specialist' },
    date: 'May 5, 2026',
    readTime: 10,
    views: 11300,
    featured: false,
    trending: false,
    image: 'listening',
    imageColor: 'from-cyan-600 to-blue-600',
  },
  {
    slug: 'skimming-scanning-reading-ielts',
    title: 'Speed Reading for IELTS: Skimming & Scanning Techniques That Work',
    excerpt: 'Complete the Reading module in 50 minutes instead of 60 with these battle-tested techniques. Includes practice exercises, speed drills, and timing benchmarks by question type.',
    category: 'Reading',
    tags: ['Speed Reading', 'Time Management', 'Technique'],
    author: { name: 'Fatima Al-Rashid', avatar: 'FA', role: 'Academic Coach' },
    date: 'May 3, 2026',
    readTime: 11,
    views: 9800,
    featured: false,
    trending: false,
    image: 'reading',
    imageColor: 'from-blue-600 to-indigo-700',
  },
  {
    slug: 'english-for-job-interviews',
    title: 'Professional English for Job Interviews: From HR Screening to Panel Round',
    excerpt: 'Master the STAR method, behavioural questions, and C-suite vocabulary. Includes 50 sample Q&A pairs, salary negotiation scripts, and common mistakes non-native speakers make.',
    category: 'Career English',
    tags: ['Interview', 'Professional', 'HR'],
    author: { name: 'Marcus Weber', avatar: 'MW', role: 'Career Coach' },
    date: 'Apr 30, 2026',
    readTime: 14,
    views: 22600,
    featured: false,
    trending: true,
    image: 'career',
    imageColor: 'from-slate-700 to-slate-900',
  },
  {
    slug: 'spaced-repetition-vocabulary',
    title: 'Why Spaced Repetition is the Only Vocabulary Method You Need',
    excerpt: 'Forget rote memorisation. The Ebbinghaus forgetting curve explains why you lose 70% of new words within 24 hours — and spaced repetition is the scientifically proven antidote.',
    category: 'Productivity',
    tags: ['Spaced Repetition', 'Memory', 'Science'],
    author: { name: 'Dr. Yuki Tanaka', avatar: 'YT', role: 'Cognitive Scientist' },
    date: 'Apr 28, 2026',
    readTime: 7,
    views: 16900,
    featured: false,
    trending: false,
    image: 'productivity',
    imageColor: 'from-purple-600 to-violet-700',
  },
  {
    slug: 'ielts-speaking-part-2-structures',
    title: '12 Fail-Safe Structures for IELTS Speaking Part 2 Cue Cards',
    excerpt: 'Never run out of things to say in Part 2 again. These 12 flexible frameworks expand any cue card topic into a fluent 2-minute response using the PEEL, DESCRIBE+REFLECT, and NARRATIVE arc methods.',
    category: 'Speaking',
    tags: ['Part 2', 'Cue Card', 'Fluency'],
    author: { name: 'Amara Diallo', avatar: 'AD', role: 'Speaking Coach' },
    date: 'Apr 25, 2026',
    readTime: 9,
    views: 13400,
    featured: false,
    trending: false,
    image: 'speaking',
    imageColor: 'from-violet-600 to-indigo-600',
  },
  {
    slug: 'lingoura-ai-vs-chatgpt-ielts',
    title: 'Lingoura AI vs ChatGPT for IELTS Prep: An Honest 30-Day Comparison',
    excerpt: 'We used both tools daily for a month across all four IELTS skills. Here is the full breakdown: where each tool shines, where it fails, and which one produces measurable score gains.',
    category: 'AI Learning',
    tags: ['AI', 'Comparison', 'IELTS', 'Review'],
    author: { name: 'Arjun Mehta', avatar: 'AM', role: 'Research Lead' },
    date: 'Apr 22, 2026',
    readTime: 13,
    views: 41200,
    featured: false,
    trending: true,
    image: 'ai',
    imageColor: 'from-pink-600 to-rose-600',
  },
  {
    slug: 'english-email-writing-professional',
    title: 'Business Email English: 40 Templates for Every Professional Scenario',
    excerpt: 'From cold outreach to executive escalations, these 40 email templates are ready to use with native-sounding phrasing, subject line formulas, and cultural nuance tips.',
    category: 'Career English',
    tags: ['Email', 'Business', 'Templates'],
    author: { name: 'Sophie Chen', avatar: 'SC', role: 'Writing Coach' },
    date: 'Apr 19, 2026',
    readTime: 16,
    views: 8700,
    featured: false,
    trending: false,
    image: 'career',
    imageColor: 'from-slate-700 to-slate-900',
  },
  {
    slug: 'ielts-reading-true-false-not-given',
    title: 'True / False / Not Given: Why 40% of Candidates Lose Points Here',
    excerpt: 'This question type has a hidden logic trap. We analyse 120 real IELTS questions to extract the exact linguistic patterns that distinguish "False" from "Not Given" — with a decision flowchart.',
    category: 'Reading',
    tags: ['True/False', 'Strategy', 'Common Mistakes'],
    author: { name: 'Fatima Al-Rashid', avatar: 'FA', role: 'Academic Coach' },
    date: 'Apr 16, 2026',
    readTime: 10,
    views: 24500,
    featured: false,
    trending: false,
    image: 'reading',
    imageColor: 'from-blue-600 to-indigo-700',
  },
];

const TRENDING_TAGS = [
  'Band 9', 'AI', 'Speaking', 'Writing', 'IELTS 2026',
  'Vocabulary', 'Fluency', 'Strategy', 'Research', 'Mock Test',
];

// ─── Animation Helpers ────────────────────────────────────────────────────────

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Image Placeholder ────────────────────────────────────────────────────────

const IMAGE_LABELS: Record<string, string> = {
  speaking: 'Speaking', ai: 'AI', writing: 'Writing', vocab: 'Vocabulary',
  listening: 'Listening', reading: 'Reading', career: 'Career', productivity: 'Productivity',
};

function PostImage({ image, colorClass, size = 'full' }: { image: string; colorClass: string; size?: 'full' | 'thumb' }) {
  const label = IMAGE_LABELS[image] ?? 'Article';
  return (
    <div className={`bg-gradient-to-br ${colorClass} flex items-center justify-center ${size === 'full' ? 'h-52' : 'h-32 w-32 rounded-xl shrink-0'}`}>
      <span style={{ fontSize: size === 'full' ? 13 : 11, fontWeight: 800, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{label}</span>
    </div>
  );
}

// ─── Post Cards ───────────────────────────────────────────────────────────────

function FeaturedCard({ post, isDark }: { post: Post; isDark: boolean }) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group rounded-3xl overflow-hidden border"
      style={{
        background: isDark ? 'rgba(255,255,255,0.03)' : '#fff',
        borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)',
        boxShadow: isDark ? 'none' : '0 4px 24px rgba(0,0,0,0.06)',
      }}
    >
      <div className="relative overflow-hidden">
        <PostImage image={post.image} colorClass={post.imageColor} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {post.trending && (
          <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white"
            style={{ background: 'rgba(239,68,68,0.9)', backdropFilter: 'blur(8px)' }}>
            <Flame size={11} /> Trending
          </div>
        )}
        <span className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold"
          style={{ background: 'rgba(99,102,241,0.9)', color: '#fff', backdropFilter: 'blur(8px)' }}>
          {post.category}
        </span>
      </div>
      <div className="p-6">
        <h2 className="text-lg font-bold leading-snug mb-2 group-hover:text-indigo-500 transition-colors"
          style={{ color: isDark ? '#f9fafb' : '#111' }}>
          {post.title}
        </h2>
        <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
              {post.author.avatar}
            </div>
            <div>
              <p className="text-xs font-semibold" style={{ color: isDark ? '#e5e7eb' : '#374151' }}>{post.author.name}</p>
              <p className="text-[10px]" style={{ color: isDark ? '#6b7280' : '#9ca3af' }}>{post.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs" style={{ color: isDark ? '#6b7280' : '#9ca3af' }}>
            <span className="flex items-center gap-1"><Clock size={11} /> {post.readTime}m</span>
            <span className="flex items-center gap-1"><Users size={11} /> {(post.views / 1000).toFixed(1)}k</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function ListCard({ post, isDark }: { post: Post; isDark: boolean }) {
  return (
    <motion.article
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2 }}
      className="group flex gap-4 p-4 rounded-2xl border transition-colors"
      style={{
        background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
        borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
      }}
    >
      <PostImage image={post.image} colorClass={post.imageColor} size="thumb" />
      <div className="flex flex-col justify-center min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: isDark ? 'rgba(99,102,241,0.15)' : '#eef2ff', color: isDark ? '#818cf8' : '#4f46e5' }}>
            {post.category}
          </span>
          {post.trending && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
              style={{ background: isDark ? 'rgba(239,68,68,0.12)' : '#fef2f2', color: isDark ? '#f87171' : '#dc2626' }}>
              <Flame size={9} /> Trending
            </span>
          )}
        </div>
        <h3 className="text-sm font-bold leading-snug mb-1 group-hover:text-indigo-500 transition-colors line-clamp-2"
          style={{ color: isDark ? '#f9fafb' : '#111' }}>
          {post.title}
        </h3>
        <div className="flex items-center gap-3 text-xs" style={{ color: isDark ? '#6b7280' : '#9ca3af' }}>
          <span>{post.author.name}</span>
          <span>·</span>
          <span className="flex items-center gap-1"><Clock size={10} /> {post.readTime}m read</span>
          <span>·</span>
          <span>{post.date}</span>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BlogPage() {
  const [isDark, setIsDark] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('landing-theme');
    if (saved === 'dark') setIsDark(true);
  }, []);

  useEffect(() => {
    if (showSearch) searchRef.current?.focus();
  }, [showSearch]);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem('landing-theme', next ? 'dark' : 'light');
  };

  const filteredPosts = useMemo(() => {
    return POSTS.filter((p) => {
      const matchCat = activeCategory === 'all' || p.category === activeCategory;
      const matchTag = !activeTag || p.tags.includes(activeTag);
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      return matchCat && matchTag && matchSearch;
    });
  }, [activeCategory, searchQuery, activeTag]);

  const featuredPosts = filteredPosts.filter((p) => p.featured).slice(0, 3);
  const trendingPosts = POSTS.filter((p) => p.trending).slice(0, 5);
  const remainingPosts = filteredPosts.filter((p) => !featuredPosts.includes(p));

  const bg = isDark ? '#0B0E14' : '#FAFBFF';
  const ink = isDark ? '#F9FAFB' : '#111111';
  const muted = isDark ? '#9CA3AF' : '#6B7280';
  const cardBg = isDark ? 'rgba(255,255,255,0.03)' : '#fff';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)';
  const navBg = isDark ? 'rgba(11,14,20,0.85)' : 'rgba(255,255,255,0.8)';
  const inputBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';

  return (
    <div style={{ minHeight: '100vh', background: bg, color: ink, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", WebkitFontSmoothing: 'antialiased' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .cat-btn { transition: all 0.2s; white-space: nowrap; }
        .cat-btn:hover { transform: translateY(-1px); }
        .scrollbar-hide { scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .hero-gradient {
          background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.15) 0%, transparent 70%);
        }
        .blog-layout { display: grid; grid-template-columns: 1fr 300px; gap: 48px; align-items: start; }
        .blog-sidebar { display: flex; flex-direction: column; gap: 28px; position: sticky; top: 148px; }
        @media (max-width: 900px) {
          .blog-layout { grid-template-columns: 1fr !important; gap: 32px; }
          .blog-sidebar { display: none !important; }
          .blog-nav-pill { width: calc(100% - 32px) !important; max-width: 600px; }
          .blog-hero { padding-top: 96px !important; padding-left: 20px !important; padding-right: 20px !important; }
        }
      `}</style>

      {/* ── Navbar ── */}
      <nav className="blog-nav-pill" style={{
        position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)', maxWidth: 1200, zIndex: 1000,
        height: 60, display: 'flex', alignItems: 'center', padding: '0 20px',
        background: navBg, backdropFilter: 'blur(24px) saturate(180%)',
        border: `1px solid ${border}`, borderRadius: 20,
        boxShadow: isDark ? 'none' : '0 8px 32px rgba(0,0,0,0.06)',
      }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <img src="/logo-icon.png" alt="Lingoura AI" style={{ height: 34, width: 'auto', objectFit: 'contain' }} />
            <span style={{ fontSize: 17, fontWeight: 900, letterSpacing: '-0.025em' }}>
              <span style={{ color: '#7c3aed' }}>Lingoura</span>
              <span style={{ background: 'linear-gradient(to right, #7c3aed, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}> AI</span>
            </span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <AnimatePresence>
              {showSearch && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 220, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ overflow: 'hidden' }}
                >
                  <input
                    ref={searchRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles..."
                    style={{
                      width: '100%', padding: '8px 14px', borderRadius: 10,
                      background: inputBg, border: `1px solid ${border}`,
                      color: ink, fontSize: 13, fontWeight: 500, outline: 'none',
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={() => { setShowSearch(!showSearch); if (showSearch) setSearchQuery(''); }}
              style={{ padding: '9px', borderRadius: 10, background: inputBg, border: `1px solid ${border}`, cursor: 'pointer', display: 'flex', alignItems: 'center', color: muted }}
            >
              {showSearch ? <X size={16} /> : <Search size={16} />}
            </button>

            <button
              onClick={toggleTheme}
              style={{ padding: '9px', borderRadius: 10, background: inputBg, border: `1px solid ${border}`, cursor: 'pointer', display: 'flex', alignItems: 'center', color: muted }}
            >
              {isDark ? <Sun size={16} style={{ color: '#facc15' }} /> : <Moon size={16} />}
            </button>

            <Link href="/" style={{ fontSize: 13, fontWeight: 700, color: muted, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              ← Home
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div className="hero-gradient blog-hero" style={{ paddingTop: 112, paddingBottom: 56, textAlign: 'center' }}>
        <FadeIn>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 9999, background: isDark ? 'rgba(99,102,241,0.12)' : '#eef2ff', border: `1px solid ${isDark ? 'rgba(99,102,241,0.25)' : '#c7d2fe'}`, marginBottom: 24 }}>
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: isDark ? '#818cf8' : '#4f46e5' }}>Lingoura Blog</span>
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 16, color: ink }}>
            Learn English,{' '}
            <span style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 50%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              score higher.
            </span>
          </h1>
          <p style={{ fontSize: 18, color: muted, maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.6 }}>
            Expert guides, AI-backed strategies, and real IELTS insights — written by examiners and top scorers.
          </p>

          {/* Search bar */}
          <div style={{ maxWidth: 520, margin: '0 auto', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', color: muted }} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 100+ articles on IELTS, Speaking, Writing..."
              style={{
                width: '100%', padding: '16px 18px 16px 50px', borderRadius: 16,
                background: isDark ? 'rgba(255,255,255,0.06)' : '#fff',
                border: `1px solid ${border}`, color: ink,
                fontSize: 15, fontWeight: 500, outline: 'none',
                boxShadow: isDark ? 'none' : '0 4px 24px rgba(0,0,0,0.08)',
                boxSizing: 'border-box',
              }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: muted }}>
                <X size={16} />
              </button>
            )}
          </div>
        </FadeIn>
      </div>

      {/* ── Category pills ── */}
      <div style={{ position: 'sticky', top: 88, zIndex: 100, background: bg, borderBottom: `1px solid ${border}`, paddingBottom: 1 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '14px 24px', overflowX: 'auto', display: 'flex', gap: 8 }} className="scrollbar-hide">
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setActiveTag(null); }}
                className="cat-btn"
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  background: active ? (isDark ? '#6366f1' : '#4f46e5') : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'),
                  color: active ? '#fff' : muted,
                  border: active ? 'none' : `1px solid ${border}`,
                }}
              >
                {cat.icon}
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="blog-layout" style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 96px' }}>

        {/* ── Main Column ── */}
        <main>
          {/* Active filters */}
          {(searchQuery || activeTag) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <Filter size={14} style={{ color: muted }} />
              <span style={{ fontSize: 13, color: muted }}>Filtered by:</span>
              {searchQuery && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 8, background: isDark ? 'rgba(99,102,241,0.15)' : '#eef2ff', color: isDark ? '#818cf8' : '#4f46e5', fontSize: 12, fontWeight: 700 }}>
                  "{searchQuery}" <X size={11} style={{ cursor: 'pointer' }} onClick={() => setSearchQuery('')} />
                </span>
              )}
              {activeTag && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 8, background: isDark ? 'rgba(99,102,241,0.15)' : '#eef2ff', color: isDark ? '#818cf8' : '#4f46e5', fontSize: 12, fontWeight: 700 }}>
                  #{activeTag} <X size={11} style={{ cursor: 'pointer' }} onClick={() => setActiveTag(null)} />
                </span>
              )}
            </div>
          )}

          {/* Featured section */}
          {featuredPosts.length > 0 && !searchQuery && !activeTag && activeCategory === 'all' && (
            <FadeIn>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: ink }}>Featured</h2>
                <span style={{ fontSize: 12, color: muted, fontWeight: 600 }}>{featuredPosts.length} articles</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20, marginBottom: 48 }}>
                {featuredPosts.map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <FeaturedCard post={post} isDark={isDark} />
                  </Link>
                ))}
              </div>
            </FadeIn>
          )}

          {/* All / filtered posts */}
          <FadeIn delay={0.1}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: ink }}>
                {activeCategory === 'all' && !searchQuery && !activeTag ? 'All Articles' : 'Results'}
              </h2>
              <span style={{ fontSize: 12, color: muted, fontWeight: 600 }}>
                {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
              </span>
            </div>

            {filteredPosts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 24px', color: muted }}>
                <Search size={36} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: ink }}>No articles found</p>
                <p style={{ fontSize: 14 }}>Try adjusting your search or filters</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {(searchQuery || activeTag || activeCategory !== 'all' ? filteredPosts : remainingPosts).map((post, i) => (
                  <motion.div
                    key={post.slug}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.4 }}
                  >
                    <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <ListCard post={post} isDark={isDark} />
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </FadeIn>
        </main>

        {/* ── Sidebar ── */}
        <aside className="blog-sidebar">

          {/* Trending posts */}
          <FadeIn delay={0.15}>
            <div style={{ padding: 24, borderRadius: 20, background: cardBg, border: `1px solid ${border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                <Flame size={16} style={{ color: '#ef4444' }} />
                <h3 style={{ fontSize: 15, fontWeight: 800, color: ink }}>Trending Now</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {trendingPosts.map((post, i) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <span style={{ fontSize: 20, fontWeight: 900, color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)', fontVariantNumeric: 'tabular-nums', lineHeight: 1.3, minWidth: 24 }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.4, color: ink, marginBottom: 4 }} className="line-clamp-2">
                          {post.title}
                        </p>
                        <span style={{ fontSize: 11, color: muted }}>{post.readTime}m · {(post.views / 1000).toFixed(1)}k views</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Trending tags */}
          <FadeIn delay={0.2}>
            <div style={{ padding: 24, borderRadius: 20, background: cardBg, border: `1px solid ${border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Tag size={14} style={{ color: isDark ? '#818cf8' : '#6366f1' }} />
                <h3 style={{ fontSize: 15, fontWeight: 800, color: ink }}>Popular Tags</h3>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {TRENDING_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                    style={{
                      padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                      background: activeTag === tag ? (isDark ? '#6366f1' : '#4f46e5') : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'),
                      color: activeTag === tag ? '#fff' : muted,
                      border: `1px solid ${activeTag === tag ? 'transparent' : border}`,
                      transition: 'all 0.2s',
                    }}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Newsletter CTA */}
          <FadeIn delay={0.25}>
            <div style={{ padding: 24, borderRadius: 20, background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(236,72,153,0.08) 100%)', border: `1px solid ${isDark ? 'rgba(99,102,241,0.25)' : '#c7d2fe'}` }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: ink, marginBottom: 6 }}>Weekly IELTS tips</h3>
              <p style={{ fontSize: 13, color: muted, lineHeight: 1.5, marginBottom: 16 }}>
                Join 8,000+ learners getting expert strategies every week.
              </p>
              <input
                placeholder="your@email.com"
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 10, marginBottom: 10,
                  background: isDark ? 'rgba(255,255,255,0.06)' : '#fff',
                  border: `1px solid ${border}`, color: ink,
                  fontSize: 13, outline: 'none', boxSizing: 'border-box',
                }}
              />
              <button style={{
                width: '100%', padding: '10px', borderRadius: 10, fontSize: 13,
                fontWeight: 800, background: '#6366f1', color: '#fff',
                border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
                Subscribe <ArrowRight size={13} />
              </button>
            </div>
          </FadeIn>

          {/* Categories list */}
          <FadeIn delay={0.3}>
            <div style={{ padding: 24, borderRadius: 20, background: cardBg, border: `1px solid ${border}` }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: ink, marginBottom: 16 }}>Browse by Category</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => {
                  const count = POSTS.filter((p) => p.category === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(activeCategory === cat.id ? 'all' : cat.id)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '9px 12px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                        background: activeCategory === cat.id ? (isDark ? 'rgba(99,102,241,0.15)' : '#eef2ff') : 'transparent',
                        color: activeCategory === cat.id ? (isDark ? '#818cf8' : '#4f46e5') : muted,
                        border: 'none', textAlign: 'left', transition: 'all 0.15s',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {cat.icon}
                        {cat.label}
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 800, opacity: 0.6 }}>{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </FadeIn>
        </aside>
      </div>

      {/* ── Footer ── */}
      <footer style={{ borderTop: `1px solid ${border}`, padding: '32px 24px', textAlign: 'center' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 12 }}>
          <img src="/logo-icon.png" alt="Lingoura AI" style={{ height: 28, objectFit: 'contain' }} />
          <span style={{ fontSize: 15, fontWeight: 900, letterSpacing: '-0.025em' }}>
            <span style={{ color: '#7c3aed' }}>Lingoura</span>
            <span style={{ background: 'linear-gradient(to right, #7c3aed, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}> AI</span>
          </span>
        </Link>
        <p style={{ fontSize: 12, color: muted, fontWeight: 600 }}>© 2026 Lingoura AI · All rights reserved</p>
      </footer>
    </div>
  );
}
