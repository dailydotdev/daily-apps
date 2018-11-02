export function ratioToSize(ratio: number): string {
    if (ratio > 1.5) {
        return 'small';
    }

    if (ratio <= 0.75) {
        return 'large';
    }

    return 'medium';
}