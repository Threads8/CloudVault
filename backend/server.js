const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
const authRoutes = require('./routes/authRoutes');
const fileRoutes = require('./routes/fileRoutes');
const folderRoutes = require('./routes/folderRoutes');
const shareRoutes = require('./routes/shareRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

console.log('authRoutes:', typeof authRoutes, authRoutes);
console.log('fileRoutes:', typeof fileRoutes, fileRoutes);
console.log('folderRoutes:', typeof folderRoutes, folderRoutes);
console.log('shareRoutes:', typeof shareRoutes, shareRoutes);
console.log('analyticsRoutes:', typeof analyticsRoutes, analyticsRoutes);
console.log('errorMiddleware:', typeof errorMiddleware, errorMiddleware);

app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/share', shareRoutes);
app.use('/api/analytics', analyticsRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('CloudVault API is running...');
});

// Global Error Handler
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

