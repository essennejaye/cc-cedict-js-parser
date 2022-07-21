const mongoose = require('mongoose');

const { Schema } = mongoose;

const dictionarySchema = new Schema({
  traditional: String,
  simplified: String,
  pinyin: String,
  english: String,
});

const Dictionary = mongoose.model('Dictionary', dictionarySchema);

module.exports = Dictionary;
