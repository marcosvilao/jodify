const { removeAccents, formatDate } = require('../Brain/Utils.js')
const pool = require('../db')

class EventFacade {
  async getEventById(id) {
    const query = `
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
                  'name', d.name
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
    WHERE e.id = $1
    GROUP BY e.id, mp.priority, ed.djs, et.types
    `

    const values = [id]

    const event = await pool.query(query, values)

    if (!event) return null

    return event.rows[0]
  }

  async getEventCount(argentinaTime) {
    try {
      const res = await pool.query(
        'SELECT COUNT(*) FROM events WHERE is_active = true AND date_from >= $1',
        [argentinaTime]
      )
      return res.rows[0].count
    } catch (err) {
      console.error('Error executing query', err.stack)
    }
  }

  async getEventsByFilter(data) {
    const {
      dates,
      citiesId,
      search,
      sharedId,
      setOff,
      argentinaTime,
      typesId,
      limit,
      status,
      promoterId,
    } = data

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
                  'name', d.name
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
    WHERE e.is_active = TRUE
    `
    const values = []
    let paramCount = 1

    if (promoterId) {
      query += ` AND p.id = $${paramCount} AND e.is_active = TRUE`
      values.push(String(promoterId))
      paramCount++
    } else {
      if (dates && dates.length === 2) {
        const [date1, date2] = dates
        const firstDate = formatDate(date1)
        const secondDate = formatDate(date2)
        if (firstDate !== secondDate) {
          query += ` AND e.date_from >= $${paramCount} AND e.date_from <= $${paramCount + 1}`
          values.push(firstDate, secondDate)
          paramCount += 2
        } else {
          query += ` AND (e.date_from = $${paramCount})`
          values.push(firstDate)
          paramCount++
        }
      } else if (status) {
        query += ` AND (e.date_from < $${paramCount})`
        values.push(argentinaTime)
        paramCount++
      } else {
        query += ` AND (e.date_from >= $${paramCount})`
        values.push(argentinaTime)
        paramCount++
      }
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
      )`
      values.push(`%${searchWithoutAccents}%`)
      paramCount++
    }

    if (sharedId) {
      query += ` AND (e.id = $${paramCount} OR (e.date_from = (SELECT date_from FROM events WHERE id = $${paramCount}) AND e.id != $${paramCount}))`
      values.push(sharedId)
      paramCount++
    }

    query += ` GROUP BY e.id, mp.priority, ed.djs, et.types ORDER BY e.date_from ASC, mp.priority ASC, e.id ASC ${
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

  async relationshipEventId(ids, query1, query2) {
    const query = `
          INSERT INTO public.${query1}(event_id, ${query2})
          VALUES ($1, $2);
        `
    await pool.query(query, ids)
  }

  async updateEvent(id, data) {
    const { name, venue, date_from, event_city, ticket_link, image } = data

    const setParts = []
    const values = []
    let paramIndex = 1

    if (name) {
      setParts.push(`name = $${paramIndex}`)
      values.push(name)
      paramIndex++
    }
    if (date_from) {
      setParts.push(`date_from = $${paramIndex}`)
      values.push(date_from)
      paramIndex++
    }
    if (ticket_link) {
      setParts.push(`ticket_link = $${paramIndex}`)
      values.push(ticket_link)
      paramIndex++
    }
    if (image) {
      setParts.push(`image = $${paramIndex}`)
      values.push(JSON.stringify(image))
      paramIndex++
    }
    if (venue) {
      setParts.push(`venue = $${paramIndex}`)
      values.push(venue)
      paramIndex++
    }
    if (event_city) {
      setParts.push(`city_id = $${paramIndex}`)
      values.push(event_city)
      paramIndex++
    }

    setParts.push(`updatedAt = CURRENT_TIMESTAMP`)

    const setClause = setParts.join(', ')
    const query = `UPDATE events SET ${setClause} WHERE id = $${paramIndex} RETURNING *;`
    values.push(id)

    const eventUpdated = await pool.query(query, values)

    if (!eventUpdated || !eventUpdated.rows[0]) return null
    return eventUpdated.rows[0]
  }

  async updateRelationshipEvent(table, column, id, arr_ids) {
    // try {
    //   const query = `UPDATE ${table} SET ${column} = $1 WHERE event_id = $2;`

    //   await pool.query(query, [id, event_id])
    // } catch (error) {
    //   console.log('err', { err: error.message })
    // }

    try {
      // Paso 1: Eliminar todas las relaciones existentes para el evento especificado
      const deleteQuery = `DELETE FROM ${table} WHERE event_id = $1;`
      await pool.query(deleteQuery, [id])

      // Paso 2: Insertar las nuevas relaciones
      const insertQuery = `INSERT INTO ${table} (event_id, ${column}) VALUES ($1, $2);`

      // Usa una transacción para asegurar que todas las operaciones sean atómicas
      await pool.query('BEGIN')
      for (const ID of arr_ids) {
        await pool.query(insertQuery, [id, ID])
      }
      await pool.query('COMMIT')
    } catch (error) {
      await pool.query('ROLLBACK')
      console.log('err', { err: error.message })
    }
  }

  async updateEventInteraction(id, interaction) {
    console.log('id', id)
    console.log('interaction', interaction)

    const query = 'UPDATE events SET interactions = $1 WHERE id = $2'
    const values = [interaction, id]

    try {
      await pool.query(query, values)
      console.log('Event interaction updated successfully')
    } catch (error) {
      console.error('Error updating event interaction:', error)
    }
  }

  async deleteEvent(id) {
    const query = `
      UPDATE events
      SET is_active = false
      WHERE id = $1;
    `
    const values = [id]

    try {
      await pool.query(query, values)
    } catch (error) {
      console.error('Error updating event to inactive:', error)
      throw error
    }
  }

  async setFeaturedEvent(id) {

    const getQuery = `
    SELECT is_featured FROM events WHERE id = $1
  `

    try {
      let isFeatured = await pool.query(getQuery, [id])
      isFeatured = isFeatured.rows[0].is_featured
      const query = `
      UPDATE events SET is_featured = ${isFeatured ? false : true} WHERE id = $1 RETURNING is_featured
    `
      let featuredEvents = await pool.query(query, [id])
      return featuredEvents?.rows[0]?.is_featured
    } catch (error) {
      console.error('Error fetching featured events:', error)
      throw error
    }
  }

  async getFeaturedEvents() {
    const query = `
      SELECT * FROM events WHERE is_featured = true ORDER BY RANDOM() LIMIT 10
    `
    try {
      let featuredEvents = await pool.query(query)
      return featuredEvents.rows
    } catch (error) {
      console.error('Error fetching featured events:', error)
      throw error
    }
  }
  
}

module.exports = {
  EventFacade,
}
