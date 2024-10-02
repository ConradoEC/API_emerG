const express = require('express')
const path = require('path')
const routes = express.Router()
const mysql = require('mysql2')
const mongoose = require('mongoose')
const multer = require('multer')
const fs = require('fs')
const mongodb = require('mongodb')
const Grid = require('gridfs-stream')
// O multer-gridfs-storage recebe o arquivo e o passa para o GridFS.
// O GridFS divide o arquivo em chunks menores e armazena cada chunk na coleção fs.chunks
// const GridFsStorage = require('multer-gridfs-storage').GridFsStorage
const GridFsStorage = require('multer-gridfs-storage').GridFsStorage
const {connectionMongoDB} = require('../bd_access/connectionMongoDB.js')
// connectionMongoDB()
routes.use(express.json())

const newMarkerModel = require('../bd_access/bd_models/newMarkers.js')
const newPostModel = require('../bd_access/bd_models/newPost.js')
const newReportModel = require('../bd_access/bd_models/newReport.js')
const newInformationModel = require('../bd_access/bd_models/newInformations.js')
const newOngModel = require('../bd_access/bd_models/newOngs.js')
const newUserModel = require('../bd_access/bd_models/newUsers.js')


const { GridFSBucket } = require('mongodb')
var gfs

mongoose.connect(`mongodb+srv://emerG:emerG2022@emerg.mlrb30g.mongodb.net/?retryWrites=true&w=majority&appName=emerG`)
    .then(async() => 
    {
        console.log('Banco conectado')
        const db = mongoose.connection.db
        // Essa parte é a configuração do GridFS, que seria uma ferramenta que vai fragmentar o arquivo em pequenas partes para que ele possa ser armazenado. O nome dado para ele foi 'uploads'
        gfs = new GridFSBucket(db, {bucketName: 'uploads'})
        // const collections = await db.listCollections().toArray()
    })    
    .catch((error) =>
    {
        console.log('Não foi possível conectar por causa do erro ---> ' + error)
    })


const data = new Date()
const time = String(data.getTime())

// Estamos configurando o multer. Ele é o responsável por tratar o arquivo. Aqui estamos indicando que esse arquivo será armazenado em um banco de dados remoto (através da URL) e que o nome que esse arquivo receberá será o seu nome normal + a data de envio do arquivo e também definimos que o Bucket (GridFS) a ser utilizado é o 'uploads'
const multerConfig = new GridFsStorage({
    url: 'mongodb+srv://emerG:emerG2022@emerg.mlrb30g.mongodb.net/?retryWrites=true&w=majority&appName=emerG',
    file: (req, file) => ({
        bucketName: 'uploads',
        filename: `${file.originalname.split('.')[0]}_${time}`,
        metadata: {
            originalName: file.originalname
        }
    })
})


// Estamos falando que a variável 'upload' vai receber o multer porém com a configuração que fizemos anteriormente
const upload = multer({ storage: multerConfig })

routes.get('/', (req, res) => 
{
    res.send('Ola')
})

routes.get('/markersFlood', async(req, res) => 
{
    const allMarkers = await newMarkerModel.find({})
    .then((allMarkers) => 
    {
        res.send(allMarkers)
    })
    .catch((error) => 
    {
        res.send('Não foi possível encontras os marcadores por causa do erro: ' + error)
    })
})

routes.get('/ongs', async(req, res) => 
{
    const allOngs = await newOngModel.find({})
    .then((allOngs) => 
    {
        console.log("Tudo certo")
        res.send(allOngs)
    })
    .catch((error) => 
    {
        console.log('Este é o erro ------------ ' + error)
    })
})

routes.get('/reports', (req, res) => 
{
    
})

routes.post('/informations', async(req, res) =>
{
    const allInformations = await newInformationModel.find({idUsuario: req.body[0].user_id})
    .then((allInformations) =>
    {
        res.send(allInformations)
    })
    .catch((error) => 
    {
        res.send('Não foi possível carregar')
    })
})

routes.get('/posts', async(req, res) =>
{
    const allPosts = await newPostModel.find({})
    .then((allPosts) => 
    {
        // console.log('Informações resgatadas')
        res.send(allPosts)
    })
    .catch((error) => 
    {
        console.log(error)
        res.send('Não foi possível adquirir as informações desejadas')
    })
})

routes.get('/archieves', async(req, res) => 
{
    const files = await gfs.find().toArray()
    .then((files) => {
            res.json(files)
    })
    .catch((error) => {
            console.log(error)
    })
})

routes.get('/downloadArchieve/:filename', (req, res) => {
    // O que é uma Stream? - É uma sequência de dados que pode ser lida ou escrita. São usados para manipular dados, como arquivos e dados de rede.
    gfs.openDownloadStreamByName(req.params.filename)
    // O método "pipe" é usado para direcionar a saída de um stream (de leitura) para outro stream (de escrita). Ele basicamente conecta o output de um stream diretamente com o input de outro.
    // Nesse exemplo, o pipe está sendo utilizado para indicar que o "res" (resposta HTTP) receberá a stream de leitura para poder mostrar para o usuário, então o "res" é a stream de escrita
    .pipe(res)
    .on('error', (err) => {
        res.send(err)
    })
})

routes.post('/createMarker', async(req, res) =>
{
    const newMarker = await newMarkerModel.create(
    {
        address: req.body.address,
        name: req.body.name,
        floodLevel: req.body.floodLevel,
        lat: req.body.lat,
        lng: req.body.lng
    })
    .then(() => 
    {
        console.log('Marcador criado')
        res.send('Marcador criado')
    })
    .catch((error) =>
    {
        console.log('Erro ----------- ' + error)
    })

    // res.status(200).send('Marcador criado')
})

routes.post('/createOngs', async(req, res) => 
{
    const newOng = await newOngModel.create({
        ong_name: req.body.ong_name,
        ong_description: req.body.ong_description,
        ong_cnpj: req.body.ong_cnpj,
        ong_email: req.body.ong_email,
        ong_phone: req.body.ong_phone,
        ong_address: req.body.ong_address,
        ong_cep: req.body.ong_cep,
        ong_logo: req.body.ong_logo,
        ong_checked: false,
        ong_icon: req.body.ong_icon,
        ong_niche: req.body.ong_niche,
        ong_stars: 0,
        ong_city: req.body.ong_city,
        ong_lat: req.body.ong_lat,
        ong_lng: req.body.ong_lng
    })
})

routes.post('/createReport', async(req, res) => 
{
    const newReport = await newReportModel.create({
        report_idUsuario: '123456789',
        report_id_post: req.body.report_id_post,
        report_id_ong: req.body.report_id_ong,
        report_theme: req.body.report_theme,
        report_description: req.body.report_description
    })
    .then(() => 
    {
        console.log('Enviado')
        res.send('Denúncia enviada')
    })
    .catch((error) => 
    {
        console.log('O erro foi: ' + error)
    })
})

routes.post('/createPost', async(req, res) => 
{
    var createAll = await req.body
    console.log(req.body)

    createAll.forEach(async(item) => 
    {
        const newPost = await newPostModel.create({
            post_id_ong: item.post_id_ong,
            post_ong_name: 'Erick',
            post_ong_email: 'erick@gmail.com',
            post_ong_logo: '11111',
            post_image: item.post_image,
            post_documents: item.post_file,
            post_description: item.post_description,
        })
        .then((response) =>
        {
            console.log('Tudo certo')
            res.send('tudo certo')
        })
        .catch((error) => 
        {
            console.log('O erro foi: ' + error)
        })
    })
})

routes.post('/uploadFile', upload.single('file'), (req, res) => 
{
    console.log(req.file)
    res.status(200).send('Arquivo Armazenado')
})

routes.post('/keepInformations', async(req, res) =>
{    
    const keepInformations = await newInformationModel.create({
        typeInfo: req.body.typeInfo,
        id_post: req.body.id_post,
        idUsuario: req.body.idUsuario,
        actived: req.body.actived
    })
    .then((response) => 
    {
        console.log('response: ' + response)
    })
    .catch((error) => 
    {
        console.log('O erro foi: ' + error)
    })

    res.status(200).send('Informações armazenadas')
})

routes.post('/newUser', async(req, res) => 
{
    const newUser = await newUserModel.create({
        nomeUsuarioF: req.body.nomeUsuarioF,
        sobrenomeUsuarioF: req.body.sobrenomeUsuarioF,
        cpfUsuarioF: req.body.cpfUsuarioF,
        emailUsuarioF: req.body.emailUsuarioF,
        celularUsuarioF: req.body.celularUsuarioF,
        enderecoUsuarioF: req.body.enderecoUsuarioF,
        cidadeUsuarioF: req.body.cidadeUsuarioF,
        bairroUsuarioF: req.body.bairroUsuarioF,
        cepUsuarioF: req.body.cepUsuarioF,
        doarF: req.body.doarF
    })
    .then((response) => {
        res.send('Usuário criado com sucesso')
    })
    .catch((error) => {
        console.log(error)
    })
})

routes.delete('/deleteInfo:id', async(req, res) => 
{
    var indexCounter = 0
    var bigId = await req.params.id
    someIds = await bigId.split('_')
    await someIds.pop()
    console.log(someIds)

    someIds.forEach(async(item) => 
    {
        console.log(item)
        indexCounter = indexCounter + 1
        console.log(indexCounter)

        if(someIds.indexOf(item) % 2 == 0)
        {
            // console.log(someIds.indexOf(item))
            // console.log(item)
            console.log(indexCounter)
            const deleteInfo = await newInformationModel.deleteOne({id_post: item, typeInfo: someIds[indexCounter]})
            .then(() => 
            {
                // console.log('Deletado')
                // console.log(deleteInfo)
            })
            .catch(() => 
            {
                console.log('Não deletado')
            })
        }

        // if(item == 'following')
        // {
        //     console.log('Este é o item: ' + item)
        // }
        // else if(item == 'liked')
        // {
        //     console.log('Este é o item: ' + item)
        // }
        // else if(item == 'saved')
        // {
        //     console.log('Este é o item: ' + item)
        // }
        // else
        // {
        //     console.log('Este é o item: ' + item)

        //     const deleteInfo = await newInformationModel.deleteOne({id_post: item, typeInfo: someIds[someIds.indexOf(item) + 1]})
        //     .then(() => 
        //     {
        //         console.log('Deletado')
        //         // console.log(deleteInfo)
        //     })
        //     .catch(() => 
        //     {
        //         console.log('Não deletado')
        //     })
        // }
    })
})

module.exports = routes