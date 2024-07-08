const responseGetEvents = (events) => {
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

  return groupedEventsArray
}

const generateCode = () => {
  const characters = '0123456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return code
}

const filterUpdatedData = (data) => {
  const filteredData = {}
  Object.keys(data).forEach((key) => {
    if (data[key] !== null && data[key] !== '') {
      filteredData[key] = data[key]
    }
  })

  return filteredData
}

function sanitizeUsername(username) {
  // Reemplaza los espacios con _
  let sanitized = username.replace(/\s+/g, '_')

  // Elimina los caracteres que no sean letras, números o _
  sanitized = sanitized.replace(/[^\w]/g, '')

  return sanitized
}

module.exports = {
  responseGetEvents,
  generateCode,
  filterUpdatedData,
  sanitizeUsername,
}
