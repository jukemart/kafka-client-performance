# Kafka Client Performance

This project is to do ad-hoc performance testing of various Kafka Clients.
The goal of this performance testing is to determine a soft ceiling for read and write performance of each client tested.

## Goals

Obtain approximate numbers that give a general sense of performance in ideal conditions.
Maybe a pretty graph or two.

Reproducibility of tests and numbers is also a priority, with a generous estimation range of, say, 20% i.e. re-running tests should get numbers within 20% of the originals.

Non-goals include:
* Production-grade performance
* Realistic workloads
* Capabilities analysis or comparison
* "Apples to apples" testing that tries to remove all possible extraneous variables
* Stability

In short, don't make your production application this way, and take the results with a grain of salt.

If you're making a mission-critical Kafka application where performance is a concern, DO NOT USE THESE NUMBERS.
You _**must**_ do performance testing with _your_ application and _your_ workloads.
Use these numbers _only_ as a rough guide.

You've been warned.

< / disclaimers >

## Methodology

Kafka infrastructure and Kafka Clients run in a cloud environment with consistent instance types.
Kafka components to be minimized to save on unnecessary cost (single ZK node, 3 brokers, one or two additional components for monitoring).
Instance types for Kafka Brokers should have enough capacity to fully handle a single client application, as well as external monitoring.

Kafka topics created with bare minimum requirements for replication factor (`RF=1`) and resiliency.
This also implies minimum in-sync replicas is also 1.
Baseline performance should be measured on a Kafka topic with a single partition on each broker i.e. 3 partitions in this setup.

Clients will be expected to read and write from Kafka topics with 3 partitions, using settings that give the least overhead and maximum throughput.
This may or may not differ for each client &mdash; each client will be configured on a best-effort basis to achieve maximum throughput.

In general, the following settings are used:
* `acks=0`
* `batch.size=1000000` -~ 1MB`
* `linger.ms=100`
* `retries=0`
* No keys on messages

Where possible, messages read/written as ByteArray or raw bytes i.e. without serializing/deserializing.
No client compression used in benchmarks. (Particularly interesting differences in compression results may be remarked on if found.)
No delivery reports or callbacks on failed messages i.e. "maybe-once semantics".

Every message must be read by the client, but no further action is needed.
* No I/O
* No print to console
* No message transformations

Messages are small, < 1KB each.
All message keys, headers, offsets, topics, or any other metadata are ignored.
Clients will not generate their own messages &mdash; only two modes are tested, Read-Only and Read-Write.
Messages will exist on a topic, written to externally (likely by the `kafka-producer-perf-test` tool).
Clients will run long enough that any startup / initialization / GC factors should be amortized.

## Setup

_**TODO**_ Link to infrastructure setup

### Topics

Create a `test` topic with 3 partitions and RF=1.

(Optional) Ensure that each partition leader is on a separate broker.

### Kafka Producer Perf Tool
