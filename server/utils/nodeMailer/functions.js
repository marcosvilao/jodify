const nodemailer = require('nodemailer')
const logo =
  'https://res.cloudinary.com/dry3arjar/image/upload/v1715027728/JODIFY_Horizontal_Color_bujchm.png'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', //smtp.ethereal.email
  port: 465, //587
  secure: true, // true for 465, false for other ports
  auth: {
    user: `${process.env.NODEMAILER_GMAIL}`, //TODO generar variables en .env
    pass: `${process.env.NODEMAILER_PASS_GMAIL}`,
  },
})

const imageBtnDegrade =
  'https://res.cloudinary.com/dzu7tm74o/image/upload/v1718300473/EVENTS/8800ff_c18fff_1920_1080_jqklr5.png'

const mailOptionGeneratePassword = (email, username, token) => {
  return {
    from: 'Jodify',
    to: `${email}`,
    subject: 'Nueva contraseña Jodify',
    html: `
    <body style="font-family: Arial, sans-serif; margin:0; padding:0;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #0C0C0C; text-align: center; padding: 20px;">
            <img src=${logo} alt="Logo" style="width: 150px; height: auto; display: inline-block;">
        </div>
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <p>Hola ${username},</p>
            <p>Haz click en el link de abajo para confirmar el cambio de contraseña:</p>
            <div style="padding: 20px; text-align: center;">
                <a href="${process.env.HREF_ROOT}/reset-password/${token}" style="background-image: url(${imageBtnDegrade}); color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; border-radius: 100px; background-size: cover;">
                    Ir a Jodify
                </a>
            </div>

            <div style="display:flex; padding-bottom:30px">
              <div style="background-color:#C18FFF; width:11px;"> </div>
                <p style="padding-left:5px">Si no estas tratando de cambiar los datos de tu cuenta, por favor ignora este correo electrónico. Es posible que otro usuario haya introducido su información de forma incorrecta.</p>
            </div>

            <div style="margin-bottom: 0;">Abrazo.</div>
            <div style="margin-bottom: 0;">Equipo de Jodify.</div>

        </div>
        <div style="max-width: 600px; margin: 0 auto; background-color: #0C0C0C; color: #FFFFFF; padding: 10px; text-align: center;">
            Jodify © 2024
        </div>
    </body>
      `,
  }
}

const mailOptionValidateEmail = (email, username) => {
  return {
    from: 'Jodify',
    to: `${email}`,
    subject: 'Valida el email de tu cuenta de Jodify',
    html: `
    <body style="font-family: Arial, sans-serif; margin:0; padding:0;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #0C0C0C; text-align: center; padding: 20px;">
        <img src=${logo} alt="Logo" style="width: 150px; height: auto; display: inline-block;">
    </div>
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <p>Hola ${username}</p>
        <p>¿Cómo estas?</p>
        <p>Haz click en el link de abajo para confirmar tu correo electrónico.</p>
        <div style="padding: 20px; text-align: center;">
            <a href="${process.env.HREF_ROOT}/" style="background-image: url(${imageBtnDegrade}); color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; border-radius: 100px; background-size: cover;">
                Ir a Jodify
            </a>
        </div>

        <div style="display:flex; padding-bottom:30px">
          <div style="background-color:#C18FFF; width:11px;"> </div>
            <p style="padding-left:5px">Si no estas tratando de cambiar los datos de tu cuenta, por favor ignora este correo electrónico. Es posible que otro usuario haya introducido su información de forma incorrecta.</p>
        </div>

        <div style="margin-bottom: 0;">Abrazo.</div>
        <div style="margin-bottom: 0;">Jodify</div>

    </div>
    <div style="max-width: 600px; margin: 0 auto; background-color: #0C0C0C; color: #FFFFFF; padding: 10px; text-align: center;">
        Jodify © 2024
    </div>
</body>
      `,
  }
}

const mailOptionWelcomeForm = (email, username, adminName, token) => {
  return {
    from: 'Jodify',
    to: `${email}`,
    subject: '¡Te damos la bienvenida a Jodify!',
    html: `
    <body style="font-family: Arial, sans-serif; margin:0; padding:0;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #0C0C0C; text-align: center; padding: 20px;">
          <img src="${logo}" alt="Logo" style="width: 150px; height: auto;">
      </div>
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <p style="margin: 0 0 10px;">Hola ${username},</p>
          <p style="margin: 0 0 20px;">Soy ${adminName}, un gusto hablar con vos y conocer más acerca de tu productora. Te creamos un <a href="${process.env.HREF_ROOT}/register-promoters/${token}" style="color: #C18FFF; text-decoration: underline; cursor: pointer;">link</a> temporal para que puedas registrarte con el correo electrónico ${email} y así empezar a compartir tus eventos.</p>
          <p style="margin: 0 0 20px;"><strong>¡Quiero darte la bienvenida a Jodify!</strong></p>
          <div style="padding: 20px; text-align: center;">
              <a href="${process.env.HREF_ROOT}/register-promoters/${token}" style="background-image: url(${imageBtnDegrade}); color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; border-radius: 100px; background-size: cover;">
                  Registrarse
              </a>
          </div>
          <p style="margin: 0 0 20px;">Aclaramos que el link <strong>solo dura 48 horas</strong> y <strong>solo sirve para ese mail.</strong></p>
          <p style="margin: 0;">Saludos,</p>
          <p style="margin: 0;">${adminName}</p>
      </div>
      <div style="max-width: 600px; margin: 0 auto; background-color: #0C0C0C; color: #FFFFFF; padding: 10px; text-align: center;">
          Jodify © 2024
      </div>
  </body>

      `,
  }
}

const mailOptionUserPromoterRegister = (email, username) => {
  return {
    from: 'Jodify',
    to: `${email}`,
    subject: 'Nueva cuenta Jodify',
    html: `
    <body style="font-family: Arial, sans-serif; margin:0; padding:0;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #0C0C0C; text-align: center; padding: 20px;">
            <img src=${logo} alt="Logo" style="width: 150px; height: auto; display: inline-block;">
        </div>
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <p>Hola ${username},</p>
            <div style="margin-bottom:5;">Tu cuenta fue creada con éxito,</div>
            <div style="color:#8800FF;"><strong>¡Queremos darte la bienvenida a Jodify!</strong></div>
            <div style="padding: 20px; text-align: center;">
            <a href="${process.env.HREF_ROOT}/login-promoters" style="background-image: url(${imageBtnDegrade}); color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; border-radius: 100px; background-size: cover;">
                Iniciar Sesión
            </a>
            </div>

              <div style="margin-bottom:5;">Estamos aquí para ayudarte en cada paso del camino.</div>
              <div style="margin-bottom:50;">¡Esperamos que disfrutes tu experiencia!</div>
          

            <div style="margin-bottom: 0;">Abrazo.</div>
            <div style="margin-bottom: 0;">Equipo de Jodify.</div>

        </div>
        <div style="max-width: 600px; margin: 0 auto; background-color: #0C0C0C; color: #FFFFFF; padding: 10px; text-align: center;">
            Jodify © 2024
        </div>
    </body>
      `,
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
  mailOptionValidateEmail,
  mailOptionWelcomeForm,
  mailOptionUserPromoterRegister,
}
