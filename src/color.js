import {randomInt} from "./random";

function randomRGBColor(minimumValue = 0){
    return [
        randomInt(minimumValue, 255),
        randomInt(minimumValue, 255),
        randomInt(minimumValue, 255),
    ]
}

export {randomRGBColor}