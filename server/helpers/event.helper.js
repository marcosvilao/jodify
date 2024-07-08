const { EventFacade } = require('../facade/event.facade.js')
const { v4: uuidv4 } = require('uuid')
const { responseGetEvents } = require('../utils/functions.js')
const { deleteImage } = require('../utils/cloudinary/cludinary.js')
const { linkScrapping } = require('../utils/scrapping/scrapEventData.js')
const { getImageFromCache } = require('../utils/cacheFunction/cacheFunction.js')
const { GenericHelper } = require('../helpers/generic.helper.js')
const { EventFacade2 } = require('../facade/event.facade2.js')
const moment = require('moment-timezone')

const facade = new EventFacade()
const facade2 = new EventFacade2()
const helperGeneric = new GenericHelper()

class EventHelper {
  async getEventQuantity() {
    const currentDate = new Date()
    currentDate.setDate(currentDate.getDate() - 1)
    const options = { timeZone: 'America/Argentina/Buenos_Aires' }
    const argentinaTime = currentDate.toLocaleString('en-US', options)
    return await facade.getEventCount(argentinaTime)
  }

  async getEventById(id) {
    return await facade2.getEventById(id)
  }

  async getEventByTicketLink(link) {
    const event = await facade2.getEventByTicketLink(link)

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

    const setOff = page * 20
    const currentDate = new Date()
    currentDate.setDate(currentDate.getDate() - 1)
    const options = { timeZone: 'America/Argentina/Buenos_Aires' }
    const argentinaTime = currentDate.toLocaleString('en-US', options)

    data.argentinaTime = argentinaTime
    data.setOff = setOff

    const events = await facade2.getEventsByFilter(data)

    for (const e of events) {
      // if (e.image.image_url.startsWith('https://res.cloudinary.com')) {
      if (e.image.secure_url) {
        const buffer = await getImageFromCache(e.image.secure_url)

        // se convierte el buffer en una url para mandar al front

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
    const event = await facade2.searchEvent(searchQuery)

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

    const dateFormatted = new Date(date_from)
    dateFormatted.setUTCHours(9)

    const dataCreate = {
      name,
      date_from: dateFormatted,
      venue,
      ticket_link,
      image,
      city_id: cityID,
    }

    const newEvent = await facade2.createEvent(dataCreate)

    if (!newEvent) return null

    if (typesIDs && typesIDs[0] && typesIDs[0] !== undefined) {
      await facade2.relationshipEvent(newEvent, 'addTypes', typesIDs)
    }

    if (djsIDs && djsIDs[0] && djsIDs[0] !== undefined) {
      await facade2.relationshipEvent(newEvent, 'addDjs', djsIDs)
    }

    if (promotersIDs && promotersIDs[0] && promotersIDs[0] !== undefined) {
      await facade2.relationshipEvent(newEvent, 'addPromoters', promotersIDs)
    }

    return newEvent.id
  }

  async updateEvent(id, data, event) {
    const {
      name,
      venue,
      date_from,
      city_id,
      ticket_link,
      event_type,
      event_djs,
      event_promoter,
      image,
    } = data

    let typesIDs =
      event_type.length > 0 ? event_type.map((type) => type.id).filter((id) => id) : null
    let djsIDs = event_djs.length > 0 ? event_djs.map((dj) => dj.id).filter((id) => id) : null
    let promotersIDs =
      event_promoter.length > 0
        ? event_promoter.map((promoter) => promoter.id).filter((id) => id)
        : null

    if (image) {
      const imageDelete = event.image.public_id

      await deleteImage(imageDelete)
    }

    const eventInstance = await facade2.getEventById(id, true)

    if (djsIDs && djsIDs[0]) {
      await facade2.updateRelationshipEvent(eventInstance, 'setDjs', djsIDs)
    }

    if (promotersIDs && promotersIDs[0]) {
      await facade2.updateRelationshipEvent(eventInstance, 'setPromoters', promotersIDs)
    }

    if (typesIDs && typesIDs[0]) {
      await facade2.updateRelationshipEvent(eventInstance, 'setTypes', typesIDs)
    }

    const eventUpdated = await facade2.updateEvent(id, data)

    return eventUpdated
  }

  async updateEventInteraction(id, event) {
    const interaction = event.interactions + 1
    await facade2.updateEventInteraction(id, interaction)
  }

  async deleteEvent(id, event) {
    const image = event.image

    if (image.public_id) {
      await deleteImage(image.public_id)
    }
    await facade2.deleteEvent(id)
    return
  }

  async getFeaturedEvents() {
    return await facade2.getFeaturedEvents()
  }

  async setFeaturedEvent(id, event) {
    return await facade2.setFeaturedEvent(id, event.is_featured)
  }

  async scrapDataEvent(url) {
    return await linkScrapping(url)
  }
}

module.exports = {
  EventHelper,
}
