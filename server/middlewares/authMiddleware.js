const pool = require('../db'); // Replace with your database connection


// Middleware to check if user is an admin
async function checkAdmin(req, res, next) {

    const username = req.user.username; // Assuming user object is attached to the request
    try {
        const query = `SELECT role FROM users WHERE username = $1;`;
        const values = [username];

        const result = await pool.query(query, values);
        const user = result.rows[0];

        if (user && user.role === 'admin') {
            next(); // User is an admin, proceed to the next middleware
        } else {
            res.status(403).json({ message: 'Access denied: You are not an admin.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while checking admin status.' });
    }
}

module.exports = {
    checkAdmin
};
