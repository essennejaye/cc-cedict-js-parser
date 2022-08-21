const { Schema, model } = require('mongoose');

const dictionarySchema = new Schema({
  traditional: {
    type: String,
  },
  simplified: {
    type: String,
    required: true,
  },
  pinyin: {
    type: String,
    required: true,
  },
  english: {
    type: String,
    required: true,
  },
});

const Dictionary = model('Dictionary', dictionarySchema);

module.exports = Dictionary;
