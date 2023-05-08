const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'favorite.txt');
const output = fs.createWriteStream(filePath, 'utf-8');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('What kind of junk food do you like?');

rl.on('line', (input) => {
  if (input.toLowerCase() === 'exit') {
    exitProcess();
  } else {
    output.write(`${input}\n`);
  }
});

function exitProcess() {
  console.log('Удачи в изучении Node.js!');
  output.end();
  rl.close();
  process.exit();
}

rl.on('SIGINT', () => {
  exitProcess();
});
