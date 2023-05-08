const fs = require('fs/promises');
const path = require('path');

const srcDir = path.join(__dirname, 'files');
const destDir = path.join(__dirname, 'files-copy');

fs.rm(destDir, { recursive: true, force: true })
  .then(() => fs.mkdir(destDir))
  .then(() => {
    return fs.readdir(srcDir)
      .then(files => {
        const copyPromises = files.map(file =>
          fs.copyFile(path.join(srcDir, file), path.join(destDir, file))
        );
        return Promise.all(copyPromises);
      });
  })
  .then(() => {
    console.log('All files have been copied successfully');

    fs.watch(srcDir, (eventType, filename) => {
      if (eventType === 'change') {
        fs.copyFile(path.join(srcDir, filename), path.join(destDir, filename))
          .then(() => {
            console.log(`File ${filename} has been updated`);
          })
          .catch(err => {
            console.error(`An error occurred while updating file ${filename}:`, err);
          });
      } else if (eventType === 'unlink') {
        fs.unlink(path.join(destDir, filename))
          .then(() => {
            console.log(`File ${filename} has been deleted`);
          })
          .catch(err => {
            console.error(`An error occurred while deleting file ${filename}:`, err);
          });
      }
    });
  })
  .catch(err => {
    console.error('An error occurred:', err);
  });


