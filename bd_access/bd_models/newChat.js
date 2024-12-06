const mongoose = require('mongoose')

const newChatSchema = new mongoose.Schema({
    remetente: {
        type: String,
        allowNull: false
    },
    destinatario: {
        type: String,
        allowNull: false
    },
    mensagens: [Array]
})

const newChatModel = mongoose.model('newChats', newChatSchema)

module.exports = newChatModel