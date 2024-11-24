const mongoose = require('mongoose')
const { GridFSBucket } = require('mongodb')
const fs = require('fs')
const mongodb = require('mongodb')
var gfs
var db

const connectionMongoDB = async() =>
{
    return await mongoose.connect(`mongodb+srv://emerG:emerG2022@emerg.mlrb30g.mongodb.net/test?retryWrites=true&w=majority&appName=emerG`)
    .then(async() => 
    {
        console.log('Banco conectado')
        db = mongoose.connection.db
        // Essa parte é a configuração do GridFS, que seria uma ferramenta que vai fragmentar o arquivo em pequenas partes para que ele possa ser armazenado. O nome dado para ele foi 'uploads'
        return gfs = new GridFSBucket(db, {bucketName: 'uploads'})
    })    
    .catch((error) =>
    {
        console.log('Não foi possível conectar por causa do erro ---> ' + error)
    })
    // mongoose.connection.once('open', async() => 
    // {
    //     db = mongoose.connection.db
    //     console.log(db)
    //     // Essa parte é a configuração do GridFS, que seria uma ferramenta que vai fragmentar o arquivo em pequenas partes para que ele possa ser armazenado. O nome dado para ele foi 'uploads'
    //     gfs = new GridFSBucket(db, {bucketName: 'uploads'})
    //     const collections = await db.listCollections().toArray()
    //     console.log(collections)
    //     console.log('funcionou')
    // })
}

module.exports = {connectionMongoDB}