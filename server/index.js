// Our Dependencies
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authentication/auth_routes')

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

app.use(authRoutes)
