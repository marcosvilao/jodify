const { EventFacade } = require('../facade/event.facade.js')
const { v4: uuidv4 } = require('uuid')
const { responseGetEvents } = require('../utils/functions.js')
const { deleteImage } = require('../utils/cloudinary/cludinary.js')
const { linkScrapping } = require('../utils/scrapping/scrapEventData.js')
const { getImageFromCache } = require('../utils/cacheFunction/cacheFunction.js')
const { GenericHelper } = require('../helpers/generic.helper.js')

const facade = new EventFacade()
const helperGeneric = new GenericHelper()

class EventHelper {
  async getEventById(id) {
    return await facade.getEventById(id)
  }

  async getEventByTicketLink(link) {
    const event = await facade.getEventByTicketLink(link)

    if (
      event &&
      !event.ticket_link.toLowerCase().includes('instagram') &&
      !event.ticket_link.toLowerCase().includes('espacioro')
    ) {
      return 'Ya existe este evento'
    }

    return null
  }

  async getAllEventsByFilter(data) {
    const { page, sharedId } = data

    // console.log('data', data)

    const setOff = page * 20
    const currentDate = new Date()
    currentDate.setDate(currentDate.getDate() - 1)
    const options = { timeZone: 'America/Argentina/Buenos_Aires' }
    const argentinaTime = currentDate.toLocaleString('en-US', options)

    data.argentinaTime = argentinaTime
    data.setOff = setOff

    // if (types) {
    //   const mappedTypes = types.map((type) => type?.id)
    //   data.mappedTypes = mappedTypes
    // }

    const events = await facade.getEventsByFilter(data)
    // console.log('event', events)

    for (const e of events) {
      // if (e.image.image_url.startsWith('https://res.cloudinary.com')) {
      if (e.image.secure_url) {
        const buffer = await getImageFromCache(e.image.secure_url)

        //se convierte el buffer en una url para mandar al front

        const base64Image = Buffer.from(buffer).toString('base64')

        // tipo de imagen: .jpg, .png etc.
        const type = e.image.secure_url.match(/\.([^.]+)$/)
        if (!type) return null
        const contentType = type[1].toLowerCase()

        const imageUrl = `data:${contentType};base64,${base64Image}`

        e.image.image_url = imageUrl
        // e.image.image_url = e.image.secure_url
      }
    }

    const response = responseGetEvents(events)

    if (response[0] && sharedId) {
      response.push({ date: events[0].date_from })
    }

    return response
  }

  async searchEvent(searchQuery) {
    const event = await facade.searchEvent(searchQuery)

    return responseGetEvents(event)
  }

  async createEventByForm(data) {
    let {
      name,
      event_type,
      date_from,
      venue,
      image,
      event_djs,
      event_city,
      event_promoter,
      ticket_link,
    } = data

    if (!name && event_djs.length > 0) {
      name = event_djs[0]?.name ? event_djs?.map((dj) => dj?.name).join(' | ') : null
    }

    if (event_djs && Array.isArray(event_djs)) {
      const newDjsNames = []

      for (const dj of event_djs) {
        if (typeof dj === 'string') {
          newDjsNames.push(dj)
        }
      }

      const newDjs = []

      if (newDjsNames[0]) {
        for (const dj of newDjsNames) {
          const newDj = await helperGeneric.createDj(dj)

          if (!newDj) {
            return console.log(`Error al crear dj. ${dj}`)
          }

          newDjs.push(newDj)
        }
      }

      const djsFilters = event_djs.filter((dj) => typeof dj === 'object')
      event_djs = [...newDjs, ...djsFilters]
    }

    let typesIDs = event_type.length > 0 ? event_type.map((type) => type?.id) : null
    let djsIDs = event_djs.length > 0 ? event_djs.map((dj) => dj.id) : null
    let promotersIDs =
      event_promoter.length > 0 ? event_promoter.map((promoter) => promoter?.id) : null
    let cityID = event_city.id

    const formattedEventDate = new Date(date_from)
    formattedEventDate.setHours(9, 0, 0)

    const event = {
      id: uuidv4(),
      name,
      date_from,
      venue,
      ticket_link,
      image,
    }

    const values = [
      event.id,
      event.name,
      formattedEventDate,
      event.venue,
      event.ticket_link,
      event.image,
      cityID,
    ]

    const eventId = await facade.createEvent(values)

    if (!eventId) return null

    if (typesIDs && typesIDs[0] && typesIDs[0] !== undefined) {
      for (const id of typesIDs) {
        await facade.relationshipEventId([eventId, id], 'event_types', 'type_id')
      }
    }

    if (djsIDs && djsIDs[0] && djsIDs[0] !== undefined) {
      for (const id of djsIDs) {
        if (id) {
          await facade.relationshipEventId([eventId, id], 'event_djs', 'dj_id')
        }
      }
    }

    if (promotersIDs && promotersIDs[0] && promotersIDs[0] !== undefined) {
      for (const id of promotersIDs) {
        await facade.relationshipEventId([eventId, id], 'event_promoters', 'promoter_id')
      }
    }

    return eventId
  }

  async updateEvent(id, data, event) {
    const {
      name,
      venue,
      date_from,
      event_city,
      ticket_link,
      event_type,
      event_djs,
      event_promoter,
      image,
    } = data

    let typesIDs = event_type.length > 0 ? event_type.map((type) => type.id) : null
    let djsIDs = event_djs.length > 0 ? event_djs.map((dj) => dj.id) : null
    let promotersIDs =
      event_promoter.length > 0 ? event_promoter.map((promoter) => promoter.id) : null

    if (image) {
      const imageDelete = event.image.public_id

      await deleteImage(imageDelete)
    }

    if (djsIDs) {
      // for (const djId of djsIDs) {
      //   await facade.updateRelationshipEvent('event_djs', 'dj_id', djId, id)
      // }
      await facade.updateRelationshipEvent('event_djs', 'dj_id', id, djsIDs)
    }

    if (promotersIDs) {
      // for (const promoterId of promotersIDs) {
      //   await facade.updateRelationshipEvent('event_promoters', 'promoter_id', promoterId, id)
      // }
      await facade.updateRelationshipEvent('event_promoters', 'promoter_id', id, promotersIDs)
    }

    if (typesIDs) {
      console.log('3', typesIDs)
      // for (const typeId of typesIDs) {
      //   await facade.updateRelationshipEvent('event_types', 'type_id', typeId, id)
      // }
      await facade.updateRelationshipEvent('event_types', 'type_id', id, typesIDs)
    }

    const eventUpdated = await facade.updateEvent(id, data)

    return eventUpdated
  }

  async updateEventInteraction(id, event) {
    const interaction = event.interactions + 1

    await facade.updateEventInteraction(id, interaction)
  }

  async deleteEvent(id, event) {
    const image = event.image

    if (image.public_id) {
      await deleteImage(image.public_id)
    }
    await facade.deleteEvent(id)
    return
  }

  async scrapDataEvent(url) {
    return await linkScrapping(url)
  }
}

module.exports = {
  EventHelper,
}
