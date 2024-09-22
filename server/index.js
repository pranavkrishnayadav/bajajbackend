const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// import { fileURLToPath } from 'url';

// Resolving Dirname For ES module

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename);

//Use the Client App

// app.use(express.static(path.join(__dirname,'/client/')))

//
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());  // Make sure to invoke the CORS function
app.use(bodyParser.json());

// Sample user details
const userId = "pranavkrishnathota_05042004"; 
const email = "pranavkrish_thota@srmap.edu.in";
const rollNumber = "AP21110011345";

// POST /bfhl endpoint
app.post('/bfhl', (req, res) => {
    const data = req.body.data;

    if (!Array.isArray(data)) {
        return res.status(400).json({
            is_success: false,
            user_id: userId,
            email: email,
            roll_number: rollNumber,
            numbers: [],
            alphabets: [],
            highest_alphabet: []
        });
    }

    const numbers = data.filter(item => !isNaN(item));
    const alphabets = data.filter(item => /^[a-zA-Z]$/.test(item));
    const highestAlphabet = alphabets.length > 0 ? [alphabets.reduce((a, b) => a > b ? a : b)] : [];

    return res.json({
        is_success: true,
        user_id: userId,
        email: email,
        roll_number: rollNumber,
        numbers: numbers,
        alphabets: alphabets,
        highest_alphabet: highestAlphabet
    });
});

// GET /bfhl endpoint
app.get('/bfhl', (req, res) => {
    res.status(200).json({ operation_code: 1 });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
