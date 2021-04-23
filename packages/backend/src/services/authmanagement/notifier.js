module.exports = function(app) {
   // i think this needs to get sent to the client
   // that then posts it to the backend
   var serverUrl = app.get('clientServer');
   var fromEmail = app.get('fromEmail');

   function getLink(type, hash) {
     const url = serverUrl + '/tldr/' + type + '?token=' + hash
     return url
   }
 
   function sendEmail(email) {
     return app.service('mailer').create(email).then(function (result) {
       console.log('Sent email', result)
     }).catch(err => {
       console.log('Error sending email', err)
     })
   }
 
   return {
     notifier: function(type, user, notifierOptions) {
      // why datavalues instead of an array?

       let tokenLink
       let email
       switch (type) {
         case 'resendVerifySignup': //sending the user the verification email
           tokenLink = getLink('verify', user.verifyToken)
           email = {
              from: fromEmail,
              to: user.email,
              subject: 'Verify Signup',
              html: tokenLink
           }
           return sendEmail(email)
           break
 
         case 'verifySignup': // confirming verification
           tokenLink = getLink('verify', user.verifyToken)
           email = {
              from: fromEmail,
              to: user.email,
              subject: 'Confirm Signup',
              html: 'Thanks for verifying your email'
           }
           return sendEmail(email)
           break
 
         case 'sendResetPwd':
           tokenLink = getLink('resetpassword', user.resetToken)
           email = {
            from: fromEmail,
            to: user.email,
            subject: 'Reset your password',
            html: `Here you go: ${tokenLink}`
           }
           return sendEmail(email)
           break
 
         case 'resetPwd':
           email = {
              from: fromEmail,
              to: user.email,
              subject: 'Your password was reset',
              html: `Hope you were the one who did it`
            }
           return sendEmail(email)
           break
 
         case 'passwordChange':
           email = {}
           return sendEmail(email)
           break
 
         case 'identityChange':
           tokenLink = getLink('verifyChanges', user.verifyToken)
           email = {}
           return sendEmail(email)
           break
 
         default:
           break
       }
     }
   }
 }