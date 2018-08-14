const express = require('express');

const app = express();

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

module.exports = app;
