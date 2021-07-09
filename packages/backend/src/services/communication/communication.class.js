const buildContactEmailText = (data) => 


`TLDR CONTACT PAGE

#########
MESSAGE
#########
${data.message} 

#########
FROM
#########
${data.user.urlKey} 
${data.user.name} 
${data.user.email}
${data.serverUrl}/tldr/profile?userId=${data.user.id}
`;


/* eslint-disable no-unused-vars */
exports.Communication = class Communication {
  constructor (options, app) {
    this.options = options || {};
    this.app = app || {};

    this.serverUrl = this.app.get('clientServer');
    this.fromEmail = this.app.get('fromEmail');
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
        email = {
          from: this.fromEmail,
          to: 'boenigk@gmail.com',
          subject: `TLDR CONTACT: ${data.user.email}`,
          text: buildContactEmailText({...data, serverUrl: this.serverUrl})
        }  
        break;
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
