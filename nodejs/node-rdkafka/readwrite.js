const Kafka = require('node-rdkafka');
const Dotenv = require('dotenv');

process.env.UV_THREADPOOL_SIZE = '6';

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

  const NUM_BATCH_MESSAGES = 100000;
  const producer = new Kafka.Producer({
    'client.id': 'node-rdkafka-client',
    'metadata.broker.list': KAFKA_BROKERS,
    'linger.ms': 100,
    'socket.keepalive.enable': true,
    'queue.buffering.max.messages': 1000000,
    'queue.buffering.max.ms': 100,
    'batch.num.messages': NUM_BATCH_MESSAGES
  }, {
    'acks': 0
  });

  let numProduced = 0;
  const onData = (data) => {
    if (CONSOLE_DEBUG === 'true') {
      console.log(data.value.toString());
    }

    try {
      producer.produce(// Topic to send the message to
        'test-write', // optionally we can manually specify a partition for the message
        // this defaults to -1 - which will use librdkafka's default partitioner (consistent random for keyed messages, random for unkeyed messages)
        null, // Message to send. Must be a buffer
        data.value,
        null,
        Date.now(),
        null
      );
      numProduced++;
      if (numProduced >= NUM_BATCH_MESSAGES) {
        producer.poll();
        numProduced = 0;
      }
    } catch (ignored) {
    }

  };

  // Connect to the broker manually
  producer.connect();

  // Wait for the ready event before proceeding
  producer.on('ready', function () {

    let consumer = new Kafka.KafkaConsumer({
      'group.id': 'node-rdkafka-read-group',
      'metadata.broker.list': KAFKA_BROKERS,
      'queued.min.messages': NUM_BATCH_MESSAGES,
      'queued.max.messages.kbytes': 10000
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
  });
}

module.exports = main;
