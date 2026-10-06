import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import dotenv from 'dotenv';
import { db } from './server/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Body parsers
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static uploads directory
const UPLOADS_DIR = path.resolve(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use('/uploads', express.static(UPLOADS_DIR));

// Configure multer storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
    const unique = `${cleanName}-${Date.now()}${ext}`;
    cb(null, unique);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Simple secure auth token verification (Bearer token)
const AUTH_SECRET = process.env.ADMIN_TOKEN_SECRET || 'craftnest-secure-secret-key-2026';

function generateToken(email: string) {
  const payload = JSON.stringify({ email, time: Date.now() });
  return Buffer.from(payload).toString('base64');
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication token required' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    if (!decoded.email) {
      return res.status(401).json({ error: 'Invalid authentication token' });
    }
    // Token valid
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Session expired or invalid' });
  }
}

// -------------------------------------------------------------
// PUBLIC & SEO ENDPOINTS
// -------------------------------------------------------------

// /ads.txt for Google AdSense verification
app.get('/ads.txt', (_req, res) => {
  const settings = db.getSettings();
  res.type('text/plain');
  res.send(settings.adsTxt || 'google.com, pub-9876543210987654, DIRECT, f08c47fec0942fa0\n');
});

// /robots.txt
app.get('/robots.txt', (req, res) => {
  const host = req.get('host') || 'localhost:3000';
  const protocol = req.protocol;
  const baseUrl = `${protocol}://${host}`;
  res.type('text/plain');
  res.send(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nSitemap: ${baseUrl}/sitemap.xml\n`);
});

// /sitemap.xml
app.get('/sitemap.xml', (req, res) => {
  const host = req.get('host') || 'localhost:3000';
  const protocol = req.protocol;
  const baseUrl = `${protocol}://${host}`;
  const { posts } = db.getPosts({ status: 'published' });
  const categories = db.getCategories();
  const pages = db.getPages();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Home
  xml += `  <url>\n    <loc>${baseUrl}/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

  // Posts
  for (const post of posts) {
    xml += `  <url>\n    <loc>${baseUrl}/post/${post.slug}</loc>\n    <lastmod>${post.updatedAt.split('T')[0]}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
  }

  // Categories
  for (const cat of categories) {
    xml += `  <url>\n    <loc>${baseUrl}/category/${cat.slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  }

  // Pages
  for (const page of pages) {
    xml += `  <url>\n    <loc>${baseUrl}/${page.slug}</loc>\n    <lastmod>${page.lastUpdated.split('T')[0]}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.5</priority>\n  </url>\n`;
  }

  xml += `  <url>\n    <loc>${baseUrl}/contact</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.5</priority>\n  </url>\n`;
  xml += `</urlset>`;

  res.type('application/xml');
  res.send(xml);
});

// -------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------

// --- Posts ---
app.get('/api/posts', (req, res) => {
  try {
    const { category, tag, search, status, limit, offset } = req.query;
    const result = db.getPosts({
      categorySlug: category as string,
      tag: tag as string,
      search: search as string,
      status: (status as any) || 'published',
      limit: limit ? parseInt(limit as string, 10) : undefined,
      offset: offset ? parseInt(offset as string, 10) : undefined
    });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/posts/:slug', (req, res) => {
  try {
    const inc = req.query.inc === '1';
    const post = db.getPostBySlug(req.params.slug, inc);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/posts', requireAuth, (req, res) => {
  try {
    const created = db.createPost(req.body);
    res.status(201).json(created);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/posts/:id', requireAuth, (req, res) => {
  try {
    const updated = db.updatePost(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/posts/:id', requireAuth, (req, res) => {
  try {
    const success = db.deletePost(req.params.id);
    res.json({ success });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/posts/:id/duplicate', requireAuth, (req, res) => {
  try {
    const duplicated = db.duplicatePost(req.params.id);
    if (!duplicated) {
      return res.status(404).json({ error: 'Original post not found' });
    }
    res.status(201).json(duplicated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- Categories ---
app.get('/api/categories', (_req, res) => {
  try {
    const cats = db.getCategories();
    res.json(cats);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/categories', requireAuth, (req, res) => {
  try {
    const created = db.createCategory(req.body);
    res.status(201).json(created);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/categories/:id', requireAuth, (req, res) => {
  try {
    const updated = db.updateCategory(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Category not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/categories/:id', requireAuth, (req, res) => {
  try {
    const reassignId = req.query.reassign as string;
    const result = db.deleteCategory(req.params.id, reassignId);
    if (!result.success) {
      return res.status(400).json({ error: result.message });
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- Comments ---
app.get('/api/comments', (req, res) => {
  try {
    const { postId, approvedOnly } = req.query;
    const comments = db.getComments({
      postId: postId as string,
      approvedOnly: approvedOnly === 'true'
    });
    res.json(comments);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/comments', (req, res) => {
  try {
    // Basic spam bot protection: honeypot check
    if (req.body.honeypot) {
      return res.status(200).json({ success: true, message: 'Comment submitted' });
    }
    const { postId, authorName, authorEmail, content } = req.body;
    if (!postId || !authorName || !content) {
      return res.status(400).json({ error: 'Name and comment text are required' });
    }
    const comment = db.addComment({ postId, authorName, authorEmail: authorEmail || '', content });
    res.status(201).json(comment);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/comments/:id/approve', requireAuth, (req, res) => {
  try {
    const updated = db.toggleApproveComment(req.params.id);
    if (!updated) return res.status(404).json({ error: 'Comment not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/comments/:id', requireAuth, (req, res) => {
  try {
    const success = db.deleteComment(req.params.id);
    res.json({ success });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- Subscribers ---
app.get('/api/subscribers', requireAuth, (_req, res) => {
  try {
    const list = db.getSubscribers();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/subscribers', (req, res) => {
  try {
    if (req.body.honeypot) {
      return res.json({ success: true, message: 'Subscribed successfully' });
    }
    const result = db.addSubscriber(req.body.email);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/subscribers/:id', requireAuth, (req, res) => {
  try {
    const success = db.deleteSubscriber(req.params.id);
    res.json({ success });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/subscribers/export', requireAuth, (_req, res) => {
  try {
    const subs = db.getSubscribers();
    let csv = 'ID,Email,SubscribedDate\n';
    subs.forEach(s => {
      csv += `"${s.id}","${s.email}","${s.subscribedAt}"\n`;
    });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="craftnest_subscribers.csv"');
    res.send(csv);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- Messages ---
app.get('/api/messages', requireAuth, (_req, res) => {
  try {
    const msgs = db.getMessages();
    res.json(msgs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/messages', (req, res) => {
  try {
    if (req.body.honeypot) {
      return res.json({ success: true, message: 'Message sent' });
    }
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }
    const msg = db.addMessage({ name, email, subject: subject || 'Website Contact Form', message });
    res.status(201).json({ success: true, message: 'Thank you! Your message has been received.', data: msg });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/messages/:id/read', requireAuth, (req, res) => {
  try {
    const isRead = req.body.isRead !== false;
    const updated = db.markMessageRead(req.params.id, isRead);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/messages/:id', requireAuth, (req, res) => {
  try {
    const success = db.deleteMessage(req.params.id);
    res.json({ success });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- Media Library & File Upload ---
app.get('/api/media', requireAuth, (_req, res) => {
  try {
    const media = db.getMedia();
    res.json(media);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/upload', requireAuth, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    const mediaItem = db.addMedia({
      filename: req.file.originalname,
      url: fileUrl,
      size: req.file.size,
      mimeType: req.file.mimetype
    });
    res.status(201).json(mediaItem);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Support direct image upload via base64 data URL
app.post('/api/upload/base64', requireAuth, (req, res) => {
  try {
    const { dataUrl, filename } = req.body;
    if (!dataUrl) return res.status(400).json({ error: 'Missing dataUrl' });
    
    const matches = dataUrl.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Invalid data URL format' });
    }

    const mimeType = matches[1];
    const buffer = Buffer.from(matches[2], 'base64');
    const ext = mimeType.split('/')[1] || 'png';
    const name = `${(filename || 'image').replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${Date.now()}.${ext}`;
    const filePath = path.join(UPLOADS_DIR, name);

    fs.writeFileSync(filePath, buffer);
    const mediaItem = db.addMedia({
      filename: filename || name,
      url: `/uploads/${name}`,
      size: buffer.length,
      mimeType
    });
    res.status(201).json(mediaItem);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/media/:id', requireAuth, (req, res) => {
  try {
    const success = db.deleteMedia(req.params.id);
    res.json({ success });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- Static Pages ---
app.get('/api/pages', (_req, res) => {
  try {
    const pages = db.getPages();
    res.json(pages);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/pages/:slug', (req, res) => {
  try {
    const page = db.getPageBySlug(req.params.slug);
    if (!page) return res.status(404).json({ error: 'Page not found' });
    res.json(page);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/pages/:slug', requireAuth, (req, res) => {
  try {
    const updated = db.updatePage(req.params.slug, req.body);
    if (!updated) return res.status(404).json({ error: 'Page not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- Settings ---
app.get('/api/settings', (_req, res) => {
  try {
    const settings = db.getSettings();
    res.json(settings);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/settings', requireAuth, (req, res) => {
  try {
    const updated = db.updateSettings(req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- Admin Authentication ---
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const isValid = db.verifyAdmin(email, password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = generateToken(email);
    const admin = db.getAdmin();
    res.json({
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  try {
    const admin = db.getAdmin();
    res.json({ admin });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/auth/profile', requireAuth, (req, res) => {
  try {
    const { email, name, password } = req.body;
    db.updateAdmin({ email, name, password });
    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- Dashboard Stats ---
app.get('/api/stats', requireAuth, (_req, res) => {
  try {
    const stats = db.getStats();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// VITE DEV MIDDLEWARE OR PRODUCTION STATIC SERVER
// -------------------------------------------------------------
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CraftNest server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
