// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// const pool = require('./db')
// const bcrypt = require('bcrypt');

// const initializePassport = (passport) => {
//     passport.use(new LocalStrategy(async (username, password, done) => {
//     try {
//         const query = `SELECT * FROM users WHERE username = $1;`;
//         const values = [username];

//         const result = await pool.query(query, values);
//         const user = result.rows[0];

//         if (!user) {
//             return done(null, false, { message: 'Incorrect username.' });
//         }

//         const passwordMatch = await bcrypt.compare(password, user.password);
//         if (passwordMatch) {
//             return done(null, user, {message: 'You logged in!'});
//         } else {
//             return done(null, false, { message: 'Incorrect password.' });
//         }
//     } catch (error) {
//         return done(error);
//     }
// }));

// passport.serializeUser((user, done) => {
//     done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//     const query = `SELECT * FROM users WHERE id = $1;`;
//     const values = [id];

//     try {
//         const result = await pool.query(query, values);
//         const user = result.rows[0];
//         done(null, user);
//     } catch (error) {
//         done(error);
//     }
// });
// }


// module.exports = initializePassport
