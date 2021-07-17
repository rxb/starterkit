const buildHtmlEmail = require('../mailer/buildHtmlEmail');


module.exports = function (app) {
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
    notifier: function (type, user, notifierOptions) {

      let tokenLink, email, bodyContent
      switch (type) {

        case 'resendVerifySignup': //sending the user the verification email
          tokenLink = getLink('verify', user.verifyToken)
          bodyContent = `
              <h1>Verify your email</h1>
              <p>Follow this link to verify your account: <a href="${tokenLink}">${tokenLink}</a></p>
          `.trim();
          email = {
            from: fromEmail,
            to: user.email,
            subject: `Verify your email`,
            html: buildHtmlEmail({}, bodyContent)
          };
          return sendEmail(email)
          break

        case 'verifySignup': // confirming verification
          tokenLink = getLink('verify', user.verifyToken)
          bodyContent = `
              <h1>Welcome!</h1>
              <p>Thanks for verifying your email.</p>
          `.trim();
          email = {
            from: fromEmail,
            to: user.email,
            subject: `Welcome!`,
            html: buildHtmlEmail({}, bodyContent)
          };
          return sendEmail(email)
          break
          
        case 'sendResetPwd':
          tokenLink = getLink('resetpassword', user.resetToken)
          bodyContent = `
              <h1>Reset your password</h1>
              <p>Follow this link to reset your password: <a href="${tokenLink}">${tokenLink}</a></p>
          `.trim();
          email = {
            from: fromEmail,
            to: user.email,
            subject: `Reset your password`,
            html: buildHtmlEmail({}, bodyContent)
          };
          return sendEmail(email)
          break

        case 'resetPwd':
          bodyContent = `
              <h1>Your password was reset</h1>
              <p>Hope you were the one who did it</p>
          `.trim();
          email = {
            from: fromEmail,
            to: user.email,
            subject: `Your password was reset`,
            html: buildHtmlEmail({}, bodyContent)
          };
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