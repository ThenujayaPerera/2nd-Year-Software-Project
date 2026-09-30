# NVSHOP.LK Project

Full-stack second-year software project with a Spring Boot backend and React/Vite frontend.

## Project Structure

```text
.
├── backend/   Spring Boot API, Gradle wrapper, database config
├── frontend/  React + Vite storefront
├── docs/      Project overview HTML/PDF and related generator script
└── run-project.bat
```

## Run Everything On Windows

```bat
run-project.bat
```

The launcher starts two terminals:

- Backend: `http://localhost:8080`
- Frontend: `http://localhost:5173`

Before running, make sure MySQL is running. The backend expects a `gpsd_project` database and uses the values from `.env` if you create one from `.env.example`.

## Configuration

```bat
copy .env.example .env
```

Edit `.env` for local database credentials, mail delivery, SMS delivery, or port changes. Blank mail/SMS credentials keep development fallback behavior where OTP delivery is logged/simulated instead of sent through a live provider.

## Manual Commands

```bat
cd backend
gradlew.bat bootRun
```

```bat
cd frontend
npm install
npm run dev
```
