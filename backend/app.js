const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const shiftsRoutes = require('./routes/shifts');
const usersRoutes = require('./routes/users');
const branchesRoutes = require('./routes/branches');
const rotasRoutes = require('./routes/rotas');
const loginRoutes = require('./routes/login');
const messageRoutes = require('./routes/messages');

const app = express();

mongoose.connect("mongodb+srv://alessandro:" + process.env.MONGO_ATLAS_PW + "@cluster0-yr8nv.mongodb.net/roster-mgmt")
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();
});

app.use('/api/shifts', shiftsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/branches', branchesRoutes);
app.use('/api/rotas', rotasRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/messages', messageRoutes);

module.exports = app;
