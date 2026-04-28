const express = require('express');
const app = express();

app.use(express.json());

// routes
const userRoutes = require('./routes/user.routes');
app.use('/', userRoutes);

module.exports = app;