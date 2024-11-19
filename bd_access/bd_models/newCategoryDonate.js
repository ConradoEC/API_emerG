const mongoose = require('mongoose')

const newCategoryDonateSchema = new mongoose.Schema({
    nameCategory: {
        type: String,
        allowNull: false
    }
})

const newCategoryDonateModel = mongoose.model('categoriasDoacao', newCategoryDonateSchema)

module.exports = newCategoryDonateModel