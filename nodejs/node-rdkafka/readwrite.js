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

  const BATCH_MESSAGE_SIZE = 100000;
  let consumerStream;
  const producer = new Kafka.Producer({
    'client.id': 'node-rdkafka-client',
    'metadata.broker.list': KAFKA_BROKERS,
    'linger.ms': 100,
    'socket.keepalive.enable': true,
    'queue.buffering.max.messages': 1000000,
    'queue.buffering.max.ms': 100,
    'batch.num.messages': BATCH_MESSAGE_SIZE
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
      numProduced++
      if (numProduced >= BATCH_MESSAGE_SIZE) {
        producer.poll();
        numProduced = 0;
        consumerStream.consumer.commit();
      }
    } catch (ignored) {
    }

  };

  // Connect to the broker manually
  producer.connect();

  // Wait for the ready event before proceeding
  producer.on('ready', function () {

    consumerStream = Kafka.createReadStream({
      'group.id': 'node-rdkafka-read-group',
      'metadata.broker.list': KAFKA_BROKERS,
      'socket.keepalive.enable': true,
      'enable.auto.commit': false
    }, {
      'auto.offset.reset': 'beginning'
    }, {
      topics: ['test'],
      fetchSize: BATCH_MESSAGE_SIZE
    });

    consumerStream.on('data', onData);
  });
}

module.exports = main;
