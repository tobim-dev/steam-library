# Steam Gaming Library

A personal web application for managing your Steam game collection with a gaming diary, notes, and multi-user support.

## Features

### Game Library
- Automatic import of all games from your Steam library via the Steam Web API
- Detail view per game with header images, genre tags, and playtime
- Search and sorting (name, playtime, genre)

### Gaming Diary
- Log your gaming sessions as diary entries
- Per entry: title, content, play date, hours played, and rating (1-5 stars)
- Filter entries by game or time period

### Notes
- Create free-form notes per game (tips, guides, thoughts)
- Text fields with creation and modification timestamps

### Multi-User & Authentication
- JWT-based authentication with Passport.js (Local + JWT Strategy)
- Role-based access control (Admin / User)
- Each user has their own isolated game collection
- Default admin account is automatically created on first startup (`admin` / `admin`)
- Mandatory password change on first login

### Admin Panel
- User management: create, activate/deactivate, change roles, delete
- Trigger Steam sync for all users at once
- Manage the global Steam API key

### User Profile
- Set your own Steam ID (required for library sync)
- Change display name
- Change password

### Steam Sync
- Users can trigger their own sync (if Steam ID is configured)
- Admin can trigger sync for all users at once
- Global Steam API key (managed by admin)

## Tech Stack

| Component | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, React Router, CSS Modules |
| **Backend** | NestJS 11, TypeScript, Passport.js, JWT |
| **Database** | SQLite (better-sqlite3) via TypeORM |
| **Architecture** | Clean Architecture (Domain → Application → Interface Adapters → Infrastructure) |
| **Auth** | Passport.js (Local Strategy + JWT Strategy), bcrypt |
| **CI/CD** | GitHub Actions (Lint, Test, Build, Docker Push) |
| **Deployment** | Docker (Multi-Stage Build), nginx + supervisord |

## Project Structure

```
gaming-library/
├── backend/                    # NestJS Backend
│   ├── src/
│   │   ├── domain/             # Entities & Repository Interfaces
│   │   ├── application/        # Use Cases & Ports
│   │   ├── interface-adapters/ # Controllers, DTOs, Presenters
│   │   ├── infrastructure/     # TypeORM, Passport, Modules, Seeding
│   │   └── shared/             # Shared Types & Constants
│   └── test/                   # E2E Tests
├── frontend/                   # React Frontend
│   └── src/
│       ├── pages/              # Login, Library, GameDetail, Diary, Admin, Profile, Settings
│       ├── components/         # Layout (Sidebar, etc.)
│       ├── contexts/           # AuthContext
│       ├── hooks/              # Custom Hooks
│       ├── api/                # API Client & Endpoint Modules
│       └── types/              # TypeScript Interfaces
├── Dockerfile                  # Multi-Stage Docker Build
├── nginx.conf                  # Reverse Proxy Configuration
├── supervisord.conf            # Process Manager (nginx + NestJS)
└── .github/workflows/ci.yml   # CI/CD Pipeline
```

## Prerequisites

- **Node.js** >= 22
- **npm** >= 10
- A **Steam Web API Key** (free at https://steamcommunity.com/dev/apikey)

## Local Development

### 1. Clone the repository & install dependencies

```bash
git clone <repository-url>
cd gaming-library
npm install
```

### 2. Start the backend

```bash
npm run start:dev -w backend
```

The backend starts on **http://localhost:3001** and automatically creates:
- A SQLite database at `backend/data/gaming_library.db`
- A default admin account: **Username:** `admin` / **Password:** `admin`

### 3. Start the frontend

```bash
npm run dev -w frontend
```

The frontend starts on **http://localhost:5173** and automatically proxies API requests to the backend (port 3001).

### 4. Log in & set up

1. Open http://localhost:5173
2. Log in with `admin` / `admin`
3. You will be prompted to change your password
4. Under **Settings**, enter your Steam API key
5. Under **Profile**, set your Steam ID
6. Use the **Sync** button in the sidebar to import your game library

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3001` | Port for the NestJS backend |
| `DB_PATH` | `./data/gaming_library.db` | Path to the SQLite database |
| `JWT_SECRET` | `gaming-library-secret-dev-key` | Secret for JWT token signing (change in production!) |

## Scripts

### Backend (`npm run ... -w backend`)

| Script | Description |
|---|---|
| `start:dev` | Start backend in watch mode |
| `build` | Compile TypeScript |
| `test` | Run unit tests |
| `test:e2e` | Run E2E tests (`DB_PATH=":memory:"` recommended) |
| `lint:ci` | Lint without auto-fix |

### Frontend (`npm run ... -w frontend`)

| Script | Description |
|---|---|
| `dev` | Start Vite dev server with HMR |
| `build` | Compile TypeScript & build production bundle |
| `test` | Run unit tests |
| `lint` | Run ESLint |

## Docker

### Build the image

```bash
docker build -t gaming-library .
```

### Run the container

```bash
docker run -d \
  -p 80:80 \
  -v gaming-library-data:/app/data \
  -e JWT_SECRET=your-secure-secret \
  gaming-library
```

The application will be available at **http://localhost**.

The Docker image includes:
- **nginx** as a reverse proxy (serves frontend + proxies API requests)
- **NestJS** backend (managed via supervisord)
- **SQLite** database (persisted in the `/app/data` volume)

## API Endpoints

All endpoints (except login) require a JWT token in the `Authorization: Bearer <token>` header.

| Method | Path | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/login` | Login (username + password) | Public |
| `GET` | `/api/auth/me` | Current user | Authenticated |
| `POST` | `/api/auth/change-password` | Change password | Authenticated |
| `GET` | `/api/games` | All games for the user | Authenticated |
| `GET` | `/api/games/:id` | Game details | Authenticated |
| `GET` | `/api/diary` | Diary entries | Authenticated |
| `POST` | `/api/diary` | Create diary entry | Authenticated |
| `PUT` | `/api/diary/:id` | Update diary entry | Authenticated |
| `DELETE` | `/api/diary/:id` | Delete diary entry | Authenticated |
| `GET` | `/api/games/:gameId/notes` | Notes for a game | Authenticated |
| `POST` | `/api/games/:gameId/notes` | Create note | Authenticated |
| `PUT` | `/api/notes/:id` | Update note | Authenticated |
| `DELETE` | `/api/notes/:id` | Delete note | Authenticated |
| `POST` | `/api/sync/steam` | Steam sync for own account | Authenticated |
| `GET` | `/api/settings` | Get settings | Authenticated |
| `PUT` | `/api/settings` | Update settings | Admin |
| `GET` | `/api/profile` | Own profile | Authenticated |
| `PUT` | `/api/profile` | Update profile | Authenticated |
| `GET` | `/api/admin/users` | All users | Admin |
| `POST` | `/api/admin/users` | Create user | Admin |
| `PUT` | `/api/admin/users/:id` | Update user | Admin |
| `DELETE` | `/api/admin/users/:id` | Delete user | Admin |
| `POST` | `/api/admin/sync-all` | Sync for all users | Admin |

## License

This project is unlicensed (private).
