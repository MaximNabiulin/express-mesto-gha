const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { login, logout, createUser } = require('../controllers/users');
const { validateUrl } = require('../utils/validateUrl');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateUrl),
  }),
}), createUser);

router.get('/signout', auth, logout);
router.use('/users', auth, require('./users'));
router.use('/cards', auth, require('./cards'));

router.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

module.exports = router;
