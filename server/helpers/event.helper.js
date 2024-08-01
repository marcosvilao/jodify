const { responseGetEvents, getArgentinaTime } = require('../utils/functions.js')
const { deleteImage } = require('../utils/cloudinary/cludinary.js')
const { linkScrapping } = require('../utils/scrapping/scrapEventData.js')
const { getImageFromCache } = require('../utils/cacheFunction/cacheFunction.js')
const { GenericHelper } = require('../helpers/generic.helper.js')
const { EventFacade } = require('../facade/event.facade.js')

const facade = new EventFacade()
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

    const setOff = page * 20
    const currentDate = new Date()
    currentDate.setDate(currentDate.getDate() - 1)
    const options = { timeZone: 'America/Argentina/Buenos_Aires' }
    const argentinaTime = currentDate.toLocaleString('en-US', options)

    data.argentinaTime = argentinaTime
    data.setOff = setOff

    let events = await facade.getEventsByFilter(data)

    if (events.length > 20 && sharedId) {
      const eventShared = events.find((e) => e.id === sharedId)
      const filteredEvents = events.filter((e) => e.id !== sharedId)

      const twentyEvents = filteredEvents.slice(0, 20)

      events = []
      if (eventShared) {
        events.push(eventShared)
      }

      events.push(...twentyEvents)
    }

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
      if (e.image.secure_url_banner) {
        const buffer = await getImageFromCache(e.image.secure_url_banner)

        const base64Image = Buffer.from(buffer).toString('base64')
        const type = e.image.secure_url_banner.match(/\.([^.]+)$/)
        if (!type) return null
        const contentType = type[1].toLowerCase()

        const bannerUrl = `data:${contentType};base64,${base64Image}`

        e.image.banner_url = bannerUrl
      }
    }

    const response = responseGetEvents(events)

    if (response[0] && sharedId) {
      response.push({ date: events[0].date_from })
    }

    return response
  }

  async searchEvent(searchQuery, page, limit) {
    const setOff = page * 20

    const currentDate = new Date()
    currentDate.setDate(currentDate.getDate() - 1)
    const options = { timeZone: 'America/Argentina/Buenos_Aires' }
    const argentinaTime = currentDate.toLocaleString('en-US', options)

    const events = await facade.searchEvent(searchQuery, limit, setOff, argentinaTime)

    for (const e of events) {
      if (e.image.secure_url) {
        const buffer = await getImageFromCache(e.image.secure_url)

        const base64Image = Buffer.from(buffer).toString('base64')
        const type = e.image.secure_url.match(/\.([^.]+)$/)
        if (!type) return null
        const contentType = type[1].toLowerCase()

        const imageUrl = `data:${contentType};base64,${base64Image}`

        e.image.image_url = imageUrl
      }
      if (e.image.secure_url_banner) {
        const buffer = await getImageFromCache(e.image.secure_url_banner)

        const base64Image = Buffer.from(buffer).toString('base64')
        const type = e.image.secure_url_banner.match(/\.([^.]+)$/)
        if (!type) return null
        const contentType = type[1].toLowerCase()

        const bannerUrl = `data:${contentType};base64,${base64Image}`

        e.image.banner_url = bannerUrl
      }
    }

    return responseGetEvents(events)
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

    const newEvent = await facade.createEvent(dataCreate)

    if (!newEvent) return null

    if (typesIDs && typesIDs[0] && typesIDs[0] !== undefined) {
      await facade.relationshipEvent(newEvent, 'addTypes', typesIDs)
    }

    if (djsIDs && djsIDs[0] && djsIDs[0] !== undefined) {
      await facade.relationshipEvent(newEvent, 'addDjs', djsIDs)
    }

    if (promotersIDs && promotersIDs[0] && promotersIDs[0] !== undefined) {
      await facade.relationshipEvent(newEvent, 'addPromoters', promotersIDs)
    }

    return newEvent.id
  }

  async updateEvent(id, data, event) {
    let {
      name,
      venue,
      date_from,
      city_id,
      ticket_link,
      event_type,
      event_djs,
      event_promoter,
      image,
      banner,
    } = data

    const imageUpdate = {}

    if (event_djs && Array.isArray(event_djs)) {
      const newDjsNames = []

      for (const dj of event_djs) {
        if (typeof dj === 'string') {
          const checkDj = await helperGeneric.getDjByName(dj)

          // console.log(checkDj)

          if (!checkDj) {
            newDjsNames.push(dj)
          }
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

      imageUpdate = {
        ...image,
        secure_url_banner: banner ? banner.secure_url_banner : event.image.secure_url_banner,
        public_id_banner: banner ? banner.public_id_banner : event.image.public_id_banner,
      }
    }

    if (banner) {
      const imageDelete = event.image.public_id_banner

      await deleteImage(imageDelete)
      imageUpdate = {
        ...banner,
        secure_url: image ? image.secure_url : event.image.secure_url,
        public_id: image ? image.public_id : event.image.public_id,
      }
    }

    const eventInstance = await facade.getEventById(id, true)

    if (djsIDs && djsIDs[0]) {
      await facade.updateRelationshipEvent(eventInstance, 'setDjs', djsIDs)
    }

    if (promotersIDs && promotersIDs[0]) {
      await facade.updateRelationshipEvent(eventInstance, 'setPromoters', promotersIDs)
    }

    if (typesIDs && typesIDs[0]) {
      await facade.updateRelationshipEvent(eventInstance, 'setTypes', typesIDs)
    }

    data.image = image || banner ? imageUpdate : null

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

  async getFeaturedEvents() {
    const argentinaTime = getArgentinaTime()
    return await facade.getFeaturedEvents(argentinaTime)
  }

  async setFeaturedEvent(id, event) {
    return await facade.setFeaturedEvent(id, event.is_featured)
  }

  async scrapDataEvent(url) {
    return await linkScrapping(url)
  }
}

module.exports = {
  EventHelper,
}
