const pool = require('../db')
const {linkScrap} = require('../Brain/getEventData')
const { v4: uuidv4 } = require('uuid');
const { types } = require('pg');


const getEvents = async (req, res, next) => {
    try {
        const currentDate = new Date();
        currentDate.setHours(0,0,0,0)
        console.log(currentDate.toLocaleString())
        const query = ('SELECT * FROM event WHERE event_date >= $1');
        const values = [currentDate];
        const allEvents = await pool.query(query, values);
        if (!allEvents.rows) {
            res.status(404).send({ message: 'Cannot receive events from Database, please try again' });
            return;
        }

        // Create an array to hold the grouped events
        const groupedEventsArray = [];

        // Iterate through each event and group them by event_date
        const groupedEvents = {};
        allEvents.rows.forEach(event => {
            const eventDate = event.event_date;
            if (!groupedEvents[eventDate]) {
                groupedEvents[eventDate] = [];
            }
            groupedEvents[eventDate].push(event);
        });

        // Convert the groupedEvents object into an array of objects
        for (const date in groupedEvents) {
            if (groupedEvents.hasOwnProperty(date)) {
                const obj = {};
                obj[date] = groupedEvents[date];
                groupedEventsArray.push(obj);
            }
        }

                // Sort the groupedEventsArray by date
                groupedEventsArray.sort((a, b) => {
                    // Extract the date keys
                    const dateA = Object.keys(a)[0];
                    const dateB = Object.keys(b)[0];
                    
                    // Convert the date strings to Date objects for comparison
                    const dateObjA = new Date(dateA);
                    const dateObjB = new Date(dateB);
        
                    // Compare the Date objects
                    return dateObjA - dateObjB;
                });

        console.log('events MOTHERFUCKER')

        res.status(200).json(groupedEventsArray);
    } catch (error) {
        next(error);
    }
};


const createEvent = async (req, res) => {
    try {
        const {event_title, event_type, event_date, event_location, ticket_link, event_image, event_djs, event_city } = req.body.event;

        const formattedType = event_type.join(' | ');

        const checkQuery = `
            SELECT * FROM event
        `;
        let events = await pool.query(checkQuery);
        events = events.rows
        let eventsMap = new Map()

        const date = new Date(event_date)
        console.log(date.toLocaleDateString())
        if(events.length > 0){
            for (const event of events) {
                if(eventsMap.get(`${event.event_title.toLowerCase().trim()}_${event.event_date.toLocaleDateString()}`)){
                    eventsMap.get(`${event.event_title.toLowerCase().trim()}_${event.event_date.toLocaleDateString()}`).push(event)
                } else {
                    eventsMap.set(`${event.event_title.toLowerCase().trim()}_${event.event_date.toLocaleDateString()}`, [event])
                }
            }
        }

        if(eventsMap.get(`${event_title.toLowerCase().trim()}_${date.toLocaleDateString()}`)){
            res.status(404).send({ message: 'Ya existe este evento'});
            return
        }
 
        const query = `
            INSERT INTO event(id, event_title, event_type, event_date, event_location, ticket_link, event_image, event_djs, city_id)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id;
        `;

        const values = [uuidv4(), event_title, formattedType, event_date, event_location, ticket_link, event_image, event_djs, event_city.id];

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
        events.forEach(event => {
            const eventDate = event.event_date;
            if (!groupedEvents[eventDate]) {
                groupedEvents[eventDate] = [];
            }
            groupedEvents[eventDate].push(event);
        });

        // Convert the groupedEvents object into an array of objects
        const groupedEventsArray = Object.keys(groupedEvents).map(date => ({ [date]: groupedEvents[date] }));

        res.status(200).json(groupedEventsArray);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error searching for events' });
    }
};


const filterEvents = async (req, res) => {
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
        events.forEach(event => {
            const eventDate = event.event_date;
            if (!groupedEvents[eventDate]) {
                groupedEvents[eventDate] = [];
            }
            groupedEvents[eventDate].push(event);
        });

        // Convert the groupedEvents object into an array of objects
        const groupedEventsArray = Object.keys(groupedEvents).map(date => ({ [date]: groupedEvents[date] }));

        res.status(200).json(groupedEventsArray);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ error: "An error occurred while fetching events" });
    }
};


const scrapLink = async (req, res) => {
    try {
        const LINK = req.body.link
        let data = await linkScrap(LINK)
        res.status(200).json(data)
    } catch (error) {
        console.log(error)
    }
}



module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    searchEvent,
    filterEvents,
    scrapLink
}
