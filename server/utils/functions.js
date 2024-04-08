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

module.exports = {
  responseGetEvents,
}
