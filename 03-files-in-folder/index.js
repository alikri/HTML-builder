const fs = require('fs/promises');
const path = require('path');

async function readDirectory(directoryPath) {
  try {
    const dirents = await fs.readdir(directoryPath, { withFileTypes: true });

    for (const dirent of dirents) {
      if (dirent.isFile()) {
        const filePath = path.join(directoryPath, dirent.name);
        const stats = await fs.stat(filePath);
        const fileExtension = path.extname(filePath);
        const fileName = path.basename(filePath, fileExtension);
        const fileSizeInBytes = stats.size;

        console.log(`${fileName} - ${fileExtension.slice(1)} - ${fileSizeInBytes}kb`);
      }
    }
  } catch (error) {
    console.log(`Unable to read directory: ${error}`);
  }
}

const directoryPath = path.join(__dirname, 'secret-folder');
readDirectory(directoryPath);


