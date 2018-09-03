const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, 'secret_word_for_jsonwebtoken_roster-mgmt');
    next();
  } catch (error) {
    res.status(401).json({message: 'Auth failed! Middleware'});
  }
};
