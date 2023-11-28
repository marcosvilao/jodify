const pool = require('../db')

const getDjs = async (req, res, next) => {
    try {
        const allDjs = await pool.query('SELECT name FROM djs ORDER BY "name" ASC')

        if (allDjs.rows) {
            res.status(200).json(allDjs.rows);
        } else {
            res.status(404).send({ message: 'Cannot receive djs from Database, please try again' });
        }
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getDjs
}
