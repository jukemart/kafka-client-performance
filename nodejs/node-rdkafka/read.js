const Kafka = require('node-rdkafka');

const Dotenv = require('dotenv');

Dotenv.config();

async function main() {

  const {
    CONSOLE_DEBUG,
    KAFKA_BROKERS
  } = process.env;

  if (!KAFKA_BROKERS) {
    console.error('Kafka Brokers not present');
    process.exit(1);
  }

  const onData = (data) => {
    if (CONSOLE_DEBUG === 'true') {
      console.log(data.value.toString());
    }
  };

  const consumer = new Kafka.KafkaConsumer({
    'group.id': 'node-rdkafka-group',
    'metadata.broker.list': KAFKA_BROKERS
  }, {
    'auto.offset.reset': 'beginning'
  });

  // Flowing mode
  consumer.connect();

  consumer
    .on('ready', function () {
      consumer.subscribe(['test']);

      // Consume from the test topic. This is what determines
      // the mode we are running in. By not specifying a callback (or specifying
      // only a callback) we get messages as soon as they are available.
      consumer.consume();
    })
    .on('data', onData);
}

module.exports = main;
