const mongoose = require("mongoose")

const newVolunteerSchema = new mongoose.Schema({
    function: {
        type: String,
        allowNull: false
    },
    requests: {
        type: String,
        allowNull: false
    },
    description: {
        type: String,
        allowNull: false
    },
    ongId: {
        type: String,
        allowNull: false
    },
    idVolunteer: {
        type: Number,
        allowNull: false
    }
})

const newVolunteerModel = mongoose.model('volunteers', newVolunteerSchema)

module.exports = newVolunteerModel