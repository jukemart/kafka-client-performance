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
