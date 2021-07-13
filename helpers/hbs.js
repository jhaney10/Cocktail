//handlebar helpers

//middleware for date formatting
const moment = require('moment')

module.exports = {
    formatDate: (date, format) => {
        return moment(date).format(format)
    }
}