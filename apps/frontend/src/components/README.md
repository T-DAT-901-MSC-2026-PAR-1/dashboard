# Components

This directory contains all React components used in the application.

## Structure

```
components/
├── common/        # Reusable UI components (buttons, inputs, cards, etc.)
├── layout/        # Layout components (header, sidebar, footer, etc.)
├── charts/        # Chart components (using lightweight-charts)
└── README.md
```

## Guidelines

### Common Components
Place reusable UI components that can be used across the entire app:
- Buttons
- Inputs
- Cards
- Modals
- Loaders
- etc.

### Layout Components
Components that define the app structure:
- Header
- Sidebar
- Footer
- Navigation
- PageContainer

### Chart Components
Cryptocurrency visualization components:
- CandlestickChart
- LineChart
- VolumeChart
- PriceChart
- etc.

## Naming Convention

- Use PascalCase for component files: `Button.tsx`, `PriceChart.tsx`
- Export default for main component
- Co-locate styles if using CSS modules: `Button.module.css`
- Co-locate tests: `Button.spec.tsx`

## Example Structure

```
common/
├── Button/
│   ├── Button.tsx
│   ├── Button.module.css
│   ├── Button.spec.tsx
│   └── index.ts
```
