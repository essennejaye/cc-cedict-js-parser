// Before starting, open the dowloaded CEDICT text file and delete everything until the first entry.
// Otherwise the program will try to parse it and you will get an error message.
// I chose this dictionary because it contained pinyin(romanized spelling for transliterating Chinese)

// require npm package to read file (more performant than node fs)
const lines = require('n-readlines');

const liner = new lines('cedict_ts.u8');
let line;
let parsed_lines = [];
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
];

// labeled while loop, if a line meets conditions for skipping control returns to while loop instead
// of for loop
loop1: while ((line = liner.next()) && lineNumber <= 20) {
  // convert each line of file to text with utf8 encoding, otherwise newLine is undefined
  newLine = line.toString('utf8');

  for (i = 0; i <= linesToSkip.length; i++) {
    if (newLine == '' || newLine.includes(linesToSkip[i])) {
      numOfLinesSkipped++;
      continue loop1;
    }
  }
  parsed_line(newLine);
  lineNumber++;
}

// each line of text is formatted as traditional chinese characters followed by
// simplified chinese characters followed by pinyin with tone marks in square brackets
// followed by forward slash, english translation, forward slash
function parsed_line(newLine) {
  parsed = {};
  newLine = newLine.slice(0, -1);
  newLine = newLine.split('/');
  if (newLine.length <= 1) {
    return;
  }
  let english = newLine[1];
  let char_and_pinyin = newLine[0].split('[');
  let characters = char_and_pinyin[0];
  characters = characters.split(' ');
  let traditional = characters[0];
  let simplified = characters[1];
  let pinyin = char_and_pinyin[1];
  pinyin = pinyin.slice(0, -2);

  // Convert the parsed line into an object
  parsed['traditional'] = traditional;
  parsed['simplified'] = simplified;
  parsed['pinyin'] = pinyin;
  parsed['english'] = english;
  parsed_lines.push(parsed);
}

console.log(`Number of lines skipped = ${numOfLinesSkipped}`);
console.log(parsed_lines);
