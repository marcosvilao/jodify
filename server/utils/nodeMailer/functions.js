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

const mailOptionGeneratePassword = (email, username, token) => {
  return {
    from: 'Jodify',
    to: `${email}`,
    subject: 'Nueva contraseña Jodify',
    html: `
    <body>
        <div style="background-color:#0C0C0C; color: #fff; text-align: center; padding: 20px 0;">
            <img src=${logo} alt="Logo" style="width: 150px; height: auto; display: inline-block;">
        </div>
        <div style=" display: flex; flex-direction: column; padding: 20px;">
            <p>Hola ${username},</p>
            <p>Haz click en el link de abajo para confirmar el cambio de contraseña:</p>
            <div style="padding: 20px;text-align: center;">
                <a href="${process.env.HREF_ROOT}/reset-password/${token}" style="background-color: #C18FFF; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; border-radius: 100px;">
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
        <div style="background-color: #0C0C0C; color: #FFFFFF; padding: 10px ; position: fixed; bottom: 0; width: 90%;">
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
    <body>
    <div style="background-color:#0C0C0C; color: #fff; text-align: center; padding: 20px 0;">
        <img src=${logo} alt="Logo" style="width: 150px; height: auto; display: inline-block;">
    </div>
    <div style=" display: flex; flex-direction: column; padding: 20px;">
        <p>Hola ${username}</p>
        <p>¿Cómo estas?</p>
        <p>Haz click en el link de abajo para confirmar tu correo electrónico.</p>
        <div style="padding: 20px;text-align: center;">
            <a href="${process.env.HREF_ROOT}/" style="background-color: #C18FFF; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; border-radius: 100px;">
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
    <div style="background-color: #0C0C0C; color: #FFFFFF; padding: 10px ; position: fixed; bottom: 0; width: 90%;">
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
    <body>
      <div style="background-color:#0C0C0C; color: #fff; text-align: center; padding: 20px 0;">
          <img src=${logo} alt="Logo" style="width: 150px; height: auto; display: inline-block;">
      </div>
      <div style=" display: flex; flex-direction: column; padding: 20px;">
          <p>Hola ${username}</p>
          <div>Soy ${adminName}, ¿Cómo estas?</div>
          <div><b>¡Quiero darte la bienvenida a Jodify!</b></div>
          <p>Nos interesa participar en su fiesta y queremos que publiques tu evento en nuestra página</p>
          <p>Te creamos un <b>link temporal</b> para que puedas registrarte con nosotros.</p>
          <div style="padding: 20px;text-align: center;">
              <a href="${process.env.HREF_ROOT}/register-promoters/${token}" style="background-color: #C18FFF; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; border-radius: 100px;">
                  Ir a Jodify
              </a>
          </div>

          <p>Aclaramos que el link <b>solo dura 48 horas</b> pero no te preocupes, en caso de no poder completar el registro podes pedirnos otro link.</p>

          <div style="margin-bottom: 0;">Abrazo.</div>
          <div style="margin-bottom: 0;">${adminName}</div>
          <div style="margin-bottom: 0;">Jodify</div>

      </div>
      <div style="background-color: #0C0C0C; color: #FFFFFF; padding: 10px ; position: fixed; bottom: 0; width: 90%;">
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
}
