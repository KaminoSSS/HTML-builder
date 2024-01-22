const fs = require('fs');
const path = require('path');

fs.readdir(
  path.join(__dirname, '/secret-folder'),
  { withFileTypes: true },
  (err, files) => {
    if (err) console.log(err);
    else {
      files.forEach((file) => {
        if (file.isFile()) {
          fs.stat(path.join(file.path, file.name), (err, stats) => {
            if (err) console.log(err);
            const fileInf = path.parse(file.name);
            console.log(
              `${fileInf.name} - ${fileInf.ext.slice(1)} - ${
                stats.size / 1000
              }kb`,
            );
          });
        }
      });
    }
  },
);
