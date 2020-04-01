export function guardNumber(v: any): number {
    return Number(v) || 0;
}

export function guardInt(v: any): number {
    return Math.round(guardNumber(v));
}

export function guardRange(v: number, lower: number, upper: number): number {
    return Math.max(lower, Math.min(upper, v));
}

export function guardNonEmptyString(v: any, d: string): string {
    return String(v).trim() || d;
}
