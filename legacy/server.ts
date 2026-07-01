import 'dotenv/config';
import express from 'express';
import path from 'path';
import { randomBytes, timingSafeEqual } from 'crypto';
import { DEFAULT_PROFILE, INITIAL_POSTS } from '../frontend/src/initialData.ts';
import type { BlogPost, UserProfile } from '../frontend/src/types.ts';

// Legacy only: this temporary Express API was kept as a reference while the
// project moves to a Java Spring Boot backend under ../backend.

const app = express();
const port = Number(process.env.PORT || process.env.API_PORT || 3001);
const adminUsername = process.env.ADMIN_USERNAME || 'admin';
const adminPassword = process.env.ADMIN_PASSWORD || 'admin';
const sessionCookie = 'blog_admin_session';
const sessions = new Set<string>();

let profile: UserProfile = DEFAULT_PROFILE;
let posts: BlogPost[] = INITIAL_POSTS;

app.use(express.json({ limit: '1mb' }));

function parseCookies(cookieHeader = '') {
  return Object.fromEntries(
    cookieHeader
      .split(';')
      .map((cookie) => cookie.trim())
      .filter(Boolean)
      .map((cookie) => {
        const separator = cookie.indexOf('=');
        if (separator === -1) return [cookie, ''];
        return [cookie.slice(0, separator), decodeURIComponent(cookie.slice(separator + 1))];
      })
  );
}

function safeCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function getSessionToken(req: express.Request) {
  return parseCookies(req.headers.cookie)[sessionCookie];
}

function isAdminRequest(req: express.Request) {
  const token = getSessionToken(req);
  return Boolean(token && sessions.has(token));
}

function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (!isAdminRequest(req)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  next();
}

function setSessionCookie(res: express.Response, token: string) {
  res.setHeader(
    'Set-Cookie',
    `${sessionCookie}=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=604800`
  );
}

function clearSessionCookie(res: express.Response) {
  res.setHeader('Set-Cookie', `${sessionCookie}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`);
}

app.get('/api/auth/me', (req, res) => {
  if (!isAdminRequest(req)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  res.json({ user: { role: 'admin' } });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body ?? {};

  if (
    typeof username !== 'string' ||
    typeof password !== 'string' ||
    !safeCompare(username, adminUsername) ||
    !safeCompare(password, adminPassword)
  ) {
    res.status(401).json({ error: 'Invalid username or password' });
    return;
  }

  const token = randomBytes(32).toString('hex');
  sessions.add(token);
  setSessionCookie(res, token);
  res.json({ user: { role: 'admin' } });
});

app.post('/api/auth/logout', (req, res) => {
  const token = getSessionToken(req);
  if (token) sessions.delete(token);
  clearSessionCookie(res);
  res.status(204).end();
});

app.get('/api/posts', (_req, res) => {
  res.json(posts);
});

app.get('/api/posts/:id', (req, res) => {
  const post = posts.find((item) => item.id === req.params.id);
  if (!post) {
    res.status(404).json({ error: 'Post not found' });
    return;
  }

  res.json(post);
});

app.get('/api/profile', (_req, res) => {
  res.json(profile);
});

app.post('/api/posts', requireAdmin, (req, res) => {
  const postData = req.body as Omit<BlogPost, 'id' | 'date'>;
  const post: BlogPost = {
    ...postData,
    id: Date.now().toString(),
    date: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
  };

  posts = [post, ...posts];
  res.status(201).json(post);
});

app.put('/api/posts/:id', requireAdmin, (req, res) => {
  const index = posts.findIndex((item) => item.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Post not found' });
    return;
  }

  const updatedPost: BlogPost = {
    ...posts[index],
    ...req.body,
    id: posts[index].id,
    date: posts[index].date,
  };

  posts = posts.map((item) => (item.id === updatedPost.id ? updatedPost : item));
  res.json(updatedPost);
});

app.delete('/api/posts/:id', requireAdmin, (req, res) => {
  posts = posts.filter((item) => item.id !== req.params.id);
  res.status(204).end();
});

app.put('/api/profile', requireAdmin, (req, res) => {
  profile = req.body as UserProfile;
  res.json(profile);
});

app.post('/api/reset-demo-data', requireAdmin, (_req, res) => {
  profile = DEFAULT_PROFILE;
  posts = INITIAL_POSTS;
  res.json({ profile, posts });
});

// Serve frontend static files
app.use(express.static(path.resolve('dist')));

// SPA fallback for non-API routes
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.sendFile(path.resolve('dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
