# Steam Gaming Library

Eine persönliche Web-Anwendung zur Verwaltung deiner Steam-Spielesammlung mit Tagebuch, Notizen und Multi-User-Support.

## Features

### Spielebibliothek
- Automatischer Import aller Spiele aus deiner Steam-Bibliothek via Steam Web API
- Detailansicht pro Spiel mit Headerbildern, Genre-Tags und Spielzeit
- Such- und Sortierfunktionen (Name, Spielzeit, Genre)

### Spieletagebuch
- Gaming-Sessions als Tagebucheinträge festhalten
- Pro Eintrag: Titel, Inhalt, Spieldatum, Stunden und Bewertung (1-5 Sterne)
- Einträge filtern nach Spiel oder Zeitraum

### Notizen
- Freie Notizen pro Spiel anlegen (Tipps, Guides, Gedanken)
- Markdown-artige Textfelder mit Erstellungs- und Änderungsdatum

### Multi-User & Authentifizierung
- JWT-basierte Authentifizierung mit Passport.js (Local + JWT Strategy)
- Rollenbasierte Zugriffskontrolle (Admin / User)
- Jeder Nutzer hat seine eigene, isolierte Spielesammlung
- Standard-Admin wird beim ersten Start automatisch angelegt (`admin` / `admin`)
- Pflicht zur Passwortänderung beim ersten Login

### Admin-Bereich
- Nutzerverwaltung: Anlegen, Aktivieren/Deaktivieren, Rollenänderung, Löschen
- Steam-Sync für alle Nutzer gleichzeitig auslösen
- Globalen Steam API Key verwalten

### Benutzerprofil
- Eigene Steam ID hinterlegen (wird für den Bibliotheks-Sync benötigt)
- Anzeigename ändern
- Passwort ändern

### Steam-Sync
- Nutzer können ihren eigenen Sync triggern (sofern Steam ID hinterlegt)
- Admin kann Sync für alle Nutzer gleichzeitig starten
- Globaler Steam API Key (vom Admin verwaltet)

## Tech-Stack

| Komponente | Technologie |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, React Router, CSS Modules |
| **Backend** | NestJS 11, TypeScript, Passport.js, JWT |
| **Datenbank** | SQLite (better-sqlite3) via TypeORM |
| **Architektur** | Clean Architecture (Domain → Application → Interface Adapters → Infrastructure) |
| **Auth** | Passport.js (Local Strategy + JWT Strategy), bcrypt |
| **CI/CD** | GitHub Actions (Lint, Test, Build, Docker Push) |
| **Deployment** | Docker (Multi-Stage Build), nginx + supervisord |

## Projektstruktur

```
gaming-library/
├── backend/                    # NestJS Backend
│   ├── src/
│   │   ├── domain/             # Entities & Repository-Interfaces
│   │   ├── application/        # Use-Cases & Ports
│   │   ├── interface-adapters/ # Controller, DTOs, Presenter
│   │   ├── infrastructure/     # TypeORM, Passport, Module, Seeding
│   │   └── shared/             # Gemeinsame Typen & Konstanten
│   └── test/                   # E2E-Tests
├── frontend/                   # React Frontend
│   └── src/
│       ├── pages/              # Login, Library, GameDetail, Diary, Admin, Profil, Settings
│       ├── components/         # Layout (Sidebar, etc.)
│       ├── contexts/           # AuthContext
│       ├── hooks/              # Custom Hooks
│       ├── api/                # API-Client & Endpunkt-Module
│       └── types/              # TypeScript Interfaces
├── Dockerfile                  # Multi-Stage Docker Build
├── nginx.conf                  # Reverse Proxy Konfiguration
├── supervisord.conf            # Prozess-Manager (nginx + NestJS)
└── .github/workflows/ci.yml   # CI/CD Pipeline
```

## Voraussetzungen

- **Node.js** >= 22
- **npm** >= 10
- Einen **Steam Web API Key** (kostenlos unter https://steamcommunity.com/dev/apikey)

## Lokale Entwicklung

### 1. Repository klonen & Dependencies installieren

```bash
git clone <repository-url>
cd gaming-library
npm install
```

### 2. Backend starten

```bash
npm run start:dev -w backend
```

Das Backend startet auf **http://localhost:3001** und erstellt automatisch:
- Eine SQLite-Datenbank unter `backend/data/gaming_library.db`
- Einen Standard-Admin-Account: **Benutzer:** `admin` / **Passwort:** `admin`

### 3. Frontend starten

```bash
npm run dev -w frontend
```

Das Frontend startet auf **http://localhost:5173** und leitet API-Anfragen automatisch an das Backend (Port 3001) weiter.

### 4. Einloggen & Einrichten

1. Öffne http://localhost:5173
2. Login mit `admin` / `admin`
3. Du wirst aufgefordert, das Passwort zu ändern
4. Unter **Einstellungen** den Steam API Key eintragen
5. Unter **Profil** deine Steam ID hinterlegen
6. Über den **Sync**-Button in der Sidebar deine Spielesammlung importieren

## Umgebungsvariablen

| Variable | Standard | Beschreibung |
|---|---|---|
| `PORT` | `3001` | Port für das NestJS Backend |
| `DB_PATH` | `./data/gaming_library.db` | Pfad zur SQLite-Datenbank |
| `JWT_SECRET` | `gaming-library-secret-dev-key` | Secret für JWT-Token-Signierung (in Produktion ändern!) |

## Scripts

### Backend (`npm run ... -w backend`)

| Script | Beschreibung |
|---|---|
| `start:dev` | Startet Backend im Watch-Modus |
| `build` | Kompiliert TypeScript |
| `test` | Unit-Tests ausführen |
| `test:e2e` | E2E-Tests ausführen (`DB_PATH=":memory:"` empfohlen) |
| `lint:ci` | Lint ohne Auto-Fix |

### Frontend (`npm run ... -w frontend`)

| Script | Beschreibung |
|---|---|
| `dev` | Startet Vite Dev-Server mit HMR |
| `build` | Kompiliert TypeScript & baut Produktions-Bundle |
| `test` | Unit-Tests ausführen |
| `lint` | ESLint ausführen |

## Docker

### Image bauen

```bash
docker build -t gaming-library .
```

### Container starten

```bash
docker run -d \
  -p 80:80 \
  -v gaming-library-data:/app/data \
  -e JWT_SECRET=dein-sicheres-secret \
  gaming-library
```

Die Anwendung ist dann unter **http://localhost** erreichbar.

Das Docker-Image enthält:
- **nginx** als Reverse Proxy (Frontend-Auslieferung + API-Proxy)
- **NestJS** Backend (via supervisord verwaltet)
- **SQLite** Datenbank (persistiert im Volume `/app/data`)

## API-Endpunkte

Alle Endpunkte (außer Login) erfordern einen JWT-Token im `Authorization: Bearer <token>` Header.

| Methode | Pfad | Beschreibung | Zugriff |
|---|---|---|---|
| `POST` | `/api/auth/login` | Login (Username + Passwort) | Alle |
| `GET` | `/api/auth/me` | Aktueller Benutzer | Authentifiziert |
| `POST` | `/api/auth/change-password` | Passwort ändern | Authentifiziert |
| `GET` | `/api/games` | Alle Spiele des Nutzers | Authentifiziert |
| `GET` | `/api/games/:id` | Spiel-Details | Authentifiziert |
| `GET` | `/api/diary` | Tagebucheinträge | Authentifiziert |
| `POST` | `/api/diary` | Tagebucheintrag erstellen | Authentifiziert |
| `PUT` | `/api/diary/:id` | Tagebucheintrag bearbeiten | Authentifiziert |
| `DELETE` | `/api/diary/:id` | Tagebucheintrag löschen | Authentifiziert |
| `GET` | `/api/games/:gameId/notes` | Notizen für ein Spiel | Authentifiziert |
| `POST` | `/api/games/:gameId/notes` | Notiz erstellen | Authentifiziert |
| `PUT` | `/api/notes/:id` | Notiz bearbeiten | Authentifiziert |
| `DELETE` | `/api/notes/:id` | Notiz löschen | Authentifiziert |
| `POST` | `/api/sync/steam` | Steam-Sync für eigenen Account | Authentifiziert |
| `GET` | `/api/settings` | Einstellungen abrufen | Authentifiziert |
| `PUT` | `/api/settings` | Einstellungen ändern | Admin |
| `GET` | `/api/profile` | Eigenes Profil | Authentifiziert |
| `PUT` | `/api/profile` | Profil bearbeiten | Authentifiziert |
| `GET` | `/api/admin/users` | Alle Benutzer | Admin |
| `POST` | `/api/admin/users` | Benutzer anlegen | Admin |
| `PUT` | `/api/admin/users/:id` | Benutzer bearbeiten | Admin |
| `DELETE` | `/api/admin/users/:id` | Benutzer löschen | Admin |
| `POST` | `/api/admin/sync-all` | Sync für alle Benutzer | Admin |

## Lizenz

Dieses Projekt ist unlizenziert (privat).
