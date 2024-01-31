
const formatDate = (date) => {
    const inputDate = new Date(date);
    const options = {
      weekday: 'short',
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    };
    const formattedDate = inputDate.toLocaleString('en-US', options);
    console.log(formattedDate)
    return formattedDate
}

module.exports = {
    formatDate
}