# KafkaJs

## Installation

Requires Node.js.
Tested with Node.js 12.

Run `npm install` to get dependencies.

Copy `env.template` to `.env` and fill in values specific to your Kafka cluster.

## Run

Use `npm start` to start reading from the `test` topic from beginning.

The Kafka client will then read messages until forcibly stopped.

To stop/interrupt the process, use `ctrl-c` or otherwise kill it.

## Results

Over a 5-minute period, the read client read 100 million records and the readwrite client wrote 17 million (3.57 million / min).
