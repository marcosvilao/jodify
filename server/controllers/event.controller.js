const pool = require("../db");
const { linkScrap } = require("../Brain/getEventData");
const { v4: uuidv4 } = require("uuid");
const { types } = require("pg");
const { DateTime } = require("luxon");

const getEvents = async (req, res, next) => {
  try {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);
    const options = { timeZone: "America/Argentina/Buenos_Aires" };
    const argentinaTime = currentDate.toLocaleString("en-US", options);
    const query = "SELECT * FROM event WHERE event_date >= $1";
    const values = [argentinaTime];
    const allEvents = await pool.query(query, values);
    if (!allEvents.rows) {
      res.status(404).send({
        message: "Cannot receive events from Database, please try again",
      });
      return;
    }
    const groupedEventsArray = [];
    const groupedEvents = {};
    allEvents.rows.forEach((event) => {
      let eventDate = event.event_date;
      if (!groupedEvents[eventDate]) {
        groupedEvents[eventDate] = [];
      }
      groupedEvents[eventDate].push(event);
    });

    for (const date in groupedEvents) {
      if (groupedEvents.hasOwnProperty(date)) {
        const obj = {};
        obj[date] = groupedEvents[date];
        groupedEventsArray.push(obj);
      }
    }

    groupedEventsArray.sort((a, b) => {
      const dateA = Object.keys(a)[0];
      const dateB = Object.keys(b)[0];

      const dateObjA = new Date(dateA);
      const dateObjB = new Date(dateB);

      return dateObjA - dateObjB;
    });

    res.status(200).json(groupedEventsArray);
  } catch (error) {
    next(error);
  }
};

const filterEvents = async (req, res) => {
  try {

    const { dates, city, type, search } = req.body;
    const {page} = req.params;

    let query = "SELECT * FROM event WHERE TRUE";
    const values = [];

    let paramCount = 1; // Initialize parameter counter

    if (date) {
      query += ` AND event_date = $${paramCount}`;
      values.push(date);
      paramCount++;
    } else {
      query += " AND (event_date IS NULL OR event_date = event_date)";
    }

    if (city) {
      query += ` AND city_id = $${paramCount}`;
      values.push(city);
      paramCount++;
    } else {
      query += " AND (city_id IS NULL OR city_id = city_id)";
    }

    if (type) {
      query += ` AND event_type = $${paramCount}`;
      values.push(type);
    } else {
      query += " AND (event_type IS NULL OR event_type = event_type)";
    }

    const result = await pool.query(query, values);
    const events = result.rows;

    // Create an object to hold the grouped events
    const groupedEvents = {};

    // Iterate through each event and group them by event_date
    events.forEach((event) => {
      const eventDate = event.event_date;
      if (!groupedEvents[eventDate]) {
        groupedEvents[eventDate] = [];
      }
      groupedEvents[eventDate].push(event);
    });

    // Convert the groupedEvents object into an array of objects
    const groupedEventsArray = Object.keys(groupedEvents).map((date) => ({
      [date]: groupedEvents[date],
    }));

    res.status(200).json(groupedEventsArray);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "An error occurred while fetching events" });
  }
};

const getEventsPromoters = async (req, res) => {
  try {
    const todayInArgentina = DateTime.local()
      .setZone("America/Argentina/Buenos_Aires")
      .toISODate();

    const oneWeekFromNow = DateTime.local()
      .setZone("America/Argentina/Buenos_Aires")
      .plus({ days: 7 }) // Obtener la fecha una semana desde hoy
      .toISODate();

    const result = await pool.query(`
        SELECT e.*, p.* 
        FROM event e
        LEFT JOIN promoters p ON p.id = ANY(CAST(e.promoter_id AS uuid[]))
        WHERE DATE(e.event_date) BETWEEN '${todayInArgentina}' AND '${oneWeekFromNow}'
        ORDER BY DATE(e.event_date), 
                 CASE
                   WHEN p.priority IS NOT NULL THEN p.priority
                   ELSE 9999
                 END
      `);

    if (result && result.rows && Array.isArray(result.rows)) {
      const rows = result.rows;
      res.status(202).json({ eventos: rows });
    } else {
      throw new Error("La consulta no devolvió un conjunto de filas.");
    }
  } catch (error) {
    res.status(404).send("Error interno del servidor: " + error.message);
  }
};

const createEvent = async (req, res) => {
  try {
      const {event_title, event_type, event_date, event_location, ticket_link, event_image, event_djs, event_city, event_promoter } = req.body.event;

      const formattedEventDate = new Date(event_date);
      formattedEventDate.setHours(9, 0, 0);
      let promoter;

      if(event_promoter.length > 0){
          promoter = event_promoter.map(promoter => promoter.id)
      } else {
          promoter = null
      }

      const formattedType = event_type.join(' | ');

      const querydate = ('SELECT ticket_link FROM event WHERE ticket_link = $1');
      const valuesLink = [ticket_link];

      let duplicateEvent = await pool.query(querydate, valuesLink);
      duplicateEvent = duplicateEvent.rows

      if(duplicateEvent.length > 0 && !duplicateEvent[0]?.ticket_link.toLowerCase().includes('instagram') && !duplicateEvent[0]?.ticket_link.toLowerCase().includes('espacioro')){
          res.status(404).send({ message: 'Ya existe este evento'});
          return
      }


      const query = `
          INSERT INTO event(id, event_title, event_type, event_date, event_location, ticket_link, event_image, event_djs, city_id, promoter_id)
          VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          RETURNING id;
      `;

    const values = [
      uuidv4(),
      event_title,
      formattedType,
      formattedEventDate,
      event_location,
      ticket_link,
      event_image,
      event_djs,
      event_city.id,
      promoter,
    ];

    const result = await pool.query(query, values);

    const insertedId = result.rows[0].id;

    res
      .status(201)
      .json({ message: "Event created successfully", eventId: insertedId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating event" });
  }
};

const updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id; // Assuming 'id' is the parameter name

    const { title, date, image, link, djs } = req.body;

    const query = `
            UPDATE event
            SET event_title = $1, event_date = $2, ticket_link = $3, event_image = $4, event_djs = $5
            WHERE id = $6;
        `;

    const values = [title, date, link, image, djs, eventId];

    await pool.query(query, values);

    res.status(200).json({ message: "Event updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating event" });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const eventIds = req.body.ids; // You need to set 'ids' as the key when passing the data

    const query = `
            DELETE FROM event
            WHERE id = ANY($1);
        `;

    const values = [eventIds];

    await pool.query(query, values);

    res.status(200).json({ message: "Events deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting events" });
  }
};

const searchEvent = async (req, res) => {
  try {
    const searchQuery = req.query.searchQuery;

    const query = `
        SELECT * FROM event
        WHERE event_title ILIKE $1
           OR event_location ILIKE $1
           OR event_type ILIKE $1
           OR $1 = ANY(event_djs);
        `;

    const values = [`%${searchQuery}%`]; // Using ILIKE for case-insensitive search

    const result = await pool.query(query, values);

    const events = result.rows;

    // Create an object to hold the grouped events
    const groupedEvents = {};

    // Iterate through each event and group them by event_date
    events.forEach((event) => {
      const eventDate = event.event_date;
      if (!groupedEvents[eventDate]) {
        groupedEvents[eventDate] = [];
      }
      groupedEvents[eventDate].push(event);
    });

    // Convert the groupedEvents object into an array of objects
    const groupedEventsArray = Object.keys(groupedEvents).map((date) => ({
      [date]: groupedEvents[date],
    }));

    res.status(200).json(groupedEventsArray);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error searching for events" });
  }
};

const scrapLink = async (req, res) => {
  try {
    const LINK = req.body.link;
    let data = await linkScrap(LINK);
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  searchEvent,
  filterEvents,
  scrapLink,
  getEventsPromoters,
};