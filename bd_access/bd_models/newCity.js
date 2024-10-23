const mongoose = require("mongoose")

const newCitySchema = new mongoose.Schema({
    city: {
        type: String,
        allowNull: false
    }
})

const newCityModel = mongoose.model('cities', newCitySchema)

module.exports = newCityModel