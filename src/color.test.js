import {jest, test, expect} from "@jest/globals"; // this is optional, all three are global variables im runner scope
import {randomRGBColor} from './color'
import * as random from './random'

test ('Random color generates 3-tuple', () => {
    const spyRandomInt = jest.spyOn(random, 'randomInt');

    const color = randomRGBColor();

    expect(color).toBeInstanceOf(Array);
    expect(color).toHaveLength(3);
    const [red, green, blue] = color

    expect(red).toBeGreaterThanOrEqual(0);
    expect(red).toBeLessThanOrEqual(255);

    expect(spyRandomInt).toHaveBeenCalledTimes(3);
});
