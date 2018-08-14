const express = require('express');
const bodyParser = require('body-parser');
// add mongoose
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});

// this one receives a shift FROM Angular
app.post('/api/shifts', (req, res, next) => {
  const shift = req.body;
  console.log(shift);
  res.status(201).json({
    message: "Shift added successfully"
  });
});

// this one send the shifts TO Angular
app.use('/api/shifts', (req, res, next) => {
  const shifts = [
    { id: 'i2oyui',
      name: "Server shift",
      start: "09:00",
      end: "13:00"
    },
    { id: 'vbfngbe3',
      name: "Lunch shift",
      start: "13:00",
      end: "14:00"
    }
  ];
  res.status(200).json({
    message: "Shift fetch successfully",
    shifts: shifts
  });
});

// this one receives a user FROM Angular
app.post('/api/users', (req, res, next) => {
  const shift = req.body;
  console.log(shift);
  res.status(201).json({
    message: "User added successfully"
  });
});

// this one send the users TO Angular
app.use('/api/users', (req, res, next) => {
  const users = [
    { id: '23r22342',
      firstName: "John",
      lastName: "Brown",
      email: "john@brown.com",
      telephone: 22323223
    },
    { id: '8979787',
      firstName: "Mike",
      lastName: "Hunt",
      email: "mikehunt@aol.com",
      telephone: 678686
    }
  ];
  res.status(200).json({
    message: "User fetch successfully",
    users: users
  });
});

// this one receives a branch FROM Angular
app.post('/api/branches', (req, res, next) => {
  const shift = req.body;
  console.log(shift);
  res.status(201).json({
    message: "Branch added successfully"
  });
});

// this one send the branches TO Angular
app.use('/api/branches', (req, res, next) => {
  const branches = [
    { id: "www11",
      branchName: "London branch"
    },
    {
      id: "oooo334",
      branchName: "Sydney branch"
    }
  ];
  res.status(200).json({
    message: "Branch fetched successfully",
    branches: branches
  });
});

module.exports = app;
