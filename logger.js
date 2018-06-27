const logger = (who, string, time) => {

    const hour = time.getHours()
    const minute = time.getMinutes()
    const seconds = time.getSeconds()

    const day = time.getDay()
    const month = time.getMonth()
    const year = time.getFullYear()

    const fullDate = `${hour}:${minute}:${seconds} - ${day}/${month}/${year}`

    return `[${who}][${fullDate}]: ${string}\n`

}

module.exports = logger
