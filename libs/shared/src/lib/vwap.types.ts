export interface VwapMessage {
    window_start: string;
    window_end: string;
    market: string;
    from_symbol: string;
    to_symbol: string;
    vwap: number;
    volume: number;
}

export interface VwapSubscription {
    market: string;
    from_symbol: string;
    to_symbol: string;
}

export enum WebSocketEvent {
    SUBSCRIBE_VWAP = 'subscribe_vwap',
    UNSUBSCRIBE_VWAP = 'unsubscribe_vwap',
    VWAP_UPDATE = 'vwap_update',
    ERROR = 'error',
}

export interface ServerToClientEvents {
    [WebSocketEvent.VWAP_UPDATE]: (data: VwapMessage) => void;
    [WebSocketEvent.ERROR]: (error: { message: string }) => void;
}

export interface ClientToServerEvents {
    [WebSocketEvent.SUBSCRIBE_VWAP]: (subscription: VwapSubscription) => void;
    [WebSocketEvent.UNSUBSCRIBE_VWAP]: (subscription: VwapSubscription) => void;
}