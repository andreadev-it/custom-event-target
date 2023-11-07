type Listener = (a: EventDetails) => void | Promise<void>;
type EventDetails = any;


export class CustomEventTarget {
    private listeners: Map<string, Listener[]>;

    constructor() {
        this.listeners = new Map();
    }

    addListener(event: string, listener: Listener) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }

        this.listeners.get(event)!.push(listener);
    }

    removeListener(event: string, listener: Listener) {
        if (!this.listeners.has(event)) return;

        let listeners = this.listeners.get(event)!;

        let index = listeners.findIndex((x: Listener) => x === listener);
        if (index >= 0) {
            listeners.splice(index, 1);
        }

        this.listeners.set(event, listeners);
    }

    /**
     * Call all the listeners for a specific event in a synchronous way.
     * If an async listener is found, it gets awaited before continuing.
     */
    async fireEvent(event: string, details: EventDetails) {
        if (!this.listeners.has(event)) return;

        for (let listener of this.listeners.get(event)!) {
            let val = listener(details);
            if (val instanceof Promise) {
                await val;
            }
        }
    }

    /**
     * Call all the listeners for a specific event in an asynchronous way.
     * All the async listeners found are awaited using Promise.all().
     */
    async fireEventAsync(event: string, details: EventDetails) {
        if (!this.listeners.has(event)) return;

        let promises: Promise<void>[] = [];

        for (let listener of this.listeners.get(event)!) {
            let ret = listener(details);
            if (ret instanceof Promise) {
                promises.push(ret);
            }
        }

        await Promise.all(promises);
    }

    /**
     * Call all the listeners for a specific event as if they were all
     * synchronous functions. Not recommended, since it doesn't handle
     * async at all. Only use it when all listeners are synchronous.
     */
    fireEventSync(event: string, details: EventDetails) {
        if (!this.listeners.has(event)) return;

        for (let listener of this.listeners.get(event)!) {
            listener(details);
        }
    }
}
