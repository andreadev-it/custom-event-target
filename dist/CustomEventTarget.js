export class CustomEventTarget {
    listeners;
    constructor() {
        this.listeners = new Map();
    }
    addListener(event, listener) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(listener);
    }
    removeListener(event, listener) {
        if (!this.listeners.has(event))
            return;
        let listeners = this.listeners.get(event);
        listeners = listeners.splice(listeners.findIndex((x) => x === listener), 1);
        this.listeners.set(event, listeners);
    }
    /**
     * Call all the listeners for a specific event in a synchronous way.
     * If an async listener is found, it gets awaited before continuing.
     */
    async fireEvent(event, details) {
        if (!this.listeners.has(event))
            return;
        for (let listener of this.listeners.get(event)) {
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
    async fireEventAsync(event, details) {
        if (!this.listeners.has(event))
            return;
        let promises = [];
        for (let listener of this.listeners.get(event)) {
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
    fireEventSync(event, details) {
        if (!this.listeners.has(event))
            return;
        for (let listener of this.listeners.get(event)) {
            listener(details);
        }
    }
}
