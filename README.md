# Interdisciplinary

**Where the speed of sound, meets the speed of light.**

Interdisciplinary is a Studio OS built for film producers and musicians — and everyone who works at the intersection of both. It is not a DAW. It is not an NLE. It is the creative workspace that comes before and after those tools: the place where your script, your score, your clients, your schedule, and your release strategy live together.

---

## Who it's for

| User | Use case |
|------|----------|
| **Aspiring filmmakers** | Script → storyboard → pipeline → distribution, without losing track of anything |
| **Aspiring musicians** | Map your album, write your score, manage sync licensing and releases |
| **Creative professionals** | Directors who score their own work. Composers who produce their own films. One workspace that respects both disciplines |
| **Photographers, designers, animators, writers** | Portfolio, client management, archive, and resell market for any creative medium |

---

## Features

### Creative Tools
- **Script Writer** — Fountain-format screenplay editor with scene headings, action lines, character, dialogue, and parentheticals. Export to `.fountain`, `.txt`, PDF, and DOCX.
- **Storyboard Studio** — Panel-by-panel shot visualization with shot type, camera angle, lens, and notes per panel.
- **Score Writer** — VexFlow-powered music notation editor. Compose by measure, navigate pages, export to PDF, SVG, and MusicXML (opens in MuseScore, Finale, Sibelius, Dorico).
- **Arrangement Mapper** — Visual song structure mapping with section labels, keys, tempo, and mood before entering the studio.
- **6-Stage Pipeline** — Guided film + music workflow from Idea through Distribution. Free and Studio content per stage.
- **Cross-Discipline Projects** — Film and music in the same project. Score writers and directors in one workspace.

### Project Management
- **Projects** — Kanban board with custom statuses, priority, genre, type, and linked shot lists and music cues.
- **Schedule** — Event calendar with shoot dates, deadlines, meetings, and milestones.
- **Assets** — File and asset tracker linked to projects.

### Client Management
- **Clients** — Client records with contact info, status, and project history.
- **Client Projects** — Separate project view scoped to individual clients.
- **Invoices** — Create, send, and track invoices with status (Draft, Sent, Paid, Overdue).
- **Contracts** — Contract management with DocuSeal e-signature integration.
- **Equipment** — Gear list linked to shoots and client deliverables.
- **Client Portal** — Private, token-based portal link for clients to track project progress, review deliverables, and communicate — no app download required.

### Brand
- **Brand Studio** — Three tracks: DIY (build your own profile), Hire (find a brand designer), AI Studio (Claude-powered bio writer, tagline generator, and color palette generator).
- **Public Profile** — Publicly listed producer profile with specialties, location, tagline, and avatar.
- **Portfolio** — Published work feed with client approval controls.
- **Packages** — Pricing packages displayed on your public profile.
- **Messages** — Direct messaging with clients and collaborators.
- **Forum** — Community discussion board.
- **Resell Market** — List gear and software from your Inventory Log for resale. Public browse page with filters by category, type, and condition.

### Logs
- **Inventory Log** — Structured gear and software tracker. Fields: Name, Manufacturer, Condition, Purchased At, Quantity, Price, Acquired date, Category, Serial Key, Software/Hardware. List any item for resale directly from the log.
- **Practice Log** — Session tracker with Date, Technique, Duration, Recording, and Notes.
- **Archive Log** — Completed project archive with discipline tagging (Film, Music, Photography, Design, Animation, Writing, Podcast, Commercial, Theatre, Cross-Discipline), client, tools used, and project link. Toggle public/private to post to the Community feed.
- **Reference Log** — Free-text log for reference tracks, films, books, and creative inspiration.

### Community & Discovery
- **Discover** — Public marketplace to find and hire producers. Filter by specialty, location, and name.
- **Community Feed** — Social feed of portfolio posts and public archived projects. Discipline color-coded by medium.
- **Resell Market** — Public gear marketplace populated from Inventory Logs.

### Cloud Storage
Three tiers of cloud storage for scripts, scores, storyboards, client deliverables, portfolio media, and project archives:

| Plan | Storage | Price |
|------|---------|-------|
| Free | 5 GB | $0 |
| Pro | 100 GB | $9 / month |
| Studio | 1 TB | $29 / month |

---

## Tech Stack

### Frontend
| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| Music notation | VexFlow 4 |
| PDF export | jsPDF |
| DOCX export | docx |

### Backend / API
Serverless API routes deployed on Vercel (`/api/*`).

### Third-Party Integrations

| Category | Service | Purpose |
|----------|---------|---------|
| Database + Auth | **Supabase** | User accounts, project data, real-time messaging |
| File storage | **Supabase Storage** | Scripts, scores, storyboards, deliverables, media |
| Payments | **Stripe** | Storage tier subscriptions, invoice payments |
| Email | **Resend** | Invoice delivery, client portal invites, contract sends |
| AI | **Anthropic (Claude)** | Brand Studio AI — bio, tagline, color palette, script/score suggestions |
| Analytics | **PostHog** | Product analytics and feature usage |
| Error monitoring | **Sentry** | Runtime error tracking with React Router tracing |
| Video hosting | **Mux** | Portfolio video upload and playback |
| Image optimization | **Cloudflare Images** | Storyboard panels, portfolio photos |
| Push notifications | **OneSignal** | Invoice paid, new message, contract signed alerts |
| E-signatures | **DocuSeal** | Contract signing workflow |
| Booking | **Cal.com** | Hire/Discover page booking integration |
| Deployment | **Vercel** | Hosting + serverless API routes |

---

## Project Structure

```
interdisciplinary/
├── api/                        # Vercel serverless API routes
│   ├── ai/generate.ts          # Anthropic Claude proxy
│   ├── contracts/sign.ts       # DocuSeal e-signature
│   ├── email/
│   │   ├── invoice.ts          # Resend invoice email
│   │   ├── portal-invite.ts    # Client portal invite
│   │   └── contract.ts         # Contract signing email
│   ├── stripe/
│   │   ├── checkout.ts         # Create Stripe Checkout session
│   │   ├── webhook.ts          # Handle Stripe subscription events
│   │   └── portal.ts           # Stripe Customer Portal
│   ├── upload/
│   │   ├── image.ts            # Cloudflare Images proxy
│   │   └── mux.ts              # Mux video upload URL
│   └── notify.ts               # OneSignal push notifications
│
├── src/
│   ├── lib/                    # Third-party client initializations
│   │   ├── supabase.ts         # Supabase client + auth helpers
│   │   ├── stripe.ts           # Stripe.js + checkout helpers
│   │   ├── anthropic.ts        # AI task wrappers
│   │   ├── analytics.ts        # PostHog + typed event constants
│   │   ├── sentry.ts           # Error monitoring
│   │   ├── storage.ts          # Supabase Storage helpers
│   │   ├── email.ts            # Client-side email triggers
│   │   ├── mux.ts              # Mux playback + upload helpers
│   │   ├── onesignal.ts        # Push notification helpers
│   │   ├── cloudflare.ts       # Image delivery URL builder
│   │   └── cal.ts              # Cal.com embed + modal
│   │
│   ├── components/
│   │   ├── layout/             # AppLayout, AppSidebar, QuickNav
│   │   ├── tools/              # ScriptWriter, ScoreWriter, StoryBoard, ArrangementMapper
│   │   ├── projects/           # KanbanBoard, ShotListPanel, MusicCuesPanel
│   │   └── ui/                 # Card, Badge, Button, Input, Modal
│   │
│   ├── context/AppContext.tsx  # Global state + localStorage persistence
│   ├── pages/
│   │   ├── Landing.tsx         # Public landing page
│   │   ├── Discover.tsx        # Producer marketplace
│   │   ├── Community.tsx       # Community feed
│   │   ├── ResellMarket.tsx    # Gear resell market
│   │   ├── app/                # Authenticated app pages
│   │   └── portal/             # Client portal
│   └── types/index.ts
│
├── public/logos/               # DAW/NLE/Adobe tool logos
├── .env.example                # All environment variables documented
├── vercel.json                 # Vercel deployment config
└── package.json
```

---

## Local Development

```bash
# 1. Clone the repo
git clone https://github.com/TheTracyTimes/interdisciplinary.git
cd interdisciplinary

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.example .env.local
# Fill in your keys — at minimum VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

# 4. Start the dev server
npm run dev
```

The app runs without any environment variables filled in — it falls back to localStorage for all data. Fill in keys progressively as you connect each service.

---

## Deployment

1. Push to GitHub
2. Connect the repo to [Vercel](https://vercel.com)
3. Add all environment variables from `.env.example` to your Vercel project settings
4. Deploy — Vercel automatically builds the Vite app and serves API routes from `/api`

For Stripe webhooks, set the endpoint to:
```
https://yourdomain.com/api/stripe/webhook
```

---

## Design Principles

- **NLE/DAW aesthetic** — The UI follows the visual language of DaVinci Resolve, Ableton Live, and Premiere Pro. Dark panels, thin precise borders, monospace data, minimal color.
- **Not replacing your tools** — Interdisciplinary does not compete with your DAW or NLE. It is the bridge that comes before and after them.
- **One workflow** — Script, score, storyboard, schedule, invoice, archive, and distribute — without switching apps.

---

## License

Private. All rights reserved. © Interdisciplinary / TheTracyTimes.
