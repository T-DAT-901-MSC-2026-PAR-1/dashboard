# Pages

This directory contains page components that correspond to routes.

## Structure

```
pages/
├── Home/          # Home page (/)
├── Dashboard/     # Main dashboard (/dashboard)
├── Settings/      # Settings page (/settings)
└── README.md
```

## Guidelines

### Page Components
- Each page should be in its own folder
- Page components are entry points for routes
- Should compose smaller components
- Handle page-level data fetching

### Folder Structure

```
Dashboard/
├── Dashboard.tsx       # Main page component
├── Dashboard.module.css # Page styles
├── Dashboard.spec.tsx  # Page tests
├── components/         # Page-specific components
│   ├── DashboardHeader.tsx
│   └── PriceGrid.tsx
└── index.ts           # Barrel export
```

## Current Routing

The app uses **React Router v6** with manual route configuration.

Routes are defined in `app/app.tsx`:

```typescript
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/dashboard" element={<DashboardPage />} />
  <Route path="/settings" element={<SettingsPage />} />
</Routes>
```

