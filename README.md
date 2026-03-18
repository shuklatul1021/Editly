# Editly

A modern, auth-enabled PDF editing web app built with Next.js.  
It provides a polished dashboard where users can upload PDFs, apply common editing operations, and download updated files directly from the browser.

---

## What this project does

### Core user flow

1. Sign up / sign in.
2. Open the dashboard editor workspace.
3. Upload a PDF file.
4. Add overlays (text or image), apply page operations, and preview changes.
5. Download the edited PDF.

### Implemented editor capabilities

- Upload and preview PDF documents.
- Add text overlays with:
  - custom text
  - font size
  - text color
  - draggable placement
  - apply to current page or all pages
- Add image overlays (`PNG`/`JPG`) with:
  - draggable placement
  - resize controls
  - apply to current page or all pages
- Page-level operations:
  - rotate 90°
  - duplicate current page
  - delete current page
- Reset to original uploaded file.
- Download edited PDF as `*-edited.pdf`.

### Authentication and account features

- Email/password sign up and sign in.
- Optional OAuth providers (enabled only when environment variables are configured):
  - Google
  - GitHub
  - X/Twitter
- Session handling with NextAuth.

---

## Tech stack

### Frontend

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS v4
- Radix UI + shadcn/ui components
- lucide-react icons
- next-themes (dark/light theme)

### PDF processing

- `pdf-lib` for editing and exporting PDFs
- `pdfjs-dist` for rendering PDF preview in the browser

### Auth & validation

- NextAuth
- `bcryptjs` for password hashing
- React Hook Form
- Zod + `@hookform/resolvers`

### Database

- PostgreSQL
- Drizzle ORM
- Drizzle Kit (schema generation and studio)

---

## Project structure (high level)

```text
app/
	api/auth/            # auth API routes (NextAuth + signup)
	auth/                # sign-in / sign-up pages
	dashboard/           # protected dashboard with editor workspace
components/
	auth/                # auth UI forms
	dashboard/           # PDF editor workspace UI
	ui/                  # reusable shadcn/ui primitives
db/
	schema.ts            # Drizzle table definitions
lib/
	auth.ts              # NextAuth config and providers
	db.ts                # DB connection + schema bootstrap
	validations/         # Zod schemas
drizzle/
	*.sql                # generated migrations
```

---

## Environment variables

Create a `.env.local` file in the project root.

```env
# Required for database-backed auth + signup
DATABASE_URL=postgresql://user:password@localhost:5432/pdf_editor

# Required by NextAuth
NEXTAUTH_SECRET=replace-with-a-long-random-secret
NEXTAUTH_URL=http://localhost:3000

# Optional OAuth providers
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

TWITTER_CLIENT_ID=
TWITTER_CLIENT_SECRET=
```

> If `DATABASE_URL` is missing, signup/database-backed auth operations return an error response.

---

## Local development setup

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment

- Add `.env.local` using the variables above.
- Ensure PostgreSQL is running and `DATABASE_URL` points to a valid database.

### 3) Generate migrations (optional during active schema changes)

```bash
npm run db:generate
```

### 4) Run the app

```bash
npm run dev
```

Open: [http://localhost:3000](http://localhost:3000)

---

## NPM scripts

- `npm run dev` — start development server
- `npm run build` — create production build
- `npm run start` — run production server
- `npm run lint` — run ESLint
- `npm run db:generate` — generate Drizzle migration files
- `npm run db:studio` — open Drizzle Studio

---

## API endpoints

- `POST /api/auth/signup`
  - Creates a new user (name, email, password)
  - Hashes password with bcrypt
  - Returns conflict if email already exists

- `GET/POST /api/auth/[...nextauth]`
  - NextAuth handler for sign-in/session/provider flows

---

## Database schema summary

Defined in `db/schema.ts`:

- `user`
- `account`
- `session`
- `verification_token`
- `document`

The app includes runtime schema bootstrapping in `lib/db.ts` via `ensureDatabaseSchema()` for required auth/editor tables.

---

## Current scope notes

- The in-dashboard PDF editor currently performs edits in browser memory and exports directly.
- The `document` table exists and can support persistence workflows, but full document CRUD/history integration is not yet wired in the dashboard flow.
- An upload session dialog component is present as UI scaffolding for future backend/storage integration.

---

## Deployment notes

- Works well on Vercel or any Node.js host that supports Next.js.
- Set all required environment variables in your deployment platform.
- Ensure the PostgreSQL database is reachable from the deployed environment.

---

## License

No license file is currently included in this repository. Add one before public distribution.
