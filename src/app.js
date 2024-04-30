import express from 'express'
const app = express();
import * as path from "path";
import fs from 'fs';
import {v4 as uuid} from 'uuid';
import avatarSchema from "./avatar.schema.js";
import passport from 'passport';
import {Strategy} from 'passport-http-bearer';
import {BasicStrategy} from 'passport-http';
import bcrypt from "bcrypt";
import {isChild, isParent} from "./roles.js";

//app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.authenticate('bearer', {session:false}))



const user_file = path.join(process.cwd(), './src/database/users.json');
if (!fs.existsSync(user_file)) {
    fs.writeFileSync(user_file, JSON.stringify([]))
}

passport.use(new Strategy (function(token, done) {
    try{
        const users = JSON.parse(fs.readFileSync(user_file, 'utf-8'))
        const user = users.find(user => user.token === token)
        if(user){
            done(null, user);
        } else {
            done(null, false)
        }
    } catch (error) {
        done(error)
    }
}));


app.get('/',  (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`)
});


passport.use(new BasicStrategy (
    async function (userId, password, done) {
    try{
        const users = JSON.parse(fs.readFileSync(user_file, 'utf-8'))
        const user = users.find(user => user.userId === userId)
        if (user) {
            const isCorrect = await bcrypt.compare(password, user.password);
            if(isCorrect) {
                done(null, user);
            } else {
                done(null, false);
            }
        } else {
            done(null, false);
        }
    } catch (error) {
        done(error)
    }
}));

app.post('/api/users',
    passport.authenticate('basic', {session:false}),
    isParent,
    (req, res) => {
    const userData = {
        name: req.body.name,
        userId: req.body.userId,
        password: req.body.password,
        roles: req.body.roles
    }

    try{
        const data = fs.readFileSync(user_file);
        const users = JSON.parse(data);
        users.push(userData);
        fs.writeFileSync(user_file, JSON.stringify(users), {flag: 'w'})
        res.status(201).send('')
    } catch (error) {
        res.status(500).send('')
    }
})




// create new avatars
app.post('/api/avatars', (req, res) => {
    console.log(req.body);
    console.log("POST /api/avatars");

    const avatarData = {
        id: uuid(),
        avatarName: req.body.avatarName,
        childAge: parseInt(req.body.childAge),
        skinColor: req.body.skinColor,
        hairstyle: req.body.hairstyle,
        headShape: req.body.headShape,
        upperClothing: req.body.upperClothing,
        lowerClothing: req.body.lowerClothing,
        createdAt: new Date().toISOString()
    }

    try {
        // validation
        const {error, value} = avatarSchema.validate(avatarData);
        if (error) {
            res.status(400).send(JSON.stringify(error))
            console.log('validation error: ', error.details);
        } else {
            console.log('validated data: ', value);
        }

        // create and write in json file
        const data = fs.readFileSync('./src/database/avatars.json');
        const avatars = JSON.parse(data);
        avatars.push(avatarData);
        fs.writeFileSync('./src/database/avatars.json', JSON.stringify(avatars), {flag: 'w'})

        res.status(201).set("Location", `/avatar/${avatarData.id}`).send(avatarData); // new data created
    } catch(e) {
        res.status(500).send(JSON.stringify(e));
    }
});

/*
app.get('/avatars',  (req, res) => {
    try {
        const avatars = fs.readFileSync('./src/database/avatars.json');
        const avatarData = JSON.parse(avatars);

        res.send(`
            <h1>Avatars List</h1>
            <ul>
                ${avatarData.map(avatar =>
            `<li>${avatar.avatarName} - <a href="/avatars/${avatar.id}">Show Details</a></li>`
        ).join('')}
            </ul>
        `);
    } catch (e) {
        res.status(500).send('error reading avatar data')
    }
});


app.get(`/avatars/:id`, (req, res) => {
    try {
        const data = fs.readFileSync('./src/database/avatars.json');
        const avatarData = JSON.parse(data);


        // avatar that meets the requirement
        const avatar = avatarData.find(a =>
            a.id.toString() === req.params.id)

        if (avatar) {
            const headers = Object.keys(avatar).map(key => `<th>${key}</th>`).join('');
            const cells = Object.values(avatar).map(value => `<td>${value}</td>`).join('');

            const html = `
                <h1>Details for ${avatar.avatarName}</h1>
                <table border="1">
                    <tr>${headers}</tr>
                    <tr>${cells}</tr>
                </table>
            `;
            res.send(html);
        } else {
            res.status(404).send('avatar not found');
        }
    } catch (e) {
        res.status(500).send('error reading avatar data')
    }
});

 */

// read all avatars
app.get('/api/avatars',
        passport.authenticate('bearer', {session:false}),
        (req, res) => {
    fs.readFile('./src/database/avatars.json', (err, data) => {
        if (err) {
            // Handle file read error
            res.status(500).send('Failed to read database');
        }

        try {
            // Parse the JSON data and send it as a response
            const avatars = JSON.parse(data);
            res.status(200).json(avatars);
        } catch (parseError) {
            // Handle JSON parsing error
            res.status(500).send('Error parsing data');
        }
    });
});

// read one avatar
app.get('/api/avatars/:id', (req, res) => {
    fs.readFile('./src/database/avatars.json', (err, data) => {
        if (err) {
            res.status(500).send('Failed to read database');
        }

        try {
            const avatars = JSON.parse(data);
            const avatar = avatars.find(a => a.id === parseInt(req.params.id, 10));

            if (!avatar) {
                res.status(404).send('Avatar not found');
            } else {
                res.status(200).json(avatar);
            }
        } catch (parseError) {
            res.status(500).send('Error parsing data');
        }
    });
});


// update avatars (specify the avatar by id)
app.put('/api/avatars/:id', (req, res) => {
    fs.readFileSync('./src/database/avatars.json', () => {

        let avatarData = JSON.parse(data);
        let found = false;

        avatarData = avatarData.map(avatar => {
            if (avatar.id === Number(req.params.id)) {
                found = true;
                return { ...avatar, ...req.body };  // Update the avatar with new properties from req.body
            }
        });

        if (!found) {
            res.status(404).send('Avatar not found');
        } else {
            res.sendStatus(204);
        }
    });
});

// delete avatars (specify the avatar by id)
app.delete('/api/avatars/:id', (req, res) => {
    fs.readFile('./src/database/avatars.json', (err, data) => {
        if (err) {
            res.status(500).send('Failed to read database');
            return;
        }

        let avatars;
        try {
            avatars = JSON.parse(data);
        } catch (parseError) {
            res.status(500).send('Error parsing data');
            return;
        }

        const avatarIndex = avatars.findIndex(a => a.id === parseInt(req.params.id, 10));
        if (avatarIndex === -1) {
            res.status(404).send('Avatar not found');
        } else {
            avatars.splice(avatarIndex, 1);  // Remove the avatar from the array
            fs.writeFile('./src/database/avatars.json', JSON.stringify(avatars, null, 2), err => {
                if (err) {
                    res.status(500).send('Failed to update database');
                    return;
                }
                res.sendStatus(204);  // No Content, successful deletion
            });
        }
    });
});

export default app