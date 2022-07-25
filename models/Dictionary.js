var random = require('mongoose-simple-random');
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
dictionarySchema.plugin(random);

const Dictionary = model('Dictionary', dictionarySchema);

module.exports = Dictionary;
