# node-rdkafka

## Installation

Requires Node.js, C / C++ (14) development tools to build librdkafka.
Tested with Node.js 12.

Install dependencies for development tools.
On Red Hat Enterprise Linux 7, assuming subscription-manager is enabled:
```
subscription-manager repos --enable rhel-server-rhscl-7-rpms
subscription-manager repos --enable rhel-7-server-optional-rpms

yum install rh-nodejs12
scl enable rh-nodejs12 bash

yum install devtoolset-7
scl enable devtoolset-7 bash
```

Run `npm install` to get dependencies and build dependencies.

Copy `env.template` to `.env` and fill in values specific to your Kafka cluster.

## Run

Use `npm start` to start reading from the `test` topic from beginning.

The Kafka client will then read messages until forcibly stopped.

To stop/interrupt the process, use `ctrl-c` or otherwise kill it.
