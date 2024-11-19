const mongoose = require('mongoose')

const likeFollowerSchema = new mongoose.Schema({
    type: {
        type: String,
        allowNull: false
    },
    idUser: {
        type: String,
        allowNull: false
    },
    nameUser: {
        type: String,
        allowNull: false
    },
    recentQuant: {
        type: Number,
        allowNull: false
    },
    idOng: {
        type: String,
        allowNull: false
    },
    nameOng: {
        type: String,
        allowNull: false
    }
})

const newLikeFollowerModel = mongoose.model('likesFollowers', likeFollowerSchema)

module.exports = newLikeFollowerModel