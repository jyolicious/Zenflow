const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

// routers
app.use('/api/asanas', require('./routes/asanas'));
app.use('/api/meditations', require('./routes/meditations'));
app.use('/api/instructors', require('./routes/instructors'));
app.use('/api/newsletters', require('./routes/newsletters'));
app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log(`Server running on ${PORT}`));
