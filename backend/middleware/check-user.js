const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const tokenVerify = jwt.verify(token, 'secret_word_for_jsonwebtoken_roster-mgmt');
    if(tokenVerify.email === 'admin@local.com') {
      next();
    } else {
      res.status(401).json({message: 'Operation not allowed for this user! Middleware (check-user)'});
    }
  } catch (error) {
    res.status(401).json({message: 'Auth failed! Middleware (check-user)'});
  }
};
