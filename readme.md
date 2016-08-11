# AMQP -> RabbitMQ

Advanced Message Queuing Protocol

***

### How Run the Examples
See the document [how-to-run.md](how-to-run.md)

### Producer
Manage the messages to be published so they can be processed.

### Consumer
Receive the messages to process.

***

### Exchange
Entity that receives the messages from the produces and enrute to its linked queues.

##### Exchanges Types

* Direct: Send messages to the linked queues based on the _routing key(Unicast)._
* Fanout: Send messages to all the queues linked to the exchange.
* Topic: Send messages to the linked queues based on the _routing key(Multicast)._
* Headers: Designed to enrute multiples attributes(headers).

***

### Queue
Store the messages consumed by the application.

### Binding
Rules used for the exchange to send messages to its linked queues.

***

### Reference:
1. https://www.rabbitmq.com/tutorials/amqp-concepts.html
2. http://www.squaremobius.net/amqp.node/channel_api.html
3. https://github.com/squaremo/amqp.node
4. https://www.rabbitmq.com/getstarted.html
5. https://www.cloudamqp.com/blog/2015-05-18-part1-rabbitmq-for-beginners-what-is-rabbitmq.html