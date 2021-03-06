
var amqp = require('amqplib');
var when = require('when');

var args = process.argv.slice(2);
var key = (args.length > 0) ? args[0] : 'log.info';
var message = args.slice(1).join(' ') || 'Hello World!';

amqp.connect('amqp://localhost').then(function (conn) {
    return when(conn.createChannel().then(function (ch) {
        var ex = 'topic_exchange';
        var ok = ch.assertExchange(ex, 'topic', {durable: true});

        ok = ok.then(function() {
            return ch.publish(ex, key, new Buffer(message));
        });
        
        return ok.then(function () {
            console.log(" [x] Sent %s:'%s'", key, message);
            return ch.close();
        });
    })).ensure(function () { conn.close(); })
}).then(null, console.warn);