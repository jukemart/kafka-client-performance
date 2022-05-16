const Dotenv = require('dotenv');
const ReadClient = require("./read");
const ReadWriteClient = require("./readwrite");

Dotenv.config();

function main() {

  const {
    CLIENT_TYPE,
  } = process.env;

  let client = CLIENT_TYPE === 'readwrite' ? ReadWriteClient : ReadClient;

  client()
    .then(() => console.log('started'));

}

main();
