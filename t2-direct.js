
var amqp = require('amqplib');
var when = require('when');

var args = process.argv.slice(2);

// severity is the way that the consumer filter an event
var severity = args[0] || 'info';
var message = args[1] || 'Hello World!';

amqp.connect('amqp://localhost').then(function(conn) {
	return when(conn.createChannel().then(function(ch) {
		// the exchange name used to receive all the messages
		var ex = 'direct_logs';

		var ok = ch.assertExchange(ex, 'direct', {durable: false});

		return ok.then(function() {
			ch.publish(ex, severity, new Buffer(message));
			console.log(" [x] Sent %s:'%s'", severity, message);
			return ch.close();
		});
	})).ensure(function() { conn.close(); });
}).then(null, console.warn);
