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

  const producer = new Kafka.Producer({
    'client.id': 'node-rdkafka-client',
    'metadata.broker.list': KAFKA_BROKERS
  });

  const consumer = new Kafka.KafkaConsumer({
    'group.id': 'node-rdkafka-group',
    'metadata.broker.list': KAFKA_BROKERS
  }, {
    'auto.offset.reset': 'beginning'
  });

  const onData = (data) => {
    if (CONSOLE_DEBUG === "true") {
      console.log(data.value.toString());
    }

    try {
      producer.produce(
        // Topic to send the message to
        'test-write',
        // optionally we can manually specify a partition for the message
        // this defaults to -1 - which will use librdkafka's default partitioner (consistent random for keyed messages, random for unkeyed messages)
        null,
        // Message to send. Must be a buffer
        data.value
      );
    } catch (ignored) {}

  }

  // Connect to the broker manually
  producer.connect();

  // Wait for the ready event before proceeding
  producer.on('ready', function() {

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
  });

  // We must either call .poll() manually after sending messages
  // or set the producer to poll on an interval (.setPollInterval).
  // Without this, we do not get delivery events and the queue
  // will eventually fill up.
  producer.setPollInterval(100);

}

module.exports = main;
