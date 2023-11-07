export function waitFor(ms: number) {
    return new Promise((resolve, _) => {
        setTimeout(resolve, ms);
    });
}
