import joi from 'joi';

export default joi.object( {
    id: joi.any(),
    createdAt: joi.any(),

    avatarName: joi
        .string()
        .max(20)
        .required(),

    childAge: joi
        .number()
        .integer()
        .min(0)
        .max(100)
        .required(),

    skinColor: joi
        .string()
        .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
        .required(),

    hairstyle: joi
        .string()
        .valid('classic_bob', 'messy_bun', 'long_layers', 'pixie_cut')
        .default('classic_bob'),

    headShape: joi
        .string()
        .valid('oval', 'round', 'square', 'diamond')
        .default('oval'),

    upperClothing: joi
        .string()
        .valid('tshirt', 'dress', 'hoodie', 'sweater')
        .default('tshirt'),

    lowerClothing: joi.alternatives()
        .conditional(
            'upperClothing', {
                is: 'dress',
                then: joi.forbidden(), //.optional(),
                otherwise: joi
                    .string()
                    .valid('jeans', 'leggings', 'shorts', 'skirt')
                    .default('shorts')
            }),
});

// const newAvatar = {
//     "avatarName": "Ed", //required, string, not empty, length limit
//     "childAge": 5, // required, integer, min 4, max 100
//     "skinColor": "#f5df9d", // required, rgb, hex, dez, presets
//     "hairstyle": "messy_bun", // required/ default: 'classic_bob', ''
//     "headShape": "oval", // default: 'oval', 'round', 'square'
//     "upperClothing": "hoddie", // default: 'tshirt'
//     "lowerClothing": "jeans" //  default: 'shorts'
// }

