import {jest, test, expect, describe} from "@jest/globals"; // this is optional, all three are global variables im runner scope
import app from './app.js';
import request from "supertest";
// import {response} from "express";

describe('avatar api', ()=> {

    const TEST_DATA = {
        "avatarName": "Ed",
        "childAge": 5,
        "skinColor": "#f5df9d",
        "hairstyle": "messy_bun",
        "headShape": "oval",
        "upperClothing": "hoodie",
        "lowerClothing": "jeans"
    }

// post, create new avatar
    test('create avatar', async() => {
        const createResponse = await request(app)
            .post('/api/avatars')
            .send(TEST_DATA)
            .set('Accept', 'application/json')
            .expect(201);

            expect(createResponse.body.id).toBeDefined();
            expect(createResponse.body.createdAt).toBeDefined();
            expect(createResponse.body).toMatchObject(TEST_DATA);

    // get one request
        const getOneResponse = await request(app)
            .get(`/api/avatars/${createResponse.body.id}`)
            .set('Accept', 'application/json')
            .expect(200);

        expect(getOneResponse.body.id).toBeGreaterThan(0);
        expect(getOneResponse.body.createdAt).toBeDefined();
        expect(getOneResponse.body).toMatchObject(TEST_DATA);
    });

    //get all, post new, get all avatars and check if new is included
    test('create avatar and get all', async() => {

        const getAllResponse = await request(app)
            .get(`/api/avatars`)
            .set('Accept', 'application/json')
            .expect(200);

        const createResponse = await request(app)
                .post('/api/avatars')
                .send(TEST_DATA)
                .set('Accept', 'application/json')
                .expect(201);

        // const newAvatarId = createResponse.body.id
        const getAllWithNewResponse = await request(app)
            .get('/api/avatars')
            .set('Accept', 'application/json')
            .expect(200);

        expect(getAllResponse.body.length + 1).toEqual(getAllWithNewResponse.body.length)
    });


    //delete avatar: first create, and then delete newly created avatar and check if its deleted
    test('delete avatar', async() => {

        const createResponse = await request(app)
            .post('/api/avatars')
            .send(TEST_DATA)
            .set('Accept', 'application/json')
            .expect(201);

        const newAvatarId = createResponse.body.id
        // delete by id
        await request(app)
            .delete(`/api/avatars/${newAvatarId}`)
            .set('Accept', 'application/json')
            .expect(204); // no content

        const getAllResponse = await request(app)
            .get('/api/avatars')
            .set('Accept', 'application/json')
            .expect(200);

        const avatarIsTrue = getAllResponse.body.some(avatar => avatar.id === newAvatarId);
        expect(avatarIsTrue).toBe(false);
        expect(getAllResponse.body).not.toContain(newAvatarId);
        //expect(getAllResponse.body.length).toEqual(createResponse.body.length - 1); //this lind doesnt work because of different data type
    })


// // update: create, put, get if its there, or its changed
//     test('update avatar', async() => {
//     // create avatar
//     const createResponse = await request(app)
//         .post('/api/avatars')
//         .send(TEST_DATA)
//         .set('Accept', 'application/json')
//         .expect(201);
//
//     // Define the updated data for the avatar
//     const updatedData = {
//         "avatarName": "Eddie"
//     };
//
//     const avatarId = createResponse.body.id
//
//     // update avatar
//     await request(app)
//         .put(`/api/avatars/${avatarId}`)
//         .send(updatedData)
//         .set('Accept', 'application/json')
//         .expect(200); // for a successful update
//
//     // Retrieve the updated avatar to verify changes
//     const updateResponse = await request(app)
//         .get(`/api/avatars/${avatarId}`)
//         .set('Accept', 'application/json')
//         .expect(200);
//
//     // Verify the avatar has been updated
//     expect(updateResponse.body.avatarName).toBe("Eddie");
//
//     });

    test("create avatar requires at least avatar name ad child's age", async() => {
        const test_data1 = {
            "skinColor": "#f5df9d",
            "hairstyle": "messy_bun",
            "headShape": "oval",
            "upperClothing": "hoodie",
            "lowerClothing": "jeans"
        }

        const createResponse = await request(app)
            .post('/api/avatars')
            .send(test_data1)
            .set('Accept', 'application/json')
            .expect(400);
    });

    test('create avatar when dress is upperClothing', async() => {
        const test_data2 = {
            "avatarName": "Ed",
            "childAge": 5,
            "skinColor": "#f5df9d",
            "hairstyle": "messy_bun",
            "headShape": "oval",
            "upperClothing": "dress",
            "lowerClothing": "jeans"
        }

        const createResponse = await request(app)
            .post('/api/avatars')
            .send(test_data2)
            .set('Accept', 'application/json')
            .expect(400);
    });

    test('create avatar when dress is not upperClothing', async() => {
        const test_data3 = {
            "avatarName": "Ed",
            "childAge": 5,
            "skinColor": "#f5df9d",
            "hairstyle": "messy_bun",
            "headShape": "oval",
            "upperClothing": "hoodie",
            "lowerClothing": "jeans"
        }

        const createResponse = await request(app)
            .post('/api/avatars')
            .send(test_data3)
            .set('Accept', 'application/json')
            .expect(201);
    });

});