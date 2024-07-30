const mongoose = require('mongoose')
const { Schema } = mongoose

const ongSchema = new mongoose.Schema({
    ong_name: {
        type: String,
        allowNull: false
    },
    ong_description: {
        type: String,
        allowNull: false
    },
    ong_cnpj: {
        type: String,
        allowNull: false
    },
    ong_email: {
        type: String,
        allowNull: false
    },
    ong_phone: {
        type: String,
        allowNull: false
    },
    ong_address: {
        type: String,
        allowNull: false
    },
    ong_cep: {
        type: String,
        allowNull: false
    },
    ong_logo: {
        type: String,
        allowNull: false
    },
    ong_checked: {
        type: Boolean,
        allowNull: false
    },
    ong_icon: {
        type: String,
        allowNull: true
    },
    ong_niche: {
        type: String,
        allowNull: false
    },
    ong_stars: {
        type: Number,
        allowNull: false
    },
    ong_city: {
        type: String,
        allowNull: false
    },
    ong_lat: {
        type: Number,
        allowNull: false
    },
    ong_lng: {
        type: Number,
        allowNull: false
    }
})

const newOngModel = mongoose.model('newOng', ongSchema)

module.exports = newOngModel