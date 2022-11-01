// const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/AuthorizationError');

module.exports = (req, res, next) => {
  const { authorization } = req.cookies;

  if (!authorization) {
    throw new AuthorizationError('Необходима авторизация');
    // return res
    //   .status(401)
    //   .send({ message: 'Необходима авторизация' });
  }

  let payload;

  try {
    payload = jwt.verify(authorization, 'ed971b19bc18f2a281a4810fb5aaf2e4');
    // payload = jwt.verify(authorization, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return next(new AuthorizationError('Необходима авторизация'));
    // return res
    //   .status(401)
    //   .send({ message: 'Необходима авторизация' });
  }

  req.user = payload;
  return next();
};
