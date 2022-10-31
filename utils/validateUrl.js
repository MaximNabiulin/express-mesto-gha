const regex = /^http(s)?:\/\/(www\.)?([\w\S]+\.)([\w\S]{2,}#?)/;

module.exports.isUrl = (string) => {
  regex.test(string);
};

module.exports.validateUrl = (string) => {
  if (!regex.test(string)) {
    throw new Error('Введен некорректный URL');
  }
  return string;
};
