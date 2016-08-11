
var amqp = require('amqplib');
var basename = require('path').basename;

var key = process.argv[2] || 'log.info';

amqp.connect('amqp://localhost').then(function (conn) {
	process.once('SIGINT', function() { conn.close(); });

	return conn.createChannel().then(function (ch) {
		var ex = 'topic_exchange';
		var queue = 'queue';
		var exdl = 'topic_exchange.dl';
		var queuedl = 'queue.dl';

		// dead letter exchange configs
		var ok = ch.assertExchange(exdl, 'topic', {durable: true});

		ok = ok.then(function() {
			return ch.assertQueue(queuedl, {durable: true});
		});

		ok = ok.then(function() {
			return ch.bindQueue(queuedl, exdl, key);
		});

		// exchange configs
		ok = ok.then(function() {
			return ch.assertExchange(ex, 'topic', {durable: true});
		});

		ok = ok.then(function () {
			return ch.assertQueue(queue, {
				durable: true,
				arguments: {
					'x-dead-letter-exchange': exdl
				}
			});
		});

		ok = ok.then(function () {
			return ch.bindQueue(queue, ex, key).then(function() { return queue; });
		});

		ok = ok.then(function(queue) {
			return ch.consume(queue, logMessage, {noAck: false});
		});

		return ok.then(function() {
			console.log(' [*] Waiting for logs. To exit press CTRL+C.');
		});

		function logMessage(msg) {
			console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content.toString());

			if(msg.content.toString() !== 'hello') {
				ch.reject(msg, false);
			} else {
				ch.ack(msg);
			}
		}
	});
}).then(null, console.warn);
