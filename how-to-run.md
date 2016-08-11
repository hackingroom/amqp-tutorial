# How To Run The Examples

### Dependencies
* RabbitMQ Host.
* NodeJS.

#### How to install RabbitMQ using docker
Install docker run this command:
```bash
docker run -d --hostname my-rabbit --name some-rabbit -p 15672:15672 -p 5672:5672 rabbitmq:3-management
```

After that, you will be able to access to the management on `0.0.0.0:15672` or `localhost:15672` and have access to the services on the port `5672`.

### Tutorial 1

1. Open a terminal to run the consumer:
```bash
# this will show: [*] Waiting for messages. To exit press CTRL+C
$ node t1-basic-consumer.js
```

2. Open other terminal to run the producer:
```bash
# this will show:  [x] Sent 'hello world'
$ node t1-basic.js 'hello world.'
```

3. Wait 3 seconds and then you will see `[x] Received 'hello world'` on the consumers terminal.

### Tutorial 2
1. Open the terminal to run the consumer:
```bash
# this will show: [*] Waiting for logs. To exit press CTRL+C.
$ node t2-direct-consumer.js SEVERITY
```

2. Open other terminal to run the producer:
```bash
# this will show: [x] Sent SEVERITY:'hellow world'
$ node t2-direct.js SEVERITY 'hello world'
```

### Tutorial 3
1. Open the terminal to run the consumer:
```bash
# This command will consume all the messages with a key that match with `logs.#`: `logs.info`, `logs.error`, `logs.warning`
$ node t3-topics-consumer.js 'logs.#'
```

2. Open other terminal to run the producer:
```bash
$ node t3-topics.js 'logs.info' 'information message'
$ node t3-topics.js 'logs.error' 'error message'
$ node t3-topics.js 'logs.warning' 'warning message'
```
### Tutotial 4
1. Open the terminal to run the consumer:
```bash
# this consumer will process events only that match with `logs.info`. Also
# this consumer will only accept the messages equal to `hello` and reject the others.
# All the messages rejected will be stored on `queue.dl`.
$ node t4-deadletter-consumer.js 'logs.info'
```

2. Open other terminal to runt the producer:
```bash
# this message is accepted
$ node t4-deadletter.js 'logs.info' 'hello'
# and this is rejected.
$ node t4-deadletter.js 'logs.info' 'hellos'
```