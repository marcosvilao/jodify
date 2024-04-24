const pool = require('../db')

const getDjs = async (req, res, next) => {
    try {

        const query = `
            SELECT d.id, d.name, json_agg(t.*) as types
            FROM djs d
            LEFT JOIN dj_types dt ON d.id = dt.dj_id
            LEFT JOIN types t ON dt.type_id = t.id
            GROUP BY d.id
            ORDER BY d.name ASC
        `;

        const allDjsWithTypes = await pool.query(query);

        if (allDjsWithTypes.rows.length > 0) {
            res.status(200).json(allDjsWithTypes.rows);
        } else {
            res.status(404).send({ message: 'Cannot receive DJs with types from Database, please try again' });
        }
    } catch (error) {
        console.error('Error fetching DJs with types:', error);
        next(error);
    }
};

module.exports = {
    getDjs
}
