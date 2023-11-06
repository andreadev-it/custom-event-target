export function waitFor(ms) {
    return new Promise((resolve, _) => {
        setTimeout(resolve, ms);
    });
}

