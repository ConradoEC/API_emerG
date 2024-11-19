const mongoose = require('mongoose')

const newDoadorSchema = new mongoose.Schema({
    idDoador: {
        type: String,
        allowNull: false
    }, 
    idOng: {
        type: String,
        allowNull: false
    }, 
    quantDoada: {
        type: Number,
        allowNull: false
    }
})

const newDoadorModel = mongoose.model('doadores', newDoadorSchema)

module.exports = newDoadorModel