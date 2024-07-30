// ('apenas usuários físicos poderão fazer denúncias')

// idUsuarioF
// id_post
// id_ong => ('tbm da pra recuperar esse id pelo "id_post"')
// report_theme
// report_description

const mongoose = require('mongoose')
const { Schema } = mongoose

const reportSchema = new mongoose.Schema({
    report_idUsuario: {
        type: String,
        allowNull: false
    },
    report_id_post: {
        type: String,
        allowNull: false
    },
    report_id_ong: {
        type: String,
        allowNull: false
    },
    report_theme: {
        type: String,
        allowNull: false
    },
    report_description: {
        type: String,
        allowNull: false
    }
})

const reportModel = mongoose.model('reports', reportSchema)

module.exports = reportModel