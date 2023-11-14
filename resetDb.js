const fs = require('fs');

fs.copyFile('./db-original.json', './db.json', (err) => {
  if (err) throw err;
  console.log('copy done');
});