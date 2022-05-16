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

  const producer = kafka.producer();
  await producer.connect();

  const consumer = kafka.consumer({groupId: 'kafkajs-readwrite-group'});

  await consumer.connect();
  await consumer.subscribe({
    topic: 'test',
    fromBeginning: true
  });

  await consumer.run({
    eachBatch: async ({
      batch
    }) => {
      if (CONSOLE_DEBUG) {
        // Just write one from the batch
        console.log(batch.messages[0].value.toString());
      }
      await producer.send({
        acks: 0,
        topic: "test-write",
        messages: batch.messages
      })
    }
  });

}

module.exports = main;
