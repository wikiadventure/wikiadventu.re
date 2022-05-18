type OptionalNumber = number | null | undefined;

declare const roundCountMarker: unique symbol;
export type roundCount = number & {[roundCountMarker]: true;};

export function Round(n:OptionalNumber, defaultValue:number) {
    return (n == null ? defaultValue : n < 1 ? 1 : n > 20 ? 20 : n) as roundCount;
}

declare const voteDurationMarker: unique symbol;
export type voteDuration = number & {[voteDurationMarker]: true;};

export function VoteDuration(n:OptionalNumber, defaultValue:number) {
    return (n == null ? defaultValue : n < 0 ? 0 : n > 1800 ? 1800 : n) as voteDuration;
}

declare const playDurationMarker: unique symbol;
export type playDuration = number & {[playDurationMarker]: true;};

export function PlayDuration(n:OptionalNumber, defaultValue:number) {
    return (n == null ? defaultValue : n < 0 ? 0 : n > 3600 ? 3600 : n) as playDuration;
}
