export const wait = (msTime: number) => {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve();
        }, msTime)
    });
}