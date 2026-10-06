# CraftNest ✂️ – Modern DIY Craft Blog & Tutorial Publishing Platform

CraftNest is a fast, SEO-optimized DIY craft tutorial blog featuring an integrated **Admin Creator Studio**. Craft creators and video publishers can easily write and publish detailed, 5–6 step visual craft guides with supplies checklists, embedded videos, maker tips, and designated Google AdSense spaces without touching code.

---

## 🎨 Features Overview

### 1. Public Visitor Website
- **Sticky Header**: Responsive navigation, category dropdown, quick search modal, and dark/light theme switch.
- **Home Page**: Hero section with search bar, Featured Crafts highlight, Category tiles, Latest Tutorials, Popular Crafts by views, and interactive Newsletter box.
- **Step-by-Step Article Page (`/post/[slug]`)**:
  - Reading progress bar at top of page.
  - Interactive "What You Will Need" materials checklist with checkable boxes.
  - Embedded video player (YouTube/Social clips).
  - Dynamic 1–10 Step Builder with alternating left/right photo layouts on desktop and stacked on mobile.
  - Big step badges, high-res photos, detailed instructions, and "Maker's Tip" callouts.
  - "The Final Look" photo and display/styling advice.
  - Social share buttons (WhatsApp, Pinterest, Facebook, X, Copy link).
  - Related crafts in the same category.
  - Visitor comments section with honeypot spam protection.
- **Search (`/search?q=`)**: Instant keyword search matching titles, excerpts, tags, and materials.
- **Category Archives (`/category/[slug]`)**: Curated pages for Paper Crafts, Home Decor, Kids Crafts, Handmade Gifts, Recycling Crafts, and Wall Art.
- **AdSense Mandatory Pages**: Professionally written About Us, Privacy Policy (with Google DART cookie & third-party ad disclosure), Terms & Conditions, and Craft Safety Disclaimer.
- **GDPR Cookie Consent Banner**: Customizable consent dialog remembering visitor preferences.

### 2. Admin Creator Studio (`/admin`)
- **Secure Authentication**: Protected API endpoints and admin dashboard login.
- **Overview Dashboard**: Post count, drafts, total readership views, newsletter subscriber counts, unread contact messages, and recent crafts table.
- **Tutorial Post Editor**:
  - Title, auto-generated slug, category picker, and comma-separated tags.
  - Hero image upload or URL preview.
  - Materials checklist builder (add/remove supply items dynamically).
  - Dynamic Step Builder (add/remove/reorder steps with photos and tips).
  - Live Google Search snippet preview (SERP card).
  - Focus keyword, custom meta title, and meta description.
  - Instant Save Draft or Publish.
- **Category Manager**: Add, edit, or delete categories with safety checks to prevent orphan posts.
- **Media Library**: Upload photos (WebP, PNG, JPG), view thumbnails, copy URLs, and delete files.
- **Comments Moderation**: Approve or delete visitor comments.
- **Subscribers Management**: View email list and export directly to CSV (`craftnest_subscribers.csv`).
- **Contact Messages Inbox**: View customer queries and project suggestions with read/unread flags.
- **Legal Pages Editor**: Edit content for About Us, Privacy Policy, Terms, and Disclaimer directly from the UI.
- **Site Settings**: Customize site name, logo, primary color picker, social URLs, Google Analytics ID, Search Console meta tag, and AdSense settings.

---

## ⚡ Quick Start & Local Setup

### 1. Prerequisites
- Node.js 18+ or 20+ installed on your computer.

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-username/craftnest.git
cd craftnest

# Install dependencies
npm install

# Start the full-stack development server
npm run dev
```

The application will start at `http://localhost:3000`.

### 3. Default Admin Login
Navigate to `http://localhost:3000/admin` or click **Log in** in the top header.
- **Email**: `admin@craftnest.com`
- **Password**: `admin123`

> You can change the password anytime directly inside **Admin > Site & AdSense Settings > Change Admin Credentials**, or by setting `ADMIN_PASSWORD` in your `.env` file.

---

## 📁 Project Structure

```
├── server.ts                  # Express full-stack entry point + Vite middleware
├── server/
│   ├── db.ts                  # Persistent database engine (safe JSON store in /data)
│   └── seedData.ts            # Seed categories, rich tutorials, pages, & settings
├── data/
│   └── database.json          # Persistent file database
├── public/
│   └── uploads/               # Image uploads folder
├── src/
│   ├── types.ts               # Shared TypeScript models (Post, Step, Category, etc.)
│   ├── api.ts                 # Full client API client with bearer token auth
│   ├── context/
│   │   ├── AuthContext.tsx    # Admin authentication provider
│   │   └── SettingsContext.tsx# Site branding, AdSense injection & theme provider
│   ├── components/
│   │   ├── Header.tsx         # Sticky navigation, categories menu, & theme toggle
│   │   ├── Footer.tsx         # Social links, quick links, & legal footers
│   │   ├── CraftCard.tsx      # Tutorial card with badges & reading time
│   │   ├── AdSenseBanner.tsx  # Controlled AdSense display units
│   │   ├── SEOHead.tsx        # Dynamic tags + HowTo & Article JSON-LD Schema
│   │   ├── NewsletterBox.tsx  # Newsletter subscription box
│   │   └── CookieConsent.tsx  # GDPR cookie banner
│   ├── pages/
│   │   ├── HomePage.tsx       # Featured tutorials, category tiles & popular crafts
│   │   ├── ArticlePage.tsx    # Step-by-step visual craft tutorial page
│   │   ├── CategoryPage.tsx   # Category archive page
│   │   ├── SearchPage.tsx     # Search craft tutorials
│   │   ├── StaticPage.tsx     # About, Privacy Policy, Terms, Disclaimer
│   │   ├── ContactPage.tsx    # Contact us form with inbox saving
│   │   └── NotFoundPage.tsx   # Custom 404 page
│   └── admin/
│       ├── AdminLayout.tsx    # Sidebar, topbar, & tab controller
│       ├── AdminLogin.tsx     # Admin authentication login
│       ├── DashboardTab.tsx   # Metrics & AdSense readiness overview
│       ├── PostsTab.tsx       # Post list table, filters, duplicate, & toggles
│       ├── PostEditor.tsx     # Dynamic 1–10 step builder & materials list
│       ├── CategoriesTab.tsx  # Category editor with reassign checks
│       ├── MediaLibraryTab.tsx# Photo gallery & file uploader
│       ├── CommentsTab.tsx    # Comments moderation
│       ├── SubscribersTab.tsx # Newsletter list & CSV export
│       ├── MessagesTab.tsx    # Contact message inbox
│       ├── PagesTab.tsx       # Legal pages content editor
│       └── SettingsTab.tsx    # AdSense publisher ID, ads.txt, & colors
├── package.json
└── tsconfig.json
```

---

## 🚀 How to Publish a Craft Tutorial

1. Log into `/admin`.
2. Click **Create New Craft Article** or go to **Craft Tutorials > Write New Craft**.
3. Fill in the **Title**, **Category**, **Tags**, and upload a **Cover Image**.
4. Switch to **Step-by-Step Builder**:
   - Write the step title.
   - Upload or paste an image of that specific step.
   - Add clear instructions and an optional "Maker's Tip".
   - Click **Add Another Step** to add up to 10 visual steps.
5. Switch to **Materials Checklist**:
   - Add each supply with quantity (e.g. `180g Italian Crepe Paper (2 sheets)`).
6. Switch to **SEO & Meta**:
   - Add your focus keyword and review the Google Search Snippet preview.
7. Click **Publish Article**.

---

## 🌐 Deployment Guide

### Deploying to GitHub & Vercel
1. Initialize Git and commit your files:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of CraftNest"
   ```
2. Push your repository to GitHub:
   ```bash
   git remote add origin https://github.com/your-username/craftnest.git
   git branch -M main
   git push -u origin main
   ```
3. Import the repository in [Vercel](https://vercel.com):
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Set Environment Variables in Vercel:
   - `ADMIN_EMAIL`: your chosen admin email
   - `ADMIN_PASSWORD`: your chosen admin password
   - `ADMIN_TOKEN_SECRET`: a random secure string

### Production Media Storage Note
In default local mode, uploaded files are stored in `/public/uploads`. On serverless platforms with ephemeral file systems like Vercel, connect **Cloudinary** or **Supabase Storage** for persistent images. You can also paste direct image URLs (from Unsplash, Imgur, or Cloudinary) directly in the image fields.

---

## 🏆 Google AdSense Approval Checklist

CraftNest is architected to fulfill all Google AdSense Publisher criteria:

| Requirement | Implementation in CraftNest |
|---|---|
| **High Quality Original Content** | Multi-step original craft tutorials with written steps and supply lists. |
| **Mandatory Legal Pages** | Comprehensive `/privacy` (with Google DART cookie clause), `/terms`, `/disclaimer`, and `/about`. |
| **Working Contact Page** | Fully functional `/contact` form with inbox management. |
| **ads.txt Verification** | Dynamic `/ads.txt` route served directly from admin settings. |
| **Cookie Notice (GDPR/ePrivacy)** | Built-in GDPR cookie consent banner. |
| **Structured Data (SEO)** | Google Rich Results `HowTo` schema and `BlogPosting` schema embedded automatically via JSON-LD. |
| **Search Console Verification** | Input your verification tag in **Admin > Settings** to verify your site instantly. |
| **Clean Navigation** | Category menus, search bar, and clean URLs (`/post/how-to-make-crepe-paper-peonies`). |

To connect AdSense:
1. Obtain your Publisher ID (e.g. `ca-pub-XXXXXXXXXXXXXXXX`) from your Google AdSense account.
2. Go to **Admin > Site & AdSense Settings**.
3. Toggle **Enable Google AdSense**, paste your **Publisher ID**, and paste your **ads.txt** snippet.
4. Click **Save All Settings**. The AdSense script and ads.txt will be automatically active site-wide.
