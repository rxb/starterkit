const { disallow } = require('feathers-hooks-common');
const mailer = require('feathers-mailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

module.exports = async function (app) {

	// Register the service, see below for an example
	app.use('mailer', mailer(sendgridTransport({
		auth: {
			api_key: process.env.STARTERKIT_SENDGRID_KEY
		}
	})));
	app.service('mailer').hooks({
		before: { all: [disallow('external')] }
	})

	
	// Send a test email on load
	const email = {
		from: 'TLDR.cards <info@tldr.cards>',
		to: 'boenigk@gmail.com',
		subject: 'tldr.cards mailier starting',
		html: 'Hey what is up bro'
	};
	app.service('mailer').create(email)
		.then(result => console.log(result))
		.catch(err => console.log(err));
	

};
