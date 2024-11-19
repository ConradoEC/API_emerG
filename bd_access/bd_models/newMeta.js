const mongoose = require('mongoose')

const newMetaSchema = new mongoose.Schema({
    idOng: {
        type: String,
        allowNull: false
    },
    nomeItem: {
        type: String,
        allowNull: false
    },
    quant: {
        type: Number,
        allowNull: false
    },
    quantDoa: {
        type: Number,
        allowNull: false
    }
})

const newMetaModel = mongoose.model('doacao', newMetaSchema)

module.exports = newMetaModel