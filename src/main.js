import app from './app.js';
export const port = 3000
app.listen(port, () => {
    console.log(`app is listening on http://localhost:${port}`)});













/*
const express = require('express');
const app = express();
const fs = require('fs');
//app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const port = 3000

app.listen(port, () => {
    console.log(`app is listening on http://localhost:${port}`)});

app.get('/',  (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`)
});

// create new avatars
app.post('/api/avatars', (req, res) => {
    console.log(req.body);
    console.log("POST /api/avatars");

    const avatarData = {
        id: Date.now(),
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
        const data = fs.readFileSync('./src/database/avatars.json');
        const avatars = JSON.parse(data);
        avatars.push(avatarData);
        fs.writeFileSync('./src/database/avatars.json', JSON.stringify(avatars), {flag: 'w'})

        res.status(201).set("Location", `/avatar/${avatarData.id}`).send(avatarData); // new data created
    } catch(e) {
        res.sendStatus(500);
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

/*
// read all avatars
app.get('/api/avatars', (req, res) => {
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
/*
app.put('/api/avatars/:id', (req, res) => {
    fs.readFileSync('./src/database/avatars.json', () => {

        let avatarData = JSON.parse(data);
        let found = false;

        avatarData = avatarData.map(avatar => {
            if (avatar.id === Number(req.params.id)) {
                found = true;
                // fs.writeFileSync('./src/database/avatars.json', JSON.stringify(avatarData));
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
*/

/*
app.put("/api/avatars/:id", async (req, res)=>{
    try {
        const data = fs.readFileSync('./src/database/avatars.json');
        const avatars = JSON.parse(data);

        const avatar = avatars.find(avatar => avatar.id === parseInt(req.params.id));

        if (!avatar) {
            res.sendStatus(404)
            return;
        }

        avatar.avatarName = req.body.avatarName;
        avatar.childAge = req.body.childAge;
        avatar.skinColor = req.body.skinColor;
        avatar.hairstyle = req.body.hairstyle;
        avatar.headShape = req.body.headShape;
        avatar.upperClothing = req.body.upperClothing;
        avatar.lowerClothing = req.body.lowerClothing;

        fs.writeFileSync('./src/database/avatars.json', JSON.stringify(avatars))

        res.sendStatus(204);
    } catch {
        res.sendStatus(500)
    }
})

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

*/