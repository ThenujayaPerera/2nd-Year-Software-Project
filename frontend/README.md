# NVSHOP.LK Frontend

React + Vite storefront for the NVSHOP.LK project.

## Run From Project Root

Use the root launcher:

```bat
..\run-project.bat
```

## Run Manually

```bat
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` and talks to the backend API at `http://localhost:8080/api` by default.

## Structure

```text
src/
├── components/  Shared UI and layout components
├── data/        Mock product/catalog data
├── pages/       Route-level screens
├── services/    API client
└── store.js     Zustand state
```
