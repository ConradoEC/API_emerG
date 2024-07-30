const mongoose = require('mongoose')

const informationSchema = new mongoose.Schema({
    typeInfo: {
        type: String,
        allowNull: false,        
    },
    id_post: {
        type: String,
        allowNull: false,        
    },
    idUsuario: {
        type: String,
        allowNull: false,
    },
    actived: {
        type: Boolean,
        allowNull: false,
    }
})

const informationModel = mongoose.model('informations', informationSchema)

module.exports = informationModel
