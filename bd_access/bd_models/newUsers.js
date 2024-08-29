const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    nomeUsuarioF: {
        type: String,
        allowNull: false
    },
    sobrenomeUsuarioF: {
        type: String,
        allowNull: false,
    },
    cpfUsuarioF: {
        type: String,
        allowNull: false
    },
    emailUsuarioF: {
        type: String,
        allowNull: false
    },
    celularUsuarioF: {
        type: String,
        allowNull: false
    },
    enderecoUsuarioF: {
        type: String,
        allowNull: false
    },
    cidadeUsuarioF: {
        type: String,
        allowNull: false
    },
    bairroUsuarioF: {
        type: String,
        allowNull: false
    },
    cepUsuarioF: {
        type: String,
        allowNull: false
    },
    doarF: {
        type: Boolean,
        allowNull: false
    }
})

const newUserModel = mongoose.model('newUsers', userSchema)

module.exports = newUserModel