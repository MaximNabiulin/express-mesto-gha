const Card = require('../models/card');

const CREATED_STATUS_CODE = 201;
const CAST_ERROR_CODE = 400;
const NOT_FOUND_ERROR_CODE = 404;
const DEFAULT_ERROR_CODE = 500;

module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.send({ data: cards });
  } catch (err) {
    return res.status(DEFAULT_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.createCard = async (req, res) => {
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
      return res.status(CAST_ERROR_CODE).send({
        message: 'Переданы некорректные данные при создании карточки',
      });
    }
    return res.status(DEFAULT_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.deleteCard = async (req, res) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findByIdAndRemove(cardId);
    if (!card) {
      return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Карточка с указанным id не найдена' });
    }
    return res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(CAST_ERROR_CODE).send({ message: 'Передан некорректный id карточки' });
    }
    return res.status(DEFAULT_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.likeCard = async (req, res) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true },
    );
    if (!card) {
      return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Передан несуществующий id карточки' });
    }
    return res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(CAST_ERROR_CODE).send({ message: 'Переданы некорректные данные для постановки лайка' });
    }
    return res.status(DEFAULT_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.dislikeCard = async (req, res) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true },
    );
    if (!card) {
      return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Передан несуществующий id карточки' });
    }
    return res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(CAST_ERROR_CODE).send({ message: 'Переданы некорректные данные для снятия лайка' });
    }
    return res.status(DEFAULT_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
  }
};
