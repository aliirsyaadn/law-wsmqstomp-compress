const seven = require('node-7z');
const myStream = seven.add('archive.zip', 'test.txt', {
  $progress: true,
});
const fs = require('fs');

// fs.writeFile("/tmp/test", "Hey there!", function(err) {
//     if(err) {
//         return console.log(err);
//     }
//     console.log("The file was saved!");
// });

// Or
// fs.writeFileSync('/tmp/test-sync', 'Hey there!');
myStream.on('data', function (data) {
  //   doStuffWith(data); //? { status: 'extracted', file: 'extracted/file.txt" }
  console.log(data);
});

myStream.on('progress', function (progress) {
  //   doStuffWith(progress); //? { percent: 67, fileCount: 5, file: undefinded }
  fs.writeFileSync('./prog', 'test');
});

myStream.on('end', function () {
  // end of the operation, get the number of folders involved in the operation
  myStream.info.get('Folders'); //? '4'
});

// myStream.on('error', (err) => handleError(err));
myStream.on('error', (err) => console.log(err));
