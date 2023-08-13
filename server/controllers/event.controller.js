const pool = require('../db')


const getEvents = async (req, res, next) => {
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
        const {event_Title, event_Type, event_Date, event_Location, ticket_Link, event_Image, event_Djs } = req.body;
 



        // Assuming you have a PostgreSQL pool named 'pool'
        const query = `
            INSERT INTO event(Event_Title, Event_type, Event_date, Event_location, Ticket_link, Event_image, Event_djs)
            VALUES($1, $2, $3, $4, $5, $6, $7)
            RETURNING id;
        `;

        // Parsing event_Date in the format DD/MM/YYYY to YYYY-MM-DD
        // const [day, month, year] = event_Date.split('/');
        // const parsedDate = `${year}-${month}-${day}`;

        const values = [event_Title, event_Type, event_Date, event_Location, ticket_Link, event_Image, event_Djs];

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

module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
}