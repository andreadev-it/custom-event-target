import { CustomEventTarget } from '../dist/CustomEventTarget.js';
import { describe, test } from 'node:test';
import assert from 'node:assert';
import { waitFor } from './utils.js';

describe("CustomEventTarget should", () => {
    test("be instanced without errors", () => {
        let x = new CustomEventTarget();
        assert.ok(x instanceof CustomEventTarget);
    });

    test("allow adding listeners (both sync and async) to events", () => {
        let target = new CustomEventTarget();

        let foo = () => {};
        let bar = async () => {};

        target.addListener("load", foo);
        target.addListener("load", bar);

        assert.equal(target.listeners.size, 1);
        let eventListeners = target.listeners.get("load");
        assert.equal(eventListeners.length, 2);
    });

    test("allow removing listeners", () => {
        let target = new CustomEventTarget();

        let foo = () => {}
        let bar = () => {}

        target.addListener("load", foo);
        target.addListener("load", bar);
        
        target.removeListener("load", foo);

        let eventListeners = target.listeners.get("load");
        assert.equal(eventListeners.length, 1);

        target.removeListener("load", bar);
        assert.equal(eventListeners.length, 0);
    });

    test("call synchronous callback in order", () => {
        let target = new CustomEventTarget();
        let results = [];

        target.addListener("load", () => results.push("first"));
        target.addListener("load", () => results.push("second"));
        target.addListener("load", () => results.push("third"));

        target.fireEventSync("load", {});

        assert.deepEqual(results, ["first", "second", "third"]);
    });

    test("call asynchronous and synchronous callback in order", async () => {
        let target = new CustomEventTarget();
        let results = [];

        target.addListener("load", () => results.push("first"));
        target.addListener("load", async () => results.push("second"));
        target.addListener("load", async () => results.push("third"));
        target.addListener("load", () => results.push("fourth"));

        await target.fireEvent("load", {});

        assert.deepEqual(results, ["first", "second", "third", "fourth"]);
    });

    test("call asynchronous callback in order (should take ~800ms)", async () => {
        let target = new CustomEventTarget();
        let results = [];

        target.addListener("load", async () => { await waitFor(200); results.push("first") });
        target.addListener("load", async () => { await waitFor(200); results.push("second") });
        target.addListener("load", async () => { await waitFor(200); results.push("third") });
        target.addListener("load", async () => { await waitFor(200); results.push("fourth") });

        await target.fireEvent("load", {});

        assert.deepEqual(results, ["first", "second", "third", "fourth"]);
    });

    test("wait for all asynchronous callback to finish executing when using fireEventAsync (should take ~500ms)", async () => {
        let target = new CustomEventTarget();
        let count = 0;

        target.addListener("load", async () => {
            await waitFor(500);
            count++;
        });

        target.addListener("load", async () => {
            await waitFor(500);
            count++;
        });

        target.addListener("load", async () => {
            await waitFor(500);
            count++;
        });

        await target.fireEventAsync("load", {});

        assert.equal(count, 3);
    });

    test("not be able to wait for asynchronous callback when using fireEventSync", () => {
        let target = new CustomEventTarget();
        let count = 0;

        target.addListener("load", async () => {
            await waitFor(100);
            count++; 
        });

        target.addListener("load", async () => {
            await waitFor(100);
            count++; 
        });

        target.addListener("load", async () => {
            await waitFor(100);
            count++; 
        });

        target.fireEventSync("load", {});

        assert.notEqual(count, 3);
    });
})
