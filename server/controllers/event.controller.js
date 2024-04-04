const pool = require('../db')
const { linkScrap } = require('../Brain/getEventData')
const { v4: uuidv4 } = require('uuid')
const { types } = require('pg')
const { DateTime } = require('luxon')
const { formatDate, removeAccents } = require('../Brain/Utils.js')
const { getImageFromCache } = require('../utils/cacheFunction/cacheFunction.js')

const createEvent = async (req, res) => {
  try {
    const {
      name,
      event_type,
      date_from,
      venue,
      image_url,
      event_djs,
      event_city,
      event_promoter,
      ticket_link,
    } = req.body.event

    let typesIDs = event_type.length > 0 ? event_type.map((type) => type.id) : null
    let djsIDs = event_djs.length > 0 ? event_djs.map((dj) => dj.id) : null
    let promotersIDs =
      event_promoter.length > 0 ? event_promoter.map((promoter) => promoter.id) : null
    let cityID = event_city.id

    const formattedEventDate = new Date(date_from)
    formattedEventDate.setHours(9, 0, 0)

    const event = {
      id: uuidv4(),
      name,
      date_from,
      venue,
      ticket_link,
      image_url,
    }

    const query = `
          INSERT INTO events(id, name, date_from, venue, ticket_link, image_url, city_id)
          VALUES($1, $2, $3, $4, $5, $6, $7)
          RETURNING id;
      `

    const values = [
      event.id,
      event.name,
      formattedEventDate,
      event.venue,
      event.ticket_link,
      event.image_url,
      cityID,
    ]

    const result = await pool.query(query, values)

    const insertedId = result.rows[0].id

    if (insertedId && typesIDs.length > 0) {
      for (let id of typesIDs) {
        const query = `
          INSERT INTO public.event_types(event_id, type_id)
          VALUES ($1, $2);
        `

        const IDs = [insertedId, id]

        await pool.query(query, IDs)
      }
    }

    if (insertedId && djsIDs.length > 0) {
      for (let id of djsIDs) {
        const query = `
          INSERT INTO public.event_djs(event_id, dj_id)
          VALUES ($1, $2);
        `

        const IDs = [insertedId, id]
        if (id) {
          await pool.query(query, IDs)
        }
      }
    }

    if (insertedId && promotersIDs.length > 0) {
      for (let id of promotersIDs) {
        const query = `
          INSERT INTO public.event_promoters(event_id, promoter_id)
          VALUES ($1, $2);
        `

        const IDs = [insertedId, id]

        await pool.query(query, IDs)
      }
    }

    res.status(201).json({ message: 'Event created successfully', eventId: insertedId })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error creating event' })
  }
}

const updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id // Assuming 'id' is the parameter name

    const { title, date, image, link, djs } = req.body

    const query = `
            UPDATE event
            SET name = $1, date_from = $2, ticket_link = $3, image_url = $4, event_djs = $5
            WHERE id = $6;
        `

    const values = [title, date, link, image, djs, eventId]

    await pool.query(query, values)

    res.status(200).json({ message: 'Event updated successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error updating event' })
  }
}

const deleteEvent = async (req, res) => {
  try {
    const eventIds = req.body.ids // You need to set 'ids' as the key when passing the data

    const query = `
            DELETE FROM events
            WHERE id = ANY($1);
        `

    const values = [eventIds]

    await pool.query(query, values)

    res.status(200).json({ message: 'Events deleted successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error deleting events' })
  }
}

const searchEvent = async (req, res) => {
  try {
    const searchQuery = req.query.searchQuery

    const query = `
        SELECT * FROM events
        WHERE name ILIKE $1
           OR venue ILIKE $1
           OR event_type ILIKE $1
           OR $1 = ANY(event_djs);
        `

    const values = [`%${searchQuery}%`] // Using ILIKE for case-insensitive search

    const result = await pool.query(query, values)

    const events = result.rows

    // Create an object to hold the grouped events
    const groupedEvents = {}

    // Iterate through each event and group them by date_from
    events.forEach((event) => {
      const eventDate = event.date_from
      if (!groupedEvents[eventDate]) {
        groupedEvents[eventDate] = []
      }
      groupedEvents[eventDate].push(event)
    })

    // Convert the groupedEvents object into an array of objects
    const groupedEventsArray = Object.keys(groupedEvents).map((date) => ({
      [date]: groupedEvents[date],
    }))

    res.status(200).json(groupedEventsArray)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error searching for events' })
  }
}

const scrapLink = async (req, res) => {
  try {
    const LINK = req.body.link
    let data = await linkScrap(LINK)

    res.status(200).json(data)
  } catch (error) {
    console.error('Error en scrapLink:', error)
    res.status(500).json({ err: error })
  }
}

const filterEventsNew = async (req, res) => {
  try {
    const { dates, cities, types, search, page, sharedId } = req.body
    const mappedTypes = types.map((type) => type?.id)
    const setOff = page * 20
    const currentDate = new Date()
    currentDate.setDate(currentDate.getDate() - 1)
    const options = { timeZone: 'America/Argentina/Buenos_Aires' }
    const argentinaTime = currentDate.toLocaleString('en-US', options)

    let query = `
    WITH MinPriority AS (
      SELECT ep.event_id, MIN(p.priority) AS priority
      FROM event_promoters ep
      JOIN promoters p ON p.id = ep.promoter_id
      GROUP BY ep.event_id
    ), EventDJs AS (
      SELECT
          ed.event_id,
          jsonb_agg(
              jsonb_build_object(
                  'id', d.id,
                  'name', d.name,
                  'types', (
                    SELECT jsonb_agg(
                        jsonb_build_object(
                            'id', t.id,
                            'name', t.name
                        )
                    ) FROM dj_types djt
                    JOIN types t ON t.id = djt.type_id
                    WHERE djt.dj_id = d.id
                )
              ) ORDER BY d.name ASC
          ) AS djs
      FROM event_djs ed
      JOIN djs d ON d.id = ed.dj_id
      GROUP BY ed.event_id
  ), EventTypes AS (
      SELECT
          et.event_id,
          jsonb_agg(
              jsonb_build_object(
                  'id', t.id,
                  'name', t.name
              ) ORDER BY t.name ASC
          ) AS types
      FROM event_types et
      JOIN types t ON t.id = et.type_id
      GROUP BY et.event_id
  )
    SELECT 
    e.*, 
    COALESCE(mp.priority, 4) AS min_priority,
    COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'id', p.id,
          'name', p.name, 
          'priority', p.priority, 
          'instagram', p.instagram
        ) ORDER BY p.priority ASC
      ) FILTER (WHERE p.id IS NOT NULL),
      '[]'
    ) AS promoters,
    COALESCE(ed.djs, '[]') AS djs,
    COALESCE(et.types, '[]') AS types
    FROM events e 
    LEFT JOIN MinPriority mp ON e.id = mp.event_id
    LEFT JOIN event_promoters ep ON e.id = ep.event_id
    LEFT JOIN promoters p ON p.id = ep.promoter_id
    LEFT JOIN EventDJs ed ON e.id = ed.event_id
    LEFT JOIN EventTypes et ON e.id = et.event_id
    WHERE TRUE
  `
    const values = []

    let paramCount = 1

    if (dates && dates.length === 2) {
      const [date1, date2] = dates
      const firstDate = formatDate(date1)
      const secondDate = formatDate(date2)
      if (firstDate !== secondDate) {
        query += ` AND e.date_from >= $${paramCount} AND e.date_from <= $${paramCount + 1}`
        values.push(firstDate, secondDate)
        paramCount += 2
      } else {
        query += `AND (e.date_from = $${paramCount})`
        values.push(firstDate)
        paramCount += 1
      }
    } else {
      query += `AND (e.date_from >= $${paramCount})`
      values.push(argentinaTime)
      paramCount += 1
    }

    if (cities && cities.length > 0) {
      const cityPlaceholders = cities.map((_, index) => `$${paramCount + index}`).join(', ')
      query += ` AND e.city_id IN (${cityPlaceholders})`
      values.push(...cities)
      paramCount += cities.length
    } else {
      query += ' AND (e.city_id IS NULL OR e.city_id = e.city_id)'
    }

    if (mappedTypes && mappedTypes.length > 0) {
      const typePlaceholders = mappedTypes.map((_, index) => `$${paramCount + index}`).join(', ')
      query += ` AND EXISTS (
        SELECT 1 FROM event_types et
        WHERE et.event_id = e.id AND et.type_id IN (${typePlaceholders})
      )`
      values.push(...mappedTypes)
      paramCount += mappedTypes.length
    }

    if (search) {
      const searchWithoutAccents = removeAccents(search)
      // Adjust the search condition to include promoters, djs, venue, and event name
      query += ` AND (
        unaccent(lower(e.name)) ILIKE unaccent(lower($${paramCount}))
        OR unaccent(lower(e.venue)) ILIKE unaccent(lower($${paramCount}))
        OR EXISTS (
          SELECT 1 FROM event_djs ed
          JOIN djs dj ON ed.dj_id = dj.id
          WHERE ed.event_id = e.id AND unaccent(lower(dj.name)) ILIKE unaccent(lower($${paramCount}))
        )
        OR EXISTS (
          SELECT 1 FROM event_types et
          JOIN types tp ON et.type_id = tp.id
          WHERE et.event_id = e.id AND unaccent(lower(tp.name)) ILIKE unaccent(lower($${paramCount}))
        )
        OR EXISTS (
          SELECT 1 FROM event_promoters ep
          JOIN promoters p ON ep.promoter_id = p.id
          WHERE ep.event_id = e.id AND unaccent(lower(p.name)) ILIKE unaccent(lower($${paramCount}))
        )
        OR EXISTS (
          SELECT 1 FROM event_promoters ep
          JOIN promoters p ON ep.promoter_id = p.id
          WHERE ep.event_id = e.id AND unaccent(lower(p.name)) ILIKE unaccent(lower($${paramCount}))
        )
      )`
      values.push(`%${searchWithoutAccents}%`)
      paramCount++
    }

    query += `GROUP BY e.id, mp.priority, ed.djs, et.types ORDER BY e.date_from ASC,mp.priority ASC, e.id ASC ${
      sharedId ? 'LIMIT NULL' : 'LIMIT 20'
    } OFFSET $${paramCount}`

    values.push(setOff)
    const result = await pool.query(query, values)
    const events = result.rows

    //-----remplazamos la url de cloudinary por la url del cache:

    for (const e of events) {
      if (e.image_url.startsWith('https://res.cloudinary.com')) {
        const buffer = await getImageFromCache(e.image_url)

        //se convierte el buffer en una url para mandar al front

        const base64Image = Buffer.from(buffer).toString('base64')

        // tipo de imagen: .jpg, .png etc.
        const type = e.image_url.match(/\.([^.]+)$/)
        if (!type) return null
        const contentType = type[1].toLowerCase()

        const imageUrl = `data:${contentType};base64,${base64Image}`

        e.image_url = imageUrl
      }
    }

    //-------------------------

    const groupedEvents = {}

    events.forEach((event) => {
      const eventDate = event.date_from
      if (groupedEvents[eventDate]) {
        groupedEvents[eventDate].push(event)
      } else groupedEvents[eventDate] = [event]
    })

    const groupedEventsArray = Object.keys(groupedEvents).map((date) => ({
      [date]: groupedEvents[date],
    }))
    res.status(200).json(groupedEventsArray)
  } catch (error) {
    console.error('Error fetching events:', error)
    res.status(500).json({ error: 'An error occurred while fetching events' })
  }
}

const updateEventInteraction = async (req, res) => {
  try {
    const { id } = req.params
    let event = await pool.query(`SELECT * FROM events WHERE id = '${id}'`)
    event = event.rows[0]
    if (event) {
      const interactions = event.interactions + 1
      await pool.query(`UPDATE events SET interactions = ${interactions} WHERE id = '${id}';`)
      res.status(200).json({ message: 'Interaction added' })
    }
  } catch (error) {
    console.log(error)
  }
}

const checkLinkDuplicate = async (req, res) => {
  try {
    const { link } = req.body
    const querydate = 'SELECT ticket_link FROM events WHERE ticket_link = $1'
    const valuesLink = [link]

    let duplicateEvent = await pool.query(querydate, valuesLink)
    duplicateEvent = duplicateEvent.rows

    if (
      duplicateEvent.length > 0 &&
      !duplicateEvent[0]?.ticket_link.toLowerCase().includes('instagram') &&
      !duplicateEvent[0]?.ticket_link.toLowerCase().includes('espacioro')
    ) {
      res.status(200).send({ message: 'Ya existe este evento' })
      return
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  createEvent,
  updateEvent,
  deleteEvent,
  searchEvent,
  scrapLink,
  filterEventsNew,
  updateEventInteraction,
  checkLinkDuplicate,
}
