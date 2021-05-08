const uploadFile = require('../middleware/upload');
const fs = require('fs');
const baseUrl = 'http://localhost:8080/files/';
var amqp = require('amqplib/callback_api');

const upload = async (req, res) => {
  try {
    await uploadFile(req, res);
    console.log(req.header);

    if (req.file == undefined) {
      return res.status(400).send({ message: 'Please upload a file!' });
    }
    amqp.connect('amqp://localhost', function (error0, connection) {
      if (error0) {
        throw error0;
      }
      connection.createChannel(function (error1, channel) {
        if (error1) {
          throw error1;
        }
        var exchange = '1806141132';
        var routing_key = 'd2612dfb-b49e-436e-aa4a-26560466edbc'; // req.header[X-ROUTING-KEY]
        var msg = 'progress 10%'; // background publish

        const ex = channel.assertExchange(exchange, 'direct', {
          durable: true,
        });
        const q = channel.assertQueue(routing_key, {
          durable: true,
        });

        channel.bindQueue(routing_key, exchange, routing_key);
        channel.publish(exchange, routing_key, Buffer.from(msg));
        console.log(" [x] Sent %s: '%s'", routing_key, msg);
      });

      setTimeout(function () {
        connection.close();
        process.exit(0);
      }, 500);
    });

    // res.status(200).send({
    //   message: 'Uploaded the file successfully: ' + req.file.originalname,
    // });

    res.redirect('http://localhost:8081/progress');
  } catch (err) {
    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
};

const getListFiles = (req, res) => {
  const directoryPath = __basedir + '/resources/static/assets/uploads/';

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: 'Unable to scan files!',
      });
    }

    let fileInfos = [];

    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: baseUrl + file,
      });
    });

    res.status(200).send(fileInfos);
  });
};

const download = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + '/resources/static/assets/uploads/';

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: 'Could not download the file. ' + err,
      });
    }
  });
};

module.exports = {
  upload,
  getListFiles,
  download,
};
