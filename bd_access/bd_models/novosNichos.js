const mongoose = require('mongoose')

const novoNichosSchema = new mongoose.Schema({
    nicho: {
        type: String,
        allowNull: false
    }
})

const novoNichosModel = mongoose.model('nichos', novoNichosSchema)

module.exports = novoNichosModel