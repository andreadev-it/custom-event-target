declare type Listener = (a: EventDetails) => void | Promise<void>;
declare type EventDetails = any;
export declare class CustomEventTarget {
    private listeners;
    constructor();
    addListener(event: string, listener: Listener): void;
    removeListener(event: string, listener: Listener): void;
    /**
     * Call all the listeners for a specific event in a synchronous way.
     * If an async listener is found, it gets awaited before continuing.
     */
    fireEvent(event: string, details: EventDetails): Promise<void>;
    /**
     * Call all the listeners for a specific event in an asynchronous way.
     * All the async listeners found are awaited using Promise.all().
     */
    fireEventAsync(event: string, details: EventDetails): Promise<void>;
    /**
     * Call all the listeners for a specific event as if they were all
     * synchronous functions. Not recommended, since it doesn't handle
     * async at all. Only use it when all listeners are synchronous.
     */
    fireEventSync(event: string, details: EventDetails): void;
}
export {};
