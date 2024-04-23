import {factorial} from './calculate';
import {test, describe, expect} from "@jest/globals"; // this is optional, all three are global variables im runner scope

describe('factorial', () => {

    test('5! is 120', () => {
        expect(factorial(5)).toBe(120)
    });

    test('0! is 1', () => {
        expect(factorial(0)).toBe(1)
    });

    test('Factorial of negative int is throwing exception ', () => {
        expect(() => {
            factorial(-5);
        }).toThrow();
    });

})

describe('product', ()=>{


});

