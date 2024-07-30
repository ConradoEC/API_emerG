// ('apenas pessoas jurídicas poderão fazer o post')

// id_ong =>{
//     ong_name
//     ong_email
//     ong_logo 
// }
// post_image
// post_documents ('são no máximo dois')
// post_description

const mongoose = require('mongoose')
const { Schema } = mongoose


const postSchema = new mongoose.Schema({
    post_id_ong: {
        type: String,
        allowNull: false
    },
    post_ong_name: {
        type: String,
        allowNull: false
    },
    post_ong_email: {
        type: String,
        allowNull: false
    },
    post_ong_logo: {
        type: Schema.Types.Mixed,
        allowNull: false
    },
    post_image: {
        type: Schema.Types.Mixed,
        allowNull: false
    },
    post_documents: {
        type: Schema.Types.Mixed,
        allowNull: false
    },
    post_description: {
        type: String,
        allowNull: false
    }
})

const postModel = mongoose.model('posts', postSchema)

module.exports = postModel