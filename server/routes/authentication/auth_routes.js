const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/Users.jsx')

router.post('/register', async (req, res) => {
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


router.post('/login', async (req, res) => {
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

router.post('/logout', (req, res) => {
    // You may need additional logic here, such as invalidating sessions or revoking tokens
    res.clearCookie('token'); // Clear the token cookie
    res.send({ message: 'Logged out successfully' });
});


module.exports = router;