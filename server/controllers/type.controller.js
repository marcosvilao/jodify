const pool = require('../db')

const getTypes = async (req, res, next) => {
    try {
        const allTypes = await pool.query('SELECT * FROM types ORDER BY "name" ASC')

        if (allTypes.rows) {
            res.status(200).json(allTypes.rows);
        } else {
            res.status(404).send({ message: 'Cannot receive types from Database, please try again' });
        }
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getTypes
}
