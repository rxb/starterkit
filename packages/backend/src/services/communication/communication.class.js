


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

    // for now...
    // use POST to launch new messages 
    console.log('here we go communicating');
    console.log(data);

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
