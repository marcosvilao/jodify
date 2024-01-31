const pool = require("../db");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const createUser = async (req, res) => {
  try {
    const { username, password, repeatPassword, email, role } = req.body;
    var id = uuidv4();

    if (!username || !password || !repeatPassword || !email || !role) {
      res.status(404).send("Falta enviar datos obligatorios");
    } else if (password !== repeatPassword) {
      res
        .status(404)
        .send("La contraseña y repetir contraseña deben ser iguales");
    } else {
      // Check if email or username already exist
      const emailQuery = `SELECT * FROM users WHERE email = $1`;
      const emailResult = await pool.query(emailQuery, [email]);
      const usernameQuery = `SELECT * FROM users WHERE username = $1`;
      const usernameResult = await pool.query(usernameQuery, [username]);

      if (emailResult.rows.length > 0) {
        res.status(400).send("El email ya está en uso");
      } else if (usernameResult.rows.length > 0) {
        res.status(400).send("El nombre de usuario ya está en uso");
      } else {
        // Hash the password before storing it
        const saltRounds = 10; // Number of salt rounds for bcrypt
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const queryString = `INSERT INTO users (id, username, password, email, role) VALUES ($1, $2, $3, $4, $5)`;
        const values = [id, username, hashedPassword, email, role];
        const { rows } = await pool.query(queryString, values);
      }

      res.status(201).send(`Usuario creado correctamente`);
    }
  } catch (error) {
    console.log(error);
  }
};

const getUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!password || !email) {
      res.status(404).send("Falta enviar datos obligatorios ");
    } else {
      const emailQuery = `SELECT * FROM users WHERE email = $1`;
      const emailResult = await pool.query(emailQuery, [email]);

      if (emailResult.rows.length > 0) {
        const user = emailResult.rows[0];
        const hashedPassword = user.password;

        bcrypt.compare(password, hashedPassword, (err, result) => {
          if (err) {
            res
              .status(500)
              .send(
                "Error interno del servidor intentar luego mas tarde, disculpe las molestias"
              );
          } else if (result) {
            const loginUser = {
              email: user.email,
              username: user.username,
            };
            res.status(201).send(loginUser);
          } else {
            res.status(404).send("Usuario o contraseña incorrectos");
          }
        });
      } else {
        res.status(404).send("Usuario o contraseña incorrectos");
      }
    }
  } catch (error) {
    res
      .status(404)
      .send(
        "Error interno del servidor intentar luego mas tarde, disculpe las molestias"
      );
  }
};

const getAuth0User = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(404).send("Falta enviar datos obligatorios ");
    } else {
      const emailQuery = `SELECT * FROM users WHERE email = $1`;
      const emailResult = await pool.query(emailQuery, [email]);

      if (emailResult.rows.length > 0) {
        const user = emailResult.rows[0];
        const loginUser = {
          email: user.email,
          username: user.username,
        };
        res.status(201).send(loginUser);
      } else {
        res.status(404).send("El usuario no existe primero debe registrarse");
      }
    }
  } catch (error) {
    res
      .status(404)
      .send(
        "Error interno del servidor intentar luego mas tarde, disculpe las molestias"
      );
  }
};

const createAuth0User = async (req, res) => {
  try {
    const { username, email, role } = req.body;
    var id = uuidv4();

    if (!username || !email || !role) {
      res.status(404).send("Falta enviar datos obligatorios");
    } else {
      // Check if email or username already exist
      const emailQuery = `SELECT * FROM users WHERE email = $1`;
      const emailResult = await pool.query(emailQuery, [email]);

      if (emailResult.rows.length > 0) {
        res.status(400).send("El email ya está en uso");
      } else {
        const queryString = `INSERT INTO users (id, username, email, role) VALUES ($1, $2, $3, $4)`;
        const values = [id, username, email, role];
        const { rows } = await pool.query(queryString, values);
      }

      res.status(201).send(`Usuario creado correctamente`);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createUser,
  getUser,
  getAuth0User,
  createAuth0User,
};

// const saltRounds = 10; // Number of salt rounds for bcrypt

// // Assuming you have a function to create a user
// async function createUser(req, res) {
//     try {
//         const {username, password} = req.body
//         // Check if the username already exists
//         const checkQuery = 'SELECT id FROM users WHERE username = $1;';
//         const checkValues = [username];

//         const checkResult = await pool.query(checkQuery, checkValues);
//         if (checkResult.rows.length > 0) {
//             throw new Error('Username already exists.');
//         }

//         // Hash the password before storing it
//         const hashedPassword = await bcrypt.hash(password, saltRounds);

//         // Insert the user into the 'users' table with default role 'user'
//         const insertQuery = `
//             INSERT INTO users (username, password)
//             VALUES ($1, $2)
//             RETURNING id, username;
//         `;
//         const insertValues = [username, hashedPassword];

//         await pool.query(insertQuery, insertValues);

//         res.status(200).send({message : 'User created successfully'})
//     } catch (error) {
//         throw error;
//     }
// }

// async function verifyUser(req, res) {
//     try {
//         const { username, password } = req.body;

//         const query = `SELECT id, username, password, role FROM users WHERE username = $1;`;
//         const values = [username];

//         const result = await pool.query(query, values);
//         const user = result.rows[0];

//         if (!user) {
//             return res.status(401).json({ message: 'User not found' });
//         }

//         if (!user.password) {
//             return res.status(500).json({ message: 'User record is missing password' });
//         }

//         const passwordMatch = await bcrypt.compare(password, user.password);
//         if (passwordMatch) {
//             req.session.user = user;
//             res.status(200).json(user);
//         } else {
//             res.status(401).json({ message: 'Incorrect password' });
//         }
//     } catch (error) {
//         res.status(500).json({ message: 'Internal server error' });
//     }
// }
