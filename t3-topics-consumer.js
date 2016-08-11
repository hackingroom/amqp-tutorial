
var amqp = require('amqplib');

var key = process.argv[2] || 'log.info';

amqp.connect('amqp://localhost').then(function (conn) {
    process.once('SIGINT', function() { conn.close(); });

    return conn.createChannel().then(function(ch) {
        var ex = 'topic_logs';
        var ok = ch.assertExchange(ex, 'topic', {durable: false});
        
        ok = ok.then(function() {
            return ch.assertQueue('', {exclusive: true});
        });
        
        ok = ok.then(function(qok) {
            var queue = qok.queue;
            return ch.bindQueue(queue, ex, key).then(function() { return queue; });
        });
        
        ok = ok.then(function(queue) {
            return ch.consume(queue, logMessage, {noAck: true});
        });

        return ok.then(function() {
            console.log(' [*] Waiting for logs. To exit press CTRL+C.');
        });
        
        function logMessage(msg) {
            console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content.toString());
        }
    });
}).then(null, console.warn);
