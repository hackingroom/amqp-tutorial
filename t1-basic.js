// This is a basic example of how we should publish messages
// into rabbitmq, here we will not use directly an exchange but 
// rabbitmq always use an exchange to process data, so the default 
// exchange will be `direct` -> `amqp.direct`.=

// RabbitMQ client
var amqp = require('amqplib');
var when = require('when');

var args = process.argv.slice(2);

// and this will be the message to send.
var msg = args[0] || 'hello world';

amqp.connect('amqp://localhost').then(function(conn) {
    // here we use `when` to ensure that the connection is closed 
    // after the `sendToQueue` event
    return when(conn.createChannel().then(function(ch) {
        // this will be the name of our new queue.
        var q = 'queuet1';

        // we need to be sure that the queue `queuet1` exists
        // if not, the `assertQueue` method create it.
        var ok = ch.assertQueue(q, {durable: false});

        return ok.then(function(_qok) {
            // after create | validate the existence of the queue
            // we are ready to publish messages to it.
            ch.sendToQueue(q, new Buffer(msg));
            console.log(" [x] Sent '%s'", msg);

            // we shouldn't need the channel anymore.
            return ch.close();
        });
    })).ensure(function () { conn.close(); });
}).then(null, console.warn);

