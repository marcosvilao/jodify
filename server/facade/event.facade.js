const { removeAccents, formatDate } = require('../Brain/Utils.js')
const pool = require('../db')

class EventFacade {
  async getEventById(id) {
    const query = `
    SELECT * FROM events WHERE id = $1;
    `

    const values = [id]

    const event = await pool.query(query, values)

    if (!event) return null

    // console.log('evento:', event)
    return event.rows[0]
  }

  async getEvents() {}

  async getEventsByFilter(data) {
    const { dates, citiesId, search, sharedId, setOff, argentinaTime, typesId, limit } = data

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

    if (citiesId && citiesId.length > 0) {
      const cityPlaceholders = citiesId.map((_, index) => `$${paramCount + index}`).join(', ')
      query += ` AND e.city_id IN (${cityPlaceholders})`
      values.push(...citiesId)
      paramCount += citiesId.length
    } else {
      query += ' AND (e.city_id IS NULL OR e.city_id = e.city_id)'
    }

    if (typesId && typesId.length > 0) {
      const typePlaceholders = typesId.map((_, index) => `$${paramCount + index}`).join(', ')
      query += ` AND EXISTS (
        SELECT 1 FROM event_types et
        WHERE et.event_id = e.id AND et.type_id IN (${typePlaceholders})
        )`
      values.push(...typesId)
      paramCount += typesId.length
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

    if (sharedId) {
      query += `AND (e.id = $${paramCount} OR (e.date_from = (SELECT date_from FROM events WHERE id = $${paramCount}) AND e.id != $${paramCount}))`
      values.push(sharedId)
      paramCount++
    }

    query += `GROUP BY e.id, mp.priority, ed.djs, et.types ORDER BY e.date_from ASC, mp.priority ASC, e.id ASC ${
      sharedId || !limit ? '' : `LIMIT ${limit}`
    } OFFSET $${paramCount}`

    values.push(setOff)
    const result = await pool.query(query, values)

    if (!result) return []
    return result.rows
  }

  async getEventByTicketLink(link) {
    const query = 'SELECT ticket_link FROM events WHERE ticket_link = $1'
    const valuesLink = [link]

    const event = await pool.query(query, valuesLink)

    if (!event) return null
    return event.rows[0]
  }

  async searchEvent(searchQuery) {
    const query = `
        SELECT * FROM events
        WHERE name ILIKE $1
           OR venue ILIKE $1
           OR event_type ILIKE $1
           OR $1 = ANY(event_djs);
        `

    const values = [`%${searchQuery}%`] // Using ILIKE for case-insensitive search

    const result = await pool.query(query, values)

    if (!result) return []

    return result.rows
  }

  async createEvent(values) {
    const query = `
          INSERT INTO events(id, name, date_from, venue, ticket_link, image, city_id)
          VALUES($1, $2, $3, $4, $5, $6, $7)
          RETURNING id;
      `

    const newEvent = await pool.query(query, values)

    if (!newEvent) return null

    return newEvent.rows[0].id
  }

  async updateEvent(values) {
    const query = `
    UPDATE event
    SET name = $1, date_from = $2, ticket_link = $3, image_url = $4, event_djs = $5
    WHERE id = $6;
    `

    await pool.query(query, values)
  }

  async updateEventInteraction(id, interaction) {
    await pool.query(`UPDATE events SET interactions = ${interaction} WHERE id = '${id}';`)
  }

  async relationshipEventId(ids, query1, query2) {
    const query = `
          INSERT INTO public.${query1}(event_id, ${query2})
          VALUES ($1, $2);
        `
    await pool.query(query, ids)
  }

  async deleteEvent(id) {
    const query = `
    DELETE FROM events
    WHERE id = ANY($1);
    `

    // const values = [eventIds]  //TODO para eliminar mandan mas de un id??
    const values = [id]

    await pool.query(query, values)
  }
}

module.exports = {
  EventFacade,
}
