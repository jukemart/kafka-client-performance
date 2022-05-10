const Kafka = require('node-rdkafka');
const async = require('async');

const Dotenv = require('dotenv');

// Increase thread count for libuv
const { cpus } = require('os')
process.env.UV_THREADPOOL_SIZE = cpus().length;

Dotenv.config();

function main() {

  const {
    CONSOLE_DEBUG,
    KAFKA_BROKERS
  } = process.env;
  const MAX_QUEUE_SIZE = 3000000;
  const MAX_PARALLEL_HANDLES = 2;

  let paused = false;
  if (!KAFKA_BROKERS) {
    console.error('Kafka Brokers not present');
    process.exit(1);

  }
  const msgQueue = async.queue(async (data, done) => {
    onData(data);
    done();
  }, MAX_PARALLEL_HANDLES);

  msgQueue.drain = async () => {
    if (paused) {
      consumer.resume(consumer.assignments());
      paused = false;
    }
  }

  const onData = (data) => {
    if (CONSOLE_DEBUG && CONSOLE_DEBUG === "true") {
      console.log(data.value.toString());
    }
  }

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
    .on('data', function (data) {
      msgQueue.push(data);
      if (msgQueue.length() > MAX_QUEUE_SIZE) {
        consumer.pause(consumer.assignments());
        paused = true;
      }
    });
}

main();
