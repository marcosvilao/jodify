const pool = require('../db')


const getEvents = async (req, res, next) => {
    try {

        const searchQuery = req.query.searchQuery;

        if (req.query) {

            if(searchQuery){

                const searchEvents = await searchEvent(req, res, next);

                if(searchEvents){

                    res.status(200).json(searchEvents) 

                 } else {

                     res.status(404).send({message: 'Cannot receive events from Database, please try with another filter'})

                 }
            } else {

                const { date, city, type } = req.query;

                if (date || city || type) {

                    const filterEvent = await filterEvents(req, res, next)

                    if(filterEvent){

                       res.status(200).json(filterEvent) 

                    } else {

                        res.status(404).send({message: 'Cannot receive events from Database, please try with another filter'})

                    }
                }
        }
            
        }  else {

                const events = await getEvent(req, res, next);

                if (events) {

                    res.status(200).json(events)

                } else {

                    res.status(404).send({message: 'Cannot receive events from Database, please try with another filter'})

                }
            }
        
    } catch (error) {
        console.error("Error handling events:", error);
        res.status(500).json({ error: "An error occurred while handling events" });
    }
}

const getEvent = async (req, res, next) => {
    try {
        const allEvents = await pool.query('SELECT * from event')
        if(allEvents.rows) res.status(200).json(allEvents.rows)
        else{
            res.status(404).send({message: 'Cannot receive events from Database, please try again'})
            }
    } catch (error) {
        next(error)
    }
}

const createEvent = async (req, res) => {
    try {
        const {event_Title, event_Type, event_Date, event_Location, ticket_Link, event_Image, event_Djs, event_City } = req.body;
 



        // Assuming you have a PostgreSQL pool named 'pool'
        const query = `
            INSERT INTO event(event_title, event_type, event_date, event_location, ticket_link, event_image, event_djs, event_city)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id;
        `;

        // Parsing event_Date in the format DD/MM/YYYY to YYYY-MM-DD
        // const [day, month, year] = event_Date.split('/');
        // const parsedDate = `${year}-${month}-${day}`;

        const values = [event_Title, event_Type, event_Date, event_Location, ticket_Link, event_Image, event_Djs, event_City];

        const result = await pool.query(query, values);

        const insertedId = result.rows[0].id;

        res.status(201).json({ message: 'Event created successfully', eventId: insertedId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating event' });
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

        res.status(200).json({ message: 'Event updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating event' });
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

        res.status(200).json({ message: 'Events deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting events' });
    }
};

const searchEvent = async (req, res, next) => {
    try {
        const searchQuery = req.query;
        console.log(searchQuery)

        const query = `
        SELECT * FROM event
        WHERE event_title ILIKE $1
        OR event_location ILIKE $1
        OR $1 = ANY(event_djs);  -- Search within the array using ANY operator
    `;

        const values = [`%${searchQuery}%`]; // Using ILIKE for case-insensitive search

        const result = await pool.query(query, values);

        const events = result.rows;

        return events
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error searching for events' });
    }
};

const filterEvents = async (req, res, next) => {
    try {
        const { date, city, type } = req.query;

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
          query += ` AND event_city = $${paramCount}`;
          values.push(city);
          paramCount++;
        } else {
          query += " AND (event_city IS NULL OR event_city = event_city)";
        }

        if (type) {
          query += ` AND event_type = $${paramCount}`;
          values.push(type);
        } else {
          query += " AND (event_type IS NULL OR event_type = event_type)";
        }

        console.log(query);
        console.log(values);

        const result = await pool.query(query, values);
        const events = result.rows;

        return events
    } catch (err) {
        console.error("Error fetching events:", err);
        res.status(500).json({ error: "An error occurred while fetching events" });
    }
};







module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    searchEvent,
    filterEvents
}