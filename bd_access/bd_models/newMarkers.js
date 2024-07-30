const mongoose = require('mongoose')
const { Schema } = mongoose

const newMarkerSchema = new mongoose.Schema({
    id_flood: {
        type: Number,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    address: {
        type: String,
        allowNull: false,
    },
    name: {
        type: String,
        allowNull: false,
    },
    floodLevel: 
    {
        type: Number,
        allowNull: false
    },
    lat: {
        type: Schema.Types.Decimal128,
        allowNull: false
    },
    lng: {
        type: Schema.Types.Decimal128,
        allowNull: false
    }
})

const newMarkerModel = mongoose.model('newMarker', newMarkerSchema)

module.exports = newMarkerModel