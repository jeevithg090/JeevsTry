# TechCollab

**An all-in-one collaboration hub for the tech community — freelancing, events and developer communities in a single workspace.**

TechCollab brings together the three things people in tech usually juggle across separate tools: finding or posting freelance work, discovering and hosting events, and chatting in community groups. Each user picks a role at sign-up — **freelancer**, **client** or **startup** — and the dashboard adapts its navigation, tabs and actions to that role.

> **Status: front-end prototype.** There is no backend yet. Accounts, preferences and chat live in the browser (`localStorage` and in-memory state), and listings are seeded with sample data. The UI flows are complete and the domain logic is isolated in pure, tested modules so a real API can be dropped in later. See [Roadmap](#roadmap).

## Features

- **Role-based onboarding** – sign up as a freelancer, client or startup, with inline, accessible form validation.
- **Demo authentication** – sign-in/sign-up create a browser-local session; the dashboard redirects signed-out visitors to sign-in and returns them afterwards (`?next=`, restricted to same-site paths).
- **Freelancing** – browse projects, apply with a proposal, post a project (clients/startups), view proposals and a freelancer profile with portfolio.
- **Events** – discover hackathons, meetups and workshops, register via a modal or full registration page, create and manage hosted events (attendees, check-in, analytics tabs).
- **Community chat** – public/private groups and direct messages with reactions, group creation, join/leave and a group management view.
- **Settings** – profile editing (persisted to the session), notifications, billing placeholder and appearance: light/dark/system theme, sidebar side and font size, all remembered per browser.
- **Deep-linkable tabs** – e.g. `/dashboard/events?tab=hosting`, `/dashboard/settings?tab=appearance`.
- **Responsive & accessible UI** – mobile layouts, keyboard-operable controls, labelled icon buttons, landmark structure (`header`/`nav`/`main`), loading skeletons, a 404 page and an error boundary.

## Tech stack

| Area      | Choice                                                                                |
| --------- | ------------------------------------------------------------------------------------- |
| Framework | [Next.js 15](https://nextjs.org/) (App Router) with React 19                          |
| Language  | TypeScript (strict)                                                                   |
| Styling   | Tailwind CSS 3, [shadcn/ui](https://ui.shadcn.com/) components on Radix UI primitives |
| Icons     | lucide-react                                                                          |
| Theming   | next-themes                                                                           |
| Testing   | Vitest, Testing Library, jsdom                                                        |
| Quality   | ESLint 9 (`next/core-web-vitals`, `next/typescript`), Prettier                        |

## Architecture

```
Browser
 └─ app/layout.tsx  ── <Providers>
                         ├─ ThemeProvider      (next-themes: light/dark/system)
                         ├─ SettingsProvider   (sidebar side, font size → localStorage)
                         ├─ UserProvider       (demo session → localStorage)
                         └─ <Toaster>
     ├─ /            landing page
     ├─ /auth/*      account options, sign-in, sign-up
     ├─ /events/[id]/register
     └─ /dashboard/* ── <DashboardShell>  (auth guard + sidebar + header)
                          ├─ freelancing, events, settings …
                          └─ community ── <ChatProvider> (seeded, in-memory chat)
```

- **UI vs. logic.** React contexts in `lib/*-context.tsx` are thin wrappers. The rules live in framework-free modules that are unit tested:
  - `lib/auth.ts` – user model, sign-up/sign-in validation, safe parsing of stored sessions, redirect sanitising.
  - `lib/chat-state.ts` – immutable chat transitions (send, edit, delete, toggle reaction, membership, DM lookup).
  - `lib/format.ts`, `lib/utils.ts` – formatting and small helpers.
- **Sample data** for chat is in `lib/mock/chat-data.ts`; other pages define their sample listings inline.
- **The dashboard guard is a UX convenience, not a security boundary** — with client-side demo auth there is nothing to protect server-side yet. Real authorisation must be enforced by the backend once one exists.
- Security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) are set in `next.config.mjs`.

## Getting started

### Prerequisites

- Node.js **20.9+** (developed on Node 22)
- [pnpm](https://pnpm.io/) 10 (`corepack enable` will pick up the version pinned in `package.json`)

### Install and run

```bash
pnpm install
cp .env.example .env.local   # optional
pnpm dev                      # http://localhost:3000
```

Create an account at `/auth/signup` (any details; nothing leaves the browser), or sign in at `/auth/signin` with any email and password.

### Environment variables

| Variable               | Required | Default                 | Purpose                                                           |
| ---------------------- | -------- | ----------------------- | ----------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | No       | `http://localhost:3000` | Public base URL used for absolute metadata (e.g. Open Graph URLs) |

No secrets are needed to run the project.

## Scripts

| Command             | Description                            |
| ------------------- | -------------------------------------- |
| `pnpm dev`          | Start the development server           |
| `pnpm build`        | Production build (includes type check) |
| `pnpm start`        | Serve the production build             |
| `pnpm lint`         | ESLint                                 |
| `pnpm typecheck`    | TypeScript, no emit                    |
| `pnpm test`         | Run the test suite once                |
| `pnpm test:watch`   | Run tests in watch mode                |
| `pnpm format`       | Format with Prettier                   |
| `pnpm format:check` | Verify formatting                      |

### Tests

Unit tests sit next to the modules they cover (`lib/*.test.ts`); integration tests for the sign-in/sign-up flows, session restore and the dashboard guard are in `tests/`.

```bash
pnpm test
```

## Deployment

TechCollab is a standard Next.js app with no external services, so it runs anywhere Next.js does:

- **Vercel** – import the repository; the defaults (`pnpm install`, `pnpm build`) work as is. Set `NEXT_PUBLIC_SITE_URL` to the production URL.
- **Node server / container** – `pnpm install --frozen-lockfile && pnpm build && pnpm start` (listens on port 3000; override with `-p` or `PORT`).

## Project structure

```
app/
  layout.tsx            Root layout, metadata, global providers
  page.tsx              Landing page
  not-found.tsx         404 page
  error.tsx             Error boundary
  auth/                 Account options, sign-in, sign-up
  events/[id]/register/ Full-page event registration
  dashboard/
    layout.tsx          Dashboard metadata + DashboardShell (guard, sidebar, header)
    page.tsx            Overview
    freelancing/        Projects, proposals, profile, create-gig, apply
    events/             Discover, create, manage
    community/          Chat, groups, group management
    settings/           Profile, account, notifications, billing, appearance
components/
  ui/                   shadcn/ui primitives
  app-sidebar.tsx, dashboard-header.tsx, dashboard-shell.tsx, header.tsx, …
hooks/                  use-toast, use-mobile
lib/
  auth.ts               User model, validation, session parsing
  chat-state.ts         Pure chat state transitions
  *-context.tsx         React providers (user, settings, chat)
  mock/                 Seed data for the demo chat
  format.ts, utils.ts, site.ts
public/                 Placeholder images and logo
styles/settings.css     Font-size preference classes
tests/                  Test setup and integration tests
```

## Roadmap

- Replace demo auth with a real provider (e.g. Auth.js or a hosted identity service) and server-side session checks.
- Back gigs, proposals, events and registrations with an API and database.
- Real-time chat (WebSocket) with persistence, typing indicators and unread counts.
- Payments for paid events and billing.
- End-to-end tests (Playwright) for the main journeys.
