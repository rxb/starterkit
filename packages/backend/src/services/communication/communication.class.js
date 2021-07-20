const {buildHtmlEmail, renderButton} = require('../mailer/htmlEmail');

const buildContactPageEmail = (data, config) => {
  const bodyContent = `
      <h1>From contact page</h1>
      <p>${data.message}</p>
      <br />
      <h2>Sent by</h2>
      <p>@${data.user.urlKey}<br />
      ${data.user.name}<br />
      ${data.user.email}<br />
      ${config.serverUrl}/tldr/profile?userId=${data.user.id}</p>
  `.trim();
  return {
    from: config.serverSenderEmail,
    to: config.adminRecipientEmail,
    replyTo: data.user.email,
    subject: `From contact page: ${data.user.urlKey}`,
    html: buildHtmlEmail(config, bodyContent)
  };
}

/* eslint-disable no-unused-vars */
exports.Communication = class Communication {
  constructor (options, app) {
    this.options = options || {};
    this.app = app || {};

    this.config = {
      serverUrl: this.app.get('clientServer'),
      serverSenderEmail: this.app.get('fromEmail'),
      adminRecipientEmail: 'boenigk@gmail.com'
    }
  }

  async find (params) {
    return [];
  }

  async get (id, params) {
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }

  async create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }

    // FOR NOW
    // using POST to launch new messages 
    // data.type directs the message
    let email;
    switch(data.type){
      case 'contact':
        email = buildContactPageEmail(data, this.config) 
        break;
      /*  
      // fancier reporting later
      case 'report-card':
        email = buildReportCardEmail(data, this.config) 
        break;   
      case 'report-user':
        email = buildReportUserEmail(data, this.config) 
        break;               
      */
      default:
        break;
    }

    if(email){
      this.app.service('mailer').create(email).then(function (result) {
        console.log('Sent email', result)
      }).catch(err => {
        console.log('Error sending email', err)
      })
    }

    return data;
  }

  async update (id, data, params) {
    return data;
  }

  async patch (id, data, params) {
    return data;
  }

  async remove (id, params) {
    return { id };
  }
};
