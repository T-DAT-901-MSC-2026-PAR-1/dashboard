# Hooks

This directory contains custom React hooks for the application.

## Guidelines

Custom hooks should:
- Start with `use` prefix
- Be reusable and composable
- Handle a single responsibility
- Be properly typed with TypeScript

## Common Patterns

### Data Fetching Hooks
```typescript
// Exemple :
useKafkaStream()    // Subscribe to Kafka stream
useCryptoPrice()    // Fetch crypto prices
usePriceHistory()   // Fetch price history
```

### State Management Hooks
```typescript
// Exemple :
useWebSocket()      // WebSocket connection
useLocalStorage()   // Persist state to localStorage
useDebounce()       // Debounce values
```

### UI Hooks
```typescript
// Exemple :
useTheme()          // Theme management
useMediaQuery()     // Responsive design
useClickOutside()   // Click outside detection
```

## Naming Convention

Use descriptive names that indicate what the hook does:
- `useCryptoPrice.ts` - fetches crypto prices
- `useWebSocket.ts` - manages WebSocket connection
- `useDebounce.ts` - debounces values

## Example

```typescript
// useCryptoPrice.ts
import { useState, useEffect } from 'react';

export function useCryptoPrice(symbol: string) {
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Fetch logic here
  }, [symbol]);

  return { price, loading, error };
}
```
