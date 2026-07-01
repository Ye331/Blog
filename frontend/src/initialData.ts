/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BlogPost, UserProfile } from './types';

export const DEFAULT_AVATAR = "/avatar.jpg";

export const DEFAULT_PROFILE: UserProfile = {
  name: "Alex Chen",
  title: "Frontend Architect & Interaction Designer",
  bio: "Writing about the intersection of elegant code, thoughtful design, and digital mindfulness. Building products that respect human attention.",
  avatar: DEFAULT_AVATAR,
  github: "https://github.com",
  twitter: "https://twitter.com",
  email: "alex@example.com"
};

export const INITIAL_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "Designing with Intent: Beyond the Tailwind Defaults",
    excerpt: "Why the difference between generic generated interfaces and handcrafted digital spaces lies in typography, spacing rhythm, and strict visual discipline.",
    category: "Design",
    date: "Jun 28, 2026",
    readTime: "5 min read",
    coverImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    content: `# Designing with Intent: Beyond the Tailwind Defaults

In the modern web ecosystem, standardizing visual components has never been easier. Libraries like **Tailwind CSS** offer a frictionless path to responsive, consistent layouts. Yet, this ease has brought an unintended side effect: the **homogenization of the web**. 

When every website uses the exact same colors, border radii, and font pairings, digital spaces begin to feel like cookie-cutter templates. 

True visual craftsmanship is not about avoiding utility classes; it is about using them with **deliberate artistic intent**.

---

## 1. The Power of Custom Typography Pairings

Typography is the single most important element of any user interface. By default, Tailwind ships with a highly optimized sans-serif stack. It is clean and legible, but it carries no unique brand identity.

To create an editorial or premium feel, we should combine contrasting families:
* **Display Headings**: A character-rich serif or geometric sans-serif (e.g., *Playfair Display* or *Space Grotesk*) to draw attention and set the tone.
* **Body Copy**: A highly readable, comfortable neutral sans-serif (e.g., *Inter* or *Merriweather* if going full serif) with balanced line spacing.

\`\`\`css
/* Example custom theme definition */
@theme {
  --font-serif: "Playfair Display", Georgia, serif;
  --font-sans: "Inter", sans-serif;
}
\`\`\`

## 2. Spacing Rhythm & Visual Pacing

Identical padding everywhere looks mechanical. A handcrafted layout uses **generous negative space** to guide the reader’s eye. 

Instead of default \`p-4\` grids on everything, vary the density:
* Give your hero sections room to breathe (\`py-24\` or \`py-32\`).
* Keep cards compact and dense to imply structured data.
* Ensure your body text is constrained to a readable width (maximum \`max-w-2xl\` or \`prose\`) so the reader's eyes do not have to travel too far horizontally.

> "Whitespace is not empty space; it is the space that lets your content sing."

## 3. Creating Subtle Depth & Interaction

Modern visual design is moving away from flat screens toward **tactile layers**. We can achieve this by using subtle borders, ambient backdrop filters, and micro-interactions:
* **Borders over Shadows**: Instead of harsh, heavy box-shadows, use thin, semi-transparent borders (\`border border-neutral-100 dark:border-neutral-800\`).
* **Micro-Animations**: Apply light scale or lift effects to interactive cards on hover.

\`\`\`tsx
<div className="transition-all duration-300 hover:-translate-y-1 hover:border-neutral-300">
  {/* Card Content */}
</div>
\`\`\`

By elevating these tiny details, we transform a simple web application into a polished digital journal that users love interacting with.`
  },
  {
    id: "2",
    title: "The Slow Web: Reclaiming Focus in an Era of Infinite Streams",
    excerpt: "An exploration of self-hosted, independent digital spaces and why building personal websites is an act of creative rebellion.",
    category: "Philosophy",
    date: "Jun 15, 2026",
    readTime: "7 min read",
    coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    content: `# The Slow Web: Reclaiming Focus in an Era of Infinite Streams

We live in an era of **hyper-connectivity**. Modern social platforms are engineered to maximize session times through infinite scroll feeds, real-time telemetry, and algorithmic notifications.

While these feeds connect us instantly, they also fragment our focus and dilute our thoughts.

Entering **The Slow Web**—a philosophy that advocates for intentional consumption, asynchronous writing, and static, independent web spaces.

---

## What is a "Slow" Website?

A slow website does not load slowly (in fact, it should be blazing fast). Rather, it encourages **slow reading** and **deep focus**. 

1. **No Algorithmic Interference**: Content is presented in simple, chronological, or curated order. The reader is in full control of their exploration.
2. **Minimalist Architecture**: There are no flashing notification badges, ticking telemetry bars, or persistent overlays.
3. **High Contrast & Warm Aesthetics**: The styling mimics beautiful print paper, prioritizing physical comfort over bright, sensory-overloading layouts.

## Why We Still Build Personal Blogs

In the early days of the web, personal blogs were the standard format of expression. They were digital living rooms—custom-crafted spaces with personal charm. 

Reclaiming your own space on the web is an act of **creative rebellion**. When you write on a platform you own:
* You are not constrained by character counts.
* Your thoughts are not surrounded by distracting ads.
* You control the mood, typography, and pacing.

## How to Practice Digital Mindfulness

If you are a builder, designer, or reader, consider adopting these micro-habits:
* **Subscribe to RSS**: Curate your reading list through RSS readers instead of social media dashboards.
* **Publish in Long Form**: Instead of tweeting a short fragment of an idea, let it mature into a 500-word essay.
* **Remove Real-Time Logs**: Your personal space does not need active hit counters, online indicators, or diagnostic widgets. Keep your interface quiet.

By crafting clean, focused personal spaces like this very blog, we contribute to a calmer, more thoughtful digital ecosystem.`
  },
  {
    id: "3",
    title: "The Art of Writing Clean React in 2026",
    excerpt: "Modern best practices for building scalable React components, avoiding hook pitfalls, and keeping rendering performant.",
    category: "Technology",
    date: "May 29, 2026",
    readTime: "4 min read",
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    content: `# The Art of Writing Clean React in 2026

React has evolved significantly over the past decade. With React 19 and Vite now serving as the baseline for modern application development, our patterns have become more declarative and streamlined.

However, writing *clean* and *scalable* React code still requires a strong understanding of state management, component modularity, and rendering lifecycles.

Here is a quick guide to keeping your React codebase elegant and performant.

---

## 1. Keep Your Components Highly Modular

One of the most common pitfalls of rapid web prototyping is stuffing all UI logic, data structures, and views into a single \`App.tsx\` file. This leads to code blocks that are difficult to debug, prone to merge conflicts, and exceed generation tokens.

Instead, enforce a clear separation of concerns:
* **\`types.ts\`**: Define shared models, interfaces, and options first.
* **\`components/\`**: Break down layout structures into independent files (e.g., \`Header.tsx\`, \`CardGrid.tsx\`).
* **\`hooks/\`**: Move complex state machines or data-fetching logic into custom hooks.

## 2. Master the Dependency Array in \`useEffect\`

Incorrect usage of \`useEffect\` is the #1 cause of performance degradation and infinite re-render loops in React.

* **Rule**: Avoid updating local state directly inside a \`useEffect\` block if that state update triggers the effect again.
* **Tip**: Never include complex non-primitive variables (like raw arrays, object literals, or un-memoized functions) directly in the dependency array. Keep dependencies restricted to primitives (strings, numbers, booleans) or stabilized values.

\`\`\`tsx
// ❌ Dangerous: Array literal recreated on every render
useEffect(() => {
  fetchData(tags);
}, [tags]); // If tags is ['react', 'vite'], this re-runs endlessly!

//  Safe: Stabilized or primitive values
const tagsString = tags.join(',');
useEffect(() => {
  fetchData(tagsString.split(','));
}, [tagsString]);
`
  }
];
