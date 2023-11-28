const pool = require('../db')

const getPromoters = async (req, res, next) => {
    try {
        const allPromoters = await pool.query('SELECT * FROM promoters ORDER BY "name" ASC')

        if (allPromoters.rows) {
            res.status(200).json(allPromoters.rows);
        } else {
            res.status(404).send({ message: 'Cannot receive promoters from Database, please try again' });
        }
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getPromoters
}