const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { PASSNODEMAILER, JWT_SECRET_RESET_PASSWORD } = require("../config");
const pool = require("../db");
const { v4: uuidv4 } = require("uuid");

const postResetPassword = async (req, res) => {
  try {
    // Verify that the email has been sent
    const { email } = req.body;

    if (!email) {
      res.status(404).send("Send user email");
    } else {
      const emailQuery = `SELECT * FROM users WHERE email = $1`;
      const user = await pool.query(emailQuery, [email]);
      if (user.rows.length > 0) {
        const secret = `${JWT_SECRET_RESET_PASSWORD}`;
        const token = jwt.sign(
          { email: user.rows[0].email, id: user.rows[0].id },
          secret,
          {
            expiresIn: "15m",
          }
        );
        const link = `http://localhost:3000/reset-password/${user.rows[0].id}/${token}`;

        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "pipe.blaksley@gmail.com",
            pass: PASSNODEMAILER,
          },
          tls: {
            rejectUnauthorized: false,
          },
        });

        var mailOptions = {
          from: "pipe.blaksley@gmail.com",
          to: user.rows[0].email,
          subject: "Password Reset ¨Jodify",
          text: link,
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            res.status(404).send("Error sending email: " + error);
          } else {
            res
              .status(202)
              .send(
                "An email has been sent to reset the password" + info.response
              );
          }
        });
      } else {
        res.status(404).send("El usuario no existe");
      }
    }
  } catch (error) {
    res.status(500).send("Server internal error: " + error);
  }
};

const postResetPasswordEmail = async (req, res) => {
  try {
    const { id, token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      return res.status(400).json("Complete all fields");
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json("Password and confirmPassword are not the same");
    }

    const idQuery = `SELECT * FROM users WHERE id = $1`;
    const user = await pool.query(idQuery, [id]);

    if (user.rows.length > 0) {
      const decodedToken = jwt.verify(token, JWT_SECRET_RESET_PASSWORD);

      if (decodedToken.id !== id) {
        return res.status(401).json("Unauthorized token");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const updateQuery = `
      UPDATE users
      SET password = $1
      WHERE id = $2
      RETURNING *`;

      const updatedUser = await pool.query(updateQuery, [hashedPassword, id]);
      return res.json("Password changed successfully");
    } else {
      return res.status(404).json("User does not exist");
    }
  } catch (error) {
    return res.status(500).json("Server internal error: " + error.message);
  }
};

module.exports = {
  postResetPassword,
  postResetPasswordEmail,
};
