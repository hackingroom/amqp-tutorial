
var amqp = require('amqplib');

var args = process.argv.slice(2);
var severity = args[0] || 'info';

amqp.connect('amqp://localhost').then(function(conn) {
	process.once('SIGINT', function() { conn.close(); });

	return conn.createChannel().then(function(ch) {
		var ex = 'direct_logs';

		var ok = ch.assertExchange(ex, 'direct', {durable: false});

		ok = ok.then(function() {
			return ch.assertQueue('', {exclusive: true});
		});

		ok = ok.then(function(qok) {
			var queue = qok.queue;
			
			return ch.bindQueue(queue, ex, severity).then(function() { return queue; });
		});

		ok = ok.then(function(queue) {
			return ch.consume(queue, logMessage, {noAck: true});
		});

		return ok.then(function() {
			console.log(' [*] Waiting for logs. To exit press CTRL+C.');
		});

		function logMessage(msg) {
			console.log(" [x] %s:'%s'",
									msg.fields.routingKey,
									msg.content.toString());
		}
	});
}).then(null, console.warn);
