// Our Dependencies
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/Users.jsx');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/plantdb')
    .then(() => {
        console.log('Connected to MongoDB');
        // Let us run the server. So it's running
        app.listen(3005, () => {
            console.log('Server is running on port 3005');
        });
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB', err);
    });

// Let us create a route to the server that will register a user
app.post('/register', async (req, res) => {
    const saltRounds = 10;
    const { email, username, password } = req.body;
    console.log(email);
    console.log("here");

    try {
        // Hash the password before saving to the database
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new User instance with the hashed password
        const user = new User({ email, username, password: hashedPassword });

        // Save the user to the database
        await user.save();

        console.log('User inserted successfully!');
        res.send({ message: 'User added!' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});


app.post('/login', async (req, res) => {
    const { loginUserName, loginPassword } = req.body;

    try {
        // Find the user by username
        const user = await User.findOne({ username: loginUserName });

        if (user) {
            // Compare the user-entered password with the stored hashed password
            const passwordMatch = await bcrypt.compare(loginPassword, user.password);

            if (passwordMatch) {
                // Passwords match, generate a JWT token
                const token = jwt.sign({ userId: user._id }, 'oreo_cookie', { expiresIn: '1h' });

                // Send the token to the user
                res.json({ token });
            } else {
                // Passwords don't match
                res.status(401).json({ message: `Credentials Don't match!` });
            }
        } else {
            // User not found
            res.status(401).json({ message: `Credentials Don't match!` });
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});
