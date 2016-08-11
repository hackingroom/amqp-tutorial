var amqp = require('amqplib');

amqp.connect('amqp://localhost').then(function (conn) {
    return conn.createChannel().then(function (ch) {
        // queue to consume
        var q = 'queuet1';

        // we need to make sure that the queue exists
        var ok = ch.assertQueue(q, { durable: false});

        ok = ok.then(function () {
            // initialize the consume event 
            return ch.consume(q, function (msg) {
                setTimeout(function () {
                    console.log(" [x] Received '%s'", msg.content.toString());      
                }, 3000);
            }, { noAck: true });
        });

        return ok.then(function (_consumeOk) {
            console.log(' [*] Waiting for messages. To exit press CTRL+C');
        });
    });
}).then(null, console.warn);