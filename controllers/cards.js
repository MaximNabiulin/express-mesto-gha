const Card = require('../models/card');

// const CastError = require('../errors/CastError');
const ValidationError = require('../errors/ValidationError');
const ForbiddenError = require('../errors/ForbiddenError');
// const AuthorizationError = require('../errors/AuthorizationError');
const NotFoundError = require('../errors/NotFoundError');

const CREATED_STATUS_CODE = 201;

module.exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    return res.send({ data: cards });
  } catch (err) {
    return next(err);
  }
};

module.exports.createCard = async (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  try {
    const card = await Card.create({ name, link, owner });
    return res.status(CREATED_STATUS_CODE).send({
      _id: card._id,
      name: card.name,
      link: card.link,
      owner: card.owner,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new ValidationError('Переданы некорректные данные при создании карточки'));
    }
    return next(err);
  }
};

module.exports.deleteCard = async (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  try {
    const card = await Card.findById(cardId);
    if (!card) {
      throw new NotFoundError('Карточка с указанным id не найдена');
    }
    if (String(card.owner._id) !== String(userId)) {
      throw new ForbiddenError('Нельзя удалять чужие карточки');
    }
    await card.remove();
    return res.send({ message: 'Карточка удалена' });
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new ValidationError('Передан некорректный id карточки'));
    }
    return next(err);
  }
};

module.exports.likeCard = async (req, res, next) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true },
    );
    if (!card) {
      throw new NotFoundError('Передан несуществующий id карточки');
    }
    return res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new ValidationError('Переданы некорректные данные для постановки лайка'));
    }
    return next(err);
  }
};

module.exports.dislikeCard = async (req, res, next) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true },
    );
    if (!card) {
      throw new NotFoundError('Передан несуществующий id карточки');
    }
    return res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new ValidationError('Переданы некорректные данные для снятия лайка'));
    }
    return next(err);
  }
};
