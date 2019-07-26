import { mapObject } from './utils';

describe('utils', () => {
    describe('mapObject', () => {
        const iteratee = (key, value) => value * 2;
        const input = {
            one: 1,
            two: 2,
            three: 3,
        };
        const expectedOutput = {
            one: 2,
            two: 4,
            three: 6,
        };
        it('does nothing to empty object', () => {
            expect(mapObject({}, iteratee)).toEqual({});
        });
        it('applies iteratee to all members', () => {
            expect(mapObject(input, iteratee)).toEqual(expectedOutput);
        });
        it('does not mutate input', () => {
            const testInput = input;
            mapObject(input, iteratee);
            expect(testInput).toEqual(input);
        });
    });
});