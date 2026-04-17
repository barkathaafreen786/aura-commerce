require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const apiRoutes = require('./src/routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Base Route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to ARI Backend API MVP' });
});

// API Routes Hookup
app.use('/api/v1', apiRoutes);

app.listen(PORT, () => {
    console.log(`🚀 ARI Intelligence Server running on port ${PORT}`);
});
