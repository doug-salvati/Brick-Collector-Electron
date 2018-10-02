import removeSpares from '../removeSpares';

const testData = [
    {p_id: '12345'},
    {p_id: '54321'},
    {p_id: '23456'},
    {p_id: '74632'},
    {p_id: '98765'},
];
const testDataDup = [...testData, {p_id: '74632'}];

const testDataSorted = [
    {p_id: '12345'},
    {p_id: '23456'},
    {p_id: '54321'},
    {p_id: '74632'},
    {p_id: '98765'},
]

describe('[util] remove spares', () => {
    it('only sorts if there are no duplicates', () => {
        const actual = removeSpares(testData);
        const expected = testDataSorted;
        expect(actual).toEqual(expected);
    });
    it('removes duplicates', () => {
        const actual = removeSpares(testDataDup);
        const expected = testDataSorted;
        expect(actual).toEqual(expected);
    });
})