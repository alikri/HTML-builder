
const fs = require('fs/promises');
const path = require('path');

const srcDir = path.join(__dirname, 'files');
const destDir = path.join(__dirname, 'files-copy');

fs.mkdir(destDir, { recursive: true })
  .then(() => fs.readdir(srcDir))
	.then(files => {
    const copyPromises = files.map(file =>
      fs.copyFile(path.join(srcDir, file), path.join(destDir, file))
    );
    return Promise.all(copyPromises);
  })
  .then(() => {
    console.log('All files have been copied successfully');
  })
  .catch(err => {
    console.error('An error occurred:', err);
  });

