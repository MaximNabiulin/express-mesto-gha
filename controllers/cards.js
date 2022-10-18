const Card = require('../models/card');

module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({})
      .populate([{ path: 'user', strictPopulate: false }]);
    return res.send({ data: cards });
  } catch (err) {
    return res.status(500).send({ message: 'Ошибка по умолчанию' });
  }
};

module.exports.createCard = async (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  try {
    const card = await Card.create({ name, link, owner });
    return res.status(201).send({
      _id: card._id,
      name: card.name,
      link: card.link,
      owner: card.owner,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).send({
        message: 'Переданы некорректные данные при создании карточки',
      });
    }
    return res.status(500).send({ message: 'Ошибка по умолчанию' });
  }
};

module.exports.deleteCard = async (req, res) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findByIdAndRemove(cardId);
    if (!card) {
      return res.status(404).send({ message: 'Карточка с указанным id не найдена' });
    }
    // return res.status(200).send({ data: card });
    return res.status(200).send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).send({ message: 'Передан некорректный id карточки' });
    }
    return res.status(500).send({ message: 'Ошибка по умолчанию' });
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
      return res.status(404).send({ message: 'Передан несуществующий id карточки' });
    }
    // return res.status(200).send({ data: card });
    return res.status(200).send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка' });
    }
    return res.status(500).send({ message: 'Ошибка по умолчанию' });
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
      return res.status(404).send({ message: 'Передан несуществующий id карточки' });
    }
    // return res.status(200).send({ data: card });
    return res.status(200).send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).send({ message: 'Переданы некорректные данные для снятия лайка' });
    }
    return res.status(500).send({ message: 'Ошибка по умолчанию' });
  }
};
