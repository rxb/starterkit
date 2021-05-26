const { Service } = require('feathers-sequelize');

exports.Tldrs = class Tldrs extends Service {
   async find (data, params) {
      if(data.query.search){
         console.log('we searchin');
         return 'yay'
      }
      return super.find(data, params);
   }
};
