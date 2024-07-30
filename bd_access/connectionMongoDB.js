const mongoose = require('mongoose')

const connectionMongoDB = async() =>
{
    await mongoose.connect(`mongodb+srv://emerG:emerG2022@emerg.mlrb30g.mongodb.net/?retryWrites=true&w=majority&appName=emerG`)
    .then(() => 
    {
        console.log('Conectado ao banco')
    })
    .catch((error) =>
    {
        console.log('Não foi possível conectar por causa do erro ---> ' + error)
    })
}

module.exports = connectionMongoDB