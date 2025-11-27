# Services

This directory contains API clients and service layers for external communication.

## Structure

```
services/
├── api/              # REST API clients
│   ├── cryptoApi.ts
│   └── backendApi.ts
├── websocket/        # WebSocket services
│   └── kafkaStream.ts
└── README.md
```

## Guidelines

Services should:
- Handle all external communication
- Abstract API details from components
- Include error handling
- Be properly typed
- Use environment variables for URLs

## Example: API Service

```typescript
// services/api/backendApi.ts
const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export const backendApi = {
  async getCryptoPrices(symbol: string) {
    const response = await fetch(`${API_URL}/api/crypto/${symbol}`);
    if (!response.ok) throw new Error('Failed to fetch prices');
    return response.json();
  },

  async getCryptoHistory(symbol: string, timeframe: string) {
    const response = await fetch(
      `${API_URL}/api/crypto/${symbol}/history?timeframe=${timeframe}`
    );
    if (!response.ok) throw new Error('Failed to fetch history');
    return response.json();
  }
};
```

## Example: WebSocket Service

```typescript
// services/websocket/kafkaStream.ts
export class KafkaStreamService {
  private ws: WebSocket | null = null;

  connect(onMessage: (data: any) => void) {
    this.ws = new WebSocket('ws://localhost:3000/stream');

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  disconnect() {
    this.ws?.close();
  }
}
```

## Environment Variables

Use Vite environment variables (must be prefixed with `VITE_`):

```typescript
const API_URL = import.meta.env.VITE_BACKEND_URL;
const WS_URL = import.meta.env.VITE_WEBSOCKET_URL;
```

Set in `.env`:
```
VITE_BACKEND_URL=http://localhost:3000
VITE_WEBSOCKET_URL=ws://localhost:3000
```
