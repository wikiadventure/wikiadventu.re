export function generateCloseNumbers(start: number, min: number, max: number, length:number) {
    const size = length > (max-min) ? (max-min) : length;
    const alternatingGenerator = alternatingSequence(start);
    
    function generateBatch() {
        const result: number[] = [];
        while (result.length < size) {
            const next = alternatingGenerator.next().value;
            if (next < min || next > max) {
                continue;
            }
            result.push(next);
        }
        return result;
    }

    return { generateBatch };
}

export function* alternatingSequence(start: number): Generator<number> {
    let higher = start + 1;
    let lower = start - 1;
    let toggle = true;

    yield start; // Start with the initial value

    while (true) {
        if (toggle) {
            yield higher++;
        } else {
            yield lower--;
        }
        toggle = !toggle; // Alternate between higher and lower
    }
}

export function createSeededRandomGenerator(seed: string): (max: number) => number {
    // Hash the string seed to produce a numeric seed
    let state = hashStringToSeed(seed);

    return function random(max: number): number {
        // Xorshift algorithm
        state ^= state << 13;
        state ^= state >>> 17;
        state ^= state << 5;

        // Convert to an integer between 0 and max
        return Math.floor((state >>> 0) / 0xFFFFFFFF * max);
    };
}


export function hashStringToSeed(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0; // Convert to 32-bit integer
    }
    return hash >>> 0; // Ensure it's an unsigned integer
}
