const pool = require("../db");
const { v4: uuidv4 } = require("uuid");

const getPromoters = async (req, res, next) => {
  try {
    const allPromoters = await pool.query(
      'SELECT * FROM promoters ORDER BY "name" ASC'
    );

    if (allPromoters.rows) {
      res.status(200).json(allPromoters.rows);
    } else {
      res.status(404).send({
        message: "Cannot receive promoters from Database, please try again",
      });
    }
  } catch (error) {
    next(error);
  }
};

const postPromoters = async (req, res) => {
  try {
    var { name, instagram, priority } = req.body;
    var id = uuidv4();

    if (!name || !instagram || !priority) {
      res.status(400).send("Faltan enviar datos obligatorios");
    } else {
      const queryString = `INSERT INTO promoters (name, instagram, priority, id) VALUES ($1, $2, $3, $4)`;
      const values = [name, instagram, priority, id];
      const { rows } = await pool.query(queryString, values);

      res.status(201).send(`Productora creado correctamente`);
    }
  } catch (error) {
    console.error("Error interno del servidor:", error);
    res.status(500).send("Error interno del servidor");
  }
};

module.exports = {
  getPromoters,
  postPromoters,
};
