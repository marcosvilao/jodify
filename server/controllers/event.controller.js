const pool = require("../db");
const { linkScrap } = require("../Brain/getEventData");
const { v4: uuidv4 } = require("uuid");
const { types } = require("pg");
const { DateTime } = require("luxon");
const { formatDate, removeAccents } = require("../Brain/Utils.js");

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

const getEventsPromoters = async (req, res) => {
  try {
    const todayInArgentina = DateTime.local()
      .setZone("America/Argentina/Buenos_Aires")
      .toISODate();

    const oneWeekFromNow = DateTime.local()
      .setZone("America/Argentina/Buenos_Aires")
      .plus({ days: 7 }) // Obtener la fecha una semana desde hoy
      .toISODate();

    const values = [todayInArgentina, oneWeekFromNow];

    const query = `
    SELECT 
    e.*, 
    COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'id', p.id,
          'name', p.name, 
          'priority', p.priority, 
          'instagram', p.instagram
        )
      ),
      '[]'
    ) AS promoters
  FROM event e 
  LEFT JOIN event_promoters ep ON e.id = ep.event_id 
  LEFT JOIN promoters p ON p.id = ep.promoter_id 
  WHERE e.event_date >= $1 AND e.event_date <= $2
  GROUP BY e.id
  ORDER BY e.event_date;
      `;

    const result = await pool.query(query, values);

    if (result && result.rows && Array.isArray(result.rows)) {
      const rows = result.rows;
      res.status(202).json({ events: rows });
    } else {
      throw new Error("La consulta no devolvió un conjunto de filas.");
    }
  } catch (error) {
    res.status(404).send("Error interno del servidor: " + error.message);
  }
};

const createEvent = async (req, res) => {
  try {
    const {
      event_title,
      event_type,
      event_date,
      event_location,
      event_image,
      event_djs,
      event_city,
      event_promoter,
      ticket_link,
    } = req.body.event;
    console.log(event_promoter);
    const formattedEventDate = new Date(event_date);
    formattedEventDate.setHours(9, 0, 0);
    let promoters;

    if (event_promoter.length > 0) {
      promoters = event_promoter.map((promoter) => promoter.id);
    }

    const formattedType = event_type.join(" | ");

    const querydate = "SELECT ticket_link FROM event WHERE ticket_link = $1";
    const valuesLink = [ticket_link];

    let duplicateEvent = await pool.query(querydate, valuesLink);
    duplicateEvent = duplicateEvent.rows;

    if (
      duplicateEvent.length > 0 &&
      !duplicateEvent[0]?.ticket_link.toLowerCase().includes("instagram") &&
      !duplicateEvent[0]?.ticket_link.toLowerCase().includes("espacioro")
    ) {
      res.status(404).send({ message: "Ya existe este evento" });
      return;
    }

    const query = `
          INSERT INTO event(id, event_title, event_type, event_date, event_location, ticket_link, event_image, event_djs, city_id)
          VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
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
    ];

    const result = await pool.query(query, values);

    const insertedId = result.rows[0].id;

    if (insertedId && event_promoter.length > 0) {
      for (let promoter of promoters) {
        const promoterQuery = `
          INSERT INTO public.event_promoters(event_id, promoter_id)
          VALUES ($1, $2);
        `;

        const promoterValues = [insertedId, promoter];

        await pool.query(promoterQuery, promoterValues);
      }
    }

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
    console.error("Error en scrapLink:", error);
    res.status(500).json(error);
  }
};

const filterEventsNew = async (req, res) => {
  try {
    const { dates, cities, types, search, page } = req.body;
    const setOff = page * 20;
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);
    const options = { timeZone: "America/Argentina/Buenos_Aires" };
    const argentinaTime = currentDate.toLocaleString("en-US", options);

    let query = `
    SELECT 
    e.*, 
    COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'id', p.id,
          'name', p.name, 
          'priority', p.priority, 
          'instagram', p.instagram
        )
      ),
      '[]'
    ) AS promoters
  FROM event e 
  LEFT JOIN event_promoters ep ON e.id = ep.event_id 
  LEFT JOIN promoters p ON p.id = ep.promoter_id 
  WHERE TRUE 
  `;
    const values = [];

    let paramCount = 1;

    if (dates && dates.length === 2) {
      const [date1, date2] = dates;
      const firstDate = formatDate(date1);
      const secondDate = formatDate(date2);
      if (firstDate !== secondDate) {
        query += ` AND e.event_date >= $${paramCount} AND e.event_date <= $${
          paramCount + 1
        }`;
        values.push(firstDate, secondDate);
        paramCount += 2;
      } else {
        query += `AND (e.event_date = $${paramCount})`;
        values.push(firstDate);
        paramCount += 1;
      }
    } else {
      query += `AND (e.event_date >= $${paramCount})`;
      values.push(argentinaTime);
      paramCount += 1;
    }

    if (cities && cities.length > 0) {
      console.log("city exists");
      const cityPlaceholders = cities
        .map((_, index) => `$${paramCount + index}`)
        .join(", ");
      query += ` AND e.city_id IN (${cityPlaceholders})`;
      values.push(...cities);
      paramCount += cities.length;
    } else {
      query += " AND (e.city_id IS NULL OR e.city_id = e.city_id)";
    }

    if (types && types.length > 0) {
      const typeConditions = types
        .map((_, index) => `e.event_type ILIKE $${paramCount + index}`)
        .join(" OR ");
      query += ` AND (${typeConditions})`;
      values.push(...types.map((t) => `%${t}%`));
      paramCount += types.length;
    } else {
      query += " AND (e.event_type IS NULL OR e.event_type = e.event_type)";
    }

    if (search) {
      const searchWithoutAccents = removeAccents(search);

      query += ` AND (unaccent(lower(e.event_title)) ILIKE unaccent(lower($${paramCount})) OR unaccent(lower(e.event_location)) ILIKE unaccent(lower($${paramCount})) OR e.event_djs @> ARRAY[unaccent(lower($${paramCount}))]::character varying[])`;
      values.push(`%${searchWithoutAccents}%`);
      paramCount++;
    }

    query += `GROUP BY e.id ORDER BY e.event_date ASC LIMIT 20 OFFSET $${paramCount}`;
    values.push(setOff);
    const result = await pool.query(query, values);
    const events = result.rows;

    const groupedEvents = {};

    events.forEach((event) => {
      const eventDate = event.event_date;
      if (groupedEvents[eventDate]) {
        groupedEvents[eventDate].push(event);
      } else groupedEvents[eventDate] = [event];
    });

    const groupedEventsArray = Object.keys(groupedEvents).map((date) => ({
      [date]: groupedEvents[date],
    }));
    res.status(200).json(groupedEventsArray);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "An error occurred while fetching events" });
  }
};

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  searchEvent,
  scrapLink,
  getEventsPromoters,
  filterEventsNew,
};
