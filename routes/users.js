const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { validateUrl } = require('../utils/validateUrl');

const {
  getCurrentUser,
  getUsers,
  getUserById,
  // createUser,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

// const validateUrl = (string) => {
//   const regex = /^http(s)?:\/\/(www\.)?([\w\S]+\.)([\w\S]{2,}#?)/;
//   if (!regex.test(string)) {
//     throw new Error('Введен некорректный URL');
//   }
//   return string;
// };

router.get('/me', getCurrentUser);
router.get('/', getUsers);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUserById);

// router.post('/', createUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUserInfo);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom(validateUrl),
  }),
}), updateUserAvatar);

module.exports = router;
