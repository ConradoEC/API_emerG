const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    cpf: {
        type: String,
        allowNull: false
    },
    nome: {
        type: String,
        allowNull: false
    },
    email: {
        type: String,
        allowNull: false
    },
    telefone: {
        type: String,
        allowNull: false
    },
    senha: {
        type: String,
        allowNull: false
    },
    endereco: {
        type: String,
        allowNull: false
    },
    cep: {
        type: String,
        allowNull: false
    },
    cidade: {
        type: String,
        allowNull: false
    },
    foto: {
        type: String,
        allowNull: false
    },
    descricao: {
        type: String,
        allowNull: false
    },
})

const newUserModel = mongoose.model('newUsers', userSchema)

module.exports = newUserModel