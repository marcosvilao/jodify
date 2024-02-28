const pool = require('../db');

const getCities = async (req, res, next) => {
    try {
        const allCities = await pool.query('SELECT * FROM cities ORDER BY city_name ASC');
        
        if (allCities.rows.length > 0) {
            res.status(200).json(allCities.rows);
        } else {
            res.status(404).send({ message: 'No cities found in the database.' });
        }
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getCities
};


