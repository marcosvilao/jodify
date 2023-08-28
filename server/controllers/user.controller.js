// const pool = require('../db')

// const bcrypt = require('bcrypt');
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



// module.exports = {
//     createUser,
//     verifyUser
// }