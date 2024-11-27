const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Load names from a JSON file
const namesPath = path.join(__dirname, 'data', 'names.json');
let names = JSON.parse(fs.readFileSync(namesPath, 'utf-8'));

// Shuffle helper function
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Variable to store winners
let winners = null;

// Home page
app.get('/', (req, res) => {
    res.render('index', { error: null }); // Ensure error is always passed
});

// Start draw
app.post('/draw', (req, res) => {
    if (names.length < 9) {
        return res.render('index', { error: "Not enough participants for a full draw!" });
    }

    const shuffled = shuffle([...names]);
    winners = {
        firstPrize: shuffled.slice(0, 3),
        secondPrize: shuffled.slice(3, 6),
        thirdPrize: shuffled.slice(6, 9),
    };

    res.redirect('/first'); // Redirect to the first prize page
});

// First prize page
app.get('/first', (req, res) => {
    if (!winners) return res.redirect('/'); // Redirect to home if no draw
    res.render('prize', {
        prizeTitle: "🏆 一等奖",
        winners: winners.firstPrize,
        nextRoute: '/second',
    });
});

// Second prize page
app.get('/second', (req, res) => {
    if (!winners) return res.redirect('/');
    res.render('prize', {
        prizeTitle: "🥈 二等奖",
        winners: winners.secondPrize,
        nextRoute: '/third',
    });
});

// Third prize page
app.get('/third', (req, res) => {
    if (!winners) return res.redirect('/');
    res.render('prize', {
        prizeTitle: "🥉 三等奖",
        winners: winners.thirdPrize,
        nextRoute: null, // No next page
    });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
