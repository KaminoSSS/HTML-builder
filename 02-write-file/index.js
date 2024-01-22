const { stdin, stdout } = process;
const path = require('path');
const fs = require('fs');
const readline = require('node:readline');

const filePath = path.join(__dirname, 'text.txt');
const rl = readline.createInterface(stdin, stdout);
const writeStream = fs.createWriteStream(filePath);

console.log(`Hello!`);
rl.on('line', (content) => {
  if (content !== 'exit') {
    writeStream.write(content + '\n');
  } else {
    process.exit();
  }
});

process.on('exit', () => {
  console.log(`Goodbye!`);
  rl.close();
  writeStream.end();
});

process.on('SIGINT', () => {
  process.exit();
});
