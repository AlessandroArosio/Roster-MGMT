const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    console.log(req.headers);
    console.log('?????????? one ??????????');
    console.log(req.headers.authorization);
    console.log('?????????? two ??????????');
    const token = req.headers.authorization.split(' ')[1];
    console.log('------------------------------------------');
    jwt.verify(token, 'secret_word_for_jsonwebtoken_roster-mgmt');
    next();
  } catch (error) {
    res.status(401).json({message: 'Auth failed! Middleware'});
  }
};
