const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer'); // Import multer for file uploads
const { Buffer } = require('buffer');
const mime = require('mime-types'); // For mime type checking

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// Set up multer for file handling
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Mock user data
const userData = {
  full_name: 'PranavKrishnaThota',
  dob: '05042004',
  email: 'pranavkrishna_thota@srmap.edu.in',
  roll_number: 'AP21110011345'
};

// POST /bfhl endpoint
app.post('/bfhl', upload.single('file'), (req, res) => {
  const { data } = JSON.parse(req.body.data); // Parse the data JSON input
  const user_id = `${userData.full_name}_${userData.dob}`;
  
  // Validate input
  if (!Array.isArray(data)) {
    return res.status(400).json({ is_success: false, message: "Invalid input data" });
  }

  const numbers = data.filter(item => !isNaN(item));
  const alphabets = data.filter(item => /^[A-Za-z]$/.test(item));
  const highest_lowercase_alphabet = alphabets.filter(char => char >= 'a' && char <= 'z').sort().pop() || '';

  // File handling
  let file_valid = false;
  let file_mime_type = '';
  let file_size_kb = '0';
  let file_base64 = '';

  if (req.file) {
    try {
      file_valid = true;
      file_mime_type = mime.lookup(req.file.originalname);  // Get the mime type
      file_size_kb = (req.file.size / 1024).toFixed(2);  // Get the file size in KB
      file_base64 = req.file.buffer.toString('base64');  // Convert the file to Base64
    } catch (error) {
      console.error("Error processing file:", error);
      file_valid = false;
    }
  }

  // Construct the response
  const response = {
    is_success: true,
    user_id: user_id,
    email: userData.email,
    roll_number: userData.roll_number,
    numbers: numbers,
    alphabets: alphabets,
    highest_lowercase_alphabet: highest_lowercase_alphabet ? [highest_lowercase_alphabet] : [],
    file_valid: file_valid,
  };

  if (file_valid) {
    response.file_mime_type = file_mime_type;
    response.file_size_kb = file_size_kb;
    response.file_base64 = file_base64;  // Include the Base64 string in the response
  }

  res.json(response);
});

// GET /bfhl endpoint
app.get('/bfhl', (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
