const {Kafka} = require('kafkajs');

async function main() {

  const {
    CONSOLE_DEBUG,
    KAFKA_BROKERS
  } = process.env;

  const kafka = new Kafka({
    clientId: 'client-kafkajs',
    brokers: [KAFKA_BROKERS]
  });

  const consumer = kafka.consumer({groupId: 'kafkajs-read-group'});

  await consumer.connect();
  await consumer.subscribe({
    topic: 'test',
    fromBeginning: true
  });

  await consumer.run({
    eachMessage: async ({
      message
    }) => {
      if (CONSOLE_DEBUG === 'true') {
        console.log(message.value.toString());
      }
    }
  });

}

module.exports = main;
