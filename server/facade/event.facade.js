const { Op, literal } = require('sequelize')
const { parseISO, startOfDay, endOfDay } = require('date-fns')
const { removeAccents } = require('../Brain/Utils.js')
const {
  EventModel,
  DjModel,
  TypeModel,
  PromoterModel,
  CityModel,
  sequelize,
} = require('../models/associations.js')
const PostgresDBStorage = require('../storage/postgresDBStorage.js')
const namesTypes = require('../utils/associationsNames.js')
const { filterUpdatedData } = require('../utils/functions.js')

const storage = new PostgresDBStorage()

class EventFacade {
  async getEventById(id, eventInstance) {
    try {
      const filter = {}

      filter.where = { id }

      filter.include = [
        {
          model: DjModel,
          attributes: ['id', 'name'],
          through: { attributes: [] },
          as: namesTypes.Dj,
        },
        {
          model: TypeModel,
          attributes: ['id', 'name'],
          through: { attributes: [] },
          as: namesTypes.Type,
        },
        {
          model: PromoterModel,
          attributes: ['id', 'name', 'priority', 'instagram'],
          through: { attributes: [] },
          as: namesTypes.Promoter,
        },
      ]

      // console.log('Is event instance of EventModel:', event instanceof EventModel)
      // console.log('Methods for event:', Object.keys(event.__proto__))

      const event = await storage.findOne(EventModel, filter)

      if (!event) return null

      if (eventInstance) {
        return event
      }

      return event.dataValues
    } catch (error) {
      console.log('get event by id err', { err: error })
    }
  }

  async getEventCount(argentinaTime) {
    try {
      const filter = { where: { [Op.and]: [{ is_active: true }, { date_from: argentinaTime }] } }
      const res = await storage.count(EventModel, filter)

      return res
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

    try {
      const filter = {
        where: {
          is_active: true,
          date_from: { [Op.gte]: argentinaTime },
        },
        include: [
          {
            model: DjModel,
            attributes: ['id', 'name'],
            through: { attributes: [] },
            as: namesTypes.Dj,
          },
          {
            model: TypeModel,
            attributes: ['id', 'name'],
            through: { attributes: [] },
            as: namesTypes.Type,
          },
          {
            model: PromoterModel,
            attributes: ['id', 'name', 'priority', 'instagram'],
            through: { attributes: [] },
            as: namesTypes.Promoter,
            where: promoterId ? { id: promoterId } : undefined,
          },
        ],
        order: [
          ['date_from', 'ASC'],
          [literal(`(
            SELECT MIN(p.priority)
            FROM event_promoters ep
            JOIN promoters p ON ep.promoter_id = p.id
            WHERE ep.event_id = "Event"."id"
          )`), 'ASC'],
          ['id', 'ASC'],
        ],
      }

      if (dates && dates.length === 2) {
        const [date1, date2] = dates.map((date) => parseISO(new Date(date).toISOString()))

        if (date1 !== date2) {
          filter.where.date_from = {
            [Op.between]: [startOfDay(date1), endOfDay(date2)],
          }
        } else {
          filter.where.date_from = {
            [Op.eq]: startOfDay(date1),
          }
        }
      } else if (status) {
        filter.where.date_from = {
          [Op.lt]: argentinaTime,
        }
      }

      if (citiesId && citiesId.length > 0) {
        filter.where.city_id = {
          [Op.in]: citiesId,
        }
      }

      if (typesId && typesId.length > 0) {
        filter.include.push({
          model: TypeModel,
          attributes: ['id', 'name'],
          through: { attributes: [] },
          where: { id: typesId },
          as: namesTypes.Type,
        })
      }

      if (search) {
        const searchWithoutAccents = removeAccents(search)
        const cityCondition =
          citiesId && citiesId.length > 0
            ? `AND "Event".city_id IN (${citiesId.map((id) => `'${id}'`).join(', ')})`
            : ''

        let date1
        let date2

        if (dates) {
          ;[date1, date2] = dates?.map((date) => {
            const parsedDate = parseISO(new Date(date).toISOString())
            if (isNaN(parsedDate)) {
              throw new Error(`Invalid date: ${date}`)
            }
            return parsedDate
          })
        }

        const dateCondition =
          date1 && date2
            ? `AND "Event".date_from BETWEEN '${startOfDay(date1).toISOString()}' AND '${endOfDay(
                date2
              ).toISOString()}'`
            : ''
        const searchCondition = literal(`
          EXISTS (
            SELECT 1 FROM event_djs ed
            JOIN djs dj ON ed.dj_id = dj.id
            WHERE ed.event_id = "Event".id AND unaccent(lower(dj.name)) ILIKE unaccent(lower('%${searchWithoutAccents}%')) ${cityCondition} ${dateCondition}
          ) OR EXISTS (
            SELECT 1 FROM event_types et
            JOIN types tp ON et.type_id = tp.id
            WHERE et.event_id = "Event".id AND unaccent(lower(tp.name)) ILIKE unaccent(lower('%${searchWithoutAccents}%')) ${cityCondition} ${dateCondition}
          ) OR EXISTS (
            SELECT 1 FROM event_promoters ep
            JOIN promoters p ON ep.promoter_id = p.id
            WHERE ep.event_id = "Event".id AND unaccent(lower(p.name)) ILIKE unaccent(lower('%${searchWithoutAccents}%')) ${cityCondition} ${dateCondition}
          ) OR unaccent(lower("Event".name)) ILIKE unaccent(lower('%${searchWithoutAccents}%')) ${cityCondition} ${dateCondition}
          OR unaccent(lower("Event".venue)) ILIKE unaccent(lower('%${searchWithoutAccents}%')) ${cityCondition} ${dateCondition}
        `)
        filter.where = {
          ...filter.where,
          [Op.and]: [filter.where, searchCondition],
        }
      }

      if (sharedId) {
        filter.where[Op.or] = [
          { id: sharedId },
          {
            [Op.and]: [
              {
                date_from: {
                  [Op.eq]: literal(`(SELECT date_from FROM events WHERE id = '${sharedId}')`),
                },
              },
              { id: { [Op.ne]: sharedId } },
            ],
          },
        ]
      }

      if (limit) {
        filter.limit = limit
      }

      if (setOff) {
        filter.offset = setOff
      }

      const result = await storage.find(EventModel, filter)

      if (!result) return []

      return result
    } catch (error) {
      console.log('filters events err', { err: error })
    }
  }

  async getEventByTicketLink(link) {
    try {
      const filter = {}

      filter.where = { ticket_link: link }

      const event = await storage.find(EventModel, filter)

      if (!event || !event[0]) return null
      return event[0].dataValues
    } catch (error) {
      console.log('get ticket link err', { err: error })
    }
  }

  async searchEvent(search, limit, setOff, argentinaTime) {
    try {
      const searchWithoutAccents = removeAccents(search)

      const filter = {
        where: {
          is_active: true,
          date_from: { [Op.gte]: argentinaTime },
        },
        include: [
          {
            model: DjModel,
            attributes: ['id', 'name'],
            through: { attributes: [] },
            as: namesTypes.Dj,
          },
          {
            model: TypeModel,
            attributes: ['id', 'name'],
            through: { attributes: [] },
            as: namesTypes.Type,
          },
          {
            model: PromoterModel,
            attributes: ['id', 'name', 'priority', 'instagram'],
            through: { attributes: [] },
            as: namesTypes.Promoter,
          },
          {
            model: CityModel,
            attributes: ['id', 'city_name'],
            as: namesTypes.City,
          },
        ],
        order: [
          // ['date_from', 'asc'],
          ['id', 'asc'],
        ],
        limit: limit,
        offset: setOff,
      }

      const searchCondition = literal(`
        EXISTS (
          SELECT 1 FROM event_djs ed
          JOIN djs dj ON ed.dj_id = dj.id
          WHERE ed.event_id = "Event".id AND unaccent(lower(dj.name)) ILIKE unaccent(lower('%${searchWithoutAccents}%'))
        ) OR EXISTS (
          SELECT 1 FROM event_types et
          JOIN types tp ON et.type_id = tp.id
          WHERE et.event_id = "Event".id AND unaccent(lower(tp.name)) ILIKE unaccent(lower('%${searchWithoutAccents}%'))
        ) OR EXISTS (
          SELECT 1 FROM event_promoters ep
          JOIN promoters p ON ep.promoter_id = p.id
          WHERE ep.event_id = "Event".id AND unaccent(lower(p.name)) ILIKE unaccent(lower('%${searchWithoutAccents}%'))
        ) OR EXISTS (
          SELECT 1 FROM cities c
          WHERE c.id = "Event".city_id AND unaccent(lower(c.city_name)) ILIKE unaccent(lower('%${searchWithoutAccents}%'))
        ) OR unaccent(lower("Event".name)) ILIKE unaccent(lower('%${searchWithoutAccents}%'))
        OR unaccent(lower("Event".venue)) ILIKE unaccent(lower('%${searchWithoutAccents}%'))
      `)

      filter.where = {
        ...filter.where,
        [Op.and]: [filter.where, searchCondition],
      }

      const result = await storage.find(EventModel, filter)

      if (!result) return []

      return result
    } catch (error) {
      console.log('search event err', { err: error })
    }
  }

  async createEvent(data) {
    try {
      const newEvent = await storage.create(EventModel, data)
      if (!newEvent) return null

      return newEvent
    } catch (error) {
      console.log('err create event', { err: error })
    }
  }

  async relationshipEvent(event, relationMethod, id) {
    try {
      await storage.relationship(event, relationMethod, id)
    } catch (error) {
      console.log('relation event err', { err: error })
    }
  }

  async updateEvent(id, data) {
    try {
      const filteredData = filterUpdatedData(data)
      const [numberUpdatedRows, [eventUpdated]] = await storage.update(EventModel, filteredData, {
        where: { id },
        returning: true,
      })

      if (numberUpdatedRows === 0) return null

      return eventUpdated
    } catch (error) {
      console.log('update event err', { err: error })
    }
  }

  async updateRelationshipEvent(event, associationMethod, arr_ids) {
    const transactions = await sequelize.transaction()
    try {
      // Paso 2: Usar el método de asociación para actualizar las relaciones
      await event[associationMethod](arr_ids, { transaction: transactions })

      // Paso 3: Confirmar la transacción
      await transactions.commit()
    } catch (error) {
      // Paso 4: Revertir la transacción en caso de error
      await transactions.rollback()
      console.error('Error updating relationships:', error.message)
    }
  }

  async updateEventInteraction(id, interaction) {
    try {
      await storage.update(EventModel, { interactions: interaction }, { where: { id } })
      console.log('Event interaction updated successfully')
    } catch (error) {
      console.error('Error updating event interaction:', error)
    }
  }

  async deleteEvent(id) {
    try {
      await storage.update(EventModel, { is_active: false }, { where: { id } })
    } catch (error) {
      console.error('Error updating event to inactive:', error)
      throw error
    }
  }

  async setFeaturedEvent(id, isFeatured) {
    try {
      const [numberUpdatedRows, [eventUpdated]] = await storage.update(
        EventModel,
        { is_featured: !isFeatured },
        { where: { id }, returning: true }
      )
      if (numberUpdatedRows === 0) return null

      return eventUpdated.is_featured
    } catch (error) {
      console.error('Error fetching featured events:', error)
      // throw error
    }
  }

  async getFeaturedEvents(argentinaTime) {
    const filter = {}

    filter.where = { is_featured: true, date_from: { [Op.gte]: argentinaTime } }

    filter.order = literal('RANDOM()')

    try {
      const featuredEvents = await storage.find(EventModel, filter)

      if (!featuredEvents) return []

      return featuredEvents
    } catch (error) {
      console.error('Error fetching featured events:', error)
      // throw error
    }
  }
}

module.exports = {
  EventFacade,
}
