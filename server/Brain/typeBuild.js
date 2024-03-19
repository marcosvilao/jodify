const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const pool = require('../db');

const getTypes = async () => {
    try {
        const allEventTypes = await pool.query('SELECT DISTINCT event_type FROM event');
        
        let eventTypes = allEventTypes.rows.map(e => e.event_type).filter(eventType => eventType !== '');

        for (const eventType of eventTypes) {
            const typeId = uuidv4(); // Generate a UUID
            await pool.query('INSERT INTO "type" (id, name) VALUES ($1, $2)', [typeId, eventType]);
        }

        console.log("Event types inserted successfully!");
        
    } catch (error) {
        console.error(error);
    }
}

getTypes()
