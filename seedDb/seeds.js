const db = require('../config/connection');
const Dictionary = require('../models/Dictionary');

db.once('open', async () => {
  await Dictionary.deleteMany({});
});

// A JavaScript version of franki allegra's cc-cedict parser
// (https://github.com/rubber-duck-dragon/rubber-duck-dragon.github.io)
// Before starting, open the downloaded CEDICT text file and delete everything before the first actual entry.
// The program can't parse the copyright and info text, will generate an error message.
// I chose the Creative Commons Chinese-English Dictionary because it contained
// pinyin(romanized spelling for Chinese characters)
//  This program will also remove a surname entry if there is another entry for the character.

// npm package that is much faster than node fs)
const lines = require('n-readlines');

const router = express.Router();
let line;
let parsedLines = [];
let lineNumber = 0;
let numOfLinesSkipped = 0;

// this dictionary has thousands of entries that are not needed for my project
// so I am going to filter out some of them
const linesToSkip = [
  '(Tw)',
  '(slang)',
  '(coll.)',
  'variant',
  'Internet slang',
  'Japanese',
  'Suzhou',
  'radical',
  'idiom',
  'proverb',
  'see',
];

const liner = new lines('./cedict_ts.utf8');

// labeled while loop, if a line meets conditions for skipping, control returns to while loop instead
// of for loop
loop1: while ((line = liner.next()) && lineNumber <= 15) {
  // convert each line of file to text with utf8 encoding, otherwise newLine is undefined
  newLine = line.toString('utf8');

  for (i = 0; i <= linesToSkip.length; i++) {
    if (newLine == '' || newLine.includes(linesToSkip[i])) {
      numOfLinesSkipped++;
      continue loop1;
    }
  }
  parseLine(newLine);
  lineNumber++;
  if (liner.next === false) {
    removeSurnames(parsedLines);
    createEntries(parsedLines);
  }
}

// remove text formatting and parse each line into an object
function parseLine(newLine) {
  parsed = {};
  newLine = newLine.slice(0, -1).split('/');
  if (newLine.length <= 1) {
    return;
  }
  let charAndPinyin = newLine[0].split('[');
  let characters = charAndPinyin[0].split(' ');
  let simplified = characters[1];
  if (/[A-Z0-9]/.test(simplified[0])) {
    // numOfLinesSkipped++;
    return;
  }
  let traditional = characters[0];
  let pinyin = charAndPinyin[1].slice(0, -2);
  let english = newLine[1];

  parsed['traditional'] = traditional;
  parsed['simplified'] = simplified;
  parsed['pinyin'] = pinyin;
  parsed['english'] = english;
  parsedLines.push(parsed);
}

function removeSurnames(parsedLines) {
  for (j = 0; j <= parsedLines.length; j++) {
    if (parsedLines[j][english].includes('surname')) {
      if (parsedLines[j][traditional] == parsedLines[j + 1][traditional]) {
        parsedLines.splice(j, 1);
      }
    }
  }
  return parsedLines;
}

async function createEntries(parsedLines) {
  await Dictionary.collection.insertMany(parsedLines);
}

console.log(`Number of lines skipped = ${numOfLinesSkipped}`);
