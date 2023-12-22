class DateTimeUtils {
  static parseStringToDate(dateString) {
    const dateParts = dateString.split('-')
    const day = parseInt(dateParts[0], 10)
    const month = parseInt(dateParts[1], 10) - 1
    const year = parseInt(dateParts[2], 10)

    return new Date(year, month, day)
  }

  static convertUTCToLocalDate(date) {
    if (!date) {
      return date
    }
    date = new Date(date)
    date = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())

    return date
  }

  static convertLocalToUTCDate(date) {
    if (!date) {
      return date
    }
    date = new Date(date)
    date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))

    return date
  }
}

export default DateTimeUtils
