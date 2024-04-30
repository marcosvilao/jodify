const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', //smtp.ethereal.email
  port: 465, //587
  secure: true, // true for 465, false for other ports
  auth: {
    // user: `${process.env.NODEMAILER_GMAIL}`, //TODO generar variables en .env
    // pass: `${process.env.NODEMAILER_PASS_GMAIL}`,
  },
})

const mailOptionGeneratePassword = (email, username, newPass) => {
  const image = ''
  return {
    from: 'Jodify', // sender address
    to: `${email}`, // list of receivers
    subject: 'Nueva contraseña Jodify', // Subject line
    html: `
      <body>
          <header style="background-color: #333; color: #fff; text-align: center; padding: 20px 0;">
              <img src="" alt="Logo" style="width: 150px; height: auto; display: inline-block;">
          </header>
          <div style="padding: 20px;">
              <p>Hola [nombre de usuario],</p>
              <p>Haz click en el siguiente enlace para cambiar tu contraseña:</p>
              <button style="background-color: #4CAF50; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; border-radius: 8px;">Cambiar contraseña</button>
              <p>Más párrafos con texto aquí...</p>
          </div>
          <footer style="background-color: #333; color: #fff; text-align: center; padding: 10px 0; position: fixed; bottom: 0; width: 100%;">
              Nombre de la Página
          </footer>
      </body>
      `,

    // text: ``
  }
}

const sendEmail = (mailOption) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOption, (err, info) => {
      if (err) {
        console.log('Error al enviar el email')
        reject('Failed to send verification email.')
      } else {
        console.log('El email se envió con éxito.')
        resolve('Verification email sent successfully.')
      }
    })
  })
}

module.exports = {
  sendEmail,
  mailOptionGeneratePassword,
}
