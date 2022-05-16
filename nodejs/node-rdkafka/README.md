# node-rdkafka

## Installation

Requires Node.js, C / C++ (14) development tools to build librdkafka.
Tested with Node.js 12.

Install dependencies for development tools.
On Red Hat Enterprise Linux 8, assuming subscription-manager is enabled:
```
sudo subscription-manager repos --enable codeready-builder-for-rhel-8-x86_64-rpms
sudo dnf group install "Development Tools"
sudo dnf install git python3 cpp

### Node.js 16 ###
sudo dnf module install nodejs:16
```

Run `npm install` to get dependencies and build dependencies.

Copy `env.template` to `.env` and fill in values specific to your Kafka cluster.

## Run

Use `npm start` to start reading from the `test` topic from beginning.

The Kafka client will then read messages until forcibly stopped.

To stop/interrupt the process, use `ctrl-c` or otherwise kill it.

## Results

Over a 5-minute period, the read client consumed 107 million records, the readwrite client wrote 21 million messages (4.34 million messages / min).
